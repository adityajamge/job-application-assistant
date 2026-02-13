# ElevenLabs Text-to-Speech Integration

## Overview
Replaced browser's native text-to-speech with ElevenLabs API for high-quality, natural-sounding voice output during interviews.

## Implementation

### API Endpoint
**File:** `src/app/api/text-to-speech/route.ts`

- Accepts text input
- Calls ElevenLabs API with Rachel voice (high-quality default)
- Returns audio as base64-encoded MP3
- Includes fallback error handling

### Voice Settings
- **Voice ID:** Rachel (`21m00Tcm4TlvDq8ikWAM`)
- **Model:** `eleven_monolingual_v1`
- **Stability:** 0.5
- **Similarity Boost:** 0.75

### Frontend Integration
**File:** `src/app/interview-prep/page.tsx`

Updated `speakQuestion()` function:
1. Calls `/api/text-to-speech` endpoint
2. Converts base64 audio to Blob
3. Creates Audio object and plays
4. Automatically stops microphone when speaking
5. Fallback to browser TTS if ElevenLabs fails

### Features
- ✅ High-quality natural voice
- ✅ Automatic mic muting when AI speaks
- ✅ Graceful fallback to browser TTS
- ✅ Proper cleanup (URL revocation)
- ✅ Error handling

## Setup

### 1. Get ElevenLabs API Key
1. Sign up at https://elevenlabs.io
2. Go to Profile → API Keys
3. Copy your API key

### 2. Configure Environment
Add to `.env.local`:
```
ELEVENLABS_API_KEY=your_actual_api_key_here
```

### 3. Test
1. Start dev server: `npm run dev`
2. Go to Interview Prep
3. Upload resume and start interview
4. AI should speak with ElevenLabs voice

## Voice Options
To change voice, update `voiceId` in `src/app/api/text-to-speech/route.ts`:

Popular voices:
- Rachel: `21m00Tcm4TlvDq8ikWAM` (default)
- Adam: `pNInz6obpgDQGcFmaJgB`
- Bella: `EXAVITQu4vr4xnSDxMaL`
- Antoni: `ErXwobaYiN019PkySvjV`

Find more at: https://elevenlabs.io/voice-library

## Cost Considerations
- Free tier: 10,000 characters/month
- Each question + feedback ≈ 100-300 characters
- ~30-100 interviews per month on free tier
- Fallback to browser TTS if quota exceeded

## Fallback Behavior
If ElevenLabs fails (API error, quota exceeded, network issue):
- Automatically falls back to browser's native TTS
- No interruption to user experience
- Error logged to console for debugging
