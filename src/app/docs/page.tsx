import { Timeline } from '@/components/ui/timeline'
import { Bot, Book, Code, Sparkles } from 'lucide-react'

export default function DocsPage() {
  const timelineData = [
    {
      title: "v2.0 - 2026",
      content: (
        <div>
          <p className="text-muted-foreground text-xs md:text-sm font-normal mb-4">
            Major release with multi-agent support and enhanced AI capabilities
          </p>
          <div className="mb-4">
            <div className="flex gap-2 items-center text-foreground/80 text-xs md:text-sm mb-2">
              Multi-agent collaboration features
            </div>
            <div className="flex gap-2 items-center text-foreground/80 text-xs md:text-sm mb-2">
              Enhanced voice recognition
            </div>
            <div className="flex gap-2 items-center text-foreground/80 text-xs md:text-sm mb-2">
              YouTube video analysis
            </div>
            <div className="flex gap-2 items-center text-foreground/80 text-xs md:text-sm">
              Advanced research capabilities
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "v1.5 - Late 2025",
      content: (
        <div>
          <p className="text-muted-foreground text-xs md:text-sm font-normal mb-4">
            Added voice agent and marketing agent to the platform
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted border border-border">
              <h4 className="font-semibold text-foreground mb-2">Voice Agent</h4>
              <p className="text-sm text-muted-foreground">Natural language processing for voice interactions</p>
            </div>
            <div className="p-4 rounded-lg bg-muted border border-border">
              <h4 className="font-semibold text-foreground mb-2">Marketing Agent</h4>
              <p className="text-sm text-muted-foreground">AI-powered marketing content generation</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "v1.0 - Early 2025",
      content: (
        <div>
          <p className="text-muted-foreground text-xs md:text-sm font-normal mb-4">
            Initial launch with Software Engineer and Research agents
          </p>
          <div className="mb-4">
            <div className="flex gap-2 items-center text-foreground/80 text-xs md:text-sm mb-2">
              Software Engineer Agent for code assistance
            </div>
            <div className="flex gap-2 items-center text-foreground/80 text-xs md:text-sm">
              Research Agent for information gathering
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <main className="min-h-screen relative overflow-hidden pt-20">
      {/* Background Gradient Elements - Matching landing page theme */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            background: 'linear-gradient(to top right, oklch(0.7 0.15 280), oklch(0.6 0.2 320))'
          }}
          className="relative left-[calc(50%-20rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            background: 'linear-gradient(to top right, oklch(0.7 0.15 280), oklch(0.6 0.2 320))'
          }}
          className="relative left-[calc(50%-20rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[180deg] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg">
                <Book className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Documentation
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn how to use MultiAgent AI and explore our platform&apos;s capabilities.
              From getting started to advanced features, we&apos;ve got you covered.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 hover:shadow-lg transition-shadow">
              <Code className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">API Reference</h3>
              <p className="text-muted-foreground">Complete API documentation with examples and guides.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 hover:shadow-lg transition-shadow">
              <Bot className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Agent Guides</h3>
              <p className="text-muted-foreground">Detailed guides for each AI agent and their capabilities.</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 hover:shadow-lg transition-shadow">
              <Sparkles className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Tutorials</h3>
              <p className="text-muted-foreground">Step-by-step tutorials to help you get started quickly.</p>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Product Changelog
            </h2>
            <Timeline data={timelineData} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MultiAgent AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
