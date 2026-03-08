import { NextRequest, NextResponse } from 'next/server'
import { callStatuses } from '@/lib/twilio-store'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const callSid = formData.get('CallSid') as string
    const callStatus = formData.get('CallStatus') as string
    const sequenceNumber = formData.get('SequenceNumber')
    
    console.log(`Call ${callSid} status: ${callStatus} (seq: ${sequenceNumber})`)
    
    // Update call status in store
    if (callSid) {
      const currentStatus = callStatuses.get(callSid)
      
      if (currentStatus) {
        // Update status
        currentStatus.status = callStatus as any
        
        // If call is completed/ended, set end time
        if (callStatus === 'completed' || callStatus === 'failed' || callStatus === 'busy' || callStatus === 'no-answer') {
          currentStatus.endTime = Date.now()
          console.log(`Call ${callSid} ended. Duration: ${(currentStatus.endTime - currentStatus.startTime) / 1000}s`)
        }
      } else {
        // Store new call status
        callStatuses.set(callSid, {
          status: callStatus as any,
          startTime: Date.now()
        })
      }
    }
    
    // Return empty response for status callbacks
    return new NextResponse('', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  } catch (error) {
    console.error('Status Callback Error:', error)
    return new NextResponse('', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}

// GET endpoint to fetch call status for UI updates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const callSid = searchParams.get('callSid')
    
    if (!callSid) {
      return NextResponse.json({ error: 'CallSid required' }, { status: 400 })
    }
    
    const status = callStatuses.get(callSid)
    
    if (!status) {
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      callSid,
      status: status.status,
      startTime: status.startTime,
      endTime: status.endTime,
      duration: status.endTime ? (status.endTime - status.startTime) / 1000 : null
    })
  } catch (error) {
    console.error('Status GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 })
  }
}
