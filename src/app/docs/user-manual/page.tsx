"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Download, FileText, Mail, Target, Mic, AlertCircle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Header } from '@/components/header';

export default function UserManual() {
  const handleDownload = () => {
    const content = `# Job Application Assistant - User Manual

## 📖 Welcome!

This guide will help you get the most out of the Job Application Assistant platform.

## 🎯 Quick Start

### What Can This Platform Do?

1. **Analyze Your Resume** - Get instant feedback with scores and suggestions
2. **Generate Cover Letters** - Create personalized cover letters in seconds
3. **Check ATS Compatibility** - Ensure your resume passes automated systems
4. **Practice Interviews** - Prepare with AI-generated questions and feedback

## 📄 Feature 1: Resume Analyzer

### How to Use
1. Navigate to Resume Analyzer
2. Upload your resume (PDF, DOCX, TXT - max 5MB)
3. Wait for analysis (4-6 seconds)
4. Review your results and feedback

### Understanding Your Scores
- **90-100 (Excellent)**: Resume is highly competitive, ready to apply
- **70-89 (Good)**: Solid resume, some improvements recommended
- **50-69 (Needs Improvement)**: Several issues to address
- **Below 50 (Poor)**: Significant improvements needed

## ✉️ Feature 2: Cover Letter Generator

### How to Use
1. Navigate to Cover Letter Generator
2. Upload your resume
3. Select position from AI suggestions or enter custom
4. Add company details (optional)
5. Choose tone (Professional/Enthusiastic/Formal)
6. Generate and download letter

## 🎯 Feature 3: ATS Optimization

### How to Use
1. Navigate to ATS Optimization
2. Upload your resume
3. Add job description (optional)
4. Analyze ATS compatibility
5. Review score and issues
6. Implement suggested fixes

### Understanding ATS Scores
- **80-100 (Excellent)**: Will pass most ATS systems
- **60-79 (Good)**: Will pass many ATS systems
- **40-59 (Fair)**: May not pass all ATS systems
- **Below 40 (Poor)**: Likely to be rejected

## 🎤 Feature 4: Interview Preparation

### How to Use
1. Navigate to Interview Prep
2. Upload your resume
3. Add job description (optional)
4. Select interview type
5. Practice with AI-generated questions
6. Record answers via voice
7. Receive instant feedback

## ❓ Troubleshooting

### Common Issues
- **"Failed to analyze resume"**: Check file format and size
- **"This doesn't appear to be a resume"**: Upload actual resume/CV
- **Voice recording not working**: Use Chrome, Edge, or Safari

## 💡 Best Practices

### For Resume Analysis
1. Upload latest version
2. Review all feedback
3. Make improvements
4. Iterate and refine

### For Cover Letters
1. Provide context
2. Choose right tone
3. Customize generated letter
4. Proofread carefully

**Good luck with your job search! 🎯**`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'USER_MANUAL.md';
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
          <h1 className="text-4xl font-bold tracking-tight">User Manual</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know to get the most out of Job Application Assistant
          </p>
        </div>

        {/* Quick Start */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">🎯 Quick Start</CardTitle>
            <CardDescription>What can this platform do for you?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <FileText className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Analyze Your Resume</h4>
                  <p className="text-sm text-muted-foreground">Get instant feedback with scores and suggestions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Mail className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Generate Cover Letters</h4>
                  <p className="text-sm text-muted-foreground">Create personalized cover letters in seconds</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Target className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Check ATS Compatibility</h4>
                  <p className="text-sm text-muted-foreground">Ensure your resume passes automated systems</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Mic className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Practice Interviews</h4>
                  <p className="text-sm text-muted-foreground">Prepare with AI-generated questions and feedback</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Analyzer */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Resume Analyzer
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { step: '1', title: 'Navigate to Resume Analyzer', desc: 'Click "AI Resume Analysis" on the homepage' },
                  { step: '2', title: 'Upload Your Resume', desc: 'Supported formats: PDF, DOCX, TXT (max 5MB)' },
                  { step: '3', title: 'Wait for Analysis', desc: 'Takes 4-6 seconds, AI validates and analyzes content' },
                  { step: '4', title: 'Review Your Results', desc: 'Check scores, feedback, and suggestions' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Understanding Your Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">90-100</Badge>
                  <span className="font-semibold">Excellent</span>
                </div>
                <p className="text-sm">Resume is highly competitive, minor tweaks needed, ready to apply</p>
              </div>

              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-500">70-89</Badge>
                  <span className="font-semibold">Good</span>
                </div>
                <p className="text-sm">Solid resume, some improvements recommended, will pass most ATS systems</p>
              </div>

              <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-yellow-500">50-69</Badge>
                  <span className="font-semibold">Needs Improvement</span>
                </div>
                <p className="text-sm">Several issues to address, may not pass all ATS systems</p>
              </div>

              <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-red-500">Below 50</Badge>
                  <span className="font-semibold">Poor</span>
                </div>
                <p className="text-sm">Significant improvements needed, likely to be rejected by ATS</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cover Letter Generator */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Mail className="w-8 h-8" />
            Cover Letter Generator
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  'Navigate to Cover Letter Generator',
                  'Upload your resume',
                  'Select position from AI suggestions or enter custom',
                  'Add company details (optional)',
                  'Choose tone (Professional/Enthusiastic/Formal)',
                  'Generate and download letter'
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Provide a job description for more personalized cover letters that match the role requirements.
            </AlertDescription>
          </Alert>
        </div>

        {/* ATS Optimization */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Target className="w-8 h-8" />
            ATS Optimization
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  'Navigate to ATS Optimization',
                  'Upload your resume',
                  'Add job description (optional but recommended)',
                  'Click "Analyze ATS Compatibility"',
                  'Review score and categorized issues',
                  'Implement suggested fixes'
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Understanding ATS Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <Badge className="bg-green-500">80-100</Badge>
                  </div>
                  <p className="text-sm font-semibold mb-1">Excellent</p>
                  <p className="text-xs text-muted-foreground">Will pass most ATS systems, ready to submit</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <Badge className="bg-blue-500">60-79</Badge>
                  </div>
                  <p className="text-sm font-semibold mb-1">Good</p>
                  <p className="text-xs text-muted-foreground">Will pass many systems, address warnings</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <Badge className="bg-yellow-500">40-59</Badge>
                  </div>
                  <p className="text-sm font-semibold mb-1">Fair</p>
                  <p className="text-xs text-muted-foreground">May not pass all systems, fix critical issues</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <Badge className="bg-red-500">Below 40</Badge>
                  </div>
                  <p className="text-sm font-semibold mb-1">Poor</p>
                  <p className="text-xs text-muted-foreground">Likely to be rejected, major revisions needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interview Preparation */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Mic className="w-8 h-8" />
            Interview Preparation
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { title: 'Navigate to Interview Prep', icon: CheckCircle },
                  { title: 'Upload your resume', icon: CheckCircle },
                  { title: 'Add job description (optional)', icon: CheckCircle },
                  { title: 'Select interview type', icon: CheckCircle },
                  { title: 'Practice with AI-generated questions', icon: CheckCircle },
                  { title: 'Record answers via voice', icon: CheckCircle },
                  { title: 'Receive instant feedback', icon: CheckCircle }
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <Icon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{step.title}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Technical Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">For technical roles like coding and engineering</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Behavioral Interview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">For soft skills and past experiences</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">For architecture and design discussions</p>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Mic className="h-4 w-4" />
            <AlertDescription>
              <strong>Voice Recording:</strong> Use Chrome, Edge, or Safari for best results. Allow microphone access when prompted.
            </AlertDescription>
          </Alert>
        </div>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">❓ Troubleshooting</CardTitle>
            <CardDescription>Common issues and how to fix them</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-red-500">"Failed to analyze resume"</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Check file format (PDF, DOCX, TXT only)</li>
                  <li>• Ensure file size is under 5MB</li>
                  <li>• Make sure it's actually a resume</li>
                  <li>• Try a different file format</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-red-500">"This doesn't appear to be a resume"</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Upload an actual resume/CV document</li>
                  <li>• Not a cover letter or other document</li>
                  <li>• Must contain typical resume sections</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-red-500">Voice recording not working</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Use Chrome, Edge, or Safari browser</li>
                  <li>• Allow microphone access when prompted</li>
                  <li>• Check browser permissions in settings</li>
                  <li>• Try a different browser</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-red-500">Slow performance</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Check your internet connection</li>
                  <li>• Wait for AI processing (3-6 seconds)</li>
                  <li>• Refresh the page if stuck</li>
                  <li>• Try again later</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Lightbulb className="w-6 h-6" />
              Best Practices
            </CardTitle>
            <CardDescription>Tips to get the most out of the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">For Resume Analysis</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Upload your latest version',
                  'Review all feedback carefully',
                  'Fix critical issues first',
                  'Re-analyze after changes',
                  'Track score improvements',
                  'Keep refining iteratively'
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">For Cover Letters</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Provide job description',
                  'Include company name',
                  'Choose appropriate tone',
                  'Customize generated letter',
                  'Add personal touches',
                  'Proofread carefully'
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
