import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { activeStreams, getSarvamClient } from '@/lib/twilio-store'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' })

const DEFAULT_PROMPT = `You are a professional sales representative calling to pitch a product.

Your goal:
- Introduce yourself warmly
- Explain the product benefits clearly
- Handle objections professionally
- Close with a clear next step

Be conversational, not robotic. Listen to the client's responses and adapt your pitch accordingly.

Keep responses under 3 sentences for natural conversation flow.`

// Handle Twilio Media Stream WebSocket connection
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversationId')
  
  if (!conversationId || !activeStreams.has(conversationId)) {
    return new Response('Invalid conversation ID', { status: 400 })
  }

  // Upgrade to WebSocket connection
  // Note: Next.js App Router doesn't support WebSockets directly
  // We'll handle this through Twilio's Media Streams callback
  return new Response('WebSocket endpoint', { status: 200 })
}

// Handle Twilio Media Stream events (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Media Stream Event:', JSON.stringify(body, null, 2))

    const { event, streamSid, conversationId } = body

    switch (event) {
      case 'start':
        return handleStreamStart(streamSid, conversationId, body.start)
      
      case 'media':
        return handleMedia(streamSid, body.media)
      
      case 'stop':
        return handleStreamStop(streamSid)
      
      default:
        return NextResponse.json({ message: 'Event received' })
    }

  } catch (error: any) {
    console.error('Media Stream Error:', error)
    return NextResponse.json(
      { error: 'Media stream processing failed' },
      { status: 500 }
    )
  }
}

async function handleStreamStart(streamSid: string, conversationId: string, startData: any) {
  const conv = activeStreams.get(conversationId)
  if (!conv) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  // Store streamSid for this conversation
  conv.streamSid = streamSid

  console.log(`Media stream started for conversation ${conversationId}`)
  
  // Send initial greeting via TTS
  const greeting = "Hello! I'm calling from our company. Do you have a moment to chat?"
  conv.history.push({ role: 'assistant', content: greeting })

  // Generate audio for greeting
  const audioBase64 = await generateTTS(greeting)
  
  if (audioBase64) {
    // In a real implementation, you'd send this back through Twilio's media stream
    console.log('Generated greeting audio, length:', audioBase64.length)
  }

  return NextResponse.json({
    message: 'Stream started',
    streamSid: streamSid
  })
}

async function handleMedia(streamSid: string, mediaData: any) {
  // This is where speech-to-text would happen
  // For now, we'll simulate receiving transcribed text
  const transcript = mediaData.track === 'inbound' ? 'Simulated user speech' : ''
  
  if (!transcript) return NextResponse.json({ message: 'No inbound audio' })

  // Find conversation by streamSid
  const conv = Array.from(activeStreams.values()).find(c => c.streamSid === streamSid)
  if (!conv) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  // Add user speech to history
  conv.history.push({ role: 'user', content: transcript })

  // Generate AI response
  let aiResponse = 'I apologize, I could not understand that. Could you please repeat?'

  if (process.env.GROQ_API_KEY) {
    try {
      const messages = [
        { role: 'system', content: conv.prompt },
        ...conv.history.slice(-6)
      ]

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 150,
      })

      aiResponse = completion.choices[0]?.message?.content || aiResponse
    } catch (error) {
      console.error('Groq Error:', error)
    }
  }

  // Add AI response to history
  conv.history.push({ role: 'assistant', content: aiResponse })

  // Generate TTS audio
  const audioBase64 = await generateTTS(aiResponse)
  
  if (audioBase64) {
    // Send audio back through media stream
    console.log('Generated response audio, length:', audioBase64.length)
    // In real implementation: send audio back to Twilio
  }

  return NextResponse.json({
    message: 'Processed media',
    response: aiResponse
  })
}

async function handleStreamStop(streamSid: string) {
  // Clean up
  const conv = Array.from(activeStreams.entries()).find(([_, c]) => c.streamSid === streamSid)
  if (conv) {
    const [conversationId] = conv
    activeStreams.delete(conversationId)
    console.log(`Media stream stopped for conversation ${conversationId}`)
  }
  
  return NextResponse.json({
    message: 'Stream stopped'
  })
}

// Helper function to generate TTS
async function generateTTS(text: string): Promise<string | null> {
  const sarvamTTS = getSarvamClient()
  if (!sarvamTTS) return null

  try {
    const response = await sarvamTTS.textToSpeech.convert({
      text: text,
      target_language_code: 'en-IN',
      speaker: 'shubh',
      pace: 1.0,
      speech_sample_rate: 8000,
      model: 'bulbul:v3' as any
    })

    return response.audios?.[0] || null
  } catch (error) {
    console.error('TTS Error:', error)
    return null
  }
}

// Export activeStreams for use in call initiation
export { activeStreams }
