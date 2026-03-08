"use client"

import { EnhancedAgentInterface } from '@/components/agents/enhanced-agent-interface'
import { getAgentById } from '@/lib/agents-data'
import { Youtube, Video, TrendingUp, Palette, Sparkles } from 'lucide-react'

export default function YoutubeAgentPage() {
  const agent = getAgentById('youtube')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  const features = [
    { icon: Video, label: "Scripts", description: "Video scripts & hooks" },
    { icon: TrendingUp, label: "SEO", description: "Titles & descriptions" },
    { icon: Palette, label: "Thumbnails", description: "Click-worthy ideas" },
    { icon: Sparkles, label: "Ideas", description: "Viral content topics" },
  ]

  const theme = {
    from: "from-red-500",
    to: "to-orange-600",
    accent: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "rgba(239, 68, 68, 0.3)"
  }

  return (
    <EnhancedAgentInterface
      agent={agent}
      apiEndpoint="/api/agents/youtube"
      features={features}
      theme={theme}
    />
  )
}
