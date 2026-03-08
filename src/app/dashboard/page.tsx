"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Code2, 
  Megaphone, 
  Mic, 
  Search, 
  Youtube,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const agents = [
  { 
    id: "software-engineer", 
    name: "Software Engineer", 
    description: "Generate code, debug, and review",
    icon: Code2, 
    color: "violet",
    href: "/dashboard/agents/software-engineer",
    stats: "1.2k uses"
  },
  { 
    id: "marketing", 
    name: "Marketing", 
    description: "Create campaigns and ad copy",
    icon: Megaphone, 
    color: "pink",
    href: "/dashboard/agents/marketing",
    stats: "856 uses"
  },
  { 
    id: "voice", 
    name: "Voice", 
    description: "Voiceover and narration",
    icon: Mic, 
    color: "cyan",
    href: "/dashboard/agents/voice",
    stats: "432 uses"
  },
  { 
    id: "research", 
    name: "Research", 
    description: "Analyze data and summarize",
    icon: Search, 
    color: "emerald",
    href: "/dashboard/agents/research",
    stats: "1.5k uses"
  },
  { 
    id: "youtube", 
    name: "YouTube", 
    description: "Scripts, SEO, thumbnails",
    icon: Youtube, 
    color: "red",
    href: "/dashboard/agents/youtube",
    stats: "2.1k uses"
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  violet: { 
    bg: "bg-violet-500/10", 
    text: "text-violet-400", 
    border: "border-violet-500/30",
    gradient: "from-violet-500 to-purple-600"
  },
  pink: { 
    bg: "bg-pink-500/10", 
    text: "text-pink-400", 
    border: "border-pink-500/30",
    gradient: "from-pink-500 to-rose-600"
  },
  cyan: { 
    bg: "bg-cyan-500/10", 
    text: "text-cyan-400", 
    border: "border-cyan-500/30",
    gradient: "from-cyan-500 to-blue-600"
  },
  emerald: { 
    bg: "bg-emerald-500/10", 
    text: "text-emerald-400", 
    border: "border-emerald-500/30",
    gradient: "from-emerald-500 to-teal-600"
  },
  red: { 
    bg: "bg-red-500/10", 
    text: "text-red-400", 
    border: "border-red-500/30",
    gradient: "from-red-500 to-orange-600"
  },
}

const recentActivity = [
  { agent: "YouTube Agent", action: "Generated video script", time: "2 min ago", color: "red" },
  { agent: "Software Engineer", action: "Debugged React code", time: "15 min ago", color: "violet" },
  { agent: "Marketing", action: "Created ad campaign", time: "1 hour ago", color: "pink" },
]

export default function DashboardPage() {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Choose an AI agent to get started with your tasks.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Uses", value: "5,688", icon: Zap, change: "+12%" },
          { label: "This Month", value: "1,234", icon: TrendingUp, change: "+8%" },
          { label: "Credits Left", value: "100", icon: Sparkles, change: "Refill soon" },
          { label: "Avg. Time", value: "2.3s", icon: Clock, change: "Fast" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-emerald-500 font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Agents Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your AI Agents</h2>
          <Link 
            href="/agents" 
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {agents.map((agent, i) => {
            const colors = colorMap[agent.color]
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Link href={agent.href}>
                  <div className={cn(
                    "group p-4 rounded-xl border transition-all cursor-pointer h-full",
                    "bg-card hover:bg-card/80",
                    "border-border hover:border-primary/30",
                    "hover:shadow-lg hover:shadow-primary/5"
                  )}>
                    {/* Icon */}
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all",
                      "bg-gradient-to-br",
                      colors.gradient,
                      "group-hover:scale-110"
                    )}>
                      <agent.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Info */}
                    <h3 className="font-semibold mb-1">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {agent.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      {agent.stats}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Recent Activity & Quick Tips */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-card border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => {
              const colors = colorMap[activity.color]
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className={cn("w-2 h-2 rounded-full", colors.text.replace("text-", "bg-"))} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.agent}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-xl bg-card border border-border"
        >
          <h2 className="text-lg font-semibold mb-4">Quick Tips</h2>
          <div className="space-y-3">
            {[
              { title: "Be Specific", desc: "The more details you provide, the better the results" },
              { title: "Iterate", desc: "Refine your prompts based on the AI's responses" },
              { title: "Experiment", desc: "Try different approaches to get the best output" },
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{tip.title}</p>
                  <p className="text-xs text-muted-foreground">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
