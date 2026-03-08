# Sarvam Hindi Voice Models Configuration

## Available Hindi Voices:
- **meera** - Female voice, clear pronunciation
- **pradeep** - Male voice, professional tone
- **swara** - Female voice, friendly tone
- **rahul** - Male voice, conversational style

## Voice Characteristics:
- Sample Rate: 8000 Hz (telephone quality)
- Model: bulbul:v3 (optimized for Indian languages)
- Language Code: hi-IN (Hindi)

## Usage Notes:
- Hindi voices work best with Hindi text input
- For mixed language (Hinglish), use English voices
- Voice selection happens at TTS conversion time
- Twilio handles the actual voice call routing

## Implementation Flow:
1. Caller speaks in Hindi/English
2. Twilio converts speech to text
3. Groq AI processes text (language detected automatically)
4. Groq responds in same language
5. Sarvam converts response to selected Hindi voice
6. Twilio plays audio back to caller