'use client'

import Link from 'next/link'
import { Bot, Github, Twitter, Linkedin, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-background/90 via-background/70 to-muted/40 backdrop-blur-sm">
      {/* Top blend line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-md backdrop-blur-sm">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">MultiAgent AI</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Empowering businesses with intelligent AI agents for coding, marketing, content creation, and more. Transform your workflow today.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Stay updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border border-input/70 bg-background/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                />
                <Button variant="default" size="sm" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-primary to-primary/60 rounded-full"></span>
              Product
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/agents" className="text-muted-foreground hover:text-primary transition-colors">
                  All Agents
                </Link>
              </li>
              <li>
                <Link href="/agents/software-engineer" className="text-muted-foreground hover:text-primary transition-colors">
                  Software Engineer
                </Link>
              </li>
              <li>
                <Link href="/agents/marketing" className="text-muted-foreground hover:text-primary transition-colors">
                  Marketing Agent
                </Link>
              </li>
              <li>
                <Link href="/agents/youtube" className="text-muted-foreground hover:text-primary transition-colors">
                  YouTube Agent
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-primary to-primary/60 rounded-full"></span>
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-primary to-primary/60 rounded-full"></span>
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:from-primary hover:to-primary/90 hover:text-primary-foreground transition-all shadow-sm hover:shadow-md"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:from-primary hover:to-primary/90 hover:text-primary-foreground transition-all shadow-sm hover:shadow-md"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:from-primary hover:to-primary/90 hover:text-primary-foreground transition-all shadow-sm hover:shadow-md"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} MultiAgent AI. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>by the MultiAgent AI Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Simple Button component for footer
function Button({ variant, size, children, className = '' }: any) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-muted text-foreground',
  }
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    default: 'h-10 px-4 py-2 text-sm',
    lg: 'h-11 px-8 text-base',
  }
  
  const variantStyles = variants[variant as keyof typeof variants] || variants.default
  const sizeStyles = sizes[size as keyof typeof sizes] || sizes.default
  
  return (
    <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}>
      {children}
    </button>
  )
}
