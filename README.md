# MultiAgent AI SaaS Platform

A modern, full-stack AI SaaS website that provides multiple AI agents for various tasks including coding, marketing, voice generation, research, and YouTube content creation.

## Features

- **5 Specialized AI Agents**:
  - **Software Engineer Agent** - Code generation and debugging
  - **Marketing Agent** - Campaign creation and ad copy
  - **Voice Agent** - Voiceover scripts and TTS optimization
  - **Research Agent** - Market research and competitive analysis
  - **YouTube Agent** - Video titles, scripts, and SEO

- **Modern Tech Stack**:
  - Next.js 16 (App Router)
  - TypeScript
  - TailwindCSS
  - shadcn/ui components

- **Key Components**:
  - Responsive landing page with hero section
  - Interactive agent carousel
  - Pricing section
  - Individual agent pages with chat interface
  - RESTful API routes for each agent
  - Markdown UI specification reader

## Project Structure

```
multiagentai/
├── src/
│   ├── app/
│   │   ├── agents/              # Agent pages
│   │   │   ├── software-engineer/
│   │   │   ├── marketing/
│   │   │   ├── voice/
│   │   │   ├── research/
│   │   │   └── youtube/
│   │   ├── api/                 # API routes
│   │   │   └── agents/          # Agent API endpoints
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── agents/              # Agent-specific components
│   │   │   ├── agent-card.tsx
│   │   │   └── agent-interface.tsx
│   │   ├── landing/             # Landing page sections
│   │   │   ├── agents-section.tsx
│   │   │   ├── pricing-section.tsx
│   │   │   └── footer.tsx
│   │   └── ui/                  # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── hero-1.tsx
│   │       └── navbar.tsx
│   ├── lib/
│   │   ├── agents-data.ts       # Agent data and types
│   │   ├── markdown-spec-reader.ts  # Markdown spec parser
│   │   └── utils.ts             # Utility functions
│   └── types/                   # TypeScript types
├── public/                      # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd multiagentai
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Pages & Routes

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, agents showcase, and pricing |
| `/agents` | All agents listing page |
| `/agents/software-engineer` | Software Engineer Agent interface |
| `/agents/marketing` | Marketing Agent interface |
| `/agents/voice` | Voice Agent interface |
| `/agents/research` | Research Agent interface |
| `/agents/youtube` | YouTube Agent interface |

### API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agents/software-engineer` | POST | Software engineering assistance |
| `/api/agents/marketing` | POST | Marketing content generation |
| `/api/agents/voice` | POST | Voice/TTS script generation |
| `/api/agents/research` | POST | Research and analysis |
| `/api/agents/youtube` | POST | YouTube content creation |
| `/api/markdown-specs` | GET/POST | Read markdown UI specifications |

## API Usage Example

### Request
```javascript
const response = await fetch('/api/agents/software-engineer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Create a React component for a button'
  })
})

const data = await response.json()
console.log(data.result)
```

### Response
```json
{
  "result": "Generated code or content...",
  "agent": "software-engineer",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Markdown UI Specifications

The project includes a markdown specification reader that can parse UI design documents. Place markdown files with the `landing` prefix in the project root to define UI components.

### Supported File Names
- `landinghero.md` - Hero section specifications
- `landingagents.md` - Agents section specifications
- `landingpricing.md` - Pricing section specifications
- `landingfooter.md` - Footer specifications
- `landingyoutube.md` - YouTube agent page specifications

### Reading Specifications
```typescript
import { readMarkdownSpec } from '@/lib/markdown-spec-reader'

const spec = await readMarkdownSpec('./landinghero.md')
console.log(spec.codeBlocks) // Extracted code blocks
console.log(spec.dependencies) // Required dependencies
```

## Customization

### Adding New Agents

1. Create a new agent page directory:
```bash
mkdir -p src/app/agents/new-agent
```

2. Add the page component:
```tsx
// src/app/agents/new-agent/page.tsx
import { AgentInterface } from '@/components/agents/agent-interface'
import { getAgentById } from '@/lib/agents-data'

export default function NewAgentPage() {
  const agent = getAgentById('new-agent')
  return <AgentInterface agent={agent} apiEndpoint="/api/agents/new-agent" />
}
```

3. Create the API route:
```ts
// src/app/api/agents/new-agent/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { prompt } = await request.json()
  // Generate response using AI model
  return NextResponse.json({ result: 'Generated content' })
}
```

4. Update agents data:
```ts
// src/lib/agents-data.ts
export const agents: Agent[] = [
  // ... existing agents
  {
    id: 'new-agent',
    name: 'New Agent',
    description: 'Description here',
    icon: 'code', // or marketing, voice, research, youtube
    href: '/agents/new-agent',
  },
]
```

### Styling

The project uses TailwindCSS with custom CSS variables defined in `globals.css`. Customize the theme by modifying the CSS variables:

```css
:root {
  --primary: #7c3aed;
  --background: #ffffff;
  --foreground: #0a0a0a;
  /* ... other variables */
}
```

## Production Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Deploy to Vercel
```bash
vercel deploy
```

### Environment Variables

For production AI integration, set these environment variables:

```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## Technology Details

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Animations (optional)
- **Lucide React** - Icon library
- **Radix UI** - Accessible primitives

### Backend
- **Next.js API Routes** - Serverless functions
- **Mock AI Responses** - Replace with actual AI API calls

### Component Architecture
- Atomic design principles
- Reusable UI components in `/components/ui`
- Feature-specific components in `/components/[feature]`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with Next.js, TypeScript, and TailwindCSS.
