# Foliox

Auto-generate developer portfolios from GitHub profiles with AI-powered summaries using Next.js, Vercel AI SDK, and Groq.

## Quick Start

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key
API_KEYS=key1,key2,key3
GITHUB_TOKEN=your_github_token  # Optional
CACHE_ENABLED=true
DEFAULT_CACHE_TTL=3600
DEBUG=false
```

## API Endpoints

- `GET /api/user/[username]/profile` - GitHub profile with AI-generated bio
- `GET /api/user/[username]/projects` - Featured projects and languages
- `GET /api/user/[username]/about` - About section
- `GET /api/linkedin/[username]` - LinkedIn profile data

All endpoints require `X-API-Key` header (except when `DEBUG=true`).

## Features

- **GitHub Integration**: GraphQL API for efficient data fetching
- **AI Generation**: Vercel AI SDK with Groq (Llama 3.3 70B Versatile) for profile summaries and SEO
- **Smart Caching**: Next.js `unstable_cache` with tag-based revalidation
- **Type Safety**: Full TypeScript coverage

## Documentation

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for detailed architecture and API documentation.
