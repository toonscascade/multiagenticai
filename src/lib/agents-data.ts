import { Agent } from '@/components/agents/agent-card'

export type { Agent } from '@/components/agents/agent-card'

export const agents: Agent[] = [
  {
    id: 'software-engineer',
    name: 'Software Engineer Agent',
    description: 'Generate code, debug issues, and get help with software development tasks.',
    icon: 'code',
    href: '/agents/software-engineer',
  },
  {
    id: 'marketing',
    name: 'Marketing Agent',
    description: 'Create marketing campaigns, ad copy, and content strategies.',
    icon: 'marketing',
    href: '/agents/marketing',
  },
  {
    id: 'voice',
    name: 'Voice Agent',
    description: 'Generate natural-sounding voiceovers and audio content.',
    icon: 'voice',
    href: '/agents/voice',
  },
  {
    id: 'research',
    name: 'Research Agent',
    description: 'Conduct research, analyze data, and summarize findings.',
    icon: 'research',
    href: '/agents/research',
  },
  {
    id: 'youtube',
    name: 'YouTube Agent',
    description: 'Create video titles, descriptions, scripts, and story ideas.',
    icon: 'youtube',
    href: '/agents/youtube',
  },
  {
    id: 'conversational',
    name: 'Conversational Voice Agent',
    description: 'Make real-time phone calls with AI-powered natural conversation. Perfect for customer service, appointments, and personal assistance.',
    icon: 'voice',
    href: '/agents/conversational',
  },
]

export function getAgentById(id: string): Agent | undefined {
  return agents.find(agent => agent.id === id)
}
