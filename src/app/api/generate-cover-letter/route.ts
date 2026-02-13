import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import PDFParser from "pdf2json";
import { AIFactory } from "@/lib/ai/ai-factory";

async function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(new Error("Failed to parse PDF"));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        let text = "";
        if (pdfData.Pages) {
          pdfData.Pages.forEach((page: any) => {
            if (page.Texts) {
              page.Texts.forEach((textItem: any) => {
                if (textItem.R) {
                  textItem.R.forEach((run: any) => {
                    if (run.T) {
                      try {
                        text += decodeURIComponent(run.T) + " ";
                      } catch (e) {
                        text += run.T + " ";
                      }
                    }
                  });
                }
              });
            }
            text += "\n";
          });
        }
        resolve(text);
      } catch (error) {
        reject(error);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File;
    const position = formData.get("position") as string;
    const companyName = formData.get("companyName") as string;
    const jobDescription = formData.get("jobDescription") as string;
    const hiringManager = formData.get("hiringManager") as string;
    const tone = formData.get("tone") as string;

    if (!file || !position) {
      return NextResponse.json({ error: "Resume and position are required" }, { status: 400 });
    }

    // Extract text from file
    let resumeText = "";
    const buffer = Buffer.from(await file.arrayBuffer());

    if (file.type === "application/pdf") {
      resumeText = await parsePDF(buffer);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer });
      resumeText = result.value;
    } else if (file.type === "text/plain") {
      resumeText = buffer.toString("utf-8");
    }

    if (!resumeText || resumeText.trim().length < 100) {
      return NextResponse.json({ error: "Could not extract text from resume" }, { status: 400 });
    }

    // Get AI provider
    const aiProvider = AIFactory.getDefaultProvider();
    
    // Generate cover letter
    const coverLetter = await aiProvider.generateCoverLetter({
      resumeText,
      position,
      companyName,
      jobDescription,
      hiringManager,
      tone
    });
    
    return NextResponse.json(coverLetter);
    
  } catch (error) {
    console.error("Cover letter generation error:", error);
    
    // Provide more specific error message
    let errorMessage = "Failed to generate cover letter. Please try again.";
    
    if (error instanceof Error) {
      if (error.message.includes("parse JSON")) {
        errorMessage = "AI response format error. Please try again or simplify your inputs.";
      } else if (error.message.includes("API")) {
        errorMessage = "AI service error. Please check your API key and try again.";
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
