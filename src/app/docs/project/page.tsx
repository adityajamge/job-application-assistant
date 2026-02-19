"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, CheckCircle2, Code, Zap, Shield, Layers } from 'lucide-react';
import { Header } from '@/components/header';

export default function ProjectDocumentation() {
  const handleDownload = () => {
    const content = `# Job Application Assistant - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Technology Stack](#technology-stack)
5. [Installation & Setup](#installation--setup)

---

## 📖 Project Overview

**Job Application Assistant** is an AI-powered web application designed to help job seekers optimize their job application process.

### Key Objectives
- Help job seekers create ATS-friendly resumes
- Generate personalized cover letters
- Provide realistic interview practice with AI feedback
- Optimize application materials for better success rates

### Target Users
- Job seekers at all career levels
- Students preparing for internships
- Professionals changing careers
- Anyone looking to improve their application materials

---

## ✨ Features

### 1. AI Resume Analyzer ✅
**Status:** Fully Implemented

**Capabilities:**
- Multi-format support (PDF, DOCX, TXT)
- Comprehensive scoring system (0-100)
- Section-by-section analysis
- ATS compatibility check
- Actionable improvement suggestions

### 2. Cover Letter Generator ✅
**Status:** Fully Implemented

**Capabilities:**
- AI-powered position suggestions
- Automatic contact info extraction
- Company-specific or general letters
- Tone customization
- Professional DOCX export

### 3. ATS Optimization Tool ✅
**Status:** Fully Implemented

**Capabilities:**
- ATS compatibility scoring (0-100)
- Critical issue detection
- Warning identification
- Keyword analysis with job description

### 4. Interview Preparation ✅
**Status:** Fully Implemented

**Capabilities:**
- AI-generated interview questions
- Voice recording with speech-to-text
- Real-time answer transcription
- Instant AI feedback

---

## 🛠️ Technology Stack

### Frontend
- Framework: Next.js 16 (App Router)
- UI Library: React 19
- Language: TypeScript 5
- Styling: Tailwind CSS 4
- Components: shadcn/ui

### Backend
- Runtime: Node.js 18+
- API: Next.js API Routes
- File Parsing: pdf2json, mammoth

### AI Services
- Primary: Groq (Llama 3.3 70B Versatile)
- Backup: Google Gemini (Gemini 1.5 Flash)
- Voice: Browser Web Speech API

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18 or higher
- npm, yarn, pnpm, or bun
- Groq API key (FREE, no credit card required)

### Step-by-Step Installation

1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd job-application-assistant
\`\`\`

2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

3. Set Up Environment Variables
Create \`.env.local\` file:
\`\`\`env
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

4. Get Your FREE Groq API Key
- Visit: https://console.groq.com/keys
- Sign up (no credit card required)
- Create a new API key

5. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

6. Open Browser
Navigate to: http://localhost:3000

---

**Built with ❤️ using Next.js, TypeScript, and AI**
*Last Updated: February 2026*`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PROJECT_DOCUMENTATION.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <header className="border-b sticky top-16 bg-background/95 backdrop-blur z-10">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/docs">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Docs
            </Button>
          </Link>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download MD
          </Button>
        </div>
      </header>

      <main className="container max-w-6xl py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Project Documentation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete technical documentation for the Job Application Assistant platform
          </p>
        </div>

        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">📖 Project Overview</CardTitle>
            <CardDescription>
              AI-powered web application designed to help job seekers optimize their job application process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Objectives</h3>
              <div className="grid gap-3">
                {[
                  'Help job seekers create ATS-friendly resumes',
                  'Generate personalized cover letters',
                  'Provide realistic interview practice with AI feedback',
                  'Optimize application materials for better success rates'
                ].map((objective, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3">Target Users</h3>
              <div className="flex flex-wrap gap-2">
                {['Job seekers at all levels', 'Students', 'Career changers', 'Professionals'].map((user, i) => (
                  <Badge key={i} variant="secondary">{user}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">✨ Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Resume Analyzer */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>AI Resume Analyzer</CardTitle>
                  <Badge className="bg-green-500">Implemented</Badge>
                </div>
                <CardDescription>Comprehensive resume analysis with scoring</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Multi-format support (PDF, DOCX, TXT)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Comprehensive scoring system (0-100)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Section-by-section analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>ATS compatibility check</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Actionable improvement suggestions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Cover Letter Generator */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cover Letter Generator</CardTitle>
                  <Badge className="bg-green-500">Implemented</Badge>
                </div>
                <CardDescription>AI-powered personalized cover letters</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>AI-powered position suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Automatic contact info extraction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Company-specific or general letters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Tone customization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Professional DOCX export</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* ATS Optimization */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>ATS Optimization</CardTitle>
                  <Badge className="bg-green-500">Implemented</Badge>
                </div>
                <CardDescription>Ensure resume passes automated systems</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>ATS compatibility scoring (0-100)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Critical issue detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Warning identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Passed checks highlighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Keyword analysis with job description</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Interview Prep */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Interview Preparation</CardTitle>
                  <Badge className="bg-green-500">Implemented</Badge>
                </div>
                <CardDescription>Practice with AI-generated questions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>AI-generated interview questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Voice recording with speech-to-text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Real-time answer transcription</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Instant AI feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>Interview type selection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Layers className="w-6 h-6" />
              Architecture
            </CardTitle>
            <CardDescription>Modern three-tier architecture with AI abstraction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Frontend Layer</h4>
                <p className="text-sm text-muted-foreground">Next.js with React components</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">API Layer</h4>
                <p className="text-sm text-muted-foreground">Next.js API routes for backend logic</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">AI Layer</h4>
                <p className="text-sm text-muted-foreground">Abstracted AI provider interface</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">AI Abstraction Benefits</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Easy provider switching',
                  'Easy to add new providers',
                  'Type-safe with TypeScript',
                  'Consistent interface',
                  'Automatic fallback mechanism'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Code className="w-8 h-8" />
            Technology Stack
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Frontend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Framework</span>
                  <Badge variant="outline">Next.js 16</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">UI Library</span>
                  <Badge variant="outline">React 19</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Language</span>
                  <Badge variant="outline">TypeScript 5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Styling</span>
                  <Badge variant="outline">Tailwind CSS 4</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Components</span>
                  <Badge variant="outline">shadcn/ui</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Runtime</span>
                  <Badge variant="outline">Node.js 18+</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API</span>
                  <Badge variant="outline">Next.js Routes</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">PDF Parser</span>
                  <Badge variant="outline">pdf2json</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">DOCX Parser</span>
                  <Badge variant="outline">mammoth</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Doc Generator</span>
                  <Badge variant="outline">docx</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Primary AI</span>
                  <Badge variant="outline">Groq</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Model</span>
                  <Badge variant="outline">Llama 3.3 70B</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Backup AI</span>
                  <Badge variant="outline">Gemini</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Voice</span>
                  <Badge variant="outline">Web Speech API</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cost</span>
                  <Badge className="bg-green-500">FREE</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Installation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Installation & Setup
            </CardTitle>
            <CardDescription>Get started in minutes with these simple steps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Prerequisites</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Node.js 18+</Badge>
                <Badge variant="secondary">npm/yarn/pnpm</Badge>
                <Badge variant="secondary">Groq API Key (FREE)</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Clone the Repository</h4>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                  <code>git clone &lt;repository-url&gt;{'\n'}cd job-application-assistant</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">2. Install Dependencies</h4>
                <pre className="bg-muted p-3 rounded-lg text-sm">
                  <code>npm install</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">3. Set Up Environment Variables</h4>
                <p className="text-sm text-muted-foreground">Create <code>.env.local</code> file:</p>
                <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                  <code>GROQ_API_KEY=your_groq_api_key_here{'\n'}GEMINI_API_KEY=your_gemini_api_key_here</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">4. Get Your FREE Groq API Key</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Visit: <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://console.groq.com/keys</a></li>
                  <li>Sign up (no credit card required)</li>
                  <li>Create a new API key</li>
                  <li>Copy and paste into .env.local</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">5. Run Development Server</h4>
                <pre className="bg-muted p-3 rounded-lg text-sm">
                  <code>npm run dev</code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">6. Open Browser</h4>
                <p className="text-sm text-muted-foreground">
                  Navigate to: <a href="http://localhost:3000" className="text-primary hover:underline">http://localhost:3000</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">🔌 API Documentation</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>POST /api/analyze-resume</CardTitle>
              <CardDescription>Analyze resume and provide comprehensive feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">Request</h4>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  <code>{`Content-Type: multipart/form-data
Body: { resume: File (PDF/DOCX/TXT, max 5MB) }`}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Response</h4>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  <code>{`{
  overallScore: number,
  atsScore: number,
  formattingScore: number,
  contentScore: number,
  keywordScore: number,
  contactInfo: { ... },
  quickWins: string[],
  suggestions: string[]
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>POST /api/generate-cover-letter</CardTitle>
              <CardDescription>Generate personalized cover letter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">Request</h4>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  <code>{`Content-Type: multipart/form-data
Body: {
  resume: File,
  position: string,
  companyName?: string,
  jobDescription?: string,
  tone?: "professional" | "enthusiastic" | "formal"
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>POST /api/ats-check</CardTitle>
              <CardDescription>Check ATS compatibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">Response</h4>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  <code>{`{
  score: number (0-100),
  criticalIssues: Array<{ issue, fix }>,
  warnings: Array<{ issue, fix }>,
  passed: string[],
  keywordAnalysis: { ... }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>POST /api/generate-interview-questions</CardTitle>
              <CardDescription>Generate interview questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">Response</h4>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  <code>{`{
  questions: Array<{
    question: string,
    category: string,
    difficulty: "Easy" | "Medium" | "Hard"
  }>
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">📁 File Structure</CardTitle>
            <CardDescription>Project organization and key directories</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
              <code>{`job-application-assistant/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze-resume/route.ts
│   │   │   ├── generate-cover-letter/route.ts
│   │   │   ├── ats-check/route.ts
│   │   │   ├── generate-interview-questions/route.ts
│   │   │   └── evaluate-answer/route.ts
│   │   ├── resume-analysis/page.tsx
│   │   ├── cover-letter/page.tsx
│   │   ├── ats-optimization/page.tsx
│   │   ├── interview-prep/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/ (40+ shadcn components)
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── ai-service.ts
│   │   │   ├── ai-factory.ts
│   │   │   └── providers/
│   │   │       ├── groq-provider.ts
│   │   │       └── gemini-provider.ts
│   │   └── utils.ts
│   └── hooks/
│       └── use-mobile.tsx
├── public/
├── .env.local
├── package.json
├── tsconfig.json
└── README.md`}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Deployment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🚀 Deployment</CardTitle>
            <CardDescription>Deploy to Vercel in minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">1. Push to GitHub</h4>
                <pre className="bg-muted p-3 rounded text-sm">
                  <code>{`git add .
git commit -m "Ready for deployment"
git push origin main`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Import to Vercel</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a></li>
                  <li>Click "New Project"</li>
                  <li>Import your GitHub repository</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Configure Environment Variables</h4>
                <p className="text-sm text-muted-foreground mb-2">Add in Vercel dashboard:</p>
                <pre className="bg-muted p-3 rounded text-sm">
                  <code>{`GROQ_API_KEY=your_production_key
GEMINI_API_KEY=your_backup_key`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Deploy</h4>
                <p className="text-sm text-muted-foreground">Click "Deploy" and wait for build to complete. Your app is live!</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Other Platforms</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 border rounded">
                  <h5 className="font-semibold text-sm mb-1">Netlify</h5>
                  <p className="text-xs text-muted-foreground">Similar process to Vercel</p>
                </div>
                <div className="p-3 border rounded">
                  <h5 className="font-semibold text-sm mb-1">Railway</h5>
                  <p className="text-xs text-muted-foreground">Connect GitHub and deploy</p>
                </div>
                <div className="p-3 border rounded">
                  <h5 className="font-semibold text-sm mb-1">Self-Hosted</h5>
                  <p className="text-xs text-muted-foreground">npm run build && npm start</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🧪 Testing</CardTitle>
            <CardDescription>Manual testing checklist for all features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Resume Analyzer</h4>
                <div className="space-y-1 text-sm">
                  {[
                    'Upload PDF resume',
                    'Upload DOCX resume',
                    'Upload TXT resume',
                    'Try non-resume file',
                    'Check scores display',
                    'Verify suggestions',
                    'Test dark/light mode'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Cover Letter Generator</h4>
                <div className="space-y-1 text-sm">
                  {[
                    'Upload resume',
                    'Verify AI suggestions',
                    'Select position',
                    'Add company details',
                    'Generate letter',
                    'Download DOCX',
                    'Copy to clipboard'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">ATS Optimization</h4>
                <div className="space-y-1 text-sm">
                  {[
                    'Upload resume',
                    'Add job description',
                    'Verify score',
                    'Check issue categories',
                    'Verify keyword analysis'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Interview Preparation</h4>
                <div className="space-y-1 text-sm">
                  {[
                    'Upload resume',
                    'Add job description',
                    'Select interview type',
                    'Test voice recording',
                    'Verify text accumulation',
                    'Submit answer',
                    'Check feedback'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Browser Compatibility</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-500">Chrome ✓</Badge>
                <Badge className="bg-green-500">Edge ✓</Badge>
                <Badge className="bg-green-500">Safari ✓</Badge>
                <Badge variant="outline">Firefox (Limited voice)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Enhancements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🔮 Future Enhancements</CardTitle>
            <CardDescription>Planned features and improvements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Planned Features</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-semibold mb-2">Job Search Integration</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Search jobs from multiple boards</li>
                    <li>• Filter by location, salary, experience</li>
                    <li>• Save favorite jobs</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h5 className="font-semibold mb-2">Application Tracking</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Track all applications</li>
                    <li>• Set reminders for follow-ups</li>
                    <li>• View application status</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h5 className="font-semibold mb-2">Salary Negotiation Tool</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Research salary ranges</li>
                    <li>• Generate negotiation scripts</li>
                    <li>• Track offers</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h5 className="font-semibold mb-2">LinkedIn Integration</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Import profile data</li>
                    <li>• Sync with resume</li>
                    <li>• Auto-apply to jobs</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h5 className="font-semibold mb-2">Email Templates</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Follow-up emails</li>
                    <li>• Thank you notes</li>
                    <li>• Networking messages</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h5 className="font-semibold mb-2">Analytics Dashboard</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Application success rate</li>
                    <li>• Interview conversion rate</li>
                    <li>• Time to hire metrics</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Technical Improvements</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { title: 'Database Integration', desc: 'Save user data and history' },
                  { title: 'Authentication', desc: 'User accounts and OAuth' },
                  { title: 'Payment Integration', desc: 'Premium features and subscriptions' },
                  { title: 'Advanced AI Features', desc: 'Multi-language support, skill gap analysis' },
                  { title: 'Mobile App', desc: 'Native iOS/Android apps' },
                  { title: 'Performance Optimization', desc: 'Caching, lazy loading, code splitting' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-sm">{item.title}</span>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">📊 Performance Metrics</CardTitle>
            <CardDescription>Current performance benchmarks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Resume Analysis</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Upload</span>
                    <span className="font-semibold">Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Text Extraction</span>
                    <span className="font-semibold">1-2 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AI Analysis</span>
                    <span className="font-semibold">2-3 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">Total</span>
                    <Badge>4-6 seconds</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Cover Letter Generation</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resume Analysis</span>
                    <span className="font-semibold">2-3 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Letter Generation</span>
                    <span className="font-semibold">3-5 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">Total</span>
                    <Badge>5-8 seconds</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">ATS Check</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Text Extraction</span>
                    <span className="font-semibold">1-2 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ATS Analysis</span>
                    <span className="font-semibold">2-3 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-semibold">Total</span>
                    <Badge>3-5 seconds</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Interview Prep</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Question Generation</span>
                    <span className="font-semibold">3-5 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Answer Evaluation</span>
                    <span className="font-semibold">2-3 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Voice Recognition</span>
                    <Badge className="bg-green-500">Real-time</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2 py-8">
          <p className="text-lg font-semibold">Built with ❤️ using Next.js, TypeScript, and AI</p>
          <p className="text-sm text-muted-foreground">Last Updated: February 2026</p>
        </div>
      </main>
    </div>
  );
}
