import Link from "next/link";
import GithubIcon from "@/components/icons/github-icon";
import LinkedInIcon from "@/components/icons/linkedin-icon";
import MailFilledIcon from "@/components/icons/mail-filled-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import { FooterParallax } from "@/components/layout/FooterParallax";

export function Footer() {
  return (
    <footer className="sticky bottom-0 z-0 w-full border-t-2 border-bg-base/20 bg-text-primary text-bg-base h-dvh flex flex-col justify-between relative overflow-hidden pb-[clamp(3rem,22vw,18rem)]">
      {/* Parallax SVG layer (clickable to toggle color) */}
      <FooterParallax />

      {/* Wordmark — solid cta fill, bottom half clipped by overflow-hidden */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 font-industrial font-black uppercase tracking-wide leading-none text-[length:clamp(2rem,11vw,14rem)] whitespace-nowrap text-center w-full text-cta/40 select-none"
      >
        LET&apos;S CONNECT
      </span>

      {/* Top spacer */}
      <div className="flex-none pt-12 md:pt-16" />

      {/* Middle: centered social row — container passes clicks through to SVG layer */}
      <div className="container relative z-20 mx-auto px-6 md:px-8 flex-grow flex items-center justify-center pt-[18vh] pointer-events-none">
        <ul className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pointer-events-auto">
          <li>
            <Link
              href="https://www.linkedin.com/in/isaac-daniel-sudakar-182792375"
              target="_blank"
              data-icon-hover-trigger
              className="flex items-center gap-2.5 text-base md:text-lg text-white hover:text-cta transition-colors font-sans"
            >
              <IconHoverWrapper hoverTrigger="closest" className="shrink-0">
                <LinkedInIcon size={20} />
              </IconHoverWrapper>
              <span>LinkedIn</span>
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/Isaac-1555"
              target="_blank"
              data-icon-hover-trigger
              className="flex items-center gap-2.5 text-base md:text-lg text-white hover:text-cta transition-colors font-sans"
            >
              <IconHoverWrapper hoverTrigger="closest" className="shrink-0">
                <GithubIcon size={20} />
              </IconHoverWrapper>
              <span>GitHub</span>
            </Link>
          </li>
          <li>
            <Link
              href="mailto:benisaac1892@gmail.com"
              data-icon-hover-trigger
              className="flex items-center gap-2.5 text-base md:text-lg text-white hover:text-cta transition-colors font-sans"
            >
              <IconHoverWrapper hoverTrigger="closest" className="shrink-0">
                <MailFilledIcon size={20} />
              </IconHoverWrapper>
              <span>Email</span>
            </Link>
          </li>
        </ul>
      </div>

      
    </footer>
  );
}
