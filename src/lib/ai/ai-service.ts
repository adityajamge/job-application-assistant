// AI Service Interface - Define the contract for all AI providers
export interface AIProvider {
  analyzeResume(resumeText: string): Promise<ResumeAnalysis>;
  analyzeSuggestions(resumeText: string): Promise<ResumeSuggestions>;
  generateCoverLetter(data: CoverLetterRequest): Promise<CoverLetterResponse>;
  analyzeInterviewTypes(resumeText: string, jobDescription?: string): Promise<InterviewTypeAnalysis>;
  generateInterviewQuestions(data: InterviewQuestionsRequest): Promise<InterviewQuestionsResponse>;
  evaluateAnswer(data: EvaluateAnswerRequest): Promise<EvaluateAnswerResponse>;
  checkATSCompatibility(resumeText: string, jobDescription?: string): Promise<ATSCheckResponse>;
}

export interface ResumeAnalysis {
  overallScore: number;
  atsScore: number;
  formattingScore: number;
  contentScore: number;
  keywordScore: number;
  contactInfo: AnalysisSection;
  structure: AnalysisSection;
  content: AnalysisSection;
  atsCompatibility: AnalysisSection;
  quickWins: string[];
  suggestions: string[];
}

export interface AnalysisSection {
  status: "good" | "warning" | "poor";
  items: AnalysisItem[];
}

export interface AnalysisItem {
  label: string;
  present: boolean;
  message: string;
}

export interface ResumeSuggestions {
  suggestedPositions: string[];
  candidateLevel: string;
  primarySkills: string[];
  yearsOfExperience: number;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
}

export interface CoverLetterRequest {
  resumeText: string;
  position: string;
  companyName?: string;
  jobDescription?: string;
  hiringManager?: string;
  tone?: string;
}

export interface CoverLetterResponse {
  coverLetter: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  date: string;
  companyName: string;
  position: string;
  hiringManager?: string;
}

export interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
}

export interface InterviewQuestionsRequest {
  resumeText: string;
  jobDescription?: string;
  interviewType?: string; // NEW: Technical, Behavioral, System Design, etc.
}

export interface InterviewQuestionsResponse {
  questions: InterviewQuestion[];
}

export interface InterviewTypeAnalysis {
  availableTypes: {
    type: string;
    description: string;
    relevance: string;
    skillsToTest: string[];
  }[];
  recommendedType: string;
  candidateLevel: string;
  primarySkills: string[];
}

export interface EvaluateAnswerRequest {
  question: string;
  answer: string;
  resumeText: string;
}

export interface EvaluateAnswerResponse {
  feedback: string;
}

export interface ATSIssue {
  issue: string;
  fix: string;
}

export interface KeywordAnalysis {
  matchedKeywords: string[];
  missingKeywords: string[];
  matchRate: number;
}

export interface ATSCheckResponse {
  score: number;
  criticalIssues: ATSIssue[];
  warnings: ATSIssue[];
  passed: string[];
  keywordAnalysis: KeywordAnalysis | null;
}
