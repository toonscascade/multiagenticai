import { AgentInterface } from '@/components/agents/agent-interface'
import { getAgentById } from '@/lib/agents-data'

export default function SoftwareEngineerAgentPage() {
  const agent = getAgentById('software-engineer')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  return (
    <AgentInterface 
      agent={agent} 
      apiEndpoint="/api/agents/software-engineer"
    />
  )
}
