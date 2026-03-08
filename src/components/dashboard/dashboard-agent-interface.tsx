"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Agent } from "@/lib/agents-data"
import { 
  Send, 
  Loader2, 
  Copy, 
  Check,
  Sparkles,
  Clock,
  Globe,
  MessageSquare,
  Wand2,
  FileText,
  Play,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown
} from "lucide-react"
import { cn } from "@/lib/utils"

// Format message content with better styling
function FormattedMessage({ content }: { content: string }) {
  // Remove markdown asterisks and format
  const cleanContent = content
    .replace(/\*\*\*/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/`/g, '')
  
  // Split into sections
  const lines = cleanContent.split('\n').filter(line => line.trim())
  
  return (
    <div className="space-y-2.5">
      {lines.map((line, index) => {
        const trimmedLine = line.trim()
        
        // Section headers (detected by colons at end or common header patterns)
        if (trimmedLine.endsWith(':') || 
            /^(Video Idea|SEO Optimization|Thumbnail|Growth Strategy|Content|Tags|Hashtags|Description)/i.test(trimmedLine)) {
          return (
            <h3 key={index} className="text-sm font-bold text-foreground mt-3 first:mt-0">
              {trimmedLine}
            </h3>
          )
        }
        
        // Bullet points (lines starting with - or •)
        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
          return (
            <div key={index} className="flex gap-2 items-start ml-2">
              <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <p className="text-sm leading-relaxed text-foreground/90">
                {trimmedLine.replace(/^[-•]\s*/, '')}
              </p>
            </div>
          )
        }
        
        // Numbered lists
        if (/^\d+\./.test(trimmedLine)) {
          return (
            <div key={index} className="flex gap-3 items-start">
              <span className="text-primary font-semibold text-sm shrink-0 min-w-[1.5rem]">
                {trimmedLine.match(/^\d+/)?.[0]}.
              </span>
              <p className="text-sm leading-relaxed text-foreground/90">
                {trimmedLine.replace(/^\d+\.\s*/, '')}
              </p>
            </div>
          )
        }
        
        // Regular paragraphs
        return (
          <p key={index} className="text-sm leading-relaxed text-foreground/90">
            {trimmedLine}
          </p>
        )
      })}
    </div>
  )
}

interface DashboardAgentInterfaceProps {
  agent: Agent
  apiEndpoint: string
  theme: {
    from: string
    to: string
    accent: string
    bg: string
    border: string
    glow: string
  }
}

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
  liked?: boolean
}

export function DashboardAgentInterface({ agent, apiEndpoint, theme }: DashboardAgentInterfaceProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      // Prepare history for the API
      const historyForAPI = messages.map(msg => ({
        type: msg.type,
        content: msg.content
      }))

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input,
          history: historyForAPI
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

  const handleLike = (id: string) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, liked: m.liked === true ? undefined : true } : m
    ))
  }

  const handleDislike = (id: string) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, liked: m.liked === false ? undefined : false } : m
    ))
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className={cn(
        "px-4 lg:px-6 py-3 border-b flex items-center justify-between shrink-0",
        "border-border",
        theme.bg
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            theme.accent.replace("text-", "bg-")
          )} />
          <div>
            <span className="font-medium text-sm lg:text-base">{agent.name}</span>
            <span className="hidden sm:inline text-muted-foreground text-sm ml-2">AI Agent</span>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-4 text-xs text-muted-foreground">
          <span className="hidden md:flex items-center gap-1">
            <Clock size={12} />
            24/7
          </span>
          <span className="hidden md:flex items-center gap-1">
            <Globe size={12} />
            Multi-language
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-3 lg:space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-4",
                theme.bg
              )}
            >
              <Sparkles className={cn("w-7 h-7 lg:w-8 lg:h-8", theme.accent)} />
            </motion.div>
            <h3 className="text-base lg:text-lg font-medium mb-2">Start a conversation</h3>
            <p className="text-xs lg:text-sm text-muted-foreground max-w-md">
              Ask {agent.name} anything. Try asking for help with specific tasks or creative ideas.
            </p>
            
            {/* Quick Prompts */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["Help me with...", "Generate...", "Explain...", "Create..."].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="px-3 py-1.5 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "flex gap-2 lg:gap-3",
                  message.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.type === 'agent' && (
                  <div className={cn(
                    "w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center shrink-0",
                    theme.bg
                  )}>
                    <Sparkles className={cn("w-3.5 h-3.5 lg:w-4 lg:h-4", theme.accent)} />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[90%] lg:max-w-[80%] group",
                  message.type === 'user' 
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm" 
                    : "bg-card border border-border/50 rounded-2xl rounded-bl-sm shadow-sm"
                )}>
                  <div className="p-3 lg:p-5">
                    {message.type === 'user' ? (
                      <p className="text-sm">{message.content}</p>
                    ) : (
                      <FormattedMessage content={message.content} />
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  {message.type === 'agent' && (
                    <div className="flex items-center gap-1 px-3 pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="p-1 hover:bg-background rounded"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                      <button 
                        onClick={() => handleLike(message.id)}
                        className={cn("p-1 hover:bg-background rounded", message.liked === true && "text-emerald-500")}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleDislike(message.id)}
                        className={cn("p-1 hover:bg-background rounded", message.liked === false && "text-red-500")}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary" />
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
            className="flex gap-2 lg:gap-3"
          >
            <div className={cn(
              "w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center",
              theme.bg
            )}>
              <Sparkles className={cn("w-3.5 h-3.5 lg:w-4 lg:h-4", theme.accent)} />
            </div>
            <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-sm px-3 py-2 lg:px-4 lg:py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={cn("w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full", theme.accent.replace("text-", "bg-"))}
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
      <div className="p-3 lg:p-4 border-t border-border bg-card/50 shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2 lg:gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${agent.name}...`}
              className={cn(
                "w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl text-sm",
                "bg-background border border-border",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                "transition-all"
              )}
              onFocus={(e) => {
                // Prevent page scroll on mobile when focusing input
                e.preventDefault()
              }}
              disabled={loading}
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading || !input.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "px-3 lg:px-5 py-2.5 lg:py-3 rounded-xl font-medium flex items-center gap-1.5 lg:gap-2",
              "bg-gradient-to-r text-white shadow-md",
              theme.from,
              theme.to,
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:shadow-lg transition-all"
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
        
        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
          <button className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors whitespace-nowrap">
            <Wand2 className="w-3 h-3" />
            Improve prompt
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors whitespace-nowrap">
            <FileText className="w-3 h-3" />
            Templates
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors whitespace-nowrap">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}
