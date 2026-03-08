"use client"

import { DashboardAgentInterface } from '@/components/dashboard/dashboard-agent-interface'
import { getAgentById } from '@/lib/agents-data'

export default function DashboardVoicePage() {
  const agent = getAgentById('voice')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  const theme = {
    from: "from-cyan-500",
    to: "to-blue-600",
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    glow: "rgba(6, 182, 212, 0.3)"
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <DashboardAgentInterface
        agent={agent}
        apiEndpoint="/api/agents/voice"
        theme={theme}
      />
    </div>
  )
}
