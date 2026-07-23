import { caseStudies, type CaseStudy } from "@/app/case-studies/data";
import { FlagshipFolder } from "./flagship/FlagshipFolder";

function pick(id: string): CaseStudy {
  const found = caseStudies.find((c) => c.id === id);
  if (!found) throw new Error(`Case study not found: ${id}`);
  return found;
}

const FLAGSHIP_IDS = ["satbrain", "tux", "pocket-resume", "notebucket"] as const;

export function FlagshipFolders() {
  const studies = FLAGSHIP_IDS.map(pick);
  return (
    <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {studies.map((study) => (
        <FlagshipFolder key={study.id} study={study} />
      ))}
    </div>
  );
}
