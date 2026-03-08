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

  // Poll for call status updates
  useEffect(() => {
    let statusInterval: NodeJS.Timeout
    
    if (activeCallSid && callStatus === 'connected') {
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

  const handleTemplateChange = (template: {name: string, prompt: string}) => {
    setSelectedTemplate(template.name)
    setPrompt(template.prompt)
    setIsDropdownOpen(false)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartCall = async () => {
    if (!phoneNumber) {
      alert('Please enter a phone number')
      return
    }

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
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Persona
          </label>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-left flex items-center justify-between hover:bg-[#222] transition-colors"
            >
              <div>
                <div className="font-medium text-foreground">{selectedTemplate}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {prompt.substring(0, 60)}...
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                {(isLoadingPersonas ? [{name: 'Loading...', prompt: ''}] : personas).map((template) => (
                  <button
                    key={template.name}
                    onClick={() => handleTemplateChange(template)}
                    className="w-full p-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                  >
                    <div className="font-medium text-foreground">{template.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {template.prompt.substring(0, 80)}...
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Custom Instructions
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Enter custom instructions for the AI agent..."
          />
        </div>

        {/* Phone Number Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1234567890"
            className="w-full p-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Call Button */}
        <button
          onClick={handleStartCall}
          disabled={callStatus !== 'idle' || !phoneNumber}
          className={cn(
            "w-full py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
            callStatus === 'idle' && phoneNumber
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          )}
        >
          {callStatus === 'calling' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Start Call
            </>
          )}
        </button>
      </div>

      {/* Right Panel - Call Status & Info */}
      <div className="flex-1 p-8 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {callStatus === 'calling' && 'Calling...'}
                {callStatus === 'connected' && 'On Call'}
                {callStatus === 'ended' && 'Call Ended'}
                {callStatus === 'idle' && 'Ready to Call'}
              </h2>
              <p className="text-muted-foreground">
                {callStatus === 'calling' && 'Connecting to ' + phoneNumber}
                {callStatus === 'connected' && formatDuration(callDuration) + ' • AI is listening and responding'}
                {callStatus === 'ended' && 'The call has ended'}
                {callStatus === 'idle' && 'Configure your agent and enter a phone number to start'}
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
                  <p className="text-xs text-muted-foreground">Twilio Voice</p>
                </div>
                <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
                  <Radio className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Live Call</p>
                </div>
                <div className="p-4 bg-[#1a1a1a] border border-white/10 rounded-xl">
                  <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Groq AI</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}