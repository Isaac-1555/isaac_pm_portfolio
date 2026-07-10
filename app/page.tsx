"use client";

import { Hero } from "@/components/Hero/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { ProfileSummaryBackground } from "@/components/sections/ProfileSummaryBackground";
import { ProfileSummaryStats } from "@/components/sections/ProfileSummaryStats";
import { AccentWord } from "@/components/ui/AccentWord";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  revealProps,
  staggerContainer,
  staggerItem,
  useRevealMotion,
} from "@/lib/motion";

export default function Home() {
  const reduced = useRevealMotion();
  const textColumn = revealProps(reduced);
  const image = revealProps(reduced);

  return (
    <>
      <Hero />
      <FeaturedWork />

      <section
        id="mission-home-about"
        className="py-16 md:py-24 bg-bg-dark text-bg-base relative overflow-hidden"
      >
        <ProfileSummaryBackground />
        <div className="absolute inset-0 z-[1] bg-bg-dark/40 pointer-events-none" />

        <div className="container mx-auto px-6 md:px-8 relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            {...textColumn}
            variants={staggerContainer}
            className="will-change-transform"
          >
            <motion.h2
              variants={staggerItem}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-industrial font-bold uppercase tracking-wide md:tracking-widest text-white mb-6"
            >
              About <AccentWord text="Me" />
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-white leading-relaxed mb-8 max-w-lg font-sans text-sm md:text-base"
            >
              With over 5 years of experience in software development, AI integration, and product management, I specialize in transforming ambiguous problems into scalable, AI-powered solutions. My approach pairs rigorous data analysis with intuitive design, shipping systems that work in production and feel obvious to the people using them.
            </motion.p>
            <motion.div variants={staggerItem}>
              <ProfileSummaryStats />
            </motion.div>
          </motion.div>
          <motion.div
            {...image}
            data-cursor-spotlight
            className="relative h-64 md:h-96 w-full border-2 border-bg-accent rounded-sm overflow-hidden bg-bg-accent/20 backdrop-blur will-change-transform"
          >
            <Image
              src="/isaac.png"
              alt="Isaac Daniel Sudakar"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
