import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "No API key found" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different models to see which one works
    const modelsToTry = [
      "gemini-flash-latest",
      "gemini-pro-latest",
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro"
    ];
    
    const results = [];
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        results.push({
          model: modelName,
          success: true,
          response: result.response.text()
        });
        break; // Stop at first working model
      } catch (error: any) {
        results.push({
          model: modelName,
          success: false,
          error: error.message
        });
      }
    }
    
    return NextResponse.json({ 
      results,
      workingModel: results.find(r => r.success)?.model || null
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}
