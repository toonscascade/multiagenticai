import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { SarvamAIClient } from 'sarvamai'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' })

// Initialize Sarvam clients
const sarvamTTS = process.env.SARVAM_API_KEY 
  ? new SarvamAIClient({ apiSubscriptionKey: process.env.SARVAM_API_KEY })
  : null

// Note: Sarvam STT would be added here when available
// For now, we'll use this structure for future STT integration

const SYSTEM_PROMPT = `You are VoiceAI, a friendly conversational assistant making phone calls to help users.

Your characteristics:
- Speak naturally and conversationally
- Keep responses brief and clear (optimized for voice)
- Be helpful, warm, and engaging
- Ask clarifying questions when needed
- Provide concise answers

Conversation flow:
1. Greet the user warmly
2. Ask how you can help them today
3. Listen carefully to their needs
4. Provide helpful responses
5. Offer additional assistance
6. End call politely when conversation is complete

Keep all responses under 2-3 sentences for natural conversation flow.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, history = [], callSid } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      )
    }

    // Build messages with conversation history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT }
    ]

    // Add last 8 messages for context
    const recentHistory = history.slice(-8)
    recentHistory.forEach((msg: { type: string; content: string }) => {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })
    })

    messages.push({ role: 'user', content: prompt })

    // Generate response using Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 300, // Keep responses concise for voice
    })

    const text = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.'

    return NextResponse.json({
      result: text,
      agent: 'conversational',
      callSid,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Conversational Agent Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Text-to-Speech endpoint for generating audio
export async function PUT(request: NextRequest) {
  try {
    const { text, language = 'en-IN', selectedVoice = 'shubh' } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    if (!process.env.SARVAM_API_KEY) {
      return NextResponse.json(
        { error: 'Sarvam API key not configured' },
        { status: 500 }
      )
    }

    if (!sarvamTTS) {
      return NextResponse.json(
        { error: 'Sarvam TTS client not initialized' },
        { status: 500 }
      )
    }

    // Generate speech using Sarvam AI
    const ttsResponse = await sarvamTTS.textToSpeech.convert({
      text: text,
      target_language_code: language as any,
      speaker: selectedVoice as any,
      pace: 1.0,
      speech_sample_rate: 22050,
      model: 'bulbul:v3' as any
    })

    const audioBase64 = ttsResponse.audios?.[0]
    
    if (!audioBase64) {
      return NextResponse.json(
        { error: 'No audio generated' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      audioBase64,
      text,
      voice: selectedVoice,
      language
    })
  } catch (error: any) {
    console.error('TTS Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech', details: error.message },
      { status: 500 }
    )
  }
}
