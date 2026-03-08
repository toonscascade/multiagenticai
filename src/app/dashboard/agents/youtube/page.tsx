"use client"

import { DashboardAgentInterface } from '@/components/dashboard/dashboard-agent-interface'
import { getAgentById } from '@/lib/agents-data'

export default function DashboardYoutubePage() {
  const agent = getAgentById('youtube')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  const theme = {
    from: "from-red-500",
    to: "to-orange-600",
    accent: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "rgba(239, 68, 68, 0.3)"
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <DashboardAgentInterface
        agent={agent}
        apiEndpoint="/api/agents/youtube"
        theme={theme}
      />
    </div>
  )
}
