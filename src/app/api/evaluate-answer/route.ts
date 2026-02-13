import { NextRequest, NextResponse } from "next/server";
import { AIFactory } from "@/lib/ai/ai-factory";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, resumeText } = body;

    if (!question || !answer || !resumeText) {
      return NextResponse.json(
        { error: "Question, answer, and resume text are required" },
        { status: 400 }
      );
    }

    // Get AI provider
    const aiProvider = AIFactory.getDefaultProvider();
    
    // Evaluate the answer
    const result = await aiProvider.evaluateAnswer({
      question,
      answer,
      resumeText,
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Answer evaluation error:", error);
    
    let errorMessage = "Failed to evaluate answer. Please try again.";
    
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
