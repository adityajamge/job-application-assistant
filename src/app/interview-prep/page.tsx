"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Volume2, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
}

interface InterviewSession {
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  userAnswers: string[];
  feedback: string[];
}

interface InterviewType {
  type: string;
  description: string;
  relevance: string;
  skillsToTest: string[];
}

interface InterviewTypeAnalysis {
  availableTypes: InterviewType[];
  recommendedType: string;
  candidateLevel: string;
  primarySkills: string[];
}

export default function InterviewPrepPage() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // NEW: Interview type selection
  const [interviewTypes, setInterviewTypes] = useState<InterviewTypeAnalysis | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");
  
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [accumulatedTranscript, setAccumulatedTranscript] = useState(""); // NEW: Store all accumulated text
  const [speechSupported, setSpeechSupported] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [displayedFeedback, setDisplayedFeedback] = useState("");
  const [isTypingFeedback, setIsTypingFeedback] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>(""); // NEW: Track finalized text

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setError("Your browser doesn't support voice recognition. Please use Chrome, Edge, or Safari.");
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!speechSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Accumulate final transcripts
      if (finalTranscript) {
        finalTranscriptRef.current += finalTranscript;
        setAccumulatedTranscript(finalTranscriptRef.current);
      }
      
      // Show interim + accumulated
      setCurrentTranscript(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'no-speech') {
        // Don't stop on no-speech, just continue
        return;
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (isListening) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [speechSupported, isListening]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setError("");
    setLoading(true);

    try {
      // Send file to backend for parsing
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/extract-resume-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const data = await response.json();
      
      // Store the parsed text
      setResumeText(data.text);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to read resume file');
      setLoading(false);
    }
  };

  const analyzeInterviewTypes = async () => {
    if (!resumeText) {
      setError("Please upload your resume first");
      return;
    }

    // Frontend content validation
    const jobDesc = jobDescription.toLowerCase();
    const bannedKeywords = [
      'terrorist', 'terrorism', 'bomb', 'explosive', 'weapon', 'attack', 'kill',
      'murder', 'illegal', 'drug', 'trafficking', 'hack', 'fraud', 'scam',
      'violence', 'extremist', 'radical', 'jihad', 'isis', 'al-qaeda', 'bin laden'
    ];
    
    const containsBannedContent = bannedKeywords.some(keyword => jobDesc.includes(keyword));
    
    if (containsBannedContent) {
      setError("This job description contains inappropriate or illegal content. Please provide a legitimate job description for a legal profession.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze-interview-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDescription || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze interview types");
      }

      const data = await response.json();
      setInterviewTypes(data);
      setSelectedType(data.recommendedType); // Pre-select recommended type
      setStep(2); // Move to interview type selection
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    if (!selectedType) {
      setError("Please select an interview type");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDescription || undefined,
          interviewType: selectedType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate questions");
      }

      const data = await response.json();
      setSession({
        questions: data.questions,
        currentQuestionIndex: 0,
        userAnswers: [],
        feedback: [],
      });
      setStep(3); // Move to interview session
      
      // Speak first question with typing animation
      setTimeout(() => speakQuestion(data.questions[0].question, true), 500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const speakQuestion = async (text: string, withTyping: boolean = false): Promise<void> => {
    // Stop listening when AI starts speaking
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSpeaking(true);

    try {
      // Call ElevenLabs API first to get audio
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const data = await response.json();
      
      // Convert base64 to audio
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
        { type: data.contentType }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Get audio duration
      await new Promise<void>((resolve) => {
        audio.addEventListener('loadedmetadata', () => resolve(), { once: true });
        audio.load();
      });

      const audioDuration = audio.duration * 1000; // Convert to milliseconds

      // Show typing animation synced with audio duration if requested
      if (withTyping) {
        // Calculate delay per character (reduce 4 seconds from audio duration for faster typing)
        const adjustedDuration = Math.max(audioDuration - 4000, 1000); // Minimum 1 second
        const delayPerChar = adjustedDuration / text.length;
        
        setIsTyping(true);
        setDisplayedQuestion("");
        
        // Start typing animation
        const typingPromise = (async () => {
          for (let i = 0; i <= text.length; i++) {
            setDisplayedQuestion(text.slice(0, i));
            await new Promise(resolve => setTimeout(resolve, delayPerChar));
          }
          setIsTyping(false);
        })();

        // Start audio playback immediately
        const audioPromise = new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
            resolve();
          };
          
          audio.onerror = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
            reject(new Error("Audio playback failed"));
          };
          
          audio.play().catch(reject);
        });

        // Wait for both typing and audio to complete
        await Promise.all([typingPromise, audioPromise]);
      } else {
        // No typing animation - just show text and play audio
        setDisplayedQuestion(text);
        
        await new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
            resolve();
          };
          
          audio.onerror = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
            reject(new Error("Audio playback failed"));
          };
          
          audio.play().catch(reject);
        });
      }
      
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
      setIsTyping(false);
      setDisplayedQuestion(text); // Show full text on error
      // Fallback to browser TTS if ElevenLabs fails
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        
        await new Promise<void>((resolve) => {
          utterance.onend = () => {
            setIsSpeaking(false);
            resolve();
          };
          window.speechSynthesis.speak(utterance);
        });
      }
    }
  };

  const speakFeedback = async (text: string): Promise<void> => {
    // Stop listening when AI starts speaking feedback
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSpeaking(true);

    try {
      // Call ElevenLabs API first to get audio
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const data = await response.json();
      
      // Convert base64 to audio
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
        { type: data.contentType }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Get audio duration
      await new Promise<void>((resolve) => {
        audio.addEventListener('loadedmetadata', () => resolve(), { once: true });
        audio.load();
      });

      const audioDuration = audio.duration * 1000;

      // Calculate delay per character (reduce 4 seconds from audio duration for faster typing)
      const adjustedDuration = Math.max(audioDuration - 4000, 1000);
      const delayPerChar = adjustedDuration / text.length;
      
      setIsTypingFeedback(true);
      setDisplayedFeedback("");
      
      // Start typing animation
      const typingPromise = (async () => {
        for (let i = 0; i <= text.length; i++) {
          setDisplayedFeedback(text.slice(0, i));
          await new Promise(resolve => setTimeout(resolve, delayPerChar));
        }
        setIsTypingFeedback(false);
      })();

      // Start audio playback immediately
      const audioPromise = new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          reject(new Error("Audio playback failed"));
        };
        
        audio.play().catch(reject);
      });

      // Wait for both typing and audio to complete
      await Promise.all([typingPromise, audioPromise]);
      
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
      setIsTypingFeedback(false);
      setDisplayedFeedback(text);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    // Prevent toggling mic while AI is speaking
    if (isSpeaking) {
      setError("Please wait for the AI to finish speaking");
      setTimeout(() => setError(""), 2000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(""); // Clear any previous errors
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start recognition:", e);
        setError("Failed to start voice recognition");
      }
    }
  };

  const clearTranscript = () => {
    setCurrentTranscript("");
    setAccumulatedTranscript("");
    finalTranscriptRef.current = "";
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const submitAnswer = async () => {
    if (!session || !currentTranscript.trim()) {
      setError("Please provide an answer first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentQuestion = session.questions[session.currentQuestionIndex];
      
      const response = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: currentTranscript,
          resumeText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to evaluate answer");
      }

      const data = await response.json();
      
      // Update session with answer and feedback
      const newAnswers = [...session.userAnswers, currentTranscript];
      const newFeedback = [...session.feedback, data.feedback];
      
      setSession({
        ...session,
        userAnswers: newAnswers,
        feedback: newFeedback,
      });

      // Clear all transcript data
      setCurrentTranscript("");
      setAccumulatedTranscript("");
      finalTranscriptRef.current = "";
      
      // Show feedback with fade-in animation
      setShowFeedback(true);
      setCurrentFeedback(data.feedback);
      setDisplayedFeedback(""); // Clear any previous feedback text
      
      // Speak feedback with typing animation and wait for it to complete
      await speakFeedback(data.feedback);
      
      // Wait a bit after feedback finishes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fade out feedback
      setIsTransitioning(true);
      setDisplayedFeedback(""); // Clear feedback text during transition
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setShowFeedback(false);
      setCurrentFeedback("");
      
      // Move to next question or finish
      if (session.currentQuestionIndex + 1 < session.questions.length) {
        // Clear previous question text before updating
        setDisplayedQuestion("");
        
        // Update to next question
        setSession({
          ...session,
          userAnswers: newAnswers,
          feedback: newFeedback,
          currentQuestionIndex: session.currentQuestionIndex + 1,
        });
        
        // Fade in next question
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsTransitioning(false);
        
        const nextQuestion = session.questions[session.currentQuestionIndex + 1];
        await speakQuestion(nextQuestion.question, true); // With typing animation
      } else {
        setStep(4); // Interview complete
      }

      // Clear all transcript data again (in case)
      setCurrentTranscript("");
      setAccumulatedTranscript("");
      finalTranscriptRef.current = "";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const skipQuestion = async () => {
    if (!session) return;

    const newAnswers = [...session.userAnswers, ""];
    const newFeedback = [...session.feedback, "Skipped"];
    
    setSession({
      ...session,
      userAnswers: newAnswers,
      feedback: newFeedback,
    });

    // Clear all transcript data
    setCurrentTranscript("");
    setAccumulatedTranscript("");
    finalTranscriptRef.current = "";
    
    // Fade out current question
    setIsTransitioning(true);
    setDisplayedQuestion(""); // Clear question text during transition
    await new Promise(resolve => setTimeout(resolve, 500));

    if (session.currentQuestionIndex + 1 < session.questions.length) {
      // Update to next question
      setSession({
        ...session,
        userAnswers: newAnswers,
        feedback: newFeedback,
        currentQuestionIndex: session.currentQuestionIndex + 1,
      });
      
      // Fade in next question
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsTransitioning(false);
      
      const nextQuestion = session.questions[session.currentQuestionIndex + 1];
      await speakQuestion(nextQuestion.question, true); // With typing animation
    } else {
      setStep(4);
    }
  };

  const restartInterview = () => {
    setStep(1);
    setSession(null);
    setCurrentTranscript("");
    setAccumulatedTranscript("");
    finalTranscriptRef.current = "";
    setResumeFile(null);
    setResumeText("");
    setJobDescription("");
    setInterviewTypes(null);
    setSelectedType("");
    setIsSpeaking(false);
    setShowFeedback(false);
    setCurrentFeedback("");
    setIsTransitioning(false);
    setIsTyping(false);
    setDisplayedQuestion("");
    setDisplayedFeedback("");
    setIsTypingFeedback(false);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Step 1: Upload Resume
  if (step === 1) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Voice Interview Preparation</h1>
            <p className="text-muted-foreground text-lg">
              Practice interviews with AI-powered voice interaction
            </p>
          </div>

          {!speechSupported && (
            <Alert className="mb-6 border-destructive">
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Step 1: Upload Your Resume</CardTitle>
              <CardDescription>
                Upload your resume to generate personalized interview questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="resume">Resume (PDF, DOCX, or TXT)</Label>
                <div className="mt-2">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => document.getElementById("resume")?.click()}
                    variant="outline"
                    className="w-full"
                    disabled={loading || !speechSupported}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {resumeFile ? resumeFile.name : "Choose File"}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="jobDescription">Job Description (Optional)</Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the job description here for more targeted questions..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  className="mt-2"
                  disabled={loading || !speechSupported}
                />
              </div>

              {error && (
                <Alert className="border-destructive">
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={analyzeInterviewTypes}
                className="w-full"
                size="lg"
                disabled={!resumeFile || loading || !speechSupported}
              >
                {loading ? "Analyzing Resume..." : "Analyze & Continue"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Select Interview Type
  if (step === 2 && interviewTypes) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Select Interview Type</h1>
            <p className="text-muted-foreground text-lg">
              Based on your {interviewTypes.candidateLevel} level resume, choose the type of interview you want to practice
            </p>
          </div>

          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⭐</span>
                <h3 className="text-lg font-semibold">Recommended: {interviewTypes.recommendedType}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Primary Skills: {interviewTypes.primarySkills.join(", ")}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4 mb-6">
            {interviewTypes.availableTypes.map((type) => (
              <Card 
                key={type.type}
                className={`cursor-pointer transition-all ${
                  selectedType === type.type 
                    ? "border-primary border-2 bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedType(type.type)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <input
                          type="radio"
                          checked={selectedType === type.type}
                          onChange={() => setSelectedType(type.type)}
                          className="w-4 h-4"
                        />
                        {type.type} Interview
                      </CardTitle>
                      <CardDescription className="mt-2">{type.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Relevance:</Label>
                      <p className="text-sm text-muted-foreground mt-1">{type.relevance}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Skills to Test:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {type.skillsToTest.map((skill) => (
                          <span 
                            key={skill}
                            className="px-2 py-1 bg-muted rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {error && (
            <Alert className="mb-6 border-destructive">
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={() => setStep(1)} 
              variant="outline"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={startInterview}
              className="flex-1"
              size="lg"
              disabled={!selectedType || loading}
            >
              {loading ? "Generating Questions..." : `Start ${selectedType} Interview`}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Interview Session
  if (step === 3 && session) {
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

    return (
      <div className="min-h-screen bg-[#202124] flex flex-col">
        {/* Top Bar */}
        <div className="bg-[#202124] px-4 py-3 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-sm font-medium">AI Interview Session</h1>
            <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded font-medium">
              REC
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">
              Question {session.currentQuestionIndex + 1} of {session.questions.length}
            </span>
            <span className="text-white font-medium">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 relative flex items-center justify-center p-4">
          {/* AI Interviewer Video */}
          <div className="relative w-full max-w-6xl h-[calc(100vh-200px)] bg-[#1a1a1a] rounded-lg overflow-hidden">
            {/* Simple dark background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>

            {/* AI Avatar */}
            <div className="relative h-full flex flex-col items-center justify-center">
              <div className="relative mb-6">
                {/* Speaking animation rings */}
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 -m-4 rounded-full border-2 border-blue-500 animate-ping opacity-75"></div>
                    <div className="absolute inset-0 -m-8 rounded-full border-2 border-blue-500 animate-ping opacity-50" style={{ animationDelay: '0.2s' }}></div>
                  </>
                )}
                
                {/* Avatar circle */}
                <div className={`relative w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center transition-all ${isSpeaking ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}`}>
                  <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
              </div>

              <h2 className="text-white text-xl font-medium mb-1">AI Interviewer</h2>
              <p className="text-gray-400 text-sm mb-8">{currentQuestion.category} • {currentQuestion.difficulty}</p>

              {/* Question or Feedback Display with Transitions */}
              <div className="w-full max-w-3xl mx-4">
                {showFeedback ? (
                  // Feedback Display
                  <div className={`bg-green-900/30 border border-green-700/50 rounded-lg p-6 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-green-400 font-medium mb-2">Feedback</h3>
                        <p className="text-white text-base leading-relaxed">
                          {displayedFeedback}
                          {isTypingFeedback && <span className="inline-block w-1 h-5 bg-green-500 ml-1 animate-pulse"></span>}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Question Display
                  <div className={`bg-[#2d2d2d] rounded-lg p-6 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                    <p className="text-white text-lg leading-relaxed text-center">
                      {displayedQuestion}
                      {isTyping && <span className="inline-block w-1 h-5 bg-blue-500 ml-1 animate-pulse"></span>}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="mt-6 flex items-center gap-2">
                {isSpeaking ? (
                  <>
                    <Volume2 className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">AI is speaking...</span>
                  </>
                ) : isListening ? (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-300 text-sm">Recording...</span>
                  </>
                ) : showFeedback ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Processing feedback...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                    </svg>
                    <span className="text-gray-400 text-sm">Ready for your answer</span>
                  </>
                )}
              </div>
            </div>

            {/* Your Answer - Picture-in-Picture */}
            {currentTranscript && (
              <div className="absolute bottom-4 right-4 w-80 bg-[#2d2d2d] rounded-lg p-4 shadow-2xl border border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-medium">You</span>
                    </div>
                    <span className="text-gray-400 text-xs">Your Answer</span>
                  </div>
                  <Button
                    onClick={clearTranscript}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-gray-400 hover:text-white"
                  >
                    Clear
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{currentTranscript}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Control Bar - Google Meet Style */}
        <div className="bg-[#202124] border-t border-gray-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left - Meeting Info */}
            <div className="flex items-center gap-2 min-w-[200px]">
              <div className="text-gray-400 text-xs">
                <div className="font-medium text-white">Interview in progress</div>
                <div>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>

            {/* Center - Main Controls */}
            <div className="flex items-center gap-3">
              {/* Mic Button */}
              <button
                onClick={toggleListening}
                disabled={isSpeaking}
                className={`relative group ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : isSpeaking
                    ? 'bg-[#3c4043]'
                    : 'bg-[#3c4043] hover:bg-[#4d5156]'
                }`}>
                  {isListening ? (
                    // Recording - show mic with sound waves
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                  ) : (
                    // Muted - show mic off (both when AI speaking or ready)
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                    </svg>
                  )}
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-gray-400">
                    {isListening ? 'Stop recording' : isSpeaking ? 'Microphone muted' : 'Click to record'}
                  </span>
                </div>
              </button>

              {/* End Call Button */}
              <button
                onClick={restartInterview}
                className="relative group"
              >
                <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
                  </svg>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-gray-400">End interview</span>
                </div>
              </button>

              {/* More Options */}
              <button
                onClick={() => speakQuestion(currentQuestion.question)}
                disabled={isSpeaking}
                className={`relative group ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="w-14 h-14 rounded-full bg-[#3c4043] hover:bg-[#4d5156] flex items-center justify-center transition-all">
                  <Volume2 className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-gray-400">Repeat question</span>
                </div>
              </button>
            </div>

            {/* Right - Action Buttons */}
            <div className="flex items-center gap-3 min-w-[200px] justify-end">
              <Button
                onClick={submitAnswer}
                disabled={!currentTranscript.trim() || loading || isSpeaking}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {loading ? "Evaluating..." : "Submit Answer"}
              </Button>
              <Button
                onClick={skipQuestion}
                variant="outline"
                disabled={loading || isSpeaking}
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-[#3c4043] hover:text-white"
              >
                Skip
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-7xl mx-auto mt-3">
              <Alert className="bg-red-900/20 border-red-700/50">
                <AlertDescription className="text-red-300 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 4: Interview Complete
  if (step === 4 && session) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Interview Complete!</h1>
            <p className="text-muted-foreground text-lg">
              Here's your performance summary
            </p>
          </div>

          <div className="space-y-6">
            {session.questions.map((question, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {index + 1}: {question.category}
                  </CardTitle>
                  <CardDescription>{question.question}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Your Answer:</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {session.userAnswers[index] || "Skipped"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Feedback:</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {session.feedback[index]}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Button onClick={restartInterview} className="flex-1">
              Start New Interview
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
