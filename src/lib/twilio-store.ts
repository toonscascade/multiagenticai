// Shared state between Twilio call routes
import { SarvamAIClient } from 'sarvamai'

// Store active calls and their prompts
export const activeCalls = new Map<string, { 
  prompt: string
  greeting: string 
}>()

// Store active media streams
export const activeStreams = new Map<string, {
  prompt: string
  history: Array<{role: string, content: string}>
  streamSid: string
}>()

// Store call statuses for UI updates
export const callStatuses = new Map<string, {
  status: 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'failed'
  startTime: number
  endTime?: number
}>()

// Initialize Sarvam client
export const getSarvamClient = () => {
  return process.env.SARVAM_API_KEY 
    ? new SarvamAIClient({ apiSubscriptionKey: process.env.SARVAM_API_KEY })
    : null
}