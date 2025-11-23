"use client"

import { Button } from "@/components/ui/button"
import { FaRegEnvelope } from "react-icons/fa"
import type { NormalizedProfile } from "@/types/github"

interface PortfolioFooterProps {
  profile: NormalizedProfile
}

export function PortfolioFooter({ profile }: PortfolioFooterProps) {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-2xl font-semibold tracking-tight">Interested in working together?</h2>
            <p className="text-muted-foreground">
              I&apos;m always open to discussing product design work or partnership opportunities.
            </p>
          </div>

          {profile.email && (
            <Button
              size="lg"
              className="rounded-full px-8"
              asChild
            >
              <a href={`mailto:${profile.email}`}>
                <FaRegEnvelope className="mr-2 h-4 w-4" />
                Get in touch
              </a>
            </Button>
          )}
          
          <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-border w-full max-w-sm">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {profile.name || profile.username}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

