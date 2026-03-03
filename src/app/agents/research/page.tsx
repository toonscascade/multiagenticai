import { AgentInterface } from '@/components/agents/agent-interface'
import { getAgentById } from '@/lib/agents-data'

export default function ResearchAgentPage() {
  const agent = getAgentById('research')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  return (
    <AgentInterface 
      agent={agent} 
      apiEndpoint="/api/agents/research"
    />
  )
}
