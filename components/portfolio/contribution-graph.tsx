"use client"

import React from "react"
import { GitHubCalendar } from "react-github-calendar"
import { Card, CardContent } from "@/components/ui/card"

interface ContributionGraphProps {
  username: string
}

export function ContributionGraph({ username }: ContributionGraphProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const theme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  }

  if (!mounted) {
    return (
      <section className="w-full py-16 border-b border-border">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Contributions</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Activity over the past year
            </p>
          </div>
          <Card className="border-border">
            <CardContent className="p-6 md:p-8">
              <div className="w-full h-[160px] bg-muted/50 animate-pulse rounded-md" />
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-16 border-b border-border">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Contributions</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Activity over the past year
          </p>
        </div>
        <Card className="border-border">
          <CardContent className="p-6 md:p-8">
            <div className="w-full flex justify-center overflow-x-auto">
              <div className="min-w-fit">
                <GitHubCalendar
                  username={username}
                  fontSize={12}
                  blockSize={12}
                  blockMargin={4}
                  showWeekdayLabels={true}
                  colorScheme="light"
                  theme={{
                    light: theme.light,
                    dark: theme.dark,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

