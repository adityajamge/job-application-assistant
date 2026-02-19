import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/header';
import { ArrowLeft, FileText, BookOpen, Download, ExternalLink } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Theme Toggle */}
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Link href="/">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              📚 Documentation Center
            </h1>
            <p className="text-xl text-muted-foreground">
              Complete guides and documentation for Job Application Assistant
            </p>
          </div>
        </div>
      </section>

      {/* Main Documentation */}
      <section className="py-12">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">📖 Main Documentation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle>Project Documentation</CardTitle>
                      <Badge className="mt-1">Technical</Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-4">
                  Complete technical documentation covering architecture, features, API endpoints, and deployment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href="/docs/project" className="flex-1">
                    <Button className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read Online
                    </Button>
                  </Link>
                  <a href="/PROJECT_DOCUMENTATION.md" download>
                    <Button variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle>User Manual</CardTitle>
                      <Badge className="mt-1" variant="secondary">User Guide</Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-4">
                  Step-by-step guide for end users covering all features, tips, and troubleshooting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href="/docs/user-manual" className="flex-1">
                    <Button className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read Online
                    </Button>
                  </Link>
                  <a href="/USER_MANUAL.md" download>
                    <Button variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-12 bg-muted/50">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">🎯 Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📄 Resume Analyzer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  AI-powered resume analysis with comprehensive scoring and feedback.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">✉️ Cover Letter Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate personalized cover letters with AI suggestions and DOCX export.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎯 ATS Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Check resume compatibility with Applicant Tracking Systems.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎤 Interview Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Practice interviews with AI-generated questions and voice recording.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">🔗 Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🏠</span> Homepage
                </CardTitle>
                <CardDescription>
                  Return to the main application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Go to App
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>💻</span> GitHub
                </CardTitle>
                <CardDescription>
                  View source code and contribute
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a href="https://github.com/adityajamge/job-application-assistant" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GitHub Repo
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🔑</span> Get API Key
                </CardTitle>
                <CardDescription>
                  Get your free Groq API key
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Groq Console
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 bg-muted/50">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">🛠️ Technology Stack</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary" className="text-sm py-2 px-4">Next.js 16</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">TypeScript 5</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">React 19</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">Tailwind CSS 4</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">Groq AI</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">Gemini AI</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">shadcn/ui</Badge>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-muted-foreground">
          <p>Built with ❤️ using Next.js, TypeScript, and AI</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>•</span>
            <a href="https://github.com/adityajamge/job-application-assistant" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              GitHub
            </a>
            <span>•</span>
            <a href="mailto:support@example.com" className="hover:text-foreground">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
