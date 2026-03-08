"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Agent } from "@/lib/agents-data"
import { 
  Code2, 
  Megaphone, 
  Mic, 
  Search, 
  Youtube, 
  Send, 
  Loader2, 
  Copy, 
  Check,
  ArrowLeft,
  Sparkles,
  Zap,
  Clock,
  Globe,
  MessageSquare,
  ImageIcon,
  FileText,
  Wand2,
  Play,
  ChevronDown,
  Brain,
  Terminal
} from "lucide-react"
import { cn } from "@/lib/utils"

// Format message content with better styling
function FormattedMessage({ content }: { content: string }) {
  // Remove reasoning tags and content - only show final response
  const cleanContent = content
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .trim()
  
  // Parse content into sections (code blocks, headers, lists, paragraphs)
  const sections = []
  const lines = cleanContent.split('\n')
  let inCodeBlock = false
  let codeContent = ''
  let codeLanguage = ''
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Check for code block start/end
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true
        codeLanguage = line.slice(3).trim()
        codeContent = ''
      } else {
        // End of code block - add it as a section
        sections.push({
          type: 'code',
          language: codeLanguage,
          content: codeContent
        })
        inCodeBlock = false
        codeContent = ''
      }
      continue
    }
    
    // If inside code block, collect lines
    if (inCodeBlock) {
      codeContent += line + '\n'
      continue
    }
    
    const trimmedLine = line.trim()
    if (!trimmedLine) continue
    
    // Headers (bold text ending with colon or numbered sections)
    if ((trimmedLine.startsWith('**') && trimmedLine.endsWith(':**')) ||
        /^#{1,3}\s/.test(trimmedLine)) {
      sections.push({
        type: 'header',
        content: trimmedLine.replace(/[#*]/g, '').replace(':', '')
      })
      continue
    }
    
    // Bullet points
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      sections.push({
        type: 'bullet',
        content: trimmedLine.replace(/^[-•]\s*/, '')
      })
      continue
    }
    
    // Numbered lists
    if (/^\d+\.\s/.test(trimmedLine)) {
      sections.push({
        type: 'numbered',
        content: trimmedLine.replace(/^\d+\.\s*/, '')
      })
      continue
    }
    
    // Regular paragraph
    sections.push({
      type: 'paragraph',
      content: trimmedLine
    })
  }
  
  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        if (section.type === 'code') {
          const [copied, setCopied] = useState(false)
          
          const handleCopyCode = () => {
            navigator.clipboard.writeText(section.content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }
          
          return (
            <div key={index} className="relative mt-4 mb-4 group">
              <div className="absolute top-2 right-2 flex gap-2">
                <div className="text-xs text-muted-foreground px-2 py-1 bg-card/50 rounded">
                  {section.language || 'code'}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <pre className="bg-card border border-border/50 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-foreground/90 whitespace-pre-wrap break-words">
                  {section.content}
                </code>
              </pre>
            </div>
          )
        }
        
        if (section.type === 'header') {
          return (
            <h3 key={index} className="text-base sm:text-lg font-bold text-foreground mt-6 first:mt-0 pb-2 border-b border-border/30">
              {section.content}
            </h3>
          )
        }
        
        if (section.type === 'bullet') {
          return (
            <div key={index} className="flex gap-2 items-start ml-2">
              <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <p className="text-sm sm:text-[15px] leading-relaxed text-foreground/90">
                {section.content}
              </p>
            </div>
          )
        }
        
        if (section.type === 'numbered') {
          return (
            <div key={index} className="flex gap-3 items-start">
              <span className="text-primary font-semibold text-sm shrink-0 min-w-[1.5rem]">
                {index + 1}.
              </span>
              <p className="text-sm sm:text-[15px] leading-relaxed text-foreground/90">
                {section.content}
              </p>
            </div>
          )
        }
        
        // Paragraph
        return (
          <p key={index} className="text-sm sm:text-[15px] leading-relaxed text-foreground/90">
            {section.content}
          </p>
        )
      })}
    </div>
  )
}

interface EnhancedAgentInterfaceProps {
  agent: Agent
  apiEndpoint: string
  features: { icon: React.ElementType; label: string; description: string }[]
  theme: {
    from: string
    to: string
    accent: string
    bg: string
    border: string
    glow: string
  }
}

const iconMap = {
  code: Code2,
  marketing: Megaphone,
  voice: Mic,
  research: Search,
  youtube: Youtube,
}

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
}

export function EnhancedAgentInterface({ agent, apiEndpoint, features, theme }: EnhancedAgentInterfaceProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'plan' | 'code'>('code')
  const [showModeDropdown, setShowModeDropdown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const IconComponent = iconMap[agent.icon]

  const scrollToBottom = () => {
    // Only scroll the messages container, not the whole page
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  useEffect(() => {
    // Only auto-scroll if user is near bottom (within 100px)
    const container = messagesEndRef.current?.parentElement
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
      if (isNearBottom) {
        scrollToBottom()
      }
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Prepare history for the API (exclude the current user message we just added)
      const historyForAPI = messages.map(msg => ({
        type: msg.type,
        content: msg.content
      }))

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input,
          history: historyForAPI,
          mode: mode
        }),
      })

      const data = await response.json()
      const result = data.result || data.response || 'No response generated'

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: result,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, agentMessage])
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <main className="min-h-screen relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className={cn(
          "absolute inset-0 opacity-20",
          "bg-gradient-to-br",
          theme.from,
          theme.to
        )} />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${theme.glow} 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, ${theme.glow} 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <Link 
            href="/agents"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 sm:mb-6"
          >
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Agents</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            {/* Agent Icon */}
            <motion.div
              className={cn(
                "relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0",
                "bg-gradient-to-br shadow-lg sm:shadow-xl",
                theme.from,
                theme.to
              )}
              whileHover={{ scale: 1.05, rotate: 5 }}
              animate={{
                boxShadow: [
                  `0 0 30px ${theme.glow}`,
                  `0 0 50px ${theme.glow}`,
                  `0 0 30px ${theme.glow}`,
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <IconComponent className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
              
              {/* Status Indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse" />
              </div>
            </motion.div>

            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-foreground truncate">
                  {agent.name}
                </h1>
                <span className={cn(
                  "px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium",
                  theme.bg,
                  theme.accent
                )}>
                  AI
                </span>
                
                {/* Mode Selector for Software Engineer */}
                {agent.icon === 'code' && (
                  <div className="relative">
                    <button
                      onClick={() => setShowModeDropdown(!showModeDropdown)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all",
                        mode === 'plan' 
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      )}
                    >
                      {mode === 'plan' ? (
                        <><Brain className="w-3 h-3" /> Plan</>
                      ) : (
                        <><Terminal className="w-3 h-3" /> Code</>
                      )}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    
                    {showModeDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-40 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => {
                            setMode('plan')
                            setShowModeDropdown(false)
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                        >
                          <Brain className="w-4 h-4 text-blue-500" />
                          <div>
                            <div className="font-medium">Plan Mode</div>
                            <div className="text-xs text-muted-foreground">Only planning, no code</div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setMode('code')
                            setShowModeDropdown(false)
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                        >
                          <Terminal className="w-4 h-4 text-purple-500" />
                          <div>
                            <div className="font-medium">Code Mode</div>
                            <div className="text-xs text-muted-foreground">Write production code</div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl line-clamp-2 sm:line-clamp-none">
                {agent.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={cn(
                "p-2.5 sm:p-4 rounded-lg sm:rounded-xl border transition-all group cursor-pointer",
                "bg-background/50 backdrop-blur-sm",
                "border-border/50 hover:border-primary/30",
                "hover:bg-background/80"
              )}
              whileHover={{ y: -2 }}
            >
              <feature.icon className={cn("w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2", theme.accent)} />
              <div className="font-medium text-xs sm:text-sm">{feature.label}</div>
              <div className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">{feature.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "rounded-xl sm:rounded-2xl border overflow-hidden",
            "bg-background/60 backdrop-blur-xl",
            "border-border/50",
            "shadow-xl sm:shadow-2xl"
          )}
        >
          {/* Chat Header */}
          <div className={cn(
            "px-3 sm:px-6 py-2.5 sm:py-4 border-b flex items-center justify-between",
            "border-border/50",
            theme.bg
          )}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={cn(
                "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse",
                theme.accent.replace("text-", "bg-")
              )} />
              <span className="font-medium text-sm sm:text-base">Chat with {agent.name.split(' ')[0]}</span>
              {messages.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({messages.length} messages)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear
                </button>
              )}
              <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  24/7
                </span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[300px] sm:h-[400px] overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-primary/20">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4",
                    theme.bg
                  )}
                >
                  <Sparkles className={cn("w-6 h-6 sm:w-8 sm:h-8", theme.accent)} />
                </motion.div>
                <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Start a conversation</h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                  Ask {agent.name.split(' ')[0]} Agent anything. Try asking for help with specific tasks or creative ideas.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      "flex gap-2 sm:gap-3",
                      message.type === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.type === 'agent' && (
                      <div className={cn(
                        "w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shrink-0",
                        theme.bg
                      )}>
                        <IconComponent className={cn("w-3 h-3 sm:w-4 sm:h-4", theme.accent)} />
                      </div>
                    )}
                    
                    <div className={cn(
                      "max-w-[90%] sm:max-w-[85%] group relative",
                      message.type === 'user' 
                        ? "bg-primary text-primary-foreground rounded-xl sm:rounded-2xl rounded-br-sm sm:rounded-br-md" 
                        : "bg-card border border-border/50 rounded-xl sm:rounded-2xl rounded-bl-sm sm:rounded-bl-md shadow-sm"
                    )}>
                      <div className="p-3 sm:p-5">
                        <FormattedMessage content={message.content} />
                      </div>
                      
                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className={cn(
                          "absolute -bottom-2 right-2 p-1 sm:p-1.5 rounded-lg opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all",
                          "bg-background border border-border/50 shadow-sm",
                          "hover:bg-muted"
                        )}
                      >
                        {copiedId === message.id ? (
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        )}
                      </button>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {/* Loading Indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 sm:gap-3"
              >
                <div className={cn(
                  "w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center",
                  theme.bg
                )}>
                  <IconComponent className={cn("w-3 h-3 sm:w-4 sm:h-4", theme.accent)} />
                </div>
                <div className="bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl rounded-bl-sm sm:rounded-bl-md px-3 sm:px-4 py-2 sm:py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className={cn("w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full", theme.accent.replace("text-", "bg-"))}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2.5 sm:p-4 border-t border-border/50 bg-background/30">
            <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask ${agent.name.split(' ')[0]}...`}
                  className={cn(
                    "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base",
                    "bg-background/80 border border-border/50",
                    "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                    "transition-all"
                  )}
                  disabled={loading}
                  onFocus={(e) => {
                    // Prevent page scroll on mobile when focusing input
                    e.preventDefault()
                  }}
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading || !input.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium flex items-center gap-1.5 sm:gap-2",
                  "bg-gradient-to-r text-white shadow-md sm:shadow-lg",
                  theme.from,
                  theme.to,
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "hover:shadow-lg sm:hover:shadow-xl transition-all"
                )}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4"
        >
          {[
            { icon: Wand2, title: "Be Specific", desc: "Provide clear details for better results" },
            { icon: FileText, title: "Iterate", desc: "Refine your prompts based on responses" },
            { icon: Play, title: "Experiment", desc: "Try different approaches and styles" },
          ].map((tip, i) => (
            <div
              key={tip.title}
              className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-background/30 border border-border/30"
            >
              <div className={cn("p-1.5 sm:p-2 rounded-lg", theme.bg)}>
                <tip.icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", theme.accent)} />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-xs sm:text-sm">{tip.title}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{tip.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
