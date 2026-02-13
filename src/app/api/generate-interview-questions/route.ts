import { NextRequest, NextResponse } from "next/server";
import { AIFactory } from "@/lib/ai/ai-factory";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription, interviewType } = body;

    if (!resumeText) {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    // Get AI provider
    const aiProvider = AIFactory.getDefaultProvider();
    
    // Generate interview questions
    const result = await aiProvider.generateInterviewQuestions({
      resumeText,
      jobDescription,
      interviewType,
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Interview questions generation error:", error);
    
    let errorMessage = "Failed to generate interview questions. Please try again.";
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes("INAPPROPRIATE_CONTENT")) {
        errorMessage = error.message.replace("INAPPROPRIATE_CONTENT: ", "");
        statusCode = 400;
      } else if (error.message.includes("RESUME_MISMATCH")) {
        errorMessage = error.message.replace("RESUME_MISMATCH: ", "");
        statusCode = 400;
      } else if (error.message.includes("API")) {
        errorMessage = "AI service error. Please check your API key and try again.";
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
