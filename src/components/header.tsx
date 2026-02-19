"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Briefcase } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-background" />
          </div>
          <span className="hidden sm:inline">Job Application Assistant</span>
          <span className="sm:hidden">JAA</span>
        </Link>

        {/* Theme Toggle Only */}
        <ThemeToggle />
      </nav>
    </header>
  );
}
