import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const REPO_OWNER = "kartiklabhshetwar"
const REPO_NAME = "foliox"
const GITHUB_API_TIMEOUT = 10000
const MAX_RETRIES = 2

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = GITHUB_API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout: GitHub API did not respond in time")
    }
    throw error
  }
}

async function fetchGitHubStars(useToken: boolean = true, retryCount: number = 0): Promise<number> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Foliox/1.0",
  }

  if (useToken && process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  try {
    const response = await fetchWithTimeout(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
      {
        headers,
        cache: "no-store",
        next: { revalidate: 0 },
      },
      GITHUB_API_TIMEOUT
    )

    if (!response.ok) {
      if (response.status === 401 && useToken && process.env.GITHUB_TOKEN && retryCount === 0) {
        if (process.env.DEBUG) {
          console.warn("GitHub API returned 401 with token, retrying without token")
        }
        return fetchGitHubStars(false, 0)
      }

      if (response.status === 403) {
        const rateLimitRemaining = response.headers.get("x-ratelimit-remaining")
        const rateLimitReset = response.headers.get("x-ratelimit-reset")
        throw new Error(
          `GitHub API rate limit exceeded. Remaining: ${rateLimitRemaining || "unknown"}, Reset: ${rateLimitReset || "unknown"}`
        )
      }

      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)))
        return fetchGitHubStars(useToken, retryCount + 1)
      }

      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText} - ${errorText}`
      )
    }

    const data = await response.json()
    const stars = typeof data.stargazers_count === "number" ? data.stargazers_count : 0
    return stars
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout: GitHub API did not respond in time")
    }
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Failed to connect to GitHub API")
    }
    throw error
  }
}

export async function GET() {
  try {
    const stars = await fetchGitHubStars()
    return NextResponse.json({ stars }, { 
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    if (process.env.DEBUG) {
      console.error("Failed to fetch GitHub stars:", errorMessage)
      console.error("GITHUB_TOKEN present:", !!process.env.GITHUB_TOKEN)
      console.error("Error details:", error)
    }

    return NextResponse.json({ 
      stars: 0,
      error: process.env.DEBUG ? errorMessage : undefined
    }, { 
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    })
  }
}

