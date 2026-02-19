import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

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
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
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
    } else {
      // Try to read as text anyway
      resumeText = buffer.toString("utf-8");
    }

    if (!resumeText || resumeText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Could not extract text from resume' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: resumeText });
  } catch (error) {
    console.error('Resume text extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from resume' },
      { status: 500 }
    );
  }
}
