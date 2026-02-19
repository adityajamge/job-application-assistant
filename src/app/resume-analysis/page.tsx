"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, Loader2, CheckCircle2, XCircle, AlertCircle, Download, ArrowLeft, FileEdit, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AnalysisResult {
  overallScore: number;
  atsScore: number;
  formattingScore: number;
  contentScore: number;
  keywordScore: number;
  contactInfo: {
    status: string;
    items: { label: string; present: boolean; message: string }[];
  };
  structure: {
    status: string;
    items: { label: string; present: boolean; message: string }[];
  };
  content: {
    status: string;
    items: { label: string; present: boolean; message: string }[];
  };
  atsCompatibility: {
    status: string;
    items: { label: string; present: boolean; message: string }[];
  };
  suggestions: string[];
  quickWins: string[];
}

export default function ResumeAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF, DOCX, or TXT file");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const analyzeResume = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Show the exact error message from backend
        setError(data.error || "Analysis failed");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 container py-12 mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Resume Analyzer</h1>
            <p className="text-xl text-muted-foreground">
              Get instant feedback and ATS optimization suggestions
            </p>
          </div>

          {!result ? (
            <>
              {/* Upload Section */}
              <Card className="border-2">
                <CardContent className="p-8">
                  <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                      dragActive ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">
                      {file ? file.name : "Drop your resume here"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      or click to browse (PDF, DOCX, TXT - Max 5MB)
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileInput}
                    />
                    <label htmlFor="file-upload">
                      <Button asChild>
                        <span>
                          <FileText className="w-4 h-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </label>
                  </div>

                  {error && (
                    <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
                      {error}
                    </div>
                  )}

                  {file && !error && (
                    <div className="mt-6 flex gap-4">
                      <Button onClick={analyzeResume} disabled={analyzing} className="flex-1" size="lg">
                        {analyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Analyze Resume"
                        )}
                      </Button>
                      <Button onClick={resetAnalysis} variant="outline" size="lg">
                        Clear
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <Card>
                  <CardContent className="p-6">
                    <CheckCircle2 className="w-8 h-8 mb-3 text-green-500" />
                    <h3 className="font-semibold mb-2">ATS Optimization</h3>
                    <p className="text-sm text-muted-foreground">
                      Ensure your resume passes automated screening systems
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <CheckCircle2 className="w-8 h-8 mb-3 text-blue-500" />
                    <h3 className="font-semibold mb-2">Content Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Get feedback on structure, keywords, and impact
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <CheckCircle2 className="w-8 h-8 mb-3 text-purple-500" />
                    <h3 className="font-semibold mb-2">Actionable Tips</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive specific suggestions to improve your resume
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            /* Results Section */
            <div className="space-y-8">
              {/* Overall Score */}
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-40 h-40">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - result.overallScore / 100)}`}
                          className={
                            result.overallScore >= 80
                              ? "text-green-500"
                              : result.overallScore >= 60
                              ? "text-yellow-500"
                              : "text-red-500"
                          }
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold">{result.overallScore}</div>
                          <div className="text-sm text-muted-foreground">/ 100</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <Badge
                        variant={
                          result.overallScore >= 80
                            ? "default"
                            : result.overallScore >= 60
                            ? "secondary"
                            : "destructive"
                        }
                        className="mb-3"
                      >
                        {result.overallScore >= 80
                          ? "Excellent"
                          : result.overallScore >= 60
                          ? "Good"
                          : "Needs Improvement"}
                      </Badge>
                      <h2 className="text-3xl font-bold mb-2">Overall Resume Score</h2>
                      <p className="text-muted-foreground">
                        Your resume has been analyzed across multiple dimensions
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={resetAnalysis} variant="outline">
                        Analyze Another
                      </Button>
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ScoreCard title="ATS Score" score={result.atsScore} />
                <ScoreCard title="Formatting" score={result.formattingScore} />
                <ScoreCard title="Content" score={result.contentScore} />
                <ScoreCard title="Keywords" score={result.keywordScore} />
              </div>

              {/* Quick Wins */}
              {result.quickWins.length > 0 && (
                <Card className="border-2 border-green-500/20 bg-green-500/5">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Quick Wins
                    </h3>
                    <ul className="space-y-2">
                      {result.quickWins.map((win, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{win}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Analysis */}
              <div className="grid md:grid-cols-2 gap-6">
                <AnalysisSection title="Contact Information" data={result.contactInfo} />
                <AnalysisSection title="Structure & Formatting" data={result.structure} />
                <AnalysisSection title="Content Quality" data={result.content} />
                <AnalysisSection title="ATS Compatibility" data={result.atsCompatibility} />
              </div>

              {/* Suggestions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Improvement Suggestions</h3>
                  <Separator className="mb-4" />
                  <ul className="space-y-3">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-1">
                          {index + 1}
                        </Badge>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Next Steps - Generate Cover Letter */}
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <FileEdit className="w-5 h-5" />
                    Ready for the Next Step?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your resume looks good! Now generate a professional cover letter for your job applications.
                  </p>
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto"
                    onClick={() => {
                      // Store resume file in sessionStorage
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          sessionStorage.setItem('resumeFile', JSON.stringify({
                            name: file.name,
                            type: file.type,
                            data: reader.result
                          }));
                          window.location.href = '/cover-letter?from=resume-analyzer';
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  >
                    Generate Cover Letter
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ScoreCard({ title, score }: { title: string; score: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground mb-2">{title}</div>
        <div className="text-3xl font-bold mb-3">{score}/100</div>
        <Progress value={score} className="h-2" />
      </CardContent>
    </Card>
  );
}

function AnalysisSection({
  title,
  data,
}: {
  title: string;
  data: {
    status: string;
    items: { label: string; present: boolean; message: string }[];
  };
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-3">
          {data?.items?.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              {item.present ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : item.message.includes("recommended") || item.message.includes("consider") ? (
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.message}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
