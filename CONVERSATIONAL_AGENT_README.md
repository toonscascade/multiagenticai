# Conversational Voice Agent Setup Guide (Twilio Media Streams)

## Overview
The Conversational Voice Agent enables **real phone conversations** using Twilio's speech recognition and Groq AI for intelligent responses.

## Architecture Flow
```
1. User enters phone number in web UI
        ↓
2. Twilio initiates outbound call
        ↓
3. Caller answers phone
        ↓
4. Twilio plays AI greeting (TTS)
        ↓
5. Caller speaks response
        ↓
6. Twilio converts speech to text
        ↓
7. Groq AI processes text with custom persona
        ↓
8. AI generates response
        ↓
9. Twilio converts response to speech
        ↓
10. Caller hears AI response
        ↓
11. Conversation continues naturally
```

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Application URL (must be publicly accessible)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# API Keys
GROQ_API_KEY=your_groq_api_key
SARVAM_API_KEY=your_sarvam_api_key
```

## Setup Steps

### 1. Install Dependencies
```bash
npm install twilio ws
```

### 2. Configure Twilio Account
1. Sign up at [twilio.com](https://www.twilio.com)
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a Twilio phone number
4. Add all values to `.env.local`

### 3. Make App Publicly Accessible
- Deploy to Vercel/Netlify, OR
- Use ngrok for local testing: `ngrok http 3000`
- Update `NEXT_PUBLIC_APP_URL` with your public URL

### 4. Test Locally
1. Run `npm run dev`
2. Navigate to `/agents/conversational`
3. Enter a phone number
4. Click "Start Call"

## Current Features ✅
- **Real-time Media Streaming** - Bidirectional audio with Twilio Streams
- **AI Conversation Logic** - Powered by Groq Llama 3.3 70B
- **Natural Voice Synthesis** - Sarvam AI TTS with multiple voices
- **Conversation Memory** - Maintains context throughout call
- **Custom Personas** - Configure agent behavior and tone
- **Call Monitoring** - Real-time status and duration tracking
- **No Browser Mic Required** - Uses phone call audio directly

## Media Streams Advantages ✨
- **Low Latency** - Real-time audio streaming
- **Bidirectional** - Simultaneous send/receive audio
- **Better Quality** - Direct audio stream vs. polling
- **Scalable** - Handles multiple concurrent calls
- **Professional** - Enterprise-grade telephony

## API Endpoints

### POST `/api/agents/conversational/call`
Initiates a Media Streams call
```json
{
  "phoneNumber": "+1234567890",
  "prompt": "You are a sales representative...",
  "greeting": "Hello! I'm calling about..."
}
```

### POST `/api/agents/conversational/twiml`
Handles Twilio call setup with Media Streams connection

### POST `/api/agents/conversational/media-stream`
Processes real-time media stream events:
- `start` - Stream initialization
- `media` - Audio data (inbound/outbound)
- `stop` - Stream termination

## Troubleshooting

### Call fails to initiate
- Verify Twilio credentials in `.env.local`
- Ensure phone number is in E.164 format (+1234567890)
- Check that `NEXT_PUBLIC_APP_URL` is publicly accessible

### No audio in call
- Verify `SARVAM_API_KEY` is set correctly
- Check Sarvam API quota and limits
- Ensure Twilio Media Streams are enabled on your account

### Media stream errors
- Check console logs for detailed error messages
- Verify WebSocket connection to media stream endpoint
- Ensure proper SSL/TLS for production deployments

## Notes
- Uses Twilio's `<Connect><Stream>` for real-time audio
- Simulates STT (Speech-to-Text) - can be enhanced with Deepgram/Voicegain
- Audio is processed in real-time with minimal latency
- Conversation history maintained per call session
- Ready for production deployment with proper scaling
