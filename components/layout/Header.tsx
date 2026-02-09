"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-bg-dark bg-bg-base/80 backdrop-blur supports-[backdrop-filter]:bg-bg-base/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-industrial text-xl font-bold tracking-widest text-text-primary hover:text-cta transition-colors">
            <Rocket className="h-6 w-6" />
            <span>PM-PORTFOLIO</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 h-full">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex h-full items-center px-6 text-sm font-medium uppercase tracking-widest transition-colors hover:text-cta",
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
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/contact">
            <Button variant="default" size="sm">
              Initiate Contact
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
