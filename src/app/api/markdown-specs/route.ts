import { NextRequest, NextResponse } from 'next/server'
import { readAllMarkdownSpecs, getLandingPageSpecs, getAgentPageSpecs } from '@/lib/markdown-spec-reader'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'all', 'landing', 'agent'
    const agentName = searchParams.get('agent') // specific agent name
    
    // Project root directory (adjust based on deployment)
    const projectRoot = process.cwd()
    const specsDir = path.join(projectRoot)
    
    let specs
    
    if (type === 'landing') {
      specs = await getLandingPageSpecs(specsDir)
    } else if (type === 'agent' && agentName) {
      specs = await getAgentPageSpecs(specsDir, agentName)
    } else {
      specs = await readAllMarkdownSpecs(specsDir)
    }
    
    return NextResponse.json({
      success: true,
      count: specs.length,
      specs: specs.map(spec => ({
        fileName: spec.fileName,
        sectionType: spec.sectionType,
        componentName: spec.componentName,
        codeBlockCount: spec.codeBlocks.length,
        dependencyCount: spec.dependencies.length,
        instructionCount: spec.instructions.length,
      })),
    })
  } catch (error) {
    console.error('Error reading markdown specs:', error)
    return NextResponse.json(
      { error: 'Failed to read markdown specifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileName } = body
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      )
    }
    
    const projectRoot = process.cwd()
    const filePath = path.join(projectRoot, `${fileName}.md`)
    
    const { readMarkdownSpec } = await import('@/lib/markdown-spec-reader')
    const spec = await readMarkdownSpec(filePath)
    
    if (!spec) {
      return NextResponse.json(
        { error: 'Specification not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      spec: {
        ...spec,
        rawContent: undefined, // Don't send raw content unless requested
      },
      rawContent: spec.rawContent,
    })
  } catch (error) {
    console.error('Error reading markdown spec:', error)
    return NextResponse.json(
      { error: 'Failed to read markdown specification' },
      { status: 500 }
    )
  }
}
