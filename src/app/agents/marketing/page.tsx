"use client"

import { EnhancedAgentInterface } from '@/components/agents/enhanced-agent-interface'
import { getAgentById } from '@/lib/agents-data'
import { Megaphone, Target, TrendingUp, Palette, BarChart3 } from 'lucide-react'

export default function MarketingAgentPage() {
  const agent = getAgentById('marketing')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  const features = [
    { icon: Target, label: "Ad Copy", description: "Compelling advertisements" },
    { icon: TrendingUp, label: "Campaigns", description: "Strategic marketing" },
    { icon: Palette, label: "Branding", description: "Brand identity" },
    { icon: BarChart3, label: "Analytics", description: "Data insights" },
  ]

  const theme = {
    from: "from-pink-500",
    to: "to-rose-600",
    accent: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    glow: "rgba(236, 72, 153, 0.3)"
  }

  return (
    <EnhancedAgentInterface
      agent={agent}
      apiEndpoint="/api/agents/marketing"
      features={features}
      theme={theme}
    />
  )
}
