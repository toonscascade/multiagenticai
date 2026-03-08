"use client"

import { SoftwareAgentChat } from '@/components/agents/software-agent-chat'
import { Sidebar } from '@/components/landing/sidebar'
import { getAgentById } from '@/lib/agents-data'

export default function SoftwareEngineerAgentPage() {
  const agent = getAgentById('software-engineer')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <SoftwareAgentChat
          agent={agent}
          apiEndpoint="/api/agents/software-engineer"
        />
      </div>
    </div>
  )
}
