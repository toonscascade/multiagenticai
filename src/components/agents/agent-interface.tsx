'use client'

import { useState } from 'react'
import { Navbar } from '@/components/ui/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Agent } from '@/lib/agents-data'
import { Code2, Megaphone, Mic, Search, Youtube, Send, Loader2, Copy, Check } from 'lucide-react'

interface AgentInterfaceProps {
  agent: Agent
  apiEndpoint: string
}

const iconMap = {
  code: Code2,
  marketing: Megaphone,
  voice: Mic,
  research: Search,
  youtube: Youtube,
}

export function AgentInterface({ agent, apiEndpoint }: AgentInterfaceProps) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const IconComponent = iconMap[agent.icon]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate response')
      }

      const data = await response.json()
      setResult(data.result || data.response || 'No result generated')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {agent.name}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {agent.description}
            </p>
          </div>

          {/* Input Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Request</CardTitle>
              <CardDescription>
                Describe what you need help with and our AI will assist you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Ask the ${agent.name} for help...`}
                  className="w-full min-h-[150px] p-4 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  disabled={loading}
                />
                <div className="mt-4 flex justify-end">
                  <Button type="submit" disabled={loading || !prompt.trim()}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Result Section */}
          {(result || error) && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Result</CardTitle>
                  <CardDescription>
                    {error ? 'Something went wrong' : 'Here is your generated content'}
                  </CardDescription>
                </div>
                {result && (
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
                    {error}
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-muted whitespace-pre-wrap">
                    {result}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
