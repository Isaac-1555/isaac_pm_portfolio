"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import HamburgerIcon from "@/components/icons/hamburger-icon";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Works", href: "/work" },
  { name: "BLOG", href: "/blog" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-bg-dark bg-bg-base/95 backdrop-blur supports-[backdrop-filter]:bg-bg-base/80">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 w-[180px] font-industrial text-lg md:text-xl font-bold tracking-wide md:tracking-widest text-text-primary hover:text-cta transition-colors shrink-0"
        >
          <Image
            src="/logo.png"
            alt="Isaac Daniel"
            width={28}
            height={28}
            priority
            className="w-6 h-6 md:w-7 md:h-7 object-contain"
          />
          <motion.span
            layout
            className="overflow-hidden whitespace-nowrap"
          >
            {isScrolled ? "ID" : "Isaac Daniel"}
          </motion.span>
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

        {/* CTA + Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="https://www.linkedin.com/in/isaac-daniel-sudakar-182792375"
            target="_blank"
            className="hidden md:block text-sm font-medium text-text-secondary hover:text-cta transition-colors uppercase tracking-wide"
          >
            Contact
          </Link>
          <Link href="/experience">
            <Button variant="default" size="sm" className="text-xs md:text-sm px-3 md:px-4">
              <span className="hidden sm:inline">Resume</span>
              <span className="sm:hidden">CV</span>
            </Button>
          </Link>
          <div
            className="md:hidden cursor-pointer"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <IconHoverWrapper>
              <HamburgerIcon size={24} isOpen={mobileOpen} />
            </IconHoverWrapper>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 300, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t-2 border-bg-dark bg-bg-base/95 backdrop-blur"
          >
            <nav className="flex flex-col px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-4 py-3 text-sm font-medium uppercase tracking-wide rounded transition-colors",
                      isActive
                        ? "text-bg-dark font-bold bg-bg-accent/10"
                        : "text-text-secondary hover:text-cta hover:bg-bg-accent/5"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
