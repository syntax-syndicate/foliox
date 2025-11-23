# FastAPI to Next.js TypeScript Implementation

This document describes the complete conversion of the Python FastAPI backend to TypeScript/Next.js.

## Architecture Overview

The implementation uses:
- **Next.js 16** with App Router
- **Route Handlers** for REST API endpoints
- **TypeScript** for type safety
- **Vercel AI SDK** with Groq provider for AI generation
- **GitHub GraphQL API** for efficient data fetching
- **Next.js middleware** for API key authentication and CORS
- **Next.js built-in caching** with `unstable_cache`

## Project Structure

```
foliox/
├── app/
│   ├── api/
│   │   ├── user/
│   │   │   └── [username]/
│   │   │       ├── profile/route.ts    # GET /api/user/:username/profile
│   │   │       ├── projects/route.ts   # GET /api/user/:username/projects
│   │   │       └── about/route.ts      # GET /api/user/:username/about
│   │   └── linkedin/
│   │       └── [username]/route.ts     # GET /api/linkedin/:username
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── config/
│   │   └── settings.ts                 # Environment configuration with Zod validation
│   ├── modules/
│   │   ├── github/
│   │   │   ├── fetcher.ts             # GitHubProfileFetcher (GraphQL)
│   │   │   └── projects.ts            # GitHubProjectRanker
│   │   ├── ai/
│   │   │   └── generator.ts           # AIDescriptionGenerator (Vercel AI SDK + Groq)
│   │   └── linkedin/
│   │       └── fetcher.ts             # LinkedInProfileFetcher
│   └── utils/
│       ├── user.ts                     # Username validation
│       ├── cache.ts                    # Next.js unstable_cache wrapper
│       └── redis.ts                    # Optional Redis client (legacy)
├── types/
│   ├── github.ts                       # GitHub API types
│   └── api.ts                          # API response types
├── middleware.ts                       # API key auth + CORS
└── package.json
```

## API Endpoints

### 1. GET `/api/user/[username]/profile`
Fetches GitHub user profile with AI-generated bio and SEO metadata.

**Response:**
```json
{
  "username": "kartiklabhshetwar",
  "name": "Kartik Labhshetwar",
  "bio": "Full-stack developer",
  "avatar_url": "https://...",
  "location": "India",
  "email": null,
  "website": "https://...",
  "twitter_username": "kartik",
  "company": "@company",
  "followers": 100,
  "following": 50,
  "public_repos": 42,
  "created_at": "2020-01-01T00:00:00Z",
  "cached": true,
  "about": {
    "summary": "...",
    "highlights": ["...", "..."],
    "skills": ["...", "..."]
  },
  "seo": {
    "title": "...",
    "description": "...",
    "keywords": ["...", "..."]
  }
}
```

### 2. GET `/api/user/[username]/projects`
Fetches featured GitHub projects with language statistics.

**Response:**
```json
{
  "featured": [
    {
      "name": "project-name",
      "description": "Project description",
      "url": "https://github.com/...",
      "stars": 42,
      "forks": 10,
      "language": "TypeScript",
      "topics": ["nextjs", "react"],
      "updated_at": "2024-01-01T00:00:00Z",
      "created_at": "2023-01-01T00:00:00Z",
      "languages": {
        "TypeScript": 50000,
        "JavaScript": 20000
      }
    }
  ],
  "languages": {
    "TypeScript": 150000,
    "JavaScript": 80000
  },
  "total_stars": 200,
  "total_repos": 42
}
```

### 3. GET `/api/user/[username]/about`
Fetches cached about data for a user.

**Response:**
```json
{
  "about": {
    "summary": "...",
    "highlights": ["...", "..."],
    "skills": ["...", "..."]
  }
}
```

### 4. GET `/api/linkedin/[username]`
Fetches LinkedIn profile data (basic scraping implementation).

**Response:**
```json
{
  "username": "kartiklabhshetwar",
  "name": "Kartik Labhshetwar",
  "headline": "Full-stack Developer",
  "location": "India",
  "profile_url": "https://linkedin.com/in/kartiklabhshetwar",
  "avatar_url": "https://...",
  "summary": "...",
  "experience": [],
  "education": [],
  "skills": []
}
```

## Key Features

### 1. Environment Configuration (`lib/config/settings.ts`)
- Uses Zod for runtime validation
- Type-safe environment variables
- Validates required keys on startup

### 2. GitHub Integration (`lib/modules/github/`)
- **GraphQL API** for efficient data fetching
- Fetches user profile, repositories, languages in a single query
- Automatic token authentication if `GITHUB_TOKEN` is provided
- Error handling for missing users

### 3. AI Generation (`lib/modules/ai/generator.ts`)
- Uses **Vercel AI SDK** with **Groq provider**
- Model: `llama-3.1-8b-instant`
- Generates profile summaries, highlights, and skills
- Generates SEO metadata (title, description, keywords)
- Fallback to extractive summaries on error
- JSON response parsing with error handling
- Parallel generation of about and SEO data

### 4. Caching Strategy (`lib/utils/cache.ts`)
- **Next.js `unstable_cache`**: Production-grade caching at the framework level
- Automatic cache revalidation with configurable TTL
- Tag-based cache invalidation with `revalidateTag`
- Cache keys: `['github_profile', username]`, `['github_projects', username]`, etc.
- Default TTL: 3600 seconds (1 hour)
- LinkedIn profiles: 86400 seconds (24 hours)
- Supports both time-based and tag-based revalidation

### 5. Middleware (`middleware.ts`)
- **API Key Authentication**: Validates `X-API-Key` header
- **CORS**: Whitelisted origins with fallback for development
- **Excluded paths**: `/api/docs`, `/_next`, `/favicon.ico`
- **Debug mode**: Bypasses auth when `DEBUG=true`

### 6. Project Ranking Algorithm (`lib/modules/github/projects.ts`)
- Scores repositories based on:
  - Stars (weight: 10)
  - Forks (weight: 5)
  - Recency (weight: 2)
- Filters out forks and private repos
- Returns top 12 featured projects
- Aggregates language statistics

## Environment Variables

Create a `.env.local` file:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here
API_KEYS=key1,key2,key3

# Optional
GITHUB_TOKEN=your_github_token
CACHE_ENABLED=true
DEFAULT_CACHE_TTL=3600
DEBUG=false
NODE_ENV=development
```

## Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

3. **Run development server:**
```bash
npm run dev
```

4. **Test API endpoints:**
```bash
# Profile
curl -H "X-API-Key: your_key" http://localhost:3000/api/user/kartiklabhshetwar/profile

# Projects
curl -H "X-API-Key: your_key" http://localhost:3000/api/user/kartiklabhshetwar/projects

# About
curl -H "X-API-Key: your_key" http://localhost:3000/api/user/kartiklabhshetwar/about

# LinkedIn
curl -H "X-API-Key: your_key" http://localhost:3000/api/linkedin/kartiklabhshetwar
```

## Key Differences from FastAPI

| Feature | FastAPI (Python) | Next.js (TypeScript) |
|---------|------------------|----------------------|
| **Response Format** | Automatic JSON serialization | `NextResponse.json()` |
| **Error Handling** | `HTTPException` | `NextResponse` with status codes |
| **Caching** | Redis with `@lru_cache` | Next.js `unstable_cache` |
| **Middleware** | Starlette middleware | Next.js Edge middleware |
| **Type Safety** | Pydantic models | TypeScript interfaces |
| **Background Tasks** | FastAPI BackgroundTasks | Server Actions / external queue |
| **Dependency Injection** | FastAPI `Depends()` | Direct imports |
| **AI SDK** | Groq Python SDK | Vercel AI SDK with Groq provider |

## Performance Optimizations

1. **GraphQL over REST**: Single query fetches all required data
2. **Next.js unstable_cache**: Framework-level caching with automatic revalidation
3. **Edge middleware**: Runs at CDN edge for low latency
4. **Parallel AI generation**: About and SEO data generated concurrently
5. **Tag-based invalidation**: Selective cache clearing with `revalidateTag`
6. **ISR support**: Incremental Static Regeneration ready

## Security Features

1. **API Key Authentication**: Required for all endpoints (except in DEBUG mode)
2. **CORS Whitelist**: Only allowed origins can access the API
3. **Input Validation**: Username format validation with regex
4. **Error Sanitization**: No sensitive data in error messages
5. **Rate Limiting**: Can be added via middleware (future enhancement)

## Testing

Run linter:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

## Deployment

### Vercel (Recommended)
```bash
vercel
```

Set environment variables in Vercel dashboard.

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Future Enhancements

1. **Rate Limiting**: Add per-user/per-IP rate limits
2. **Webhooks**: GitHub webhook integration for auto-updates
3. **Background Jobs**: Queue system for async processing
4. **Analytics**: Track API usage and performance
5. **OpenAPI Docs**: Auto-generated API documentation
6. **Tests**: Unit and integration tests
7. **Monitoring**: Sentry integration for error tracking

## Troubleshooting

### "Environment validation failed"
- Ensure all required environment variables are set in `.env.local`
- Check that `GROQ_API_KEY` and `API_KEYS` are not empty

### "Invalid API Key"
- Verify `X-API-Key` header matches one of the keys in `API_KEYS`
- Set `DEBUG=true` to bypass authentication during development

### "GitHub user not found"
- Check username spelling
- Ensure GitHub user exists and is public
- Verify `GITHUB_TOKEN` if rate limited

### Caching issues
- Set `DEBUG=true` to bypass auth (cache still active)
- Use `revalidateTag` to manually invalidate specific caches
- Cache automatically revalidates based on TTL
- Next.js cache persists across deployments on Vercel

## License

MIT License - see LICENSE file for details

