"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Agent } from "@/lib/agents-data"
import { 
  Code2, 
  Megaphone, 
  Mic, 
  Search, 
  Youtube, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Zap,
  Play,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  code: Code2,
  marketing: Megaphone,
  voice: Mic,
  research: Search,
  youtube: Youtube,
}

const gradientMap: Record<string, { 
  from: string; 
  to: string; 
  accent: string;
  bg: string;
  border: string;
}> = {
  code: { 
    from: "from-violet-500", 
    to: "to-purple-600", 
    accent: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30"
  },
  marketing: { 
    from: "from-pink-500", 
    to: "to-rose-600", 
    accent: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30"
  },
  voice: { 
    from: "from-cyan-500", 
    to: "to-blue-600", 
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30"
  },
  research: { 
    from: "from-emerald-500", 
    to: "to-teal-600", 
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30"
  },
  youtube: { 
    from: "from-red-500", 
    to: "to-orange-600", 
    accent: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30"
  },
}

const featuresMap: Record<string, string[]> = {
  code: ["Code Generation", "Bug Fixing", "Code Review", "Architecture"],
  marketing: ["Ad Copy", "Campaigns", "Strategy", "Analytics"],
  voice: ["Voiceover", "Narration", "Podcast", "Audio"],
  research: ["Data Analysis", "Summaries", "Reports", "Insights"],
  youtube: ["Scripts", "SEO", "Thumbnails", "Ideas"],
}

interface AgentsCarouselProps {
  agents: Agent[]
}

export function AgentsCarousel({ agents }: AgentsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev === 0 ? agents.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev === agents.length - 1 ? 0 : prev + 1))
  }

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 6000)
    return () => clearInterval(interval)
  }, [activeIndex])

  const activeAgent = agents[activeIndex]
  const IconComponent = iconMap[activeAgent.icon]
  const gradients = gradientMap[activeAgent.icon]
  const features = featuresMap[activeAgent.icon]

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6">
      {/* Main Display */}
      <div className="relative">
        {/* Background Glow */}
        <div className={cn(
          "absolute inset-0 blur-3xl opacity-30 transition-all duration-1000",
          "bg-gradient-to-r",
          gradients.from,
          gradients.to
        )} />

        {/* Main Card */}
        <div className="relative grid lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-[400px] sm:min-h-[500px]">
          {/* Left: Visual */}
          <div className="relative flex items-center justify-center order-1 lg:order-1">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeAgent.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * -50, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative"
              >
                {/* Orbiting Elements - Hidden on mobile */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-48 h-48 sm:w-64 sm:h-64 -m-6 sm:-m-8 hidden sm:block"
                >
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full",
                        gradients.bg
                      )}
                      style={{
                        top: `${50 + 45 * Math.sin((deg * Math.PI) / 180)}%`,
                        left: `${50 + 45 * Math.cos((deg * Math.PI) / 180)}%`,
                      }}
                    />
                  ))}
                </motion.div>

                {/* Main Icon Circle */}
                <motion.div
                  className={cn(
                    "relative w-32 h-32 sm:w-48 sm:h-48 rounded-full flex items-center justify-center",
                    "bg-gradient-to-br shadow-xl sm:shadow-2xl",
                    gradients.from,
                    gradients.to,
                    "shadow-primary/20"
                  )}
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    boxShadow: [
                      "0 0 40px rgba(139, 92, 246, 0.3)",
                      "0 0 80px rgba(139, 92, 246, 0.5)",
                      "0 0 40px rgba(139, 92, 246, 0.3)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <IconComponent className="w-12 h-12 sm:w-20 sm:h-20 text-white" />
                  
                  {/* Floating Badge */}
                  <motion.div
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-lg"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                  </motion.div>
                </motion.div>

                {/* Decorative Rings */}
                <div className="absolute inset-0 w-32 h-32 sm:w-48 sm:h-48 -m-3 sm:-m-4 rounded-full border border-dashed border-primary/20 animate-spin hidden sm:block" style={{ animationDuration: '30s' }} />
                <div className="absolute inset-0 w-32 h-32 sm:w-48 sm:h-48 -m-6 sm:-m-8 rounded-full border border-primary/10 hidden sm:block" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Content */}
          <div className="relative order-2 lg:order-2 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeAgent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Badge */}
                <div className={cn(
                  "inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium",
                  gradients.bg,
                  gradients.accent,
                  "border",
                  gradients.border
                )}>
                  <Zap size={12} className="sm:w-3.5 sm:h-3.5" />
                  AI Agent
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {activeAgent.name}
                </h2>

                {/* Description */}
                <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed px-4 lg:px-0">
                  {activeAgent.description}
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-sm mx-auto lg:mx-0">
                  {features.map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={cn(
                        "flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl",
                        "bg-background/50 border border-border/50",
                        "hover:border-primary/30 transition-colors"
                      )}
                    >
                      <Star className={cn("w-3 h-3 sm:w-4 sm:h-4", gradients.accent)} />
                      <span className="text-xs sm:text-sm font-medium truncate">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <Link href={activeAgent.href} className="inline-block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "mt-2 sm:mt-4 group flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg",
                      "bg-gradient-to-r text-white shadow-lg sm:shadow-xl",
                      gradients.from,
                      gradients.to,
                      "hover:shadow-xl sm:hover:shadow-2xl hover:shadow-primary/30 transition-all"
                    )}
                  >
                    <Play size={16} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Try {activeAgent.name.split(' ')[0]} Agent</span>
                    <span className="sm:hidden">Try Agent</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mt-8 sm:mt-12">
        {/* Prev */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          className="p-2.5 sm:p-4 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        {/* Agent Thumbnails */}
        <div className="flex items-center gap-2 sm:gap-3">
          {agents.map((agent, index) => {
            const Icon = iconMap[agent.icon]
            const isActive = index === activeIndex
            return (
              <motion.button
                key={agent.id}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1)
                  setActiveIndex(index)
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "relative p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "bg-background/50 border border-border/50 hover:border-primary/30"
                )}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Next */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="p-2.5 sm:p-4 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
        {agents.map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "h-1 sm:h-1.5 rounded-full transition-all",
              index === activeIndex 
                ? "w-6 sm:w-8 bg-primary" 
                : "w-1.5 sm:w-1.5 bg-muted-foreground/30"
            )}
            animate={{ 
              scale: index === activeIndex ? 1 : 0.8,
            }}
          />
        ))}
      </div>
    </div>
  )
}
