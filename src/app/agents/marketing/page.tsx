import { AgentInterface } from '@/components/agents/agent-interface'
import { getAgentById } from '@/lib/agents-data'

export default function MarketingAgentPage() {
  const agent = getAgentById('marketing')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  return (
    <AgentInterface 
      agent={agent} 
      apiEndpoint="/api/agents/marketing"
    />
  )
}
