# Job Application Assistant 🚀

> An AI-powered platform to help job seekers optimize their resumes, generate cover letters, check ATS compatibility, and prepare for interviews.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 AI Resume Analyzer
Comprehensive resume analysis with actionable feedback

- **Multi-Format Support**: Upload PDF, DOCX, or TXT files (max 5MB)
- **5 Scoring Metrics**: Overall, ATS, Formatting, Content, Keywords (0-100 scale)
- **Smart Validation**: Ensures uploaded file is actually a resume
- **Section Analysis**: Contact info, structure, content, ATS compatibility
- **Quick Wins**: Immediate improvements you can make
- **Detailed Suggestions**: Comprehensive feedback for optimization
- **Dark/Light Mode**: Beautiful UI with theme support

### ✉️ Cover Letter Generator
AI-powered personalized cover letter creation

- **Smart Position Suggestions**: AI analyzes resume and suggests 3 suitable positions
- **Auto Contact Extraction**: Automatically pulls contact info from resume
- **Company-Specific or General**: Create targeted or general letters
- **Tone Customization**: Professional, Enthusiastic, or Formal
- **Professional Export**: Download as formatted DOCX file
- **Quick Copy**: Copy to clipboard for easy pasting
- **4-Step Wizard**: Simple, guided process

### 🎯 ATS Optimization Tool
Ensure your resume passes Applicant Tracking Systems

- **ATS Compatibility Score**: 0-100 rating with color-coded feedback
- **Issue Categorization**: Critical, Warnings, and Passed checks
- **Keyword Analysis**: Match your resume against job descriptions
- **Missing Keywords**: Identify gaps in your resume
- **Match Rate**: See percentage of job description keywords found
- **Actionable Fixes**: Specific instructions for each issue
- **Job Description Support**: Optional JD input for better analysis

### 🎤 Interview Preparation
Practice interviews with AI-generated questions and feedback

- **Resume-Based Questions**: AI generates 5 relevant questions from your resume
- **Interview Type Selection**: Technical, Behavioral, System Design, or Field-specific
- **Voice Recording**: Speak your answers naturally with speech-to-text
- **Real-Time Transcription**: See your words as you speak
- **Text Accumulation**: Never lose your answer text (even with pauses)
- **Instant AI Feedback**: Get constructive feedback after each answer
- **Resume-Job Matching**: Validates resume matches job description (30%+ relevance)
- **Session Review**: Review all questions, answers, and feedback

---

## 🎬 Demo

### Resume Analyzer
```
Upload Resume → AI Analysis (4-6s) → Detailed Scores & Feedback
```

### Cover Letter Generator
```
Upload Resume → AI Suggests Positions → Select & Customize → Generate Letter → Download DOCX
```

### ATS Optimization
```
Upload Resume + Job Description → ATS Analysis (3-5s) → Score + Issues + Keywords
```

### Interview Prep
```
Upload Resume → Select Interview Type → Practice 5 Questions → Get AI Feedback → Review Session
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes
- **PDF Parsing**: [pdf2json](https://www.npmjs.com/package/pdf2json)
- **DOCX Parsing**: [mammoth](https://www.npmjs.com/package/mammoth)
- **DOCX Generation**: [docx](https://www.npmjs.com/package/docx)

### AI Services
- **Primary**: [Groq](https://groq.com/) (Llama 3.3 70B Versatile) - FREE ⚡
- **Backup**: [Google Gemini](https://ai.google.dev/) (Gemini 1.5 Flash)
- **Voice**: Browser Web Speech API

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Version Control**: Git

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm**, yarn, pnpm, or bun
- **Groq API Key** (FREE, no credit card required)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/job-application-assistant.git
cd job-application-assistant
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Primary AI Provider (FREE - No credit card required)
GROQ_API_KEY=your_groq_api_key_here

# Backup AI Provider (Optional)
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Get your FREE Groq API key**

- Visit: [https://console.groq.com/keys](https://console.groq.com/keys)
- Sign up (no credit card required)
- Create a new API key
- Copy and paste into `.env.local`

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 📖 Usage

### 1. Resume Analyzer

**Steps:**
1. Click "AI Resume Analysis" on homepage
2. Upload your resume (PDF, DOCX, or TXT)
3. Wait 4-6 seconds for analysis
4. Review scores and feedback
5. Implement suggestions

**What You Get:**
- Overall Score (0-100)
- ATS Compatibility Score
- Formatting Score
- Content Quality Score
- Keyword Optimization Score
- Quick wins for immediate improvements
- Detailed suggestions for each section

### 2. Cover Letter Generator

**Steps:**
1. Click "Cover Letter Generator" on homepage
2. Upload your resume
3. Select from AI-suggested positions or enter custom
4. Add company details (optional)
5. Choose tone (Professional/Enthusiastic/Formal)
6. Generate and download letter

**What You Get:**
- Personalized cover letter (300-400 words)
- Professional DOCX format
- Properly formatted with contact info
- Ready to send

### 3. ATS Optimization

**Steps:**
1. Click "ATS Optimization" on homepage
2. Upload your resume
3. Optionally paste job description
4. Wait 3-5 seconds for analysis
5. Review score and issues
6. Fix critical issues first

**What You Get:**
- ATS Compatibility Score (0-100)
- Critical issues (must fix)
- Warnings (should fix)
- Passed checks (what's good)
- Keyword analysis (if JD provided)
- Specific fix instructions

### 4. Interview Preparation

**Steps:**
1. Click "Interview Preparation" on homepage
2. Upload your resume
3. Optionally add job description
4. Select interview type
5. Practice with 5 AI-generated questions
6. Record answers via voice
7. Receive instant feedback
8. Review complete session

**What You Get:**
- 5 relevant interview questions
- Voice recording capability
- Real-time transcription
- Instant AI feedback
- Session summary

---

## 📁 Project Structure

```
job-application-assistant/
├── src/
│   ├── app/
│   │   ├── api/                      # API Routes
│   │   │   ├── analyze-resume/
│   │   │   ├── analyze-resume-for-suggestions/
│   │   │   ├── generate-cover-letter/
│   │   │   ├── download-cover-letter/
│   │   │   ├── ats-check/
│   │   │   ├── extract-resume-text/
│   │   │   ├── analyze-interview-types/
│   │   │   ├── generate-interview-questions/
│   │   │   └── evaluate-answer/
│   │   ├── resume-analysis/          # Resume Analyzer Page
│   │   ├── cover-letter/             # Cover Letter Generator Page
│   │   ├── ats-optimization/         # ATS Optimization Page
│   │   ├── interview-prep/           # Interview Prep Page
│   │   ├── layout.tsx                # Root Layout
│   │   ├── page.tsx                  # Homepage
│   │   └── globals.css               # Global Styles
│   ├── components/
│   │   ├── ui/                       # shadcn/ui Components (40+)
│   │   ├── header.tsx                # Navigation Header
│   │   ├── footer.tsx                # Footer
│   │   └── theme-toggle.tsx          # Dark/Light Mode Toggle
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── ai-service.ts         # AI Interface Definitions
│   │   │   ├── ai-factory.ts         # Provider Selection Logic
│   │   │   └── providers/
│   │   │       ├── groq-provider.ts  # Groq Implementation
│   │   │       └── gemini-provider.ts # Gemini Implementation
│   │   └── utils.ts                  # Utility Functions
│   └── hooks/
│       └── use-mobile.tsx            # Mobile Detection Hook
├── public/                           # Static Assets
├── explanatory/                      # Documentation
│   ├── ats-optimization-implementation.md
│   ├── cover-letter-implementation.md
│   ├── interview-prep-implementation.md
│   └── resume-job-matching-validation.md
├── .env.local                        # Environment Variables (not in git)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── components.json
├── README.md
├── PROJECT_DOCUMENTATION.md          # Complete Technical Docs
└── USER_MANUAL.md                    # End-User Guide
```

---

## 📝 API Documentation

### Resume Analysis

**Endpoint:** `POST /api/analyze-resume`

**Request:**
```typescript
Content-Type: multipart/form-data
Body: {
  resume: File (PDF/DOCX/TXT, max 5MB)
}
```

**Response:**
```typescript
{
  overallScore: number,
  atsScore: number,
  formattingScore: number,
  contentScore: number,
  keywordScore: number,
  contactInfo: { status, items },
  structure: { status, items },
  content: { status, items },
  atsCompatibility: { status, items },
  quickWins: string[],
  suggestions: string[]
}
```

### Cover Letter Generation

**Endpoint:** `POST /api/generate-cover-letter`

**Request:**
```typescript
Content-Type: multipart/form-data
Body: {
  resume: File,
  position: string,
  companyName?: string,
  jobDescription?: string,
  hiringManager?: string,
  tone?: "professional" | "enthusiastic" | "formal"
}
```

**Response:**
```typescript
{
  coverLetter: string,
  contactInfo: { name, email, phone, linkedin, location },
  date: string,
  companyName: string,
  position: string,
  hiringManager?: string
}
```

### ATS Compatibility Check

**Endpoint:** `POST /api/ats-check`

**Request:**
```typescript
Content-Type: multipart/form-data
Body: {
  resume: File,
  jobDescription?: string
}
```

**Response:**
```typescript
{
  score: number (0-100),
  criticalIssues: [{ issue, fix }],
  warnings: [{ issue, fix }],
  passed: string[],
  keywordAnalysis: {
    matchedKeywords: string[],
    missingKeywords: string[],
    matchRate: number
  } | null
}
```

### Interview Questions Generation

**Endpoint:** `POST /api/generate-interview-questions`

**Request:**
```typescript
Content-Type: application/json
Body: {
  resumeText: string,
  jobDescription?: string,
  interviewType?: string
}
```

**Response:**
```typescript
{
  questions: [{
    question: string,
    category: string,
    difficulty: "Easy" | "Medium" | "Hard"
  }]
}
```

### Answer Evaluation

**Endpoint:** `POST /api/evaluate-answer`

**Request:**
```typescript
Content-Type: application/json
Body: {
  question: string,
  answer: string,
  resumeText: string
}
```

**Response:**
```typescript
{
  feedback: string
}
```

---

## 🏗️ Architecture

### AI Abstraction Layer

The application uses a clean abstraction pattern for AI provider flexibility:

```
┌─────────────────────────────────────┐
│         AIFactory                    │
│  (Provider Selection Logic)          │
└─────────────────────────────────────┘
              │
      ┌───────┴───────┐
      ▼               ▼
┌──────────┐    ┌──────────┐
│  Groq    │    │ Gemini   │
│ Provider │    │ Provider │
└──────────┘    └──────────┘
```

**Benefits:**
- ✅ Easy to switch AI providers (just change API key)
- ✅ Easy to add new providers (implement interface)
- ✅ No code changes needed when switching
- ✅ Type-safe with TypeScript
- ✅ Automatic fallback mechanism

**Adding New Providers:**

1. Create provider class:
```typescript
// src/lib/ai/providers/new-provider.ts
export class NewProvider implements AIProvider {
  async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    // Implementation
  }
  // ... other methods
}
```

2. Update factory:
```typescript
// src/lib/ai/ai-factory.ts
case "new-provider":
  return new NewProvider(apiKey);
```

3. Add environment variable:
```env
NEW_PROVIDER_API_KEY=your_key
```

---

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel**
- Go to [https://vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository

3. **Configure Environment Variables**

Add in Vercel dashboard:
```
GROQ_API_KEY=your_production_key
GEMINI_API_KEY=your_backup_key (optional)
```

4. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Your app is live! 🎉

### Other Platforms

**Netlify:**
- Similar process to Vercel
- Add environment variables in Netlify dashboard

**Railway:**
- Connect GitHub repository
- Add environment variables
- Deploy

**Self-Hosted:**
```bash
npm run build
npm start
```

---

## 📊 Performance

| Feature | Time |
|---------|------|
| Resume Analysis | 4-6 seconds |
| Cover Letter Generation | 5-8 seconds |
| ATS Check | 3-5 seconds |
| Interview Question Generation | 3-5 seconds |
| Answer Evaluation | 2-3 seconds |

**Optimizations:**
- Efficient file parsing
- Optimized AI prompts
- Minimal API calls
- Client-side validation

---

## 🤖 Why Groq?

| Feature | Groq | Gemini | OpenAI |
|---------|------|--------|--------|
| **Cost** | FREE forever | FREE tier | $0.15/1M tokens |
| **Speed** | Fastest ⚡ | Fast | Medium |
| **Setup** | No credit card ✅ | Requires billing ❌ | Paid only ❌ |
| **Model** | Llama 3.3 70B | Gemini 1.5 Flash | GPT-4 |
| **Accuracy** | High | High | Very High |

**Groq Advantages:**
- ✅ 100% FREE (no credit card required)
- ⚡ Lightning-fast inference
- 🎯 High accuracy with Llama 3.3 70B
- 📝 Reliable JSON responses
- 🔒 Enterprise-grade infrastructure

---

## 🔒 Security

- ✅ API keys stored in `.env.local` (not in git)
- ✅ File size validation (max 5MB)
- ✅ File type validation (PDF, DOCX, TXT only)
- ✅ Resume content validation
- ✅ Input sanitization
- ✅ Error handling for all API calls
- ✅ Secure server-side processing
- ✅ Content safety filters

---

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

### Environment Variables

```env
# Required
GROQ_API_KEY=your_groq_api_key

# Optional
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow TypeScript best practices
- Write clean, readable code
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS
- [Groq](https://groq.com/) - Lightning-Fast AI Inference
- [Lucide](https://lucide.dev/) - Beautiful Icons
- [Vercel](https://vercel.com/) - Deployment Platform

---

## 📧 Support

Need help? Have questions?

- 📖 Read the [User Manual](USER_MANUAL.md)
- 📚 Check [Project Documentation](PROJECT_DOCUMENTATION.md)
- 🐛 Open an [Issue](https://github.com/yourusername/job-application-assistant/issues)
- 💬 Start a [Discussion](https://github.com/yourusername/job-application-assistant/discussions)

---

## 🎯 Roadmap

### Completed ✅
- [x] AI Resume Analyzer
- [x] Cover Letter Generator
- [x] ATS Optimization Tool
- [x] Interview Preparation
- [x] Dark/Light Mode
- [x] Voice Recording
- [x] Resume-Job Matching

### Planned 🚧
- [ ] Job Search Integration
- [ ] Application Tracking
- [ ] Salary Negotiation Tool
- [ ] LinkedIn Integration
- [ ] Email Templates
- [ ] Analytics Dashboard
- [ ] Mobile App

---

## 📸 Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### Resume Analyzer
![Resume Analyzer](screenshots/resume-analyzer.png)

### Cover Letter Generator
![Cover Letter](screenshots/cover-letter.png)

### ATS Optimization
![ATS Optimization](screenshots/ats-optimization.png)

### Interview Preparation
![Interview Prep](screenshots/interview-prep.png)

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/job-application-assistant&type=Date)](https://star-history.com/#yourusername/job-application-assistant&Date)

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and AI**

[⬆ Back to Top](#job-application-assistant-)

</div>
