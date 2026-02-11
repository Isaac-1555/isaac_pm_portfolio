"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-bg-dark bg-bg-base/95 backdrop-blur supports-[backdrop-filter]:bg-bg-base/80">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-industrial text-lg md:text-xl font-bold tracking-wide md:tracking-widest text-text-primary hover:text-cta transition-colors shrink-0">
          <Rocket className="h-5 w-5 md:h-6 md:w-6" />
          <span className="hidden sm:inline">IDS.PM</span>
          <span className="sm:hidden">IDS</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center h-full">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex h-full items-center px-4 lg:px-6 text-xs lg:text-sm font-medium uppercase tracking-wide lg:tracking-widest transition-colors hover:text-cta",
                  isActive
                    ? "text-bg-dark font-bold bg-bg-accent/10"
                    : "text-text-secondary"
                )}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-cta"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link href="/contact" className="hidden md:block text-sm font-medium text-text-secondary hover:text-cta transition-colors uppercase tracking-wide">
            Contact
          </Link>
          <Link href="/resume.pdf" target="_blank">
            <Button variant="default" size="sm" className="text-xs md:text-sm px-3 md:px-4">
              <span className="hidden sm:inline">Resume</span>
              <span className="sm:hidden">CV</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
