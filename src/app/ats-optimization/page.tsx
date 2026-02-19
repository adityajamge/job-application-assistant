'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Loader2,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

interface ATSIssue {
  issue: string;
  fix: string;
}

interface KeywordAnalysis {
  matchedKeywords: string[];
  missingKeywords: string[];
  matchRate: number;
}

interface ATSResults {
  score: number;
  criticalIssues: ATSIssue[];
  warnings: ATSIssue[];
  passed: string[];
  keywordAnalysis: KeywordAnalysis | null;
}

export default function ATSOptimization() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ATSResults | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume file');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription);
      }

      const response = await fetch('/api/ats-check', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 container py-12 mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ATS Compatibility Checker
            </h1>
            <p className="text-xl text-muted-foreground">
              Ensure your resume passes Applicant Tracking Systems
            </p>
          </div>

          {/* Upload Section */}
          <Card className="border-2">
            <CardContent className="p-8">
              {/* File Upload */}
              <div>
                <label
                  htmlFor="resume-upload"
                  className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl p-12 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="w-16 h-16 mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    {file ? file.name : "Drop your resume here"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    or click to browse (PDF, DOCX, TXT - Max 5MB)
                  </p>
                  <Button asChild>
                    <span>
                      <FileText className="w-4 h-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                  <input
                    id="resume-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {/* Job Description (Optional) */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  Job Description (Optional)
                </label>
                <Textarea
                  placeholder="Paste the job description here for keyword matching analysis..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Adding a job description helps identify missing keywords
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Analyze Button */}
              {file && (
                <div className="mt-6 flex gap-4">
                  <Button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="flex-1"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analyze ATS Compatibility
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setJobDescription('');
                      setResults(null);
                      setError('');
                    }}
                    variant="outline"
                    size="lg"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          {!results && (
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="p-6">
                  <CheckCircle2 className="w-8 h-8 mb-3 text-green-500" />
                  <h3 className="font-semibold mb-2">ATS Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Get a compatibility score from 0-100
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <AlertTriangle className="w-8 h-8 mb-3 text-yellow-500" />
                  <h3 className="font-semibold mb-2">Issue Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Identify critical issues and warnings
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <FileText className="w-8 h-8 mb-3 text-blue-500" />
                  <h3 className="font-semibold mb-2">Keyword Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    Compare your resume with job descriptions
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
            {/* Score Card */}
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
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - results.score / 100)}`}
                        className={getScoreColor(results.score)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold">{results.score}</div>
                        <div className="text-sm text-muted-foreground">/ 100</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <Badge
                      variant={
                        results.score >= 80
                          ? "default"
                          : results.score >= 60
                          ? "secondary"
                          : "destructive"
                      }
                      className="mb-3"
                    >
                      {getScoreLabel(results.score)}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">ATS Compatibility Score</h2>
                    <p className="text-muted-foreground">
                      Your resume has been analyzed for ATS compatibility
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setJobDescription('');
                      setResults(null);
                      setError('');
                    }}
                    variant="outline"
                  >
                    Analyze Another
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Critical Issues */}
            {results.criticalIssues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Critical Issues ({results.criticalIssues.length})
                  </CardTitle>
                  <CardDescription>
                    These issues may cause your resume to be rejected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.criticalIssues.map((item, index) => (
                      <div key={index} className="p-4 border-l-4 border-red-500 bg-card rounded">
                        <p className="font-medium mb-1">
                          {item.issue}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Fix:</span> {item.fix}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {results.warnings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Warnings ({results.warnings.length})
                  </CardTitle>
                  <CardDescription>
                    These issues may reduce your ranking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.warnings.map((item, index) => (
                      <div key={index} className="p-4 border-l-4 border-yellow-500 bg-card rounded">
                        <p className="font-medium mb-1">
                          {item.issue}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Fix:</span> {item.fix}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Passed Checks */}
            {results.passed.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Passed Checks ({results.passed.length})
                  </CardTitle>
                  <CardDescription>
                    These aspects are ATS-friendly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.passed.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border-l-4 border-green-500 bg-card rounded">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Keyword Analysis */}
            {results.keywordAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Analysis</CardTitle>
                  <CardDescription>
                    Comparison with job description
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Match Rate</span>
                      <span className="text-sm font-bold">{results.keywordAnalysis.matchRate}%</span>
                    </div>
                    <Progress value={results.keywordAnalysis.matchRate} className="h-2" />
                  </div>

                  {results.keywordAnalysis.matchedKeywords.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-3">Matched Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {results.keywordAnalysis.matchedKeywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.keywordAnalysis.missingKeywords.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-3">Missing Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {results.keywordAnalysis.missingKeywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="border-red-500 text-red-700 dark:text-red-400">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        Consider adding these keywords naturally to your resume
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
