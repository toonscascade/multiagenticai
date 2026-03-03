'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Code2, Megaphone, Mic, Search, Youtube, ArrowRight } from 'lucide-react'

export interface Agent {
  id: string
  name: string
  description: string
  icon: 'code' | 'marketing' | 'voice' | 'research' | 'youtube'
  href: string
}

interface AgentCardProps {
  agent: Agent
}

const iconMap = {
  code: Code2,
  marketing: Megaphone,
  voice: Mic,
  research: Search,
  youtube: Youtube,
}

export function AgentCard({ agent }: AgentCardProps) {
  const IconComponent = iconMap[agent.icon]

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border bg-gradient-to-b from-background to-muted/20 hover:from-primary/5 hover:to-muted/30">
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/0 group-hover:to-primary/0 transition-all duration-500"></div>
      
      <CardHeader className="relative">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 border border-primary/20">
          <IconComponent className="w-7 h-7 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold">{agent.name}</CardTitle>
        <CardDescription className="text-muted-foreground leading-relaxed">
          {agent.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="relative">
        <Link href={agent.href} className="w-full">
          <Button 
            variant="outline" 
            className="w-full group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-border hover:border-primary hover:shadow-md"
          >
            Try Agent
            <ArrowRight className="w-4 h-4 ml-2 -translate-x-2 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
