"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Phone, 
  PhoneOff, 
  Loader2, 
  ArrowLeft,
  Sparkles,
  ChevronDown,
  Radio,
  Volume2
} from "lucide-react"
import { cn } from "@/lib/utils"

// Load personas from markdown file
const loadPersonasFromServer = async () => {
  try {
    const response = await fetch('/api/agents/conversational/personas')
    if (response.ok) {
      const data = await response.json()
      return data.personas || []
    }
  } catch (error) {
    console.error('Failed to load personas:', error)
  }
  return []
}

const DEFAULT_PROMPT = `You are a professional sales representative calling to pitch a product.

Your goal:
- Introduce yourself warmly
- Explain the product benefits clearly
- Handle objections professionally
- Close with a clear next step

Be conversational, not robotic. Listen to the client's responses and adapt your pitch accordingly.

Keep responses under 3 sentences for natural conversation flow.`

export function ConversationalAgentInterface() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
  const [selectedTemplate, setSelectedTemplate] = useState('Sales Representative')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  const [lastResponse, setLastResponse] = useState('')
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null)
  const [personas, setPersonas] = useState<Array<{name: string, prompt: string}>>([])
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(true)

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  // Auto-scroll to bottom of response area
  useEffect(() => {
    const container = document.getElementById('response-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [lastResponse])

  // Load personas on component mount
  useEffect(() => {
    const loadPersonas = async () => {
      const loadedPersonas = await loadPersonasFromServer()
      setPersonas(loadedPersonas)
      setIsLoadingPersonas(false)
      
      // Set default to first persona if available
      if (loadedPersonas.length > 0 && selectedTemplate === 'Sales Representative') {
        setSelectedTemplate(loadedPersonas[0].name)
        setPrompt(loadedPersonas[0].prompt)
      }
    }
    
    loadPersonas()
  }, [])

  const handleTemplateChange = (template: {name: string, prompt: string}) => {
    setSelectedTemplate(template.name)
    setPrompt(template.prompt)
    setIsDropdownOpen(false)
  }
      statusInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/agents/conversational/status?callSid=${activeCallSid}`)
          if (response.ok) {
            const data = await response.json()
            
            // If call is completed, update UI
            if (data.status === 'completed' || data.status === 'failed' || data.status === 'busy' || data.status === 'no-answer') {
              setCallStatus('ended')
              setCallDuration(Math.floor(data.duration || 0))
              
              // Clear intervals
              clearInterval(statusInterval)
              
              // Reset after delay
              setTimeout(() => {
                setCallStatus('idle')
                setConversationId(null)
                setActiveCallSid(null)
                setCallDuration(0)
              }, 3000)
            }
          }
        } catch (error) {
          console.error('Status polling error:', error)
        }
      }, 2000) // Poll every 2 seconds
    }
    
    return () => {
      if (statusInterval) clearInterval(statusInterval)
    }
  }, [activeCallSid, callStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleTemplateChange = (template: typeof PERSONA_TEMPLATES[0]) => {
    setSelectedTemplate(template.name)
    setPrompt(template.prompt)
    setIsDropdownOpen(false)
  }

  const handleStartCall = async () => {
    if (!phoneNumber || !prompt) return
    
    setCallStatus('calling')
    
    try {
      const response = await fetch('/api/agents/conversational/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber,
          prompt
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setConversationId(data.conversationId)
        setActiveCallSid(data.callSid) // Store call SID for status tracking
        setCallStatus('connected')
        setCallDuration(0)
        setLastResponse("Call initiated - AI will greet using your custom persona")
        
        // Call initiated via Twilio - conversation happens on the phone
        console.log('Twilio call initiated - conversation will happen via phone call')
      } else {
        throw new Error(data.error || 'Call failed')
      }
    } catch (error: any) {
      console.error('Twilio Call Error:', error)
      alert(`Failed to start call: ${error.message}`)
      setCallStatus('idle')
    }
  }

  // const handleEndCall = () => {
  //   // Twilio will handle the hangup automatically
  //   setCallStatus('ended')
  //   setTimeout(() => {
  //     setCallStatus('idle')
  //     setConversationId(null)
  //     setCallDuration(0)
  //   }, 2000)
  // }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left Panel - Configuration */}
      <div className="w-[45%] border-r border-white/10 p-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link 
            href="/agents"
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Conversational Voice Agent</h1>
            <p className="text-sm text-muted-foreground">Configure your AI caller</p>
          </div>
        </div>

        {/* Persona Template Selector */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">Select Persona</label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-foreground hover:border-white/20 transition-colors"
            >
              <span>{selectedTemplate}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isDropdownOpen && "rotate-180")} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50">
                {PERSONA_TEMPLATES.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => handleTemplateChange(template)}
                    className="w-full px-4 py-3 text-left text-foreground hover:bg-white/5 transition-colors"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prompt Editor */}
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium text-foreground mb-2">Agent Instructions</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-foreground text-sm leading-relaxed resize-none focus:border-emerald-500/50 outline-none transition-colors"
            placeholder="Enter instructions for your AI agent..."
          />
        </div>

        {/* Language Selector */}
        <div className="mt-6">
          <label className="text-sm font-medium text-foreground mb-2 block">Language</label>
          <select className="w-full px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl text-foreground outline-none focus:border-emerald-500/50">
            <option value="en-IN">English (India)</option>
            <option value="en-US">English (US)</option>
            <option value="hi-IN">Hindi</option>
          </select>
        </div>
      </div>

      {/* Right Panel - Call Interface */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {callStatus === 'idle' ? (
          // Call Setup Screen
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md w-full"
          >
            {/* Animated Avatar */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20 animate-pulse" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="w-20 h-20 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Call</h2>
            <p className="text-muted-foreground mb-8">
              Your AI agent is configured and ready to make calls
            </p>

            {/* Phone Number Input */}
            <div className="space-y-4">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number (+1234567890)"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground outline-none focus:border-emerald-500/50 transition-colors text-center text-lg"
              />

              <button
                onClick={handleStartCall}
                disabled={!phoneNumber}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3",
                  phoneNumber
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-white/5 text-muted-foreground cursor-not-allowed"
                )}
              >
                <Phone className="w-5 h-5" />
                Start Call
              </button>
            </div>
          </motion.div>
        ) : (
          // Active Call Screen - Clean Interface
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Pulsing Avatar */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              {/* Outer ring animation */}
              <div className={cn(
                "absolute inset-0 rounded-full border-4 border-emerald-500/30",
                callStatus === 'connected' && "animate-ping"
              )} />
              {/* Middle ring */}
              <div className={cn(
                "absolute inset-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20",
                callStatus === 'connected' && "animate-pulse"
              )} />
              {/* Inner avatar */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                {callStatus === 'calling' ? (
                  <Loader2 className="w-16 h-16 text-white animate-spin" />
                ) : callStatus === 'connected' ? (
                  <Radio className="w-16 h-16 text-white animate-pulse" />
                ) : (
                  <PhoneOff className="w-16 h-16 text-white" />
                )}
              </div>
            </div>

            {/* Call Status */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {callStatus === 'calling' && 'Calling...'}
                {callStatus === 'connected' && 'On Call'}
                {callStatus === 'ended' && 'Call Ended'}
              </h2>
              <p className="text-muted-foreground">
                {callStatus === 'calling' && 'Connecting to ' + phoneNumber}
                {callStatus === 'connected' && formatDuration(callDuration) + ' • AI is listening and responding'}
                {callStatus === 'ended' && 'The call has ended'}
              </p>
            </div>

            {/* Status Indicator */}
            {callStatus === 'connected' && (
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-400">AI is actively listening</span>
              </div>
            )}

            {/* Info Cards */}
            {callStatus === 'connected' && (
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
                <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
                  <Volume2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Twilio Media</p>
                </div>
                <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
                  <Radio className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Real-time</p>
                </div>
                <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
                  <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Groq AI</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
