import Groq from "groq-sdk";
import { AIProvider, ResumeAnalysis } from "../ai-service";

export class GroqProvider implements AIProvider {
  private client: Groq;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

  async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    // First, validate if this is actually a resume
    const validationCompletion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a document classifier. Determine if the provided text is a resume/CV. Respond with ONLY 'YES' or 'NO'."
        },
        {
          role: "user",
          content: `Is this a resume or CV? Look for typical resume elements like work experience, education, skills, contact information.\n\nDocument text:\n${resumeText.substring(0, 1500)}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 10,
    });

    const isResume = validationCompletion.choices[0]?.message?.content?.trim().toUpperCase();
    
    if (isResume !== "YES") {
      throw new Error("NOT_A_RESUME");
    }

    // Now analyze the resume
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer. Analyze resumes and return ONLY valid JSON with scores and suggestions. No markdown, no extra text."
        },
        {
          role: "user",
          content: this.buildPrompt(resumeText)
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    return this.parseResponse(responseText);
  }

  private buildPrompt(resumeText: string): string {
    return `Analyze this resume and return ONLY valid JSON:

Resume:
${resumeText}

Return this exact structure:
{
  "overallScore": 85,
  "atsScore": 80,
  "formattingScore": 90,
  "contentScore": 85,
  "keywordScore": 75,
  "contactInfo": {
    "status": "good",
    "items": [
      {"label": "Email", "present": true, "message": "Email found"},
      {"label": "Phone", "present": true, "message": "Phone present"},
      {"label": "LinkedIn", "present": false, "message": "Add LinkedIn"},
      {"label": "Location", "present": true, "message": "Location included"}
    ]
  },
  "structure": {
    "status": "good",
    "items": [
      {"label": "Clear sections", "present": true, "message": "Well organized"},
      {"label": "Consistent formatting", "present": true, "message": "Consistent"},
      {"label": "Appropriate length", "present": true, "message": "Good length"},
      {"label": "Professional font", "present": true, "message": "Professional"}
    ]
  },
  "content": {
    "status": "good",
    "items": [
      {"label": "Action verbs", "present": true, "message": "Good verbs"},
      {"label": "Quantifiable achievements", "present": false, "message": "Add numbers"},
      {"label": "Relevant experience", "present": true, "message": "Relevant"},
      {"label": "Skills section", "present": true, "message": "Skills listed"}
    ]
  },
  "atsCompatibility": {
    "status": "good",
    "items": [
      {"label": "Standard sections", "present": true, "message": "Standard names"},
      {"label": "Simple formatting", "present": true, "message": "ATS friendly"},
      {"label": "No images/graphics", "present": true, "message": "No graphics"},
      {"label": "Keywords present", "present": true, "message": "Has keywords"}
    ]
  },
  "quickWins": [
    "Add LinkedIn profile",
    "Quantify achievements",
    "Add keywords"
  ],
  "suggestions": [
    "Include measurable results",
    "Add LinkedIn profile",
    "Optimize keywords",
    "Add professional summary",
    "Consistent date format"
  ]
}`;
  }

  private parseResponse(responseText: string): ResumeAnalysis {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response");
    }
    return JSON.parse(jsonMatch[0]);
  }
}
