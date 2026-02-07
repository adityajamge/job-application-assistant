import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider, ResumeAnalysis } from "../ai-service";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    const model = this.client.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(this.buildPrompt(resumeText));
    const responseText = result.response.text();
    return this.parseResponse(responseText);
  }

  private buildPrompt(resumeText: string): string {
    return `Analyze this resume and return ONLY valid JSON:

Resume:
${resumeText}

Return valid JSON with: overallScore, atsScore, formattingScore, contentScore, keywordScore, contactInfo, structure, content, atsCompatibility, quickWins, suggestions`;
  }

  private parseResponse(responseText: string): ResumeAnalysis {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response");
    }
    return JSON.parse(jsonMatch[0]);
  }
}
