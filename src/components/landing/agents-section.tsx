'use client'

import { AgentCard, Agent } from '@/components/agents/agent-card'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AgentsSectionProps {
  agents: Agent[]
}

export function AgentsSection({ agents }: AgentsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const cardsPerPage = 3

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + cardsPerPage) % agents.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - cardsPerPage + agents.length) % agents.length)
  }

  const visibleAgents = agents.slice(currentIndex, currentIndex + cardsPerPage)

  return (
    <section id="agents" className="py-24 px-6 relative">
      {/* Subtle blend overlay at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-md backdrop-blur-sm">
              <Bot className="w-7 h-7 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Meet Our AI Agents
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful AI assistants ready to help you with coding, marketing, content creation, research, and more.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden lg:flex bg-background/80 backdrop-blur-sm shadow-md hover:bg-primary/10 transition-colors"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden lg:flex bg-background/80 backdrop-blur-sm shadow-md hover:bg-primary/10 transition-colors"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex justify-center gap-4 mt-8 lg:hidden">
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm shadow-md" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm shadow-md" onClick={nextSlide}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(agents.length / cardsPerPage) }).map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === Math.floor(currentIndex / cardsPerPage)
                    ? 'bg-primary w-6'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                onClick={() => setCurrentIndex(index * cardsPerPage)}
              />
            ))}
          </div>
        </div>
        
        {/* Subtle blend overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
      </div>
    </section>
  )
}
