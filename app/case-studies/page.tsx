import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccentWord } from "@/components/ui/AccentWord";
import Link from "next/link";
import RightChevron from "@/components/icons/right-chevron";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import { caseStudies } from "./data";

const METRICS: Record<string, string[]> = {
  "tux": ["1-Day Build", "Sub-2s Cold Start"],
  "satbrain": ["500+ Docs", "~70% Time Saved"],
  "pocket-resume": ["<20s Resume", "Store Live"],
  "notebucket": ["41 MB APK", "0 Network Calls"],
};

export default function CaseStudiesPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-industrial font-bold uppercase tracking-widest text-text-primary mb-4">
          Mission <AccentWord text="Logs" />
        </h1>
        <p className="text-text-secondary max-w-2xl text-lg font-tech uppercase tracking-wide">
          Detailed records of product development cycles, from concept to launch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {caseStudies.map((study) => {
          const Icon = study.icon;
          const metrics = METRICS[study.id] ?? [];
          return (
            <Card
              key={study.id}
              data-icon-hover-trigger
              className="group h-full flex flex-col hover:border-cta transition-colors"
            >
              <div className={`h-48 w-full bg-gradient-to-br ${study.gradient} relative overflow-hidden flex items-center justify-center`}>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <IconHoverWrapper
                  hoverTrigger="closest"
                  className="transition-transform group-hover:scale-110 [&_svg]:transition-colors group-hover:[&_svg]:text-white/40"
                >
                  <Icon size={64} color="rgba(255,255,255,0.2)" />
                </IconHoverWrapper>
                <Badge variant="outline" className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white border-white/20">
                  {study.company}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="group-hover:text-cta transition-colors">
                  {study.title}
                </CardTitle>
                <div className="text-xs font-mono text-text-secondary uppercase tracking-widest mt-1">
                  {study.role}
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <p className="text-text-secondary mb-6 leading-relaxed">
                  {study.subtitle}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {study.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {metrics.map((metric) => (
                    <div key={metric} className="bg-bg-accent/10 border border-bg-dark/20 p-2 text-center">
                      <div className="text-gold font-bold font-industrial text-sm">{metric}</div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="mt-auto pt-6 border-t border-divider/50">
                <Link href={`/case-studies/${study.id}`} data-icon-hover-trigger className="w-full">
                  <Button variant="ghost" className="w-full group-hover:bg-cta group-hover:text-white transition-all">
                    Read Case Study
                    <IconHoverWrapper hoverTrigger="closest">
                      <RightChevron size={16} className="ml-2" />
                    </IconHoverWrapper>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
