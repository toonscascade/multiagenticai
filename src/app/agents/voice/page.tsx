"use client"

import { VoiceAgentInterface } from '@/components/agents/voice-agent-interface'
import { getAgentById } from '@/lib/agents-data'
import { Headphones, Radio, Music, Volume2 } from 'lucide-react'

export default function VoiceAgentPage() {
  const agent = getAgentById('voice')
  
  if (!agent) {
    return <div>Agent not found</div>
  }

  const features = [
    { icon: Headphones, label: "Voiceover", description: "Professional audio" },
    { icon: Radio, label: "Podcast", description: "Show scripts" },
    { icon: Music, label: "Narration", description: "Story telling" },
    { icon: Volume2, label: "Audio", description: "Sound design" },
  ]

  const theme = {
    from: "from-cyan-500",
    to: "to-blue-600",
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    glow: "rgba(6, 182, 212, 0.3)"
  }

  return (
    <VoiceAgentInterface
      agent={agent}
      apiEndpoint="/api/agents/voice"
      features={features}
      theme={theme}
    />
  )
}
