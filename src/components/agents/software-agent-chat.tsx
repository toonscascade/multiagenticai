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
  Brain,
  Terminal,
  ChevronDown,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Code2
} from "lucide-react"
import { cn } from "@/lib/utils"

// Format message content with code blocks
function FormattedMessage({ content }: { content: string }) {
  const cleanContent = content
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .trim()
  
  const sections = []
  const lines = cleanContent.split('\n')
  let inCodeBlock = false
  let codeContent = ''
  let codeLanguage = ''
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeLanguage = line.slice(3).trim()
        codeContent = ''
      } else {
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
    
    if (inCodeBlock) {
      codeContent += line + '\n'
      continue
    }
    
    const trimmedLine = line.trim()
    if (!trimmedLine) continue
    
    if ((trimmedLine.startsWith('**') && trimmedLine.endsWith(':**')) ||
        /^#{1,3}\s/.test(trimmedLine)) {
      sections.push({
        type: 'header',
        content: trimmedLine.replace(/[#*]/g, '').replace(':', '')
      })
      continue
    }
    
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
      sections.push({
        type: 'bullet',
        content: trimmedLine.replace(/^[-•]\s*/, '')
      })
      continue
    }
    
    if (/^\d+\.\s/.test(trimmedLine)) {
      sections.push({
        type: 'numbered',
        content: trimmedLine.replace(/^\d+\.\s*/, '')
      })
      continue
    }
    
    sections.push({
      type: 'paragraph',
      content: trimmedLine
    })
  }
  
  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        if (section.type === 'code') {
          return (
            <div key={index} className="relative mt-4 mb-4 group">
              <div className="absolute top-2 right-2 flex gap-2">
                <div className="text-xs text-muted-foreground px-2 py-1 bg-card/50 rounded">
                  {section.language || 'code'}
                </div>
              </div>
              <pre className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-foreground/90 whitespace-pre-wrap break-words font-mono text-sm">
                  {section.content}
                </code>
              </pre>
            </div>
          )
        }
        
        if (section.type === 'header') {
          return (
            <h3 key={index} className="text-base font-semibold text-foreground mt-6 first:mt-0">
              {section.content}
            </h3>
          )
        }
        
        if (section.type === 'bullet') {
          return (
            <div key={index} className="flex gap-2 items-start ml-2">
              <span className="text-violet-400 mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
              <p className="text-[15px] leading-relaxed text-foreground/90">
                {section.content}
              </p>
            </div>
          )
        }
        
        if (section.type === 'numbered') {
          return (
            <div key={index} className="flex gap-3 items-start">
              <span className="text-violet-400 font-semibold text-sm shrink-0 min-w-[1.5rem]">
                {index + 1}.
              </span>
              <p className="text-[15px] leading-relaxed text-foreground/90">
                {section.content}
              </p>
            </div>
          )
        }
        
        return (
          <p key={index} className="text-[15px] leading-relaxed text-foreground/90">
            {section.content}
          </p>
        )
      })}
    </div>
  )
}

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
}

interface SoftwareAgentChatProps {
  agent: Agent
  apiEndpoint: string
}

export function SoftwareAgentChat({ agent, apiEndpoint }: SoftwareAgentChatProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'plan' | 'code'>('code')
  const [showModeDropdown, setShowModeDropdown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
    }
  }, [input])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Auto-scroll when new messages are added or during loading
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [messages, loading])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Main Chat Area */}
      <main className="flex-1 pb-32 pt-8">
        <div className="max-w-3xl mx-auto px-4">
          {messages.length === 0 ? (
            // Empty State
            <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-violet-400" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {agent.name}
                </h1>
                <p className="text-muted-foreground max-w-md">
                  {agent.description}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {['Generate a React component', 'Debug this error', 'Optimize this code', 'Design an API'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-muted-foreground hover:text-foreground transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            // Messages
            <div className="space-y-6 py-8">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "group",
                    message.type === 'user' ? "flex justify-end" : "flex justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] sm:max-w-[75%]",
                    message.type === 'user' ? "bg-violet-600 text-white px-5 py-3 rounded-2xl rounded-br-md" : "w-full"
                  )}>
                    {message.type === 'agent' && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                          <Code2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <FormattedMessage content={message.content} />
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCopy(message.content, message.id)}
                              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                              title="Copy"
                            >
                              {copiedId === message.id ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                              <RotateCcw className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                              <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                              <ThumbsDown className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {message.type === 'user' && (
                      <p className="text-[15px]">{message.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Code2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-2 py-3">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-8 pb-6">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-3">
            {/* Mode Selector */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className={cn(
                  "flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all border h-[56px]",
                  mode === 'plan' 
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    : "bg-violet-500/10 border-violet-500/30 text-violet-400"
                )}
              >
                {mode === 'plan' ? (
                  <><Brain className="w-4 h-4" /> Plan</>
                ) : (
                  <><Terminal className="w-4 h-4" /> Code</>
                )}
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showModeDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowModeDropdown(false)}
                  />
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        setMode('plan')
                        setShowModeDropdown(false)
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 flex items-center gap-3 transition-colors"
                    >
                      <Brain className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-medium text-foreground">Plan Mode</div>
                        <div className="text-xs text-muted-foreground">Architecture & planning only</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setMode('code')
                        setShowModeDropdown(false)
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 flex items-center gap-3 transition-colors"
                    >
                      <Terminal className="w-4 h-4 text-violet-400" />
                      <div>
                        <div className="font-medium text-foreground">Code Mode</div>
                        <div className="text-xs text-muted-foreground">Write production code</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Input Field */}
            <div className="flex-1 relative bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${agent.name}...`}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground px-5 py-4 pr-14 min-h-[56px] max-h-[200px] resize-none outline-none text-[15px]"
                rows={1}
              />
              
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    input.trim() && !loading
                      ? "bg-violet-600 hover:bg-violet-500 text-white"
                      : "bg-white/5 text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </form>
          
          <p className="text-center text-xs text-muted-foreground mt-3">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
