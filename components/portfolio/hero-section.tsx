import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FaGithub, FaLinkedin, FaGlobe, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import { FaXTwitter, FaCodeBranch, FaCodePullRequest } from "react-icons/fa6"
import type { NormalizedProfile, AboutData, GitHubMetrics } from "@/types/github"

interface HeroSectionProps {
  profile: NormalizedProfile
  about?: AboutData | null
  metrics?: GitHubMetrics | null
}

export function HeroSection({ profile, about, metrics }: HeroSectionProps) {
  const initials = profile.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || profile.username.slice(0, 2).toUpperCase()

  return (
    <section className="w-full py-16 border-b border-border">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Avatar className="h-28 w-28 md:h-32 md:w-32 border border-border">
          <AvatarImage src={profile.avatar_url} alt={profile.name || profile.username} />
          <AvatarFallback className="text-xl font-medium">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {profile.name || profile.username}
            </h1>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>

          {profile.bio && (
            <p className="text-base text-foreground/80 leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {profile.location && (
              <div className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="h-3.5 w-3.5" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.company && (
              <span>{profile.company.replace("@", "")}</span>
            )}
            {profile.public_repos > 0 && (
              <span>{profile.public_repos} repositories</span>
            )}
            {profile.followers > 0 && (
              <span>{profile.followers} followers</span>
            )}
            {profile.following > 0 && (
              <span>{profile.following} following</span>
            )}
          </div>

          {metrics && (
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-chart-1/10 border border-border">
                <div className="w-8 h-8 rounded-md bg-chart-1/20 flex items-center justify-center">
                  <FaCodeBranch className="h-4 w-4 text-chart-1" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{metrics.prs_merged.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">PRs Merged</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-chart-2/10 border border-border">
                <div className="w-8 h-8 rounded-md bg-chart-2/20 flex items-center justify-center">
                  <FaCodePullRequest className="h-4 w-4 text-chart-2" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{metrics.prs_open.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Open PRs</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`https://github.com/${profile.username}`} target="_blank" rel="noopener noreferrer">
                <FaGithub className="h-3.5 w-3.5 mr-2" />
                GitHub
              </a>
            </Button>
            {profile.linkedin_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="h-3.5 w-3.5 mr-2" />
                  LinkedIn
                </a>
              </Button>
            )}
            {profile.twitter_username && (
              <Button variant="outline" size="sm" asChild>
                <a href={`https://twitter.com/${profile.twitter_username}`} target="_blank" rel="noopener noreferrer">
                  <FaXTwitter className="h-3.5 w-3.5 mr-2" />
                  X
                </a>
              </Button>
            )}
            {profile.website && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                  <FaGlobe className="h-3.5 w-3.5 mr-2" />
                  Website
                </a>
              </Button>
            )}
            {profile.email && (
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${profile.email}`}>
                  <FaEnvelope className="h-3.5 w-3.5 mr-2" />
                  Email
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

