import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { SarvamAIClient } from 'sarvamai'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' })

// Initialize Sarvam client
const sarvamClient = process.env.SARVAM_API_KEY 
  ? new SarvamAIClient({ apiSubscriptionKey: process.env.SARVAM_API_KEY })
  : null

// Sarvam AI Voice Models (bulbul:v3 compatible)
const SARVAM_VOICES = {
  shubh: {
    name: 'Shubh',
    gender: 'Male',
    description: 'Friendly default voice for IVR and support',
    bestFor: ['conversational', 'customer support', 'friendly chat']
  },
  ritu: {
    name: 'Ritu',
    gender: 'Female',
    description: 'Soft, approachable voice for customer interactions',
    bestFor: ['conversational', 'soft', 'approachable', 'warm']
  },
  amit: {
    name: 'Amit',
    gender: 'Male',
    description: 'Formal voice for business communications',
    bestFor: ['business', 'formal', 'professional', 'news']
  },
  sumit: {
    name: 'Sumit',
    gender: 'Male',
    description: 'Balanced warmth with professionalism',
    bestFor: ['balanced', 'professional', 'educational', 'sales']
  },
  pooja: {
    name: 'Pooja',
    gender: 'Female',
    description: 'Encouraging voice for assistance flows',
    bestFor: ['encouraging', 'assistance', 'support', 'helpful']
  },
  neha: {
    name: 'Neha',
    gender: 'Female',
    description: 'Clear and professional voice',
    bestFor: ['professional', 'clear', 'educational', 'news']
  },
  rahul: {
    name: 'Rahul',
    gender: 'Male',
    description: 'Energetic voice for entertainment',
    bestFor: ['entertainment', 'energetic', 'animated', 'fun']
  },
  priya: {
    name: 'Priya',
    gender: 'Female',
    description: 'Warm and expressive for storytelling',
    bestFor: ['audiobooks', 'storytelling', 'expressive', 'warm']
  },
  anushka: {
    name: 'Anushka',
    gender: 'Female',
    description: 'Default female voice for general use',
    bestFor: ['general', 'conversational', 'friendly']
  },
  abhilash: {
    name: 'Abhilash',
    gender: 'Male',
    description: 'Professional male voice',
    bestFor: ['professional', 'business', 'formal']
  }
}

// Voice categories with descriptions
const VOICE_CATEGORIES = {
  conversational: {
    name: 'Conversational',
    description: 'Natural, friendly voice for casual chats and Q&A',
    mood: 'warm, approachable, engaging',
    recommendedVoices: ['shubh', 'ritu']
  },
  audiobooks: {
    name: 'Audiobooks',
    description: 'Expressive, storytelling voice for narration',
    mood: 'dramatic, engaging, emotive',
    recommendedVoices: ['priya', 'sumit']
  },
  entertainment: {
    name: 'Entertainment',
    description: 'Animated, dramatic voice for gaming and characters',
    mood: 'energetic, theatrical, fun',
    recommendedVoices: ['rahul', 'priya']
  },
  sales: {
    name: 'Sales',
    description: 'Persuasive, confident voice for marketing',
    mood: 'enthusiastic, convincing, professional',
    recommendedVoices: ['sumit', 'amit']
  },
  news: {
    name: 'News',
    description: 'Professional, neutral voice for broadcasting',
    mood: 'authoritative, clear, objective',
    recommendedVoices: ['amit', 'neha']
  },
  horror: {
    name: 'Horror',
    description: 'Deep, suspenseful voice for scary content',
    mood: 'dark, mysterious, terrifying',
    recommendedVoices: ['amit', 'rahul']
  },
  educational: {
    name: 'Educational',
    description: 'Clear, patient voice for learning content',
    mood: 'calm, instructive, encouraging',
    recommendedVoices: ['neha', 'pooja', 'sumit']
  }
}

const SYSTEM_PROMPT = `You are VoiceAI, an advanced Voice Assistant that helps users with text-to-speech and voice-based interactions.

Your capabilities:
1. Analyze user text to determine the best voice model and characteristics
2. Generate appropriate responses based on the context
3. Provide voice-related advice and suggestions
4. Help with scripts for voiceovers, podcasts, and audio content

Available Voice Models (Sarvam AI):
${Object.entries(SARVAM_VOICES).map(([key, voice]) => `- ${voice.name} (${voice.gender}): ${voice.description}. Best for: ${voice.bestFor.join(', ')}`).join('\n')}

Voice Categories:
${Object.entries(VOICE_CATEGORIES).map(([key, cat]) => `- ${cat.name}: ${cat.description} (Recommended voices: ${cat.recommendedVoices?.join(', ')})`).join('\n')}

When responding:
1. Analyze the user's text to understand the context, emotion, and purpose
2. Select the BEST voice model from the available Sarvam voices based on the content
3. Provide your response text that will be converted to speech

Response Format:
**Selected Voice:** [voice name like shubh, ritu, amit, etc.]
**Voice Category:** [category like conversational, educational, etc.]
**Response:**
[Your text response here]

**Voice Tips:**
[Optional tips for better voice output]`

export async function POST(req: NextRequest) {
  try {
    const { prompt, history = [], voiceCategory = 'auto' } = await req.json()

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

    // Build message array with history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      }
    ]

    // Add conversation history (last 10 messages)
    const recentHistory = history.slice(-10)
    recentHistory.forEach((msg: { type: string; content: string }) => {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })
    })

    // Add current prompt with category context
    const categoryContext = voiceCategory !== 'auto' 
      ? `[Voice Category: ${voiceCategory}] ` 
      : ''
    
    messages.push({
      role: 'user',
      content: `${categoryContext}${prompt}`
    })

    // Use Groq for text generation with streaming for faster response
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: false // Using non-streaming for now to parse voice selection first
    })
    
    const text = completion.choices[0]?.message?.content || 'No response generated'

    // Parse voice selection from response
    const voiceMatch = text.match(/\*\*Selected Voice:\*\*\s*(\w+)/i)
    const categoryMatch = text.match(/\*\*Voice Category:\*\*\s*(\w+)/i)
    
    const selectedVoice = voiceMatch ? voiceMatch[1].toLowerCase() : 'shubh'
    const detectedCategory = categoryMatch ? categoryMatch[1].toLowerCase() : 'conversational'
    
    // Validate voice is in our available voices
    const validVoice = Object.keys(SARVAM_VOICES).includes(selectedVoice) ? selectedVoice : 'shubh'
    
    // Check if Sarvam API key is configured
    const sarvamConfigured = !!process.env.SARVAM_API_KEY

    return NextResponse.json({ 
      result: text,
      voiceCategory: detectedCategory,
      selectedVoice: validVoice,
      voiceInfo: SARVAM_VOICES[validVoice as keyof typeof SARVAM_VOICES],
      sarvamConfigured
    })
  } catch (error) {
    console.error('Voice Agent API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}

// Endpoint to generate actual speech (to be implemented with Sarvam)
export async function PUT(req: NextRequest) {
  try {
    const { text, voiceCategory = 'conversational', selectedVoice = 'shubh', language = 'en-IN' } = await req.json()

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

    // Call Sarvam AI TTS API using SDK
    try {
      console.log('Calling Sarvam TTS API with text:', text.substring(0, 50) + '...')
      
      if (!sarvamClient) {
        return NextResponse.json(
          { error: 'Sarvam client not initialized' },
          { status: 500 }
        )
      }

      // Map our voice names to Sarvam speaker names
      const speakerMap: Record<string, string> = {
        'shubh': 'shubh',
        'ritu': 'ritu',
        'amit': 'amit',
        'sumit': 'sumit',
        'pooja': 'pooja',
        'neha': 'neha',
        'rahul': 'rahul',
        'priya': 'priya'
      }
      
      const speaker = speakerMap[selectedVoice] || 'shubh'
      
      console.log('Using Sarvam voice:', speaker)
      
      // Use Sarvam SDK for text-to-speech with optimized settings
      const ttsResponse = await sarvamClient.textToSpeech.convert({
        text: text,
        target_language_code: language as any,
        speaker: speaker as any,
        pace: 1.1, // Slightly faster pace
        speech_sample_rate: 22050,
        model: 'bulbul:v3' as any
      })

      console.log('Sarvam TTS response received')

      // Sarvam SDK returns audios array with base64 encoded audio
      const audioBase64 = ttsResponse.audios?.[0]
      
      if (!audioBase64) {
        return NextResponse.json(
          { error: 'No audio generated', response: ttsResponse },
          { status: 500 }
        )
      }

      return NextResponse.json({
        audioBase64,
        text,
        voiceCategory,
        selectedVoice,
        language
      })
    } catch (ttsError: any) {
      console.error('TTS Error:', ttsError)
      return NextResponse.json(
        { error: 'Failed to generate speech', details: ttsError.message || ttsError },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Voice TTS Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}
