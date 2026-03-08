import { NextRequest, NextResponse } from 'next/server'
import { loadPersonas } from '@/lib/persona-loader'

export async function GET(request: NextRequest) {
  try {
    const personas = loadPersonas()
    
    return NextResponse.json({
      success: true,
      personas: personas,
      count: personas.length
    })
  } catch (error: any) {
    console.error('Personas API Error:', error)
    return NextResponse.json(
      { error: 'Failed to load personas', details: error.message },
      { status: 500 }
    )
  }
}