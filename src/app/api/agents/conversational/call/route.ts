import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { activeCalls, activeStreams, callStatuses } from '@/lib/twilio-store'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
const appUrl = process.env.NEXT_PUBLIC_APP_URL

if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error('Twilio credentials not configured in environment variables')
}

const client = twilio(accountSid, authToken)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, prompt, greeting } = body

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Check if using localhost
    if (!appUrl || appUrl.includes('localhost')) {
      return NextResponse.json(
        { 
          error: 'Localhost URLs are not supported by Twilio',
          details: 'Please use a public URL or ngrok for testing. Set NEXT_PUBLIC_APP_URL to your public URL in .env.local',
          setup: 'Run: npx ngrok http 3000, then update NEXT_PUBLIC_APP_URL with the ngrok URL'
        },
        { status: 400 }
      )
    }

    // Generate unique conversation ID
    const conversationId = `conv_${Date.now()}`
    
    // Store prompt for this conversation
    activeCalls.set(conversationId, { 
      prompt: prompt || 'You are a helpful assistant.',
      greeting: greeting || 'Hello! How can I help you today?'
    })

    // Also store in media streams map
    activeStreams.set(conversationId, {
      prompt: prompt || 'You are a helpful assistant.',
      history: [],
      streamSid: ''
    })

    // Initiate outbound call with Media Streams
    const call = await client.calls.create({
      url: `${appUrl}/api/agents/conversational/twiml?conversationId=${encodeURIComponent(conversationId)}`,
      to: phoneNumber,
      from: twilioPhoneNumber,
      statusCallback: `${appUrl}/api/agents/conversational/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    } as any)

    // Store initial call status
    callStatuses.set(call.sid, {
      status: 'initiated',
      startTime: Date.now()
    })

    return NextResponse.json({
      success: true,
      callSid: call.sid,
      conversationId,
      status: call.status,
      message: 'Call initiated successfully with Media Streams'
    })
  } catch (error: any) {
    console.error('Twilio Call Error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate call', details: error.message },
      { status: 500 }
    )
  }
}

// Export for use in other routes
export { activeCalls }
