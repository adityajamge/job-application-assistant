import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  AIProvider, 
  ResumeAnalysis, 
  ResumeSuggestions, 
  CoverLetterRequest, 
  CoverLetterResponse,
  InterviewQuestionsRequest,
  InterviewQuestionsResponse,
  InterviewTypeAnalysis,
  EvaluateAnswerRequest,
  EvaluateAnswerResponse
} from "../ai-service";

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

  async analyzeSuggestions(resumeText: string): Promise<ResumeSuggestions> {
    const model = this.client.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Analyze this resume and suggest 3 suitable job positions. Return ONLY valid JSON with: suggestedPositions, candidateLevel, primarySkills, yearsOfExperience, contactInfo.\n\nResume:\n${resumeText}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");
    return JSON.parse(jsonMatch[0]);
  }

  async generateCoverLetter(data: CoverLetterRequest): Promise<CoverLetterResponse> {
    const model = this.client.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate a professional cover letter. Return ONLY valid JSON with: coverLetter, contactInfo, date, companyName, position.\n\nResume: ${data.resumeText}\nPosition: ${data.position}\nCompany: ${data.companyName || "the company"}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");
    return JSON.parse(jsonMatch[0]);
  }

  async analyzeInterviewTypes(resumeText: string, jobDescription?: string): Promise<InterviewTypeAnalysis> {
    const model = this.client.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Analyze this resume and suggest interview types relevant to THEIR specific field/industry.

CRITICAL: Identify their field first (tech, hospitality, healthcare, etc.) then suggest appropriate interview types for THAT field. DO NOT suggest coding/technical for non-tech fields.

Resume: ${resumeText.substring(0, 2000)}
${jobDescription ? `Job: ${jobDescription.substring(0, 500)}` : ''}

Return ONLY valid JSON with: availableTypes (array with type, description, relevance, skillsToTest), recommendedType, candidateLevel, primarySkills.`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");
    return JSON.parse(jsonMatch[0]);
  }

  async generateInterviewQuestions(data: InterviewQuestionsRequest): Promise<InterviewQuestionsResponse> {
    // Content safety check
    const jobDesc = data.jobDescription?.toLowerCase() || '';
    const bannedKeywords = [
      'terrorist', 'terrorism', 'bomb', 'explosive', 'weapon', 'attack', 'kill',
      'murder', 'illegal', 'drug', 'trafficking', 'hack', 'fraud', 'scam',
      'violence', 'extremist', 'radical', 'jihad', 'isis', 'al-qaeda', 'bin laden'
    ];
    
    const containsBannedContent = bannedKeywords.some(keyword => jobDesc.includes(keyword));
    
    if (containsBannedContent) {
      throw new Error("INAPPROPRIATE_CONTENT: This job description contains inappropriate or illegal content. Please provide a legitimate job description for a legal profession.");
    }

    // If job description is provided, check relevance first
    if (data.jobDescription && data.jobDescription.trim().length > 50) {
      const model = this.client.getGenerativeModel({ model: "gemini-pro" });
      const relevancePrompt = `Analyze if this candidate's background matches this job. Respond with ONLY 'MATCH - reason' or 'MISMATCH - reason'.

Resume: ${data.resumeText.substring(0, 2000)}
Job: ${data.jobDescription}

If at least 30% relevant, say MATCH. Otherwise MISMATCH.`;
      
      const relevanceResult = await model.generateContent(relevancePrompt);
      const relevanceResponse = relevanceResult.response.text().trim();
      
      if (relevanceResponse.toUpperCase().startsWith("MISMATCH")) {
        const reason = relevanceResponse.replace(/MISMATCH\s*-?\s*/i, "").trim();
        throw new Error(`RESUME_MISMATCH: Your resume doesn't match this job description. ${reason}. Please upload a relevant resume or change the job description.`);
      }
    }

    const model = this.client.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate 5 ${data.interviewType || 'mixed'} interview questions based on this resume. 

IMPORTANT: Generate deep, fundamental questions based on ACTUAL skills in the resume.

Return ONLY valid JSON with array of questions (each with: question, category, difficulty).

Resume:\n${data.resumeText}${data.jobDescription ? `\n\nJob Description:\n${data.jobDescription}` : ''}${data.interviewType ? `\n\nInterview Type: ${data.interviewType}` : ''}`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");
    return JSON.parse(jsonMatch[0]);
  }

  async evaluateAnswer(data: EvaluateAnswerRequest): Promise<EvaluateAnswerResponse> {
    const model = this.client.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Evaluate this interview answer and provide brief constructive feedback (2-3 sentences). Return ONLY valid JSON with: feedback.\n\nQuestion: ${data.question}\nAnswer: ${data.answer}\n\nCandidate Background:\n${data.resumeText.substring(0, 1000)}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");
    return JSON.parse(jsonMatch[0]);
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
