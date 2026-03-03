'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Bot, ChevronDown } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface NavItem {
  name: string
  href: string
}

interface NavbarProps {
  logo?: {
    src: string
    alt: string
    companyName: string
  }
  navigation?: NavItem[]
  loginHref?: string
  signupHref?: string
}

const defaultNavigation: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Agents', href: '/agents' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Docs', href: '/docs' },
]

export function Navbar({ 
  logo, 
  navigation = defaultNavigation,
  loginHref = '/login',
  signupHref = '/signup'
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const defaultLogo = {
    src: "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=violet&shade=500",
    alt: "MultiAgent AI Logo",
    companyName: "MultiAgent AI"
  }

  const finalLogo = logo || defaultLogo

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav aria-label="Global" className="flex items-center justify-between p-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">{finalLogo.companyName}</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-x-8">
          {navigation.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <Link 
            href={loginHref}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link 
            href={signupHref}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Sign up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            <Menu aria-hidden="true" className="size-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dialog */}
      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-4 py-6 sm:px-6 sm:max-w-sm sm:ring-1 sm:ring-border lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="#" className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">{finalLogo.companyName}</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Close menu</span>
              <X aria-hidden="true" className="size-6" />
            </button>
          </div>
          
          <div className="mt-8 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-4 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-4">
                <Link
                  href={loginHref}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href={signupHref}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
