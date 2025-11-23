import { graphql } from '@octokit/graphql';
import { Settings } from '@/lib/config/settings';
import { NormalizedProfile, GitHubGraphQLUser } from '@/types/github';

const graphqlWithAuth = graphql.defaults({
  headers: Settings.GITHUB_TOKEN
    ? {
        authorization: `token ${Settings.GITHUB_TOKEN}`,
      }
    : {},
});

const USER_QUERY = `
  query($username: String!) {
    user(login: $username) {
      login
      name
      bio
      avatarUrl
      location
      email
      websiteUrl
      twitterUsername
      company
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: 100, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
        totalCount
        nodes {
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
          isPrivate
          isFork
          updatedAt
          createdAt
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export class GitHubProfileFetcher {
  static async fetchUserProfile(username: string): Promise<NormalizedProfile> {
    try {
      const result = await graphqlWithAuth<{ user: GitHubGraphQLUser }>(USER_QUERY, {
        username,
      });

      if (!result.user) {
        throw new Error(`User ${username} not found`);
      }

      const user = result.user;

      const normalizedProfile: NormalizedProfile = {
        username: user.login,
        name: user.name,
        bio: user.bio,
        avatar_url: user.avatarUrl,
        location: user.location,
        email: user.email,
        website: user.websiteUrl,
        twitter_username: user.twitterUsername,
        company: user.company,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        public_repos: user.repositories.totalCount,
        created_at: user.repositories.nodes[0]?.createdAt || new Date().toISOString(),
        cached: false,
      };

      return normalizedProfile;
    } catch (error: any) {
      if (error.message?.includes('Could not resolve to a User')) {
        throw new Error(`GitHub user ${username} not found`);
      }
      throw new Error(`Failed to fetch GitHub profile: ${error.message}`);
    }
  }

  static async fetchUserRepositories(username: string) {
    try {
      const result = await graphqlWithAuth<{ user: GitHubGraphQLUser }>(USER_QUERY, {
        username,
      });

      if (!result.user) {
        throw new Error(`User ${username} not found`);
      }

      return result.user.repositories.nodes;
    } catch (error: any) {
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
  }
}

