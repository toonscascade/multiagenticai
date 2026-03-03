import { HeroLanding } from '@/components/ui/hero-1'
import { AgentsSection } from '@/components/landing/agents-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { Footer } from '@/components/landing/footer'
import { agents } from '@/lib/agents-data'

export default function Home() {
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

      {/* Hero Section with integrated navbar */}
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
      <PricingSection />
      <Footer />
    </main>
  )
}
