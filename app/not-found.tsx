import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center bg-bg-base text-center px-4">
      <div className="bg-bg-accent/10 p-12 rounded-sm border-2 border-dashed border-warning mb-8">
        <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-6 animate-pulse" />
        <h1 className="text-6xl md:text-8xl font-industrial font-bold text-bg-dark mb-4 tracking-widest">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-tech uppercase tracking-widest text-text-secondary mb-8">
          Signal Lost // Coordinates Not Found
        </h2>
        <p className="text-text-primary max-w-md mx-auto mb-8 leading-relaxed">
          The trajectory you've requested leads to uncharted space. Please recalibrate your navigation systems.
        </p>
        <Link href="/">
          <Button variant="default" size="lg">
            Return to Base
          </Button>
        </Link>
      </div>
      <div className="font-mono text-xs text-text-secondary">
        ERR_CODE: NAV_FAILURE_004
      </div>
    </div>
  );
}
