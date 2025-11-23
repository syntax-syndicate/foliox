import { NextRequest, NextResponse } from 'next/server';
import { GitHubProfileFetcher } from '@/lib/modules/github/fetcher';
import { AIDescriptionGenerator } from '@/lib/modules/ai/generator';
import { verifyUsername } from '@/lib/utils/user';
import { createCachedFunction } from '@/lib/utils/cache';
import { NormalizedProfile } from '@/types/github';

async function fetchGitHubProfile(username: string): Promise<NormalizedProfile> {
  const basicProfile = await GitHubProfileFetcher.fetchUserProfile(username);
  basicProfile.cached = false;

  try {
    const aiGenerator = new AIDescriptionGenerator();
    const [aboutData, seoData] = await Promise.all([
      aiGenerator.generateProfileSummary(basicProfile),
      aiGenerator.generateSEOContents(basicProfile),
    ]);

    basicProfile.about = aboutData;
    basicProfile.seo = seoData;
  } catch (error) {
    console.error('Failed to generate AI description:', error);
    basicProfile.about = null;
    basicProfile.seo = null;
  }

  return { ...basicProfile, cached: true };
}

function getCachedGitHubProfile(username: string) {
  const cachedFn = createCachedFunction(
    () => fetchGitHubProfile(username),
    ['github_profile', username],
    {
      ttl: 3600,
      tags: ['github_profile', `user:${username}`],
    }
  );
  return cachedFn();
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username: rawUsername } = await context.params;
    const username = verifyUsername(rawUsername);

    const profile = await getCachedGitHubProfile(username);

    return NextResponse.json(profile, { status: 200 });
  } catch (error: any) {
    if (error.message.includes('not found') || error.message.includes('Invalid')) {
      return NextResponse.json(
        { detail: error.message },
        { status: 404 }
      );
    }

    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { detail: `Failed to fetch profile: ${error.message}` },
      { status: 500 }
    );
  }
}

