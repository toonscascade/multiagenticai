"use client"

import { DashboardAgentInterface } from '@/components/dashboard/dashboard-agent-interface'
import { getAgentById } from '@/lib/agents-data'

export default function DashboardSoftwareEngineerPage() {
  const agent = getAgentById('software-engineer')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  const theme = {
    from: "from-violet-500",
    to: "to-purple-600",
    accent: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    glow: "rgba(139, 92, 246, 0.3)"
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <DashboardAgentInterface
        agent={agent}
        apiEndpoint="/api/agents/software-engineer"
        theme={theme}
      />
    </div>
  )
}
