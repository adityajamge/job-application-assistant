import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import PDFParser from "pdf2json";
import { AIFactory } from "@/lib/ai/ai-factory";

async function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error("PDF parsing error:", errData.parserError);
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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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
    
    // First, validate if this is actually a resume
    try {
      await aiProvider.analyzeResume(resumeText);
    } catch (error) {
      if (error instanceof Error && error.message === "NOT_A_RESUME") {
        return NextResponse.json(
          { error: "This doesn't appear to be a resume. Please upload a valid resume or CV document." },
          { status: 400 }
        );
      }
      throw error; // Re-throw other errors
    }
    
    // If validation passed, analyze resume for suggestions
    const suggestions = await aiProvider.analyzeSuggestions(resumeText);
    
    return NextResponse.json(suggestions);
    
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume. Please try again." },
      { status: 500 }
    );
  }
}
