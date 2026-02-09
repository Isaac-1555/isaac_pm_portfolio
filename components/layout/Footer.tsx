import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t-2 border-bg-dark bg-bg-dark text-bg-base py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="font-industrial text-xl md:text-2xl font-bold tracking-widest text-cta mb-4 block uppercase">
              PM-PORTFOLIO
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm font-sans">
              Product Manager | Systems Architect. Constructing scalable solutions for complex problems. Based in Starfield System.
            </p>
          </div>
          
          {/* Connect Section */}
          <div>
            <h4 className="text-base font-industrial font-bold mb-4 text-bg-base uppercase tracking-widest">Connect</h4>
            <ul className="space-y-3">
              <li>
                <Link href="https://linkedin.com" className="flex items-center gap-2 text-sm text-text-secondary hover:text-cta transition-colors font-sans">
                  <Linkedin className="h-4 w-4 shrink-0" /> 
                  <span>LinkedIn</span>
                </Link>
              </li>
              <li>
                <Link href="https://github.com" className="flex items-center gap-2 text-sm text-text-secondary hover:text-cta transition-colors font-sans">
                  <Github className="h-4 w-4 shrink-0" /> 
                  <span>GitHub</span>
                </Link>
              </li>
              <li>
                <Link href="mailto:hello@example.com" className="flex items-center gap-2 text-sm text-text-secondary hover:text-cta transition-colors font-sans">
                  <Mail className="h-4 w-4 shrink-0" /> 
                  <span>Email</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* System Section */}
          <div>
            <h4 className="text-base font-industrial font-bold mb-4 text-bg-base uppercase tracking-widest">System</h4>
            <ul className="space-y-2 text-sm text-text-secondary font-sans">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse shrink-0"></span>
                <span>Status: Operational</span>
              </li>
              <li>Version: 2.4.0</li>
              <li>Last Update: 2024.05.15</li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-divider/30 text-center text-xs text-text-secondary font-sans">
          &copy; {new Date().getFullYear()} NASA PUNK PM. All systems go.
        </div>
      </div>
    </footer>
  );
}
