"use client"

import { EnhancedAgentInterface } from '@/components/agents/enhanced-agent-interface'
import { getAgentById } from '@/lib/agents-data'
import { Search, FileSearch, BookOpen, Lightbulb, Database } from 'lucide-react'

export default function ResearchAgentPage() {
  const agent = getAgentById('research')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  const features = [
    { icon: FileSearch, label: "Analysis", description: "Deep data analysis" },
    { icon: BookOpen, label: "Summaries", description: "Quick insights" },
    { icon: Lightbulb, label: "Insights", description: "Key findings" },
    { icon: Database, label: "Reports", description: "Comprehensive docs" },
  ]

  const theme = {
    from: "from-emerald-500",
    to: "to-teal-600",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "rgba(16, 185, 129, 0.3)"
  }

  return (
    <EnhancedAgentInterface
      agent={agent}
      apiEndpoint="/api/agents/research"
      features={features}
      theme={theme}
    />
  )
}
