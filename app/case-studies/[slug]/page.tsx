import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ChevronRight, BarChart3, Users, Zap } from "lucide-react";
import Link from "next/link";

export default async function CaseStudyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // In a real app, fetch data based on slug
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <article className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-bg-dark text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 diagonal-stripes opacity-10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/case-studies" className="inline-flex items-center text-text-secondary hover:text-white mb-8 transition-colors uppercase tracking-widest text-sm font-tech">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Mission Control
          </Link>
          <Badge variant="tech" className="mb-4">Case Study: {slug}</Badge>
          <h1 className="text-4xl md:text-7xl font-industrial font-bold uppercase tracking-widest mb-6">
            {title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm font-tech uppercase tracking-widest text-text-secondary">
            <span>Role: Lead PM</span>
            <span className="text-cta">•</span>
            <span>Duration: 6 Months</span>
            <span className="text-cta">•</span>
            <span>Status: Complete</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          
          <section>
            <h2 className="text-2xl font-industrial uppercase tracking-widest mb-6 border-l-4 border-cta pl-4">
              Problem Statement
            </h2>
            <div className="bg-bg-accent/10 p-8 border border-bg-dark/20 rounded-sm">
              <p className="text-lg leading-relaxed text-text-primary">
                The existing telemetry systems were suffering from high latency (2500ms+) during critical launch windows, causing delays in mission-critical decision making. Operators were forced to rely on fragmented data sources, leading to a 15% error rate in anomaly detection.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-industrial uppercase tracking-widest mb-6 border-l-4 border-cta pl-4">
              Strategic Approach
            </h2>
            <div className="space-y-6">
              <p className="leading-relaxed text-text-secondary">
                We adopted a user-centric approach, starting with 20+ hours of observation in the mission control room. The core strategy focused on:
              </p>
              <ul className="space-y-4">
                {[
                  "Unifying 12 disparate data streams into a single WebSocket connection",
                  "Designing a 'Dark Mode' first UI to reduce operator eye strain",
                  "Implementing predictive anomaly detection using historical flight data"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-success shrink-0 mt-0.5" />
                    <span className="text-text-primary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-industrial uppercase tracking-widest mb-6 border-l-4 border-cta pl-4">
              Visual Execution
            </h2>
            <div className="aspect-video bg-gradient-to-br from-bg-dark to-bg-accent rounded-sm flex items-center justify-center text-white/50 font-industrial uppercase tracking-widest border-2 border-dashed border-bg-dark/20">
              [Interface Mockup Placeholder]
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-card border-2 border-bg-dark p-6 sticky top-24">
            <h3 className="text-xl font-industrial uppercase tracking-widest mb-6 text-bg-dark">
              Mission Impact
            </h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-bg-accent/10 border border-bg-dark/10">
                <div className="flex items-center gap-2 mb-2 text-gold">
                  <Zap className="h-5 w-5" />
                  <span className="font-tech uppercase tracking-wider text-xs">Latency</span>
                </div>
                <div className="text-3xl font-industrial font-bold text-bg-dark">-40%</div>
                <div className="text-xs text-text-secondary mt-1">Reduced from 2.5s to 1.5s</div>
              </div>

              <div className="p-4 bg-bg-accent/10 border border-bg-dark/10">
                <div className="flex items-center gap-2 mb-2 text-gold">
                  <Users className="h-5 w-5" />
                  <span className="font-tech uppercase tracking-wider text-xs">Adoption</span>
                </div>
                <div className="text-3xl font-industrial font-bold text-bg-dark">100%</div>
                <div className="text-xs text-text-secondary mt-1">Within 2 weeks of launch</div>
              </div>

              <div className="p-4 bg-bg-accent/10 border border-bg-dark/10">
                <div className="flex items-center gap-2 mb-2 text-gold">
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-tech uppercase tracking-wider text-xs">Accuracy</span>
                </div>
                <div className="text-3xl font-industrial font-bold text-bg-dark">99.9%</div>
                <div className="text-xs text-text-secondary mt-1">Data integrity maintained</div>
              </div>
            </div>

            <Button className="w-full mt-8" variant="outline">
              Request Full Report
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
