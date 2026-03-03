import { HeroLanding } from '@/components/ui/hero-1'
import { AgentsSection } from '@/components/landing/agents-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { Footer } from '@/components/landing/footer'
import { Timeline } from '@/components/ui/timeline'
import { agents } from '@/lib/agents-data'

export default function HomePage() {

  const timelineData = [
    {
      title: "v2.0 - 2026",
      content: (
        <div>
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
        <div>
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
        <div>
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
      
      {/* Sections flow naturally - no negative margins, clean blend */}
      <AgentsSection agents={agents} />
      
      {/* Timeline Section - Product Journey */}
      <section id="timeline" className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From humble beginnings to a comprehensive AI platform
            </p>
          </div>
          <Timeline data={timelineData} />
        </div>
      </section>
      
      <PricingSection />
      <Footer />
    </main>
  )
}
