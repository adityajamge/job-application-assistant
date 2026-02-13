import Groq from "groq-sdk";
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

  async analyzeSuggestions(resumeText: string): Promise<ResumeSuggestions> {
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a career advisor. Analyze resumes and suggest suitable job positions. Return ONLY valid JSON."
        },
        {
          role: "user",
          content: `Analyze this resume and suggest 3 most suitable job positions based on skills and experience.

Resume:
${resumeText}

Extract contact information and suggest positions. Return ONLY valid JSON:
{
  "suggestedPositions": ["Position 1", "Position 2", "Position 3"],
  "candidateLevel": "Internship|Junior|Mid-Level|Senior",
  "primarySkills": ["skill1", "skill2", "skill3"],
  "yearsOfExperience": 0,
  "contactInfo": {
    "name": "Full Name",
    "email": "email@example.com or empty string",
    "phone": "phone number or empty string",
    "linkedin": "linkedin url or empty string",
    "location": "location or empty string"
  }
}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response");
    }
    return JSON.parse(jsonMatch[0]);
  }

  async generateCoverLetter(data: CoverLetterRequest): Promise<CoverLetterResponse> {
    const hiringManagerName = data.hiringManager || "Hiring Manager";
    
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional cover letter writer. Generate compelling, personalized cover letters. Return ONLY valid JSON with properly escaped strings."
        },
        {
          role: "user",
          content: `Generate a professional cover letter.

RESUME:
${data.resumeText}

POSITION: ${data.position}
COMPANY: ${data.companyName || "the company"}
HIRING MANAGER: ${hiringManagerName}
${data.jobDescription ? `JOB DESCRIPTION:\n${data.jobDescription}` : ""}
TONE: ${data.tone || "professional"}

INSTRUCTIONS:
1. Write 3-4 paragraphs (300-400 words)
2. Address the letter to "${hiringManagerName}" (use this exact name in the salutation)
3. Match candidate's experience to job requirements
4. Highlight relevant skills from the resume
5. Show enthusiasm for the role at ${data.companyName || "the company"}
6. Use ${data.tone || "professional"} tone
7. Structure: Opening → Body (2-3 paragraphs) → Closing
8. IMPORTANT: In the coverLetter field, use \\n\\n to separate paragraphs (not actual line breaks)
9. Start with "Dear ${hiringManagerName}," (use the exact name provided)

Return ONLY valid JSON with this structure:
{
  "coverLetter": "Dear ${hiringManagerName},\\n\\nFirst paragraph text here.\\n\\nSecond paragraph text here.\\n\\nThird paragraph text here.\\n\\nSincerely,\\n[Candidate Name]",
  "contactInfo": {
    "name": "Full Name from resume",
    "email": "email@example.com or empty string",
    "phone": "+1234567890 or empty string",
    "linkedin": "linkedin.com/in/username or empty string",
    "location": "City, State or empty string"
  },
  "date": "${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}",
  "companyName": "${data.companyName || "Hiring Company"}",
  "position": "${data.position}",
  "hiringManager": "${hiringManagerName}"
}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 2500,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    try {
      const parsed = JSON.parse(responseText);
      return parsed as CoverLetterResponse;
    } catch (error) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not find JSON in AI response");
      }
      return JSON.parse(jsonMatch[0]);
    }
  }

  async analyzeInterviewTypes(resumeText: string, jobDescription?: string): Promise<InterviewTypeAnalysis> {
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Analyze resume field and suggest interview types. Return JSON only."
        },
        {
          role: "user",
          content: `Resume: ${resumeText.substring(0, 600)}
${jobDescription ? `\nJob: ${jobDescription.substring(0, 150)}` : ''}

Identify field and suggest 2-3 interview types.
Hotel/hospitality → "Hospitality", "Customer Service"
Tech → "Technical", "System Design"
Healthcare → "Clinical", "Patient Care"

JSON format:
{"availableTypes":[{"type":"X","description":"Y","relevance":"High/Medium","skillsToTest":["A","B"]}],"recommendedType":"X","candidateLevel":"Entry/Mid/Senior","primarySkills":["A","B","C"]}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as InterviewTypeAnalysis;
    } catch (error) {
      console.error("Failed to parse interview types:", responseText);
      throw new Error("Could not parse JSON from AI response");
    }
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
      const relevanceCheck = await this.client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Check if resume matches job. Return 'MATCH' or 'MISMATCH - reason'."
          },
          {
            role: "user",
            content: `Resume: ${data.resumeText.substring(0, 600)}
Job: ${data.jobDescription.substring(0, 200)}

30%+ match? Say MATCH or MISMATCH - reason.`
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        max_tokens: 80,
      });

      const relevanceResponse = relevanceCheck.choices[0]?.message?.content?.trim() || "";
      
      if (relevanceResponse.toUpperCase().startsWith("MISMATCH")) {
        const reason = relevanceResponse.replace(/MISMATCH\s*-?\s*/i, "").trim();
        throw new Error(`RESUME_MISMATCH: Your resume doesn't match this job description. ${reason}. Please upload a relevant resume or change the job description.`);
      }
    }

    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Generate 5 ${data.interviewType || 'mixed'} interview questions. Return JSON only.`
        },
        {
          role: "user",
          content: `Resume: ${data.resumeText.substring(0, 600)}
${data.jobDescription ? `Job: ${data.jobDescription.substring(0, 150)}` : ''}

Generate 5 ${data.interviewType || 'mixed'} questions based on resume skills.
${data.interviewType === 'Technical' ? 'Technical depth.' : ''}
${data.interviewType === 'Behavioral' ? 'STAR format.' : ''}
${data.interviewType === 'Hospitality Management' ? 'Hotel ops, guest service.' : ''}
${data.interviewType === 'Customer Service' ? 'Customer handling.' : ''}

JSON: {"questions":[{"question":"...","category":"${data.interviewType || 'Mixed'}","difficulty":"Easy/Medium/Hard"}]}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    console.log("=== INTERVIEW QUESTIONS RESPONSE ===");
    console.log(responseText.substring(0, 500));
    console.log("====================================");
    
    try {
      // Try to find and parse JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as InterviewQuestionsResponse;
    } catch (error) {
      console.error("Failed to parse questions:", error);
      throw new Error("Could not parse JSON from AI response");
    }
  }

  async evaluateAnswer(data: EvaluateAnswerRequest): Promise<EvaluateAnswerResponse> {
    const completion = await this.client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Provide brief feedback. Return JSON only."
        },
        {
          role: "user",
          content: `Q: ${data.question}
A: ${data.answer}
Resume: ${data.resumeText.substring(0, 400)}

Give 2-3 sentence feedback. Be constructive.

JSON: {"feedback":"..."}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 300,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as EvaluateAnswerResponse;
    } catch (error) {
      console.error("Failed to parse feedback:", responseText);
      throw new Error("Could not parse JSON from AI response");
    }
  }

  private buildPrompt(resumeText: string): string {
    return `You are an expert resume analyzer. Analyze the following resume carefully and provide detailed, accurate feedback.

RESUME TEXT:
${resumeText}

INSTRUCTIONS:
1. Read the entire resume carefully
2. Check for email addresses (look for @ symbol)
3. Check for phone numbers (look for digits with dashes, parentheses, or spaces)
4. Check for LinkedIn URLs or profiles
5. Check for location/address information
6. Evaluate the structure, formatting, content quality, and ATS compatibility
7. Provide specific, actionable suggestions based on what you actually see

SCORING GUIDELINES:
- Overall Score (0-100): Weighted average of all metrics
- ATS Score (0-100): How well it passes Applicant Tracking Systems
- Formatting Score (0-100): Structure, consistency, readability
- Content Score (0-100): Quality of achievements, experience, skills
- Keyword Score (0-100): Presence of relevant industry keywords

STATUS VALUES: Use "good" (80+), "warning" (60-79), or "poor" (<60)

Return ONLY valid JSON in this exact structure (no markdown, no code blocks):
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "formattingScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "keywordScore": <number 0-100>,
  "contactInfo": {
    "status": "<good|warning|poor>",
    "items": [
      {"label": "Email", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "Phone", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "LinkedIn", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "Location", "present": <true|false>, "message": "<specific feedback>"}
    ]
  },
  "structure": {
    "status": "<good|warning|poor>",
    "items": [
      {"label": "Clear sections", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "Consistent formatting", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "Appropriate length", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "Professional appearance", "present": <true|false>, "message": "<specific feedback>"}
    ]
  },
  "content": {
    "status": "<good|warning|poor>",
    "items": [
      {"label": "Action verbs", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "Quantifiable achievements", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "Relevant experience", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "Skills section", "present": <true|false>, "message": "<specific feedback>"}
    ]
  },
  "atsCompatibility": {
    "status": "<good|warning|poor>",
    "items": [
      {"label": "Standard sections", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "Simple formatting", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "No images/graphics", "present": <true|false>, "message": "<specific feedback>"},
      {"label": "Keywords present", "present": <true|false>, "message": "<specific feedback>"}
    ]
  },
  "quickWins": [
    "<actionable suggestion 1>",
    "<actionable suggestion 2>",
    "<actionable suggestion 3>"
  ],
  "suggestions": [
    "<detailed suggestion 1>",
    "<detailed suggestion 2>",
    "<detailed suggestion 3>",
    "<detailed suggestion 4>",
    "<detailed suggestion 5>"
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
