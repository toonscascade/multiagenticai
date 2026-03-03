'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Sparkles } from 'lucide-react'

interface PricingPlan {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
}

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for trying out our AI agents',
    features: [
      '5 agent interactions per month',
      'Basic support',
      'Access to all agent types',
      'Standard response time',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For professionals and small teams',
    features: [
      'Unlimited agent interactions',
      'Priority support',
      'Advanced customization',
      'Faster response times',
      'API access',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'On-premise deployment option',
      'Advanced analytics',
    ],
    cta: 'Contact Sales',
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 relative">
      {/* Subtle blend overlay at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-md backdrop-blur-sm">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative transition-all duration-300 hover:shadow-xl backdrop-blur-sm ${
                plan.popular 
                  ? 'border-primary shadow-lg scale-105 bg-gradient-to-b from-primary/10 via-primary/5 to-background/50 backdrop-blur-md' 
                  : 'bg-gradient-to-b from-background/80 via-background/60 to-muted/20 backdrop-blur-sm border-border/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
                  {plan.price}
                </div>
                <p className="text-sm text-muted-foreground mb-6">per month</p>
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <span className={plan.popular ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-md' 
                      : 'bg-gradient-to-r from-background to-muted hover:from-muted hover:to-muted/80 text-foreground border border-border/50'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Subtle blend overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
      </div>
    </section>
  )
}
