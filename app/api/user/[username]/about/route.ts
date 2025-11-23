import { NextRequest, NextResponse } from 'next/server';
import { verifyUsername } from '@/lib/utils/user';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  try {
    const { username: rawUsername } = await context.params;
    verifyUsername(rawUsername);

    return NextResponse.json(
      { detail: 'Use /api/user/:username/profile endpoint to get about data' },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('Invalid')) {
      return NextResponse.json(
        { detail: errorMessage },
        { status: 400 }
      );
    }

    console.error('About fetch error:', error);
    return NextResponse.json(
      { detail: `Failed to fetch about data: ${errorMessage}` },
      { status: 500 }
    );
  }
}

