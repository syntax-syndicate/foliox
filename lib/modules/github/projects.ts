import { GitHubProfileFetcher } from './fetcher';
import { FeaturedProject, ProjectsData } from '@/types/github';

export class GitHubProjectRanker {
  static async getFeatured(username: string): Promise<ProjectsData> {
    try {
      const repositories = await GitHubProfileFetcher.fetchUserRepositories(username);

      const nonForkRepos = repositories.filter(repo => !repo.isFork && !repo.isPrivate);

      const rankedRepos = nonForkRepos
        .map(repo => ({
          repo,
          score: this.calculateScore(repo),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 12);

      const featured: FeaturedProject[] = rankedRepos.map(({ repo }) => {
        const languages: { [key: string]: number } = {};
        repo.languages.edges.forEach(edge => {
          languages[edge.node.name] = edge.size;
        });

        return {
          name: repo.name,
          description: repo.description,
          url: repo.url,
          stars: repo.stargazerCount,
          forks: repo.forkCount,
          language: repo.primaryLanguage?.name || null,
          topics: repo.repositoryTopics.nodes.map(node => node.topic.name),
          updated_at: repo.updatedAt,
          created_at: repo.createdAt,
          languages,
        };
      });

      const allLanguages: { [key: string]: number } = {};
      let totalStars = 0;

      nonForkRepos.forEach(repo => {
        totalStars += repo.stargazerCount;
        repo.languages.edges.forEach(edge => {
          allLanguages[edge.node.name] = (allLanguages[edge.node.name] || 0) + edge.size;
        });
      });

      return {
        featured,
        languages: allLanguages,
        total_stars: totalStars,
        total_repos: nonForkRepos.length,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }
  }

  private static calculateScore(repo: any): number {
    const starWeight = 10;
    const forkWeight = 5;
    const recentWeight = 2;

    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const recencyScore = Math.max(0, 365 - daysSinceUpdate) / 365;

    return (
      repo.stargazerCount * starWeight +
      repo.forkCount * forkWeight +
      recencyScore * recentWeight * 100
    );
  }
}

