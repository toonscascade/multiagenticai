import fs from 'fs'
import path from 'path'

// Parse markdown file into persona objects
export function parsePersonasFromFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const personas: Array<{name: string, prompt: string}> = []
    
    // Split by ## headings
    const sections = content.split(/\n##\s+/)
    
    // Skip the first section (title)
    for (let i = 1; i < sections.length; i++) {
      const section = sections[i].trim()
      const lines = section.split('\n')
      
      if (lines.length > 0) {
        const name = lines[0].trim()
        const prompt = lines.slice(1).join('\n').trim()
        
        if (name && prompt) {
          personas.push({ name, prompt })
        }
      }
    }
    
    return personas
  } catch (error) {
    console.error('Error parsing personas file:', error)
    return []
  }
}

// Get default personas path
export function getDefaultPersonasPath() {
  return path.join(process.cwd(), 'src', 'prompts', 'conversational-personas.md')
}

// Load personas at startup
export function loadPersonas() {
  const filePath = getDefaultPersonasPath()
  return parsePersonasFromFile(filePath)
}