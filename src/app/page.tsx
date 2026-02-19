import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Briefcase, 
  Search, 
  BookOpen, 
  FileEdit,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section - Full Screen */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Gradient Background Effect */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent blur-3xl" />
        
        <div className="container relative z-10 py-32 md:py-40">
          <div className="mx-auto max-w-5xl text-center space-y-12">
            {/* Badge */}
            <Badge variant="outline" className="border-2 px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-2" />
              AI-Powered Career Tools
            </Badge>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
              <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                Job Application Assistant
              </span>
            </h1>
            


            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-3 pt-8">
              <QuickAction href="/resume-analysis" icon={<Search className="w-4 h-4" />}>
                Review resume
              </QuickAction>
              <QuickAction href="/interview-prep" icon={<BookOpen className="w-4 h-4" />}>
                Interview prep
              </QuickAction>
              <QuickAction href="/cover-letter" icon={<FileEdit className="w-4 h-4" />}>
                Cover letter
              </QuickAction>
              <QuickAction href="/ats-optimization" icon={<FileText className="w-4 h-4" />}>
                ATS Check
              </QuickAction>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-border rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-muted-foreground rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 border-t border-border">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <Badge variant="secondary" className="mb-6">
                Features
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Everything you need
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                AI-powered tools for your job search success
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <FeatureCard
                icon={<Sparkles className="w-7 h-7" />}
                title="AI Resume Analysis"
                description="Get instant feedback with detailed insights"
                href="/resume-analysis"
                buttonText="Analyze Now"
              />
              <FeatureCard
                icon={<FileEdit className="w-7 h-7" />}
                title="Cover Letter Generator"
                description="Create personalized letters in seconds"
                href="/cover-letter"
                buttonText="Generate Now"
              />
              <FeatureCard
                icon={<BookOpen className="w-7 h-7" />}
                title="Interview Preparation"
                description="Practice with AI-generated questions"
                href="/interview-prep"
                buttonText="Start Practice"
              />
              <FeatureCard
                icon={<FileText className="w-7 h-7" />}
                title="ATS Optimization"
                description="Pass automated screening systems"
                href="/ats-optimization"
                buttonText="Optimize Resume"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="flex justify-center items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Job Application Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function QuickAction({ 
  href, 
  icon, 
  children 
}: { 
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button variant="outline" asChild className="rounded-full">
      <Link href={href}>
        {icon}
        <span>{children}</span>
      </Link>
    </Button>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description,
  href,
  buttonText
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  buttonText: string;
}) {
  return (
    <Link href={href} className="block h-full">
      <Card className="group relative h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
        <div className="p-8 space-y-6 flex flex-col h-full">
          {/* Icon and Text */}
          <div className="space-y-4 flex-1">
            <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {icon}
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
          
          {/* Button */}
          <Button variant="outline" className="w-full h-12 text-base group-hover:bg-foreground group-hover:text-background transition-colors">
            {buttonText}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </Link>
  );
}
