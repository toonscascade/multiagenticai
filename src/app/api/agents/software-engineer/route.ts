import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY || '' })

const SYSTEM_PROMPT_PLAN = `You are CodeMaster AI Planning Assistant. Provide ONLY a concise plan, NO code.

Format:
- Brief problem understanding (1 line)
- Key issues (bullet points)
- Solution approach (numbered steps)
- Expected outcome (1 line)

Be extremely brief. No explanations. No code.`

const SYSTEM_PROMPT_CODE = `You are CodeMaster AI. Provide production-ready code with MINIMAL text.

Rules:
- Skip lengthy explanations
- Show code FIRST
- Add brief comments only where complex
- One-line summary before code
- One-line key changes after

Format:
[1-line summary]
\`\`\`language
// Complex parts only
code here
\`\`\`
[Key improvements: 3 bullet points max]`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, history = [], mode = 'code' } = body

    if (!prompt || typeof prompt !== 'string') {
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

    // Build messages array with history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { 
        role: 'system', 
        content: mode === 'plan' ? SYSTEM_PROMPT_PLAN : SYSTEM_PROMPT_CODE 
      }
    ]

    // Add conversation history (last 5 messages to reduce tokens)
    const recentHistory = history.slice(-5)
    recentHistory.forEach((msg: { type: string; content: string }) => {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })
    })

    messages.push({ role: 'user', content: prompt })

    // Use Groq with Qwen model - optimized for speed and cost
    const completion = await client.chat.completions.create({
      model: 'qwen/qwen3-32b',
      messages,
      temperature: mode === 'plan' ? 0.3 : 0.6,
      max_completion_tokens: mode === 'plan' ? 512 : 2048,
      top_p: 0.95,
      stop: null
    })

    const result = completion.choices[0]?.message?.content || 'No response generated'

    return NextResponse.json({
      result,
      agent: 'software-engineer',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Software Engineer Agent Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
