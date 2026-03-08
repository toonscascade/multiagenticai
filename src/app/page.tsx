"use client"

import { HeroLanding } from '@/components/ui/hero-1'
import { PricingSection } from '@/components/landing/pricing-section'
import { Timeline } from '@/components/ui/timeline'
import { agents } from '@/lib/agents-data'
import { ClientsSection } from '@/components/landing/clients-section'
import { Code2, Megaphone, Mic, Search, Youtube } from 'lucide-react'

const iconMap: Record<string, any> = {
  code: Code2,
  marketing: Megaphone,
  voice: Mic,
  research: Search,
  youtube: Youtube,
}

export default function HomePage() {

  const agentsTimelineData = agents.map((agent) => {
    const Icon = iconMap[agent.icon]
    return {
      title: agent.name,
      content: (
        <div key={agent.id} className="p-6 rounded-2xl bg-gradient-to-br from-background/50 to-muted/50 border border-border backdrop-blur-sm shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-xl font-bold text-foreground">{agent.name}</h4>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed mb-6">
            {agent.description}
          </p>
          <a 
            href={agent.href}
            className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Learn more about {agent.name} <span aria-hidden="true" className="ml-1">→</span>
          </a>
        </div>
      )
    }
  })

  const journeyTimelineData = [
    {
      title: "v2.0 - 2026",
      content: (
        <div key="v2.0">
          <p className="text-muted-foreground text-xs md:text-sm font-normal mb-4">
            Major release with multi-agent support and enhanced AI capabilities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground text-sm mb-1">Multi-Agent Collaboration</h4>
              <p className="text-xs text-muted-foreground">Multiple AI agents working together seamlessly</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground text-sm mb-1">Enhanced Voice Recognition</h4>
              <p className="text-xs text-muted-foreground">Natural language processing improvements</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground text-sm mb-1">YouTube Analysis</h4>
              <p className="text-xs text-muted-foreground">AI-powered video content analysis</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground text-sm mb-1">Advanced Research</h4>
              <p className="text-xs text-muted-foreground">Deep research capabilities with citations</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "v1.5 - Late 2025",
      content: (
        <div key="v1.5">
          <p className="text-muted-foreground text-xs md:text-sm font-normal mb-4">
            Added voice agent and marketing agent to the platform
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <h4 className="font-semibold text-foreground text-sm mb-1">Voice Agent</h4>
              <p className="text-xs text-muted-foreground">Natural voice interactions for hands-free use</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <h4 className="font-semibold text-foreground text-sm mb-1">Marketing Agent</h4>
              <p className="text-xs text-muted-foreground">AI-powered marketing content generation</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "v1.0 - Early 2025",
      content: (
        <div key="v1.0">
          <p className="text-muted-foreground text-xs md:text-sm font-normal mb-4">
            Initial launch with Software Engineer and Research agents
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground text-sm mb-1">Software Engineer Agent</h4>
              <p className="text-xs text-muted-foreground">Code assistance and development help</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <h4 className="font-semibold text-foreground text-sm mb-1">Research Agent</h4>
              <p className="text-xs text-muted-foreground">Information gathering and analysis</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <main className="min-h-screen relative">
      {/* Continuous Blended Background Gradient - Single Flow */}
      <div className="absolute inset-0 -z-50 overflow-hidden">
        {/* Main gradient spanning entire page */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl h-[200vh]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              background: 'linear-gradient(180deg, oklch(0.7 0.15 280) 0%, oklch(0.65 0.18 290) 50%, oklch(0.6 0.2 320) 100%)'
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        
        {/* Secondary gradient for depth */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[20vh] -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              background: 'linear-gradient(135deg, oklch(0.6 0.2 320 / 0.15), oklch(0.7 0.15 280 / 0.15))'
            }}
            className="relative left-[calc(50%-3rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[15deg] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {/* Hero Section */}
      <HeroLanding
        logo={{
          src: "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=violet&shade=500",
          alt: "MultiAgent AI Logo",
          companyName: "MultiAgent AI"
        }}
        navigation={[
          { name: 'Home', href: '/' },
          { name: 'Agents', href: '/agents' },
          { name: 'Pricing', href: '#pricing' },
          { name: 'Docs', href: '/docs' },
        ]}
        loginText="Log in"
        loginHref="/login"
        title="Transform Your Workflow with AI-Powered Agents"
        description="Revolutionize your productivity with our suite of intelligent AI agents for coding, marketing, content creation, research, and more."
        announcementBanner={{
          text: "New: YouTube Agent now available!",
          linkText: "Try it now",
          linkHref: "/agents/youtube"
        }}
        callToActions={[
          { 
            text: "Get Started Free", 
            href: "/signup", 
            variant: "primary" 
          },
          { 
            text: "View Agents", 
            href: "/agents", 
            variant: "secondary" 
          }
        ]}
        titleSize="large"
        gradientColors={{
          from: "oklch(0.7 0.15 280)",
          to: "oklch(0.6 0.2 320)"
        }}
      />
      
      {/* Clients Section from clients.md */}
      <ClientsSection />

      {/* Agents Scroll Section - Using Timeline for the scroll effect */}
      <section id="agents" className="relative">
        <Timeline 
          data={agentsTimelineData} 
          title="Meet Our AI Agents"
          description="Powerful AI assistants ready to help you with coding, marketing, content creation, research, and more."
        />
      </section>
      
      {/* Journey Timeline Section - Product Journey */}
      <section id="timeline" className="relative py-20">
        <Timeline data={journeyTimelineData} />
      </section>
      
        <PricingSection />
      </main>
  )
}
