import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t-2 border-bg-dark bg-bg-dark text-bg-base font-tech uppercase tracking-widest py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link href="/" className="font-industrial text-2xl font-bold tracking-widest text-cta mb-4 block">
            PM-PORTFOLIO
          </Link>
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
            Product Manager | Systems Architect
            <br />
            Constructing scalable solutions for complex problems.
            <br />
            Based in Starfield System.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-bold mb-4 text-bg-base border-b border-divider pb-2 inline-block">Connect</h4>
          <ul className="space-y-2">
            <li>
              <Link href="https://linkedin.com" className="flex items-center gap-2 hover:text-cta transition-colors">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </Link>
            </li>
            <li>
              <Link href="https://github.com" className="flex items-center gap-2 hover:text-cta transition-colors">
                <Github className="h-4 w-4" /> GitHub
              </Link>
            </li>
            <li>
              <Link href="mailto:hello@example.com" className="flex items-center gap-2 hover:text-cta transition-colors">
                <Mail className="h-4 w-4" /> Email
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4 text-bg-base border-b border-divider pb-2 inline-block">System</h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>Status: Operational</li>
            <li>Version: 2.4.0</li>
            <li>Last Update: 2024.05.15</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-12 pt-8 border-t border-divider text-center text-xs text-text-secondary">
        &copy; {new Date().getFullYear()} NASA PUNK PM. All systems go.
      </div>
    </footer>
  );
}
