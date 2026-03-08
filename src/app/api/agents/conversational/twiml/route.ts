import { NextRequest, NextResponse } from 'next/server'
import { activeCalls } from '@/lib/twilio-store'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' })

// Store conversation history for each call
const callHistories = new Map<string, Array<{role: string, content: string}>>()

// Comprehensive pre-prompt for personalized, quick responses
const CONVERSATIONAL_PREPROMPT = (customPrompt: string) => `You are an AI phone assistant with the following persona:

${customPrompt}

## Core Response Principles:
- Be CONCISE and DIRECT (2-3 sentences max)
- SPEAK naturally like a human on a phone call
- RESPOND quickly without unnecessary explanations
- USE contractions (don't -> don't, cannot -> can't)
- AVOID formal language and corporate jargon
- BE conversational and engaging
- LISTEN actively to the caller's needs

## Phone Call Behavior:
- Greet warmly but briefly
- Ask clarifying questions when needed
- Provide clear, actionable responses
- Handle objections smoothly
- Guide conversation toward resolution
- End calls professionally when appropriate

## Response Style:
- Start with acknowledgment of their point
- Provide direct answer/solution
- End with forward momentum or next step
- Sound confident and helpful

## Examples of Good Responses:
Caller: "What are your hours?"
You: "We're open Monday through Friday, 9 to 6. Saturday we're open till 4. Does that work for you?"

Caller: "I'm having trouble with my account"
You: "I'd be happy to help with that. Can you tell me what specifically isn't working?"

## Tone:
Professional but friendly, like a skilled customer service rep who genuinely wants to help.

## Language Instructions:
- Respond in the SAME LANGUAGE the caller uses
- If caller speaks Hindi, respond in Hindi
- If caller speaks English, respond in English
- Maintain natural flow regardless of language`

// Handle both GET (initial call) and POST (speech response)
export async function GET(request: NextRequest) {
  return handleTwiMLRequest(request)
}

export async function POST(request: NextRequest) {
  return handleTwiMLRequest(request)
}

async function handleTwiMLRequest(request: NextRequest) {
  try {
    const url = new URL(request.url)
    
    // Get conversationId parameter (handle duplicates)
    const conversationIds = url.searchParams.getAll('conversationId')
    const conversationId = conversationIds[0] || ''
    
    // Parse form data for POST requests
    let speechResult = ''
    let callSid = ''
    
    if (request.method === 'POST') {
      const formData = await request.formData()
      speechResult = (formData.get('SpeechResult') as string) || ''
      callSid = (formData.get('CallSid') as string) || ''
    }
    
    console.log('TwiML Request:', { 
      method: request.method, 
      callSid, 
      speechResult, 
      conversationId,
      url: request.url 
    })

    // Get the stored prompt for this conversation
    const callData = conversationId ? activeCalls.get(conversationId) : null
    const systemPrompt = callData?.prompt || 'You are Kunal, a friendly and empathetic human conversational partner. Speak naturally like a real person, not like an AI or robot.'
    const greeting = callData?.greeting || "Hello! I'm Kunal. How can I help you today?"

    console.log('Using system prompt:', systemPrompt.substring(0, 100) + '...')

    // Get or initialize conversation history
    if (!callHistories.has(conversationId)) {
      callHistories.set(conversationId, [])
    }
    const history = callHistories.get(conversationId) || []

    // If this is the initial call (no speech yet), generate personalized greeting
    if (!speechResult) {
      // Generate greeting using Groq with the custom persona
      let greeting = "Hello! I'm calling from our company. Do you have a moment to chat?"
      
      if (process.env.GROQ_API_KEY) {
        try {
          // Use the same preprompt for consistent personality
          const enhancedPrompt = CONVERSATIONAL_PREPROMPT(systemPrompt)
          
          const greetingMessages = [
            { role: 'system', content: enhancedPrompt },
            { role: 'user', content: 'Generate a brief, professional phone greeting. Keep it under 12 words and sound natural.' }
          ]

          const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: greetingMessages as any,
            temperature: 0.7,
            max_tokens: 30,
          })

          greeting = completion.choices[0]?.message?.content?.trim() || greeting
          console.log('Generated personalized greeting:', greeting)
        } catch (error) {
          console.error('Greeting generation error:', error)
        }
      }

      // Add greeting to history
      history.push({ role: 'assistant', content: greeting })

      // Return TwiML to play greeting and gather speech
      const encodedConvId = encodeURIComponent(conversationId)
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">${escapeXml(greeting)}</Say>
  <Gather input="speech" timeout="5" language="en-US" action="/api/agents/conversational/twiml?conversationId=${encodedConvId}" method="POST">
    <Pause length="1"/>
  </Gather>
  <Say voice="Polly.Joanna">I didn't hear anything. Let me try again.</Say>
  <Redirect>/api/agents/conversational/twiml?conversationId=${encodedConvId}</Redirect>
</Response>`

      return new NextResponse(twiml, {
        headers: { 'Content-Type': 'text/xml' },
      })
    }

    // Add user speech to history
    history.push({ role: 'user', content: speechResult })

    // Process user's speech with Groq using the enhanced preprompt
    let aiResponse = 'I apologize, I could not understand that. Could you please repeat?'
    
    if (process.env.GROQ_API_KEY) {
      try {
        // Use the comprehensive preprompt for better personalization
        const enhancedPrompt = CONVERSATIONAL_PREPROMPT(systemPrompt)
        
        const messages = [
          { role: 'system', content: enhancedPrompt },
          ...history.slice(-4), // Keep fewer messages for faster responses
        ]

        console.log('Sending to Groq with enhanced preprompt')

        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: messages as any,
          temperature: 0.7,
          max_tokens: 100, // Reduced for quicker, more concise responses
        })

        aiResponse = completion.choices[0]?.message?.content || aiResponse
        console.log('Groq response (quick):', aiResponse.substring(0, 100) + '...')
      } catch (error) {
        console.error('Groq Error:', error)
      }
    }

    // Add AI response to history
    history.push({ role: 'assistant', content: aiResponse })

    // Return TwiML to play response and continue gathering speech
    const encodedConvId = encodeURIComponent(conversationId)
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi">${escapeXml(aiResponse)}</Say>
  <Gather input="speech" timeout="5" language="en-US" action="/api/agents/conversational/twiml?conversationId=${encodedConvId}" method="POST">
    <Pause length="1"/>
  </Gather>
  <Say voice="Polly.Aditi">I didn't catch that. Let me know if you're still there.</Say>
  <Redirect>/api/agents/conversational/twiml?conversationId=${encodedConvId}</Redirect>
</Response>`

    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' },
    })

  } catch (error) {
    console.error('TwiML Error:', error)
    
    // Return error TwiML
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">I'm sorry, something went wrong. Please try again later.</Say>
  <Hangup/>
</Response>`

    return new NextResponse(errorTwiml, {
      headers: { 'Content-Type': 'text/xml' },
    })
  }
}

// Escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
