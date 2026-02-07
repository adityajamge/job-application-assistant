// AI Service Interface - Define the contract for all AI providers
export interface AIProvider {
  analyzeResume(resumeText: string): Promise<ResumeAnalysis>;
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
