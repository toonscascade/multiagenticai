"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
  Code2, 
  Megaphone, 
  Mic, 
  Search, 
  Youtube,
  LayoutDashboard,
  Settings,
  History,
  CreditCard,
  HelpCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Sparkles
} from "lucide-react"

const agents = [
  { id: "software-engineer", name: "Software Engineer", icon: Code2, color: "violet", href: "/dashboard/agents/software-engineer" },
  { id: "marketing", name: "Marketing", icon: Megaphone, color: "pink", href: "/dashboard/agents/marketing" },
  { id: "voice", name: "Voice", icon: Mic, color: "cyan", href: "/dashboard/agents/voice" },
  { id: "research", name: "Research", icon: Search, color: "emerald", href: "/dashboard/agents/research" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "red", href: "/dashboard/agents/youtube" },
]

const navItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "History", icon: History, href: "/dashboard/history" },
  { name: "Billing", icon: CreditCard, href: "/dashboard/billing" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
  { name: "Help", icon: HelpCircle, href: "/dashboard/help" },
]

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/30", glow: "shadow-violet-500/20" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30", glow: "shadow-pink-500/20" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30", glow: "shadow-cyan-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" },
  red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", glow: "shadow-red-500/20" },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isAgentActive = (href: string) => pathname.startsWith(href)
  const isNavActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-card border-r border-border",
          "flex flex-col transition-all duration-300",
          sidebarOpen ? "w-72" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-bold text-lg whitespace-nowrap"
                >
                  Dashboard
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          {/* Close mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {/* Main Nav */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                  "hover:bg-muted group",
                  isNavActive(item.href) && "bg-primary/10 text-primary"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 shrink-0",
                  isNavActive(item.href) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Agents Section */}
          <div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
                >
                  AI Agents
                </motion.p>
              )}
            </AnimatePresence>
            
            <nav className="space-y-1">
              {agents.map((agent) => {
                const colors = colorMap[agent.color]
                const isActive = isAgentActive(agent.href)
                
                return (
                  <Link
                    key={agent.id}
                    href={agent.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                      "hover:bg-muted group relative",
                      isActive && cn(colors.bg, colors.text, colors.border, "border")
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all",
                      isActive ? colors.bg : "bg-muted group-hover:bg-background"
                    )}>
                      <agent.icon className={cn(
                        "w-4 h-4",
                        isActive ? colors.text : "text-muted-foreground group-hover:text-foreground"
                      )} />
                    </div>
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex-1 min-w-0"
                        >
                          <span className="text-sm font-medium truncate block">{agent.name}</span>
                          <span className="text-[10px] text-muted-foreground">AI Agent</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Active Indicator */}
                    {isActive && sidebarOpen && (
                      <motion.div
                        layoutId="activeAgent"
                        className={cn("w-1.5 h-1.5 rounded-full", colors.text.replace("text-", "bg-"))}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-2">
          {/* User Profile */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-all">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 text-left"
                >
                  <span className="text-sm font-medium block">User</span>
                  <span className="text-xs text-muted-foreground">Free Plan</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Logout */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
            <LogOut className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Collapse Toggle - Desktop Only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-primary text-primary-foreground rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium capitalize">
                {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview'}
              </span>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Credits Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
              <Sparkles className="w-4 h-4" />
              <span>100 credits</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
