# Job Application Assistant

An AI-powered platform to help job seekers optimize their resumes, find jobs, and prepare for interviews. Built with Next.js 16, TypeScript, and modern AI technologies.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 Resume Analyzer (Implemented)
- **AI-Powered Analysis**: Intelligent resume evaluation using Groq AI (Llama 3.3 70B)
- **Multi-Format Support**: Upload PDF, DOCX, or TXT files
- **Comprehensive Scoring**: 
  - Overall Score
  - ATS Compatibility Score
  - Formatting Score
  - Content Quality Score
  - Keyword Optimization Score
- **Detailed Feedback**: Section-by-section analysis with actionable suggestions
- **Resume Validation**: Smart detection to ensure only resumes are analyzed
- **Beautiful UI**: Modern, responsive interface with dark/light mode

### 🚀 Coming Soon
- Job Search & Matching
- Automated Job Applications
- Cover Letter Generator
- Interview Preparation
- Salary Negotiation Tips

## 🏗️ Architecture

### AI Abstraction Layer
The application uses a clean abstraction pattern for AI provider flexibility:

```
src/lib/ai/
├── ai-service.ts              # Interface definitions
├── ai-factory.ts              # Provider selection logic
└── providers/
    ├── groq-provider.ts       # Groq implementation (primary)
    └── gemini-provider.ts     # Gemini implementation (backup)
```

**Benefits:**
- ✅ Easy to switch AI providers (just change API key)
- ✅ Easy to add new providers (implement interface)
- ✅ No code changes needed when switching providers
- ✅ Type-safe with TypeScript

### Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui components
- Lucide icons

**Backend:**
- Next.js API Routes
- Groq AI (Llama 3.3 70B) - Primary
- Google Gemini 1.5 Flash - Backup
- pdf2json (PDF parsing)
- mammoth (DOCX parsing)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Groq API key (FREE, no credit card required)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
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

**Get your FREE Groq API key:**
1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up (no credit card required)
3. Create a new API key
4. Copy and paste into `.env.local`

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Resume Analyzer

1. Go to the homepage
2. Click on "Review my resume" card
3. Upload your resume (PDF, DOCX, or TXT - max 5MB)
4. Click "Analyze Resume"
5. View your detailed analysis with scores and suggestions

### Analysis Includes:
- **Overall Score**: Weighted average of all metrics
- **ATS Score**: How well your resume passes Applicant Tracking Systems
- **Formatting Score**: Structure and visual organization
- **Content Score**: Quality of information and achievements
- **Keyword Score**: Industry-relevant terms presence
- **Quick Wins**: Easy improvements you can make immediately
- **Detailed Suggestions**: Comprehensive feedback for each section

## 🔧 Configuration

### Switching AI Providers

The system automatically uses the first available API key in this order:
1. Groq (if `GROQ_API_KEY` is set)
2. Gemini (if `GEMINI_API_KEY` is set)

To switch providers, simply add/remove API keys in `.env.local`.

### Adding New AI Providers

1. Create a new provider class in `src/lib/ai/providers/`
2. Implement the `AIProvider` interface
3. Add the provider to `AIFactory` in `src/lib/ai/ai-factory.ts`
4. Add the API key to `.env.local`

Example:
```typescript
// src/lib/ai/providers/openai-provider.ts
import OpenAI from "openai";
import { AIProvider, ResumeAnalysis } from "../ai-service";

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    // Implementation
  }
}
```

## 📁 Project Structure

```
job-application-assistant/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze-resume/
│   │   │       └── route.ts          # Resume analysis API endpoint
│   │   ├── resume-analysis/
│   │   │   └── page.tsx              # Resume analyzer UI
│   │   ├── layout.tsx                # Root layout with theme
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── header.tsx                # Navigation header
│   │   ├── footer.tsx                # Footer
│   │   └── theme-toggle.tsx          # Dark/light mode toggle
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── ai-service.ts         # AI interface definitions
│   │   │   ├── ai-factory.ts         # Provider factory
│   │   │   └── providers/
│   │   │       ├── groq-provider.ts  # Groq implementation
│   │   │       └── gemini-provider.ts # Gemini implementation
│   │   └── utils.ts                  # Utility functions
│   └── hooks/
│       └── use-mobile.tsx            # Mobile detection hook
├── public/                           # Static assets
├── explanatory/                      # Documentation
│   ├── resume-analyzer-documentation.html
│   └── resume-analyzer-visual-diagram.html
├── .env.local                        # Environment variables (not in git)
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components:
- Accordion, Alert, Avatar, Badge, Breadcrumb
- Button, Calendar, Card, Carousel, Chart
- Checkbox, Dialog, Dropdown Menu, Form
- Input, Label, Progress, Select, Separator
- Sheet, Skeleton, Slider, Switch, Table
- Tabs, Textarea, Toggle, Tooltip
- And many more...

## 🔒 Security

- API keys are stored in `.env.local` (not committed to git)
- File size validation (max 5MB)
- File type validation (PDF, DOCX, TXT only)
- Resume validation (prevents non-resume uploads)
- Error handling for all API calls
- Secure server-side processing

## 🚀 Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY` (optional)
4. Deploy!

### Environment Variables for Production

Make sure to add these in your deployment platform:
```env
GROQ_API_KEY=your_production_groq_key
GEMINI_API_KEY=your_production_gemini_key
```

## 📊 Performance

- **Upload**: Instant (client-side validation)
- **Text Extraction**: ~1-2 seconds
- **Resume Validation**: ~1 second
- **AI Analysis**: ~2-3 seconds
- **Total Time**: ~4-6 seconds end-to-end

## 🤖 Why Groq?

- ✅ **100% FREE**: No credit card required, ever
- ⚡ **Lightning Fast**: Fastest inference speed available
- 🎯 **Accurate**: Llama 3.3 70B provides high-quality results
- 📝 **Reliable**: Consistent JSON format responses
- 🔒 **Secure**: Enterprise-grade infrastructure

### AI Provider Comparison

| Provider | Cost | Speed | Setup |
|----------|------|-------|-------|
| Groq | FREE forever | Fastest | No credit card ✅ |
| Gemini | FREE tier | Fast | Requires billing ❌ |
| OpenAI | $0.15/1M tokens | Medium | Paid only ❌ |

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

## 📝 API Documentation

### POST `/api/analyze-resume`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with `resume` file

**Response (Success):**
```json
{
  "overallScore": 85,
  "atsScore": 80,
  "formattingScore": 90,
  "contentScore": 85,
  "keywordScore": 75,
  "contactInfo": { ... },
  "structure": { ... },
  "content": { ... },
  "atsCompatibility": { ... },
  "quickWins": ["...", "..."],
  "suggestions": ["...", "..."]
}
```

**Response (Error):**
```json
{
  "error": "Error message"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Groq](https://groq.com/) - AI inference
- [Lucide](https://lucide.dev/) - Icons

## 📧 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ using Next.js, TypeScript, and Groq AI**
