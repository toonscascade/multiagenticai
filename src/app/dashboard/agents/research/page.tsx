"use client"

import { DashboardAgentInterface } from '@/components/dashboard/dashboard-agent-interface'
import { getAgentById } from '@/lib/agents-data'

export default function DashboardResearchPage() {
  const agent = getAgentById('research')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  const theme = {
    from: "from-emerald-500",
    to: "to-teal-600",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "rgba(16, 185, 129, 0.3)"
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <DashboardAgentInterface
        agent={agent}
        apiEndpoint="/api/agents/research"
        theme={theme}
      />
    </div>
  )
}
