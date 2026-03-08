import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' })

// Store active conversations
const conversations = new Map<string, {
  prompt: string
  history: Array<{role: string, content: string}>
  phoneNumber: string
}>()

const DEFAULT_PROMPT = `You are a professional sales representative calling to pitch a product.

Your goal:
- Introduce yourself warmly
- Explain the product benefits clearly
- Handle objections professionally
- Close with a clear next step

Be conversational, not robotic. Listen to the client's responses and adapt your pitch accordingly.

Keep responses under 3 sentences for natural conversation flow.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, prompt = DEFAULT_PROMPT } = body

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Store conversation context
    const conversationId = `conv_${Date.now()}`
    conversations.set(conversationId, {
      prompt: prompt,
      phoneNumber: phoneNumber,
      history: []
    })

    // Return conversation details for client-side Vapi initialization
    return NextResponse.json({
      success: true,
      conversationId: conversationId,
      vapiConfig: {
        phoneNumber: phoneNumber,
        assistant: {
          firstMessage: "Hello! I'm calling from our company. Do you have a moment to chat?",
          model: {
            provider: 'groq',
            model: 'llama-3.3-70b-versatile',
            systemPrompt: prompt,
            temperature: 0.7,
            maxTokens: 150
          },
          voice: {
            provider: 'playht',
            voiceId: 'jennifer'
          },
          recordingEnabled: true,
          endCallFunctionEnabled: true,
          forwardingPhoneNumber: phoneNumber
        }
      },
      message: 'Ready to start Vapi call'
    })

  } catch (error: any) {
    console.error('Vapi Setup Error:', error)
    return NextResponse.json(
      { error: 'Failed to setup call', details: error.message },
      { status: 500 }
    )
  }
}

// Vapi webhook for handling real-time conversation events
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Vapi Webhook Event:', JSON.stringify(body, null, 2))
    
    const { type, conversationId, transcript, messages } = body

    // Handle different Vapi events
    switch (type) {
      case 'conversation-start':
        return handleConversationStart(conversationId, body)
      
      case 'speech-update':
        return handleSpeechUpdate(conversationId, transcript, messages)
      
      case 'conversation-end':
        return handleConversationEnd(conversationId)
      
      case 'hang':
        return handleHang(conversationId)
      
      default:
        return NextResponse.json({ message: 'Event received' })
    }

  } catch (error: any) {
    console.error('Vapi Webhook Error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleConversationStart(conversationId: string, eventData: any) {
  const conv = conversations.get(conversationId)
  if (!conv) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  console.log(`Conversation started with ${conv.phoneNumber}`)
  
  return NextResponse.json({
    response: {
      messages: [{
        role: 'assistant',
        content: "Hello! I'm calling from our company. Do you have a moment to chat?"
      }]
    }
  })
}

async function handleSpeechUpdate(conversationId: string, transcript: string, messages: any[]) {
  const conv = conversations.get(conversationId)
  if (!conv || !transcript) {
    return NextResponse.json({ message: 'No transcript' })
  }

  // Get the latest user message
  const userMessage = messages?.find(m => m.role === 'user')
  if (!userMessage) {
    return NextResponse.json({ message: 'No user message found' })
  }

  // Add user speech to history
  conv.history.push({ role: 'user', content: userMessage.content })

  console.log('User said:', userMessage.content)
  console.log('Conversation history length:', conv.history.length)

  // Generate AI response using Groq
  let aiResponse = 'I apologize, I could not understand that. Could you please repeat?'

  if (process.env.GROQ_API_KEY) {
    try {
      const messagesForGroq = [
        { role: 'system', content: conv.prompt },
        ...conv.history.slice(-6).flatMap(h => [
          { role: h.role, content: h.content }
        ])
      ]

      console.log('Sending to Groq with', messagesForGroq.length, 'messages')

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: messagesForGroq as any,
        temperature: 0.7,
        max_tokens: 150,
      })

      aiResponse = completion.choices[0]?.message?.content || aiResponse
      console.log('Groq response:', aiResponse.substring(0, 100) + '...')
    } catch (error) {
      console.error('Groq Error:', error)
    }
  }

  // Add AI response to history
  conv.history.push({ role: 'assistant', content: aiResponse })

  return NextResponse.json({
    response: {
      messages: [{
        role: 'assistant',
        content: aiResponse
      }]
    }
  })
}

async function handleConversationEnd(conversationId: string) {
  const conv = conversations.get(conversationId)
  if (conv) {
    console.log(`Conversation ended with ${conv.phoneNumber}. Total messages: ${conv.history.length}`)
    // Keep conversation data for analytics if needed
    // conversations.delete(conversationId)
  }
  
  return NextResponse.json({
    message: 'Conversation ended successfully'
  })
}

async function handleHang(conversationId: string) {
  const conv = conversations.get(conversationId)
  if (conv) {
    console.log(`Call hung up with ${conv.phoneNumber}`)
    conversations.delete(conversationId)
  }
  
  return NextResponse.json({
    message: 'Call hangup processed'
  })
}
