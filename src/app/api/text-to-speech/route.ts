import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
    
    if (!apiKey || apiKey === 'your_elevenlabs_api_key_here') {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    // Use ElevenLabs API with custom voice
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("ElevenLabs API error:", error);
      return NextResponse.json(
        { error: "Failed to generate speech" },
        { status: response.status }
      );
    }

    // Get audio buffer
    const audioBuffer = await response.arrayBuffer();
    
    // Return audio as base64
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    return NextResponse.json({ 
      audio: base64Audio,
      contentType: "audio/mpeg"
    });
    
  } catch (error) {
    console.error("Text-to-speech error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
