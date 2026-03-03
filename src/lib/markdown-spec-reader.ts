import { promises as fs } from 'fs'
import path from 'path'

/**
 * Markdown UI Specification Reader
 * 
 * This utility reads markdown files that contain UI specifications for the landing page.
 * It parses the content and extracts component code, dependencies, and implementation guidelines.
 */

export interface MarkdownSpec {
  filePath: string
  fileName: string
  sectionType: SectionType
  componentName?: string
  codeBlocks: CodeBlock[]
  dependencies: string[]
  instructions: string[]
  rawContent: string
}

export interface CodeBlock {
  language: string
  code: string
  fileName?: string
}

export type SectionType = 
  | 'hero'
  | 'agents'
  | 'pricing'
  | 'footer'
  | 'youtube'
  | 'navbar'
  | 'unknown'

/**
 * Maps markdown file names to section types
 */
const sectionTypeMap: Record<string, SectionType> = {
  'landinghero': 'hero',
  'landingagents': 'agents',
  'landingpricing': 'pricing',
  'landingfooter': 'footer',
  'landingyoutube': 'youtube',
  'landingnavbar': 'navbar',
}

/**
 * Determines the section type from a filename
 */
function getSectionType(fileName: string): SectionType {
  const baseName = fileName.toLowerCase().replace('.md', '')
  
  // Check for exact matches first
  if (sectionTypeMap[baseName]) {
    return sectionTypeMap[baseName]
  }
  
  // Check if it contains agent name
  const agentNames = ['youtube', 'software', 'marketing', 'voice', 'research']
  for (const agent of agentNames) {
    if (baseName.includes(agent)) {
      if (agent === 'youtube') return 'youtube'
      return 'unknown'
    }
  }
  
  // Check for landing prefix
  if (baseName.startsWith('landing')) {
    const section = baseName.replace('landing', '')
    return section as SectionType || 'unknown'
  }
  
  return 'unknown'
}

/**
 * Extracts code blocks from markdown content
 */
function extractCodeBlocks(content: string): CodeBlock[] {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const blocks: CodeBlock[] = []
  let match
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || 'text'
    const code = match[2].trim()
    
    // Try to extract filename from comments in the code
    const fileNameMatch = code.match(/\/\/\s*File:\s*(\S+)/) || 
                          code.match(/\/\*\s*File:\s*(\S+)\s*\*\//)
    
    blocks.push({
      language,
      code,
      fileName: fileNameMatch ? fileNameMatch[1] : undefined,
    })
  }
  
  return blocks
}

/**
 * Extracts dependencies from markdown content
 */
function extractDependencies(content: string): string[] {
  const dependencies: string[] = []
  
  // Look for npm install commands
  const npmInstallRegex = /npm install\s+([^\n]+)/g
  let match
  
  while ((match = npmInstallRegex.exec(content)) !== null) {
    const deps = match[1].split(/\s+/).filter(d => d.trim())
    dependencies.push(...deps)
  }
  
  // Look for import statements mentioning packages
  const importRegex = /from\s+['"]@?[\w/-]+['"]/g
  const imports = content.match(importRegex) || []
  
  imports.forEach(imp => {
    const packageName = imp.match(/['"](@?[\w-]+)/)?.[1]
    if (packageName && !dependencies.includes(packageName)) {
      // Only add external packages (starting with @ or common packages)
      if (packageName.startsWith('@') || 
          ['react', 'next', 'lucide', 'framer', 'clsx', 'tailwind'].some(p => packageName.includes(p))) {
        dependencies.push(packageName)
      }
    }
  })
  
  return [...new Set(dependencies)] // Remove duplicates
}

/**
 * Extracts implementation instructions from markdown
 */
function extractInstructions(content: string): string[] {
  const instructions: string[] = []
  
  // Look for numbered steps
  const numberedStepRegex = /^\d+\.\s+(.+)$/gm
  let match
  
  while ((match = numberedStepRegex.exec(content)) !== null) {
    instructions.push(match[1].trim())
  }
  
  // If no numbered steps, look for bullet points
  if (instructions.length === 0) {
    const bulletRegex = /^[-*]\s+(.+)$/gm
    while ((match = bulletRegex.exec(content)) !== null) {
      instructions.push(match[1].trim())
    }
  }
  
  return instructions
}

/**
 * Reads a single markdown specification file
 */
export async function readMarkdownSpec(filePath: string): Promise<MarkdownSpec | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const fileName = path.basename(filePath, '.md')
    
    return {
      filePath,
      fileName,
      sectionType: getSectionType(fileName),
      componentName: fileName.replace('landing', '').charAt(0).toUpperCase() + 
                     fileName.replace('landing', '').slice(1),
      codeBlocks: extractCodeBlocks(content),
      dependencies: extractDependencies(content),
      instructions: extractInstructions(content),
      rawContent: content,
    }
  } catch (error) {
    console.error(`Error reading markdown spec: ${filePath}`, error)
    return null
  }
}

/**
 * Reads all markdown specification files from a directory
 */
export async function readAllMarkdownSpecs(dirPath: string): Promise<MarkdownSpec[]> {
  try {
    const files = await fs.readdir(dirPath)
    const markdownFiles = files.filter(f => f.endsWith('.md'))
    
    const specs: MarkdownSpec[] = []
    
    for (const file of markdownFiles) {
      const filePath = path.join(dirPath, file)
      const spec = await readMarkdownSpec(filePath)
      if (spec) {
        specs.push(spec)
      }
    }
    
    return specs
  } catch (error) {
    console.error(`Error reading markdown specs from directory: ${dirPath}`, error)
    return []
  }
}

/**
 * Gets all landing page related specs
 */
export async function getLandingPageSpecs(baseDir: string): Promise<MarkdownSpec[]> {
  const allSpecs = await readAllMarkdownSpecs(baseDir)
  return allSpecs.filter(spec => 
    spec.fileName.toLowerCase().startsWith('landing') &&
    spec.sectionType !== 'unknown'
  )
}

/**
 * Gets specs for a specific agent page
 */
export async function getAgentPageSpecs(baseDir: string, agentName: string): Promise<MarkdownSpec[]> {
  const allSpecs = await readAllMarkdownSpecs(baseDir)
  return allSpecs.filter(spec => 
    spec.fileName.toLowerCase().includes(agentName.toLowerCase())
  )
}

/**
 * Generates a component from a markdown specification
 * This is a utility that could be used to auto-generate components from specs
 */
export function generateComponentFromSpec(spec: MarkdownSpec): string {
  const tsxBlocks = spec.codeBlocks.filter(b => b.language === 'tsx' || b.language === 'typescript' || b.language === 'jsx')
  
  if (tsxBlocks.length === 0) {
    return '// No TypeScript/TSX code found in specification'
  }
  
  // Return the first TSX block as the main component
  return tsxBlocks[0].code
}

/**
 * Utility to check if markdown specs exist and should be used
 */
export async function hasMarkdownSpecs(dirPath: string): Promise<boolean> {
  try {
    const files = await fs.readdir(dirPath)
    return files.some(f => f.endsWith('.md') && f.toLowerCase().startsWith('landing'))
  } catch {
    return false
  }
}
