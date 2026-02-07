import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "No API key found" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try gemini-pro (the stable free model)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Say hello");
    
    return NextResponse.json({ 
      success: true, 
      message: "API key is valid!",
      model: "gemini-pro",
      response: result.response.text()
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}
