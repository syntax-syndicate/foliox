"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaGithub } from "react-icons/fa"
import { BsStars, BsCodeSlash, BsLightningCharge } from "react-icons/bs"

export default function LandingPage() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    router.push(`/${username.trim()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <BsStars className="h-4 w-4" />
              <span>AI-Powered Portfolio Generator</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Turn Your GitHub Into a
              <span className="block text-primary mt-2">Beautiful Portfolio</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Auto-generate a stunning developer portfolio from your GitHub profile with AI-powered summaries, 
              featured projects, and professional insights.
            </p>
          </div>

          <div className="max-w-md mx-auto mb-16">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter GitHub username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 text-base"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-base"
                disabled={!username.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⚡</span>
                    Generating Portfolio...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Generate Portfolio
                    <BsStars className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Try: <button 
                onClick={() => setUsername("KartikLabhshetwar")}
                className="text-primary hover:underline font-medium"
              >
                KartikLabhshetwar
              </button>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FaGithub className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">GitHub Integration</h3>
              <p className="text-sm text-muted-foreground">
                Automatically fetch your profile, repositories, and contribution history from GitHub.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BsStars className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">
                Generate professional summaries, highlights, and SEO-optimized descriptions with AI.
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BsLightningCharge className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Generation</h3>
              <p className="text-sm text-muted-foreground">
                Get a fully-featured portfolio in seconds with smart caching and optimization.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">Powered by</p>
            <div className="flex items-center justify-center gap-6 text-sm font-medium">
              <span className="flex items-center gap-2">
                <BsCodeSlash className="h-4 w-4" />
                Next.js
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <FaGithub className="h-4 w-4" />
                GitHub API
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <BsStars className="h-4 w-4" />
                Groq AI
              </span>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Foliox. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  )
}
