"use client"

import { DashboardAgentInterface } from '@/components/dashboard/dashboard-agent-interface'
import { getAgentById } from '@/lib/agents-data'

export default function DashboardMarketingPage() {
  const agent = getAgentById('marketing')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  const theme = {
    from: "from-pink-500",
    to: "to-rose-600",
    accent: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    glow: "rgba(236, 72, 153, 0.3)"
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <DashboardAgentInterface
        agent={agent}
        apiEndpoint="/api/agents/marketing"
        theme={theme}
      />
    </div>
  )
}
