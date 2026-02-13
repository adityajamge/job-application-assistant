# Interview Preparation - Complete Flow

## 🎯 Feature Overview

The Interview Preparation feature provides an AI-powered voice interview practice experience. Users can upload their resume, receive personalized interview questions, answer them using voice input, and get instant AI feedback.

---

## 📥 USER JOURNEY

### Step 1: Upload Resume & Start
**URL:** `/interview-prep`

**User Actions:**
1. Upload resume (PDF, DOCX, or TXT)
2. Optionally paste job description for targeted questions
3. Click "Start Interview"

**System Actions:**
- Extracts text from resume
- Sends to AI to generate 5 personalized interview questions
- Questions are based on:
  - Candidate's experience and skills
  - Job description (if provided)
  - Mix of technical, behavioral, and situational questions

---

### Step 2: Voice Interview Session

**User Experience:**
1. AI speaks the question aloud (text-to-speech)
2. User clicks microphone button to start recording
3. User answers the question verbally
4. Speech-to-text converts answer to text in real-time
5. User clicks "Submit Answer" or "Skip"
6. AI evaluates the answer and provides feedback
7. AI speaks the feedback aloud
8. Process repeats for all 5 questions

**Features:**
- 🎤 Voice input with real-time transcription
- 🔊 Text-to-speech for questions and feedback
- ⏭️ Skip option for difficult questions
- 🔄 Repeat button to hear question again
- 📊 Progress bar showing completion

---

### Step 3: Interview Complete

**Results Display:**
- Shows all 5 questions
- User's answer for each (or "Skipped")
- AI feedback for each answer
- Options to:
  - Start new interview
  - Return to home

---

## 🤖 AI PROCESSING

### Generate Interview Questions

**API Endpoint:** `POST /api/generate-interview-questions`

**Request:**
```json
{
  "resumeText": "Full resume text...",
  "jobDescription": "Optional job description..."
}
```

**AI Prompt:**
```
Generate 5 interview questions based on this resume and job description.

INSTRUCTIONS:
1. Generate 5 diverse interview questions
2. Mix technical and behavioral questions
3. Base questions on the candidate's experience and skills
4. Include questions about specific projects or achievements
5. Vary difficulty levels

Categories: Technical, Behavioral, Situational, Experience-Based, Problem-Solving
Difficulty: Easy, Medium, Hard
```

**Response:**
```json
{
  "questions": [
    {
      "question": "Tell me about a challenging project you worked on and how you overcame obstacles.",
      "category": "Experience-Based",
      "difficulty": "Medium"
    },
    {
      "question": "How would you approach debugging a performance issue in a React application?",
      "category": "Technical",
      "difficulty": "Hard"
    },
    {
      "question": "Describe a time when you had to work with a difficult team member.",
      "category": "Behavioral",
      "difficulty": "Easy"
    }
  ]
}
```

---

### Evaluate Answer

**API Endpoint:** `POST /api/evaluate-answer`

**Request:**
```json
{
  "question": "Tell me about a challenging project...",
  "answer": "In my previous role, I worked on...",
  "resumeText": "Full resume text for context..."
}
```

**AI Prompt:**
```
Evaluate this interview answer and provide brief, constructive feedback.

INSTRUCTIONS:
1. Provide 2-3 sentences of constructive feedback
2. Highlight what was good about the answer
3. Suggest one specific improvement
4. Be encouraging and professional
5. Keep feedback concise (under 100 words)
```

**Response:**
```json
{
  "feedback": "Your answer demonstrates strong problem-solving skills and provides a concrete example. You effectively explained the challenge and your approach. To strengthen your response, consider adding specific metrics or outcomes to quantify the impact of your solution."
}
```

---

## 🎙️ VOICE FEATURES

### Speech Recognition (Speech-to-Text)

**Browser API:** Web Speech API
- `SpeechRecognition` or `webkitSpeechRecognition`
- Continuous listening mode
- Real-time interim results
- Supports: Chrome, Edge, Safari

**Implementation:**
```typescript
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

recognition.onresult = (event) => {
  let transcript = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript;
  }
  setCurrentTranscript(transcript);
};
```

---

### Text-to-Speech

**Browser API:** Speech Synthesis API
- `SpeechSynthesisUtterance`
- Adjustable rate, pitch, volume
- Supports: All modern browsers

**Implementation:**
```typescript
const utterance = new SpeechSynthesisUtterance(text);
utterance.rate = 0.9;
utterance.pitch = 1;
utterance.volume = 1;
window.speechSynthesis.speak(utterance);
```

---

## 📊 DATA FLOW

```
┌──────────────┐
│   User       │
│   Browser    │
└──────┬───────┘
       │
       │ 1. Upload resume + optional job description
       │
       ▼
┌──────────────────────┐
│  Frontend Page       │
│  /interview-prep     │
└──────┬───────────────┘
       │
       │ 2. POST /api/generate-interview-questions
       │    { resumeText, jobDescription }
       │
       ▼
┌──────────────────────┐
│  API Route           │
│  Call AI Factory     │
└──────┬───────────────┘
       │
       │ 3. AI generates 5 questions
       │
       ▼
┌──────────────────────┐
│  Frontend            │
│  - Display question  │
│  - Speak question    │
│  - Record answer     │
└──────┬───────────────┘
       │
       │ 4. POST /api/evaluate-answer
       │    { question, answer, resumeText }
       │
       ▼
┌──────────────────────┐
│  API Route           │
│  Call AI Factory     │
└──────┬───────────────┘
       │
       │ 5. AI evaluates answer
       │
       ▼
┌──────────────────────┐
│  Frontend            │
│  - Display feedback  │
│  - Speak feedback    │
│  - Next question     │
└──────────────────────┘
```

---

## 💾 DATA STRUCTURES

### Interview Session State
```typescript
interface InterviewSession {
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  userAnswers: string[];
  feedback: string[];
}

interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
}
```

---

## 🎨 UI COMPONENTS

### Step 1: Upload Screen
- File upload button
- Job description textarea (optional)
- Start interview button
- Browser compatibility warning

### Step 2: Interview Screen
- Progress bar (Question X of 5)
- Question card with:
  - Category badge
  - Difficulty level
  - Repeat button (🔊)
- Large circular microphone button
- Real-time transcript display
- Submit and Skip buttons

### Step 3: Results Screen
- Completion message
- Cards for each question showing:
  - Question text
  - User's answer
  - AI feedback
- Start new interview button
- Back to home button

---

## ⚡ KEY FEATURES

### 1. Voice Interaction
- ✅ Hands-free interview practice
- ✅ Natural conversation flow
- ✅ Real-time transcription
- ✅ Audio feedback

### 2. AI-Powered Questions
- ✅ Personalized to resume
- ✅ Targeted to job description
- ✅ Varied difficulty levels
- ✅ Multiple question categories

### 3. Instant Feedback
- ✅ Constructive evaluation
- ✅ Specific improvement suggestions
- ✅ Encouraging tone
- ✅ Audio delivery

### 4. User-Friendly
- ✅ Simple 3-step process
- ✅ Progress tracking
- ✅ Skip option
- ✅ Repeat questions

---

## 🔧 TECHNICAL IMPLEMENTATION

### AI Service Integration

**Interface:** `src/lib/ai/ai-service.ts`
```typescript
interface AIProvider {
  generateInterviewQuestions(data: InterviewQuestionsRequest): Promise<InterviewQuestionsResponse>;
  evaluateAnswer(data: EvaluateAnswerRequest): Promise<EvaluateAnswerResponse>;
}
```

**Providers:**
- Groq (llama-3.3-70b-versatile)
- Gemini (gemini-pro)

### API Routes

**Generate Questions:** `src/app/api/generate-interview-questions/route.ts`
- Accepts resume text and optional job description
- Returns array of 5 questions

**Evaluate Answer:** `src/app/api/evaluate-answer/route.ts`
- Accepts question, answer, and resume context
- Returns constructive feedback

---

## 🚀 FUTURE ENHANCEMENTS

### Potential Features:
1. **Video Recording** - Record video answers for self-review
2. **Answer Timer** - Add time limits for realistic practice
3. **Industry-Specific Questions** - Tailor to specific fields
4. **Difficulty Selection** - Let users choose question difficulty
5. **Mock Interview Modes** - Phone screen, technical, behavioral
6. **Performance Analytics** - Track improvement over time
7. **Question Bank** - Save and reuse favorite questions
8. **Multi-Language Support** - Practice in different languages

---

## 📱 BROWSER COMPATIBILITY

### Required Features:
- ✅ Web Speech API (Speech Recognition)
- ✅ Speech Synthesis API
- ✅ Modern JavaScript (ES6+)

### Supported Browsers:
- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop)
- ✅ Safari (Desktop & iOS)
- ❌ Firefox (Limited speech recognition support)

### Fallback:
- Shows warning message if voice features unavailable
- Suggests using Chrome, Edge, or Safari

---

## 🎯 SUCCESS METRICS

### User Experience:
- Interview completion rate
- Average time per question
- Skip rate per question
- Repeat interview rate

### AI Quality:
- Question relevance score
- Feedback helpfulness rating
- Answer evaluation accuracy

---

**The Interview Preparation feature is now fully implemented and ready to use!**
