"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Home, Users, FileText, Book, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, any> = {
  Home,
  Users,
  FileText,
  Book,
}

interface NavItem {
  name: string
  url: string
  icon: string
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  loginHref?: string
  signupHref?: string
}

export function NavBar({ items, className, loginHref = '/login', signupHref = '/signup' }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-6",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 bg-background/80 backdrop-blur-md border border-border py-1 px-1 rounded-full shadow-lg min-w-[120px] md:min-w-fit">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = activeTab === item.name

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                    "text-foreground/80 hover:text-primary",
                    isActive && "bg-primary/10 text-primary",
                  )}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                        <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Spacer for mobile to push hamburger right */}
          <div className="md:hidden flex-1" />

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <div className="w-px h-6 bg-border mx-1" />
            <Link
              href={loginHref}
              className="text-sm font-semibold px-4 py-2 rounded-full transition-colors text-foreground/80 hover:text-primary"
            >
              Log in
            </Link>
            <Link
              href={signupHref}
              className="text-sm font-semibold px-4 py-2 rounded-full transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Hamburger Button - Right aligned */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-muted/50 transition-colors ml-auto"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X size={24} strokeWidth={2} className="text-foreground" />
            ) : (
              <Menu size={24} strokeWidth={2} className="text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-background border-l border-border z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header with close button */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={24} strokeWidth={2} className="text-foreground" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
                  {items.map((item) => {
                    const Icon = iconMap[item.icon]
                    const isActive = activeTab === item.name

                    return (
                      <Link
                        key={item.name}
                        href={item.url}
                        onClick={() => {
                          setActiveTab(item.name)
                          setMobileMenuOpen(false)
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                          "hover:bg-muted/50",
                          isActive && "bg-primary/10 text-primary"
                        )}
                      >
                        {Icon && <Icon size={20} strokeWidth={2} />}
                        <span className="text-base">{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>

                {/* Auth Buttons at Bottom */}
                <div className="p-6 border-t border-border space-y-3">
                  <Link
                    href={loginHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-3 rounded-xl font-semibold border border-border text-foreground hover:bg-muted/50 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href={signupHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
