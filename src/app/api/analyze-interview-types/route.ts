import { NextRequest, NextResponse } from "next/server";
import { AIFactory } from "@/lib/ai/ai-factory";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText) {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    // Get AI provider
    const aiProvider = AIFactory.getDefaultProvider();
    
    // Analyze interview types
    const result = await aiProvider.analyzeInterviewTypes(resumeText, jobDescription);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Interview type analysis error:", error);
    
    let errorMessage = "Failed to analyze interview types. Please try again.";
    
    if (error instanceof Error) {
      if (error.message.includes("API")) {
        errorMessage = "AI service error. Please check your API key and try again.";
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
