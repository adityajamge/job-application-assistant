"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, Loader2, ArrowLeft, ArrowRight, Download, Copy, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ResumeSuggestions {
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

interface CoverLetterResponse {
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

function CoverLetterContent() {
  const searchParams = useSearchParams();
  const fromResumeAnalyzer = searchParams.get("from") === "resume-analyzer";
  
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Step 2 data
  const [suggestions, setSuggestions] = useState<ResumeSuggestions | null>(null);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [customPosition, setCustomPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  // Step 3 data
  const [hasCompany, setHasCompany] = useState<string>("no");
  const [companyName, setCompanyName] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [tone, setTone] = useState("professional");
  
  // Step 4 data
  const [generatedLetter, setGeneratedLetter] = useState<CoverLetterResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-load resume from sessionStorage if coming from resume analyzer
  useEffect(() => {
    if (fromResumeAnalyzer) {
      const storedResume = sessionStorage.getItem('resumeFile');
      if (storedResume) {
        try {
          const resumeData = JSON.parse(storedResume);
          // Convert base64 back to File
          fetch(resumeData.data)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], resumeData.name, { type: resumeData.type });
              setFile(file);
              // Auto-analyze and skip to step 2
              analyzeResumeAuto(file);
            })
            .catch(err => {
              console.error('Failed to load resume:', err);
              setError('Failed to load resume. Please upload again.');
            });
        } catch (err) {
          console.error('Failed to parse resume data:', err);
        }
      }
    }
  }, [fromResumeAnalyzer]);

  const analyzeResumeAuto = async (resumeFile: File) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const response = await fetch("/api/analyze-resume-for-suggestions", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Analysis failed");
        setLoading(false);
        return;
      }

      setSuggestions(data);
      setStep(2);
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/analyze-resume-for-suggestions", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Analysis failed");
        return;
      }

      setSuggestions(data);
      setStep(2);
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position);
    setError(null);
  };

  const proceedToStep3 = () => {
    if (!selectedPosition && !customPosition) {
      setError("Please select a position or enter a custom one");
      return;
    }
    setStep(3);
  };

  const generateCoverLetter = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("position", selectedPosition === "custom" ? customPosition : selectedPosition);
    if (hasCompany === "yes" && companyName) {
      formData.append("companyName", companyName);
    }
    if (jobDescription) {
      formData.append("jobDescription", jobDescription);
    }
    if (hiringManager) {
      formData.append("hiringManager", hiringManager);
    }
    formData.append("tone", tone);

    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Generation failed");
        return;
      }

      setGeneratedLetter(data);
      setStep(4);
    } catch (err) {
      setError("Failed to generate cover letter. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadDOCX = async () => {
    if (!generatedLetter) return;

    try {
      const response = await fetch("/api/download-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatedLetter),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${generatedLetter.contactInfo.name.replace(/\s+/g, "_")}_Cover_Letter.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download. Please try again.");
    }
  };

  const copyToClipboard = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setStep(1);
    setFile(null);
    setSuggestions(null);
    setSelectedPosition("");
    setCustomPosition("");
    setJobDescription("");
    setHasCompany("no");
    setCompanyName("");
    setHiringManager("");
    setTone("professional");
    setGeneratedLetter(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 container py-12 mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Cover Letter Generator</h1>
            <p className="text-xl text-muted-foreground">
              Create professional cover letters in seconds with AI-powered suggestions
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s === step
                      ? "bg-primary text-primary-foreground"
                      : s < step
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-16 h-1 ${
                      s < step ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
              {error}
            </div>
          )}

          {/* Step 1: Upload Resume */}
          {step === 1 && (
            <Card className="border-2">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Step 1: Upload Your Resume</h2>
                <p className="text-muted-foreground mb-6">
                  Upload your resume and we'll analyze it to suggest suitable positions
                </p>

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

                {file && (
                  <div className="mt-6 flex gap-4">
                    <Button onClick={analyzeResume} disabled={loading} className="flex-1" size="lg">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <Button onClick={() => setFile(null)} variant="outline" size="lg">
                      Clear
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Position */}
          {step === 2 && suggestions && (
            <Card className="border-2">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Step 2: Select Position Type</h2>
                <p className="text-muted-foreground mb-6">
                  Based on your resume, we suggest these positions:
                </p>

                <div className="space-y-3 mb-6">
                  {suggestions.suggestedPositions.map((position) => (
                    <button
                      key={position}
                      onClick={() => handlePositionSelect(position)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedPosition === position
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold">{position}</div>
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePositionSelect("custom")}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedPosition === "custom"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold">Other: Enter job description</div>
                  </button>
                </div>

                {selectedPosition === "custom" && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="customPosition">Position Title</Label>
                      <Input
                        id="customPosition"
                        placeholder="e.g., Senior Software Engineer"
                        value={customPosition}
                        onChange={(e) => setCustomPosition(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobDescription">Job Description (Optional)</Label>
                      <Textarea
                        id="jobDescription"
                        placeholder="Paste the job description here..."
                        rows={6}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button onClick={() => setStep(1)} variant="outline" size="lg">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={proceedToStep3} className="flex-1" size="lg">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Company Details */}
          {step === 3 && (
            <Card className="border-2">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Step 3: Company Details</h2>
                <p className="text-muted-foreground mb-6">
                  Tell us about the company (optional but recommended)
                </p>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base mb-3 block">Do you have a specific company in mind?</Label>
                    <RadioGroup value={hasCompany} onValueChange={setHasCompany}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="cursor-pointer">Yes, I have a specific company</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="cursor-pointer">No, I want a general cover letter</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {hasCompany === "yes" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          placeholder="e.g., Google"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hiringManager">Hiring Manager Name (Optional)</Label>
                        <Input
                          id="hiringManager"
                          placeholder="e.g., Sarah Johnson"
                          value={hiringManager}
                          onChange={(e) => setHiringManager(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-base mb-3 block">Tone</Label>
                    <RadioGroup value={tone} onValueChange={setTone}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="professional" id="professional" />
                        <Label htmlFor="professional" className="cursor-pointer">Professional (Recommended)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enthusiastic" id="enthusiastic" />
                        <Label htmlFor="enthusiastic" className="cursor-pointer">Enthusiastic</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="formal" id="formal" />
                        <Label htmlFor="formal" className="cursor-pointer">Formal</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button onClick={() => setStep(2)} variant="outline" size="lg">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={generateCoverLetter} disabled={loading} className="flex-1" size="lg">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Cover Letter 🚀"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Generated Cover Letter */}
          {step === 4 && generatedLetter && (
            <div className="space-y-6">
              <Card className="border-2 border-green-500/20 bg-green-500/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <h2 className="text-2xl font-bold">Your Cover Letter is Ready!</h2>
                  </div>
                  <p className="text-muted-foreground">
                    Review your cover letter below. This is exactly how it will appear in the DOCX file.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="max-w-3xl mx-auto">
                    {/* Document Preview - Exactly as it will appear in DOCX */}
                    <div className="bg-white text-black p-12 rounded-lg shadow-lg font-serif">
                      {/* Header - Contact Info */}
                      <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-1">{generatedLetter.contactInfo.name.toUpperCase()}</h1>
                        {generatedLetter.contactInfo.location && (
                          <p className="text-sm">{generatedLetter.contactInfo.location}</p>
                        )}
                        {(generatedLetter.contactInfo.email || generatedLetter.contactInfo.phone) && (
                          <p className="text-sm">
                            {[generatedLetter.contactInfo.email, generatedLetter.contactInfo.phone]
                              .filter(Boolean)
                              .join(" | ")}
                          </p>
                        )}
                        {generatedLetter.contactInfo.linkedin && (
                          <p className="text-sm">LinkedIn: {generatedLetter.contactInfo.linkedin}</p>
                        )}
                      </div>

                      {/* Date */}
                      <div className="mb-6">
                        <p className="text-sm">{generatedLetter.date}</p>
                      </div>

                      {/* Recipient */}
                      <div className="mb-6">
                        <p className="text-sm">{generatedLetter.hiringManager || "Hiring Manager"}</p>
                        <p className="text-sm">{generatedLetter.companyName}</p>
                      </div>

                      {/* Cover Letter Body */}
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {generatedLetter.coverLetter}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-4">
                <Button onClick={downloadDOCX} size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download DOCX
                </Button>
                <Button onClick={copyToClipboard} variant="outline" size="lg">
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                <Button onClick={resetForm} variant="outline" size="lg">
                  Generate Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


export default function CoverLetterPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container py-12 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    }>
      <CoverLetterContent />
    </Suspense>
  );
}
