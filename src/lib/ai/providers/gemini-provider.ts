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
  EvaluateAnswerResponse,
  ATSCheckResponse
} from "../ai-service";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    const model = this.client.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(this.buildPrompt(resumeText));
    const responseText = result.response.text();
    return this.parseResponse(responseText);
  }

  async analyzeSuggestions(resumeText: string): Promise<ResumeSuggestions> {
    const model = this.client.getGenerativeModel({ model: "gemini-flash-latest" });
    const truncatedText = resumeText.substring(0, 2000);
    const prompt = `Analyze this resume and suggest 3 suitable job positions. Return ONLY valid JSON with: suggestedPositions, candidateLevel, primarySkills, yearsOfExperience, contactInfo.\n\nResume:\n${truncatedText}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");
    return JSON.parse(jsonMatch[0]);
  }

  async generateCoverLetter(data: CoverLetterRequest): Promise<CoverLetterResponse> {
    const model = this.client.getGenerativeModel({ model: "gemini-flash-latest" });
    const truncatedText = data.resumeText.substring(0, 2000);
    const prompt = `Generate a professional cover letter. Return ONLY valid JSON with: coverLetter, contactInfo, date, companyName, position.\n\nResume: ${truncatedText}\nPosition: ${data.position}\nCompany: ${data.companyName || "the company"}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");
    return JSON.parse(jsonMatch[0]);
  }

  async analyzeInterviewTypes(resumeText: string, jobDescription?: string): Promise<InterviewTypeAnalysis> {
    const model = this.client.getGenerativeModel({ model: "gemini-flash-latest" });
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
      const model = this.client.getGenerativeModel({ model: "gemini-flash-latest" });
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

    const model = this.client.getGenerativeModel({ model: "gemini-flash-latest" });
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
    const model = this.client.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `Evaluate this interview answer and provide constructive feedback (2-3 sentences).

Question: ${data.question}

Answer: ${data.answer}

Focus on:
- Content quality and completeness
- Technical accuracy
- Communication clarity
- Areas for improvement

Be encouraging but honest. Do NOT mention resume or unrelated information.

Return ONLY valid JSON: {"feedback":"..."}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");
    return JSON.parse(jsonMatch[0]);
  }

  async checkATSCompatibility(resumeText: string, jobDescription?: string): Promise<ATSCheckResponse> {
    const model = this.client.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `Analyze this resume for ATS compatibility.

Resume:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}\n` : ''}

Check for: standard headers, contact info, date formats, formatting issues, keywords.

Return ONLY valid JSON:
{
  "score": number (0-100),
  "criticalIssues": [{"issue": "...", "fix": "..."}],
  "warnings": [{"issue": "...", "fix": "..."}],
  "passed": ["..."],
  "keywordAnalysis": ${jobDescription ? '{"matchedKeywords": [], "missingKeywords": [], "matchRate": 0}' : 'null'}
}`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse JSON");
    return JSON.parse(jsonMatch[0]);
  }

  private buildPrompt(resumeText: string): string {
    // Truncate resume to speed up processing
    const truncatedText = resumeText.substring(0, 3000);
    return `Analyze this resume and return ONLY valid JSON:

Resume:
${truncatedText}

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
