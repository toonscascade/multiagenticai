"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Agent } from "@/lib/agents-data"
import { 
  Mic, 
  Headphones, 
  Radio, 
  Music, 
  Volume2,
  Send, 
  Loader2, 
  Copy, 
  Check,
  ArrowLeft,
  Sparkles,
  Zap,
  MessageSquare,
  Play,
  Pause,
  VolumeX,
  Volume,
  Settings2,
  Trash2,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceAgentInterfaceProps {
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

const VOICE_CATEGORIES = [
  { id: 'auto', name: 'Auto Detect', icon: Sparkles, description: 'AI will detect best voice' },
  { id: 'conversational', name: 'Conversational', icon: MessageSquare, description: 'Natural, friendly chat' },
  { id: 'audiobooks', name: 'Audiobooks', icon: Headphones, description: 'Expressive storytelling' },
  { id: 'entertainment', name: 'Entertainment', icon: Music, description: 'Animated, dramatic' },
  { id: 'sales', name: 'Sales', icon: Zap, description: 'Persuasive, energetic' },
  { id: 'news', name: 'News', icon: Radio, description: 'Professional, neutral' },
  { id: 'horror', name: 'Horror', icon: VolumeX, description: 'Deep, suspenseful' },
  { id: 'educational', name: 'Educational', icon: Volume2, description: 'Clear, patient' },
]

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
  voiceCategory?: string
  selectedVoice?: string
  voiceInfo?: {
    name: string
    gender: string
    description: string
  }
  audioUrl?: string
}

export function VoiceAgentInterface({ agent, apiEndpoint, features, theme }: VoiceAgentInterfaceProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('auto')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [generatingAudioId, setGeneratingAudioId] = useState<string | null>(null)
  const [volume, setVolume] = useState(80)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }

  useEffect(() => {
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
          voiceCategory: selectedCategory
        }),
      })

      const data = await response.json()
      const result = data.result || 'No response generated'

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: result,
        timestamp: new Date(),
        voiceCategory: data.voiceCategory,
        selectedVoice: data.selectedVoice,
        voiceInfo: data.voiceInfo
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
    setPlayingId(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }

  const generateAndPlayAudio = async (text: string, messageId: string, voiceCategory?: string, selectedVoice?: string) => {
    try {
      setGeneratingAudioId(messageId)
      setPlayingId(messageId)
      
      console.log('🎤 Generating audio for:', text.substring(0, 50) + '...')
      
      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceCategory: voiceCategory || selectedCategory,
          selectedVoice: selectedVoice || 'shubh',
          language: 'en-IN'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Failed to generate audio:', errorData)
        setPlayingId(null)
        setGeneratingAudioId(null)
        return
      }

      const data = await response.json()
      console.log('✅ Audio generated successfully')
      
      if (data.audioBase64) {
        // Create audio from base64
        const audioSrc = `data:audio/wav;base64,${data.audioBase64}`
        
        if (audioRef.current) {
          audioRef.current.pause()
        }
        
        const audio = new Audio(audioSrc)
        audio.volume = volume / 100
        audioRef.current = audio
        
        audio.onended = () => {
          setPlayingId(null)
        }
        
        audio.onerror = () => {
          console.error('Audio playback error')
          setPlayingId(null)
        }
        
        await audio.play()
        
        // Update message with audio URL
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, audioUrl: audioSrc } : msg
        ))
      }
    } catch (error) {
      console.error('Audio generation error:', error)
      setPlayingId(null)
    } finally {
      setGeneratingAudioId(null)
    }
  }

  const handlePlayAudio = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    
    if (playingId === messageId) {
      // Pause current playback
      audioRef.current?.pause()
      setPlayingId(null)
    } else if (message?.audioUrl) {
      // Resume or start playing existing audio
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      const audio = new Audio(message.audioUrl)
      audio.volume = volume / 100
      audioRef.current = audio
      
      audio.onended = () => {
        setPlayingId(null)
      }
      
      audio.onerror = () => {
        console.error('Audio playback error')
        setPlayingId(null)
      }
      
      audio.play()
      setPlayingId(messageId)
    } else if (message) {
      // Generate new audio - extract only the response text
      const voiceInfo = parseVoiceInfo(message.content)
      const cleanText = voiceInfo.response
        .replace(/\*\*/g, '')
        .trim()
      
      generateAndPlayAudio(cleanText, messageId, message.voiceCategory, message.selectedVoice)
    }
  }

  // Parse voice info from message content
  const parseVoiceInfo = (content: string) => {
    const voiceMatch = content.match(/\*\*Selected Voice:\*\*\s*(.+)/i)
    const categoryMatch = content.match(/\*\*Voice Category:\*\*\s*(.+)/i)
    const responseMatch = content.match(/\*\*Response:\*\*\s*([\s\S]+?)(?=\*\*Voice Tips:|$)/i)
    
    return {
      selectedVoice: voiceMatch?.[1]?.trim(),
      category: categoryMatch?.[1]?.trim(),
      response: responseMatch?.[1]?.trim() || content
    }
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
              <Mic className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
              
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
                  AI Voice
                </span>
              </div>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl line-clamp-2 sm:line-clamp-none">
                {agent.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6"
        >
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "p-2 rounded-lg border transition-all",
              "bg-background/50 border-border/50",
              "hover:border-primary/30",
              showSettings && cn(theme.bg, theme.border, "border")
            )}
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Clear Chat */}
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-2 rounded-lg border border-border/50 bg-background/50 hover:border-destructive/30 hover:text-destructive transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 sm:mb-6"
            >
              <div className="p-4 rounded-xl bg-card border border-border/50 space-y-4">
                {/* Voice Category Selector */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Voice Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {VOICE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "p-2 rounded-lg border text-left transition-all",
                          selectedCategory === cat.id
                            ? cn(theme.bg, theme.border, "border", theme.accent)
                            : "bg-background/50 border-border/50 hover:border-primary/30"
                        )}
                      >
                        <cat.icon className={cn("w-4 h-4 mb-1", selectedCategory === cat.id ? theme.accent : "text-muted-foreground")} />
                        <div className="text-xs font-medium">{cat.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{cat.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume Control */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Volume className="w-4 h-4" />
                    Volume: {volume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-muted accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              <span className="font-medium text-sm sm:text-base">
                Text to Speech
              </span>
              {messages.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({messages.length} messages)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedCategory !== 'auto' && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-medium",
                  theme.bg,
                  theme.accent
                )}>
                  {VOICE_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
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
                  <Mic className={cn("w-6 h-6 sm:w-8 sm:h-8", theme.accent)} />
                </motion.div>
                <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
                  Text to Speech
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                  Type your text and the AI will convert it to natural-sounding speech.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message) => {
                  const voiceInfo = message.type === 'agent' ? parseVoiceInfo(message.content) : null
                  
                  return (
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
                          <Mic className={cn("w-3 h-3 sm:w-4 sm:h-4", theme.accent)} />
                        </div>
                      )}
                      
                      <div className={cn(
                        "max-w-[90%] sm:max-w-[85%] group relative",
                        message.type === 'user' 
                          ? "bg-primary text-primary-foreground rounded-xl sm:rounded-2xl rounded-br-sm sm:rounded-br-md" 
                          : "bg-card border border-border/50 rounded-xl sm:rounded-2xl rounded-bl-sm sm:rounded-bl-md shadow-sm"
                      )}>
                        <div className="p-3 sm:p-5">
                          {message.type === 'agent' && voiceInfo && (
                            <div className="mb-3 pb-3 border-b border-border/30">
                              {message.voiceInfo && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-muted-foreground">Voice:</span>
                                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", theme.bg, theme.accent)}>
                                    {message.voiceInfo.name} ({message.voiceInfo.gender})
                                  </span>
                                </div>
                              )}
                              {voiceInfo.category && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Style:</span>
                                  <span className="text-xs text-foreground/80">{voiceInfo.category}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <p className="text-xs sm:text-sm whitespace-pre-wrap">
                            {message.type === 'agent' && voiceInfo 
                              ? voiceInfo.response 
                              : message.content}
                          </p>
                        </div>
                        
                        {/* Audio Controls for Agent Messages */}
                        {message.type === 'agent' && (
                          <div className="flex items-center gap-1 px-3 pb-2">
                            <button
                              onClick={() => handlePlayAudio(message.id)}
                              disabled={generatingAudioId === message.id}
                              className={cn(
                                "p-1.5 rounded-lg transition-all",
                                playingId === message.id 
                                  ? cn(theme.bg, theme.accent)
                                  : "hover:bg-muted",
                                generatingAudioId === message.id && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              {generatingAudioId === message.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : playingId === message.id ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleCopy(message.content, message.id)}
                              className="p-1.5 hover:bg-muted rounded-lg transition-all"
                            >
                              {copiedId === message.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              className="p-1.5 hover:bg-muted rounded-lg transition-all"
                              title="Download audio"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {message.type === 'user' && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
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
                  <Mic className={cn("w-3 h-3 sm:w-4 sm:h-4", theme.accent)} />
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
                  placeholder="Enter text to convert to speech..."
                  className={cn(
                    "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base",
                    "bg-background/80 border border-border/50",
                    "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                    "transition-all"
                  )}
                  disabled={loading}
                  onFocus={(e) => {
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
      </div>
    </main>
  )
}
