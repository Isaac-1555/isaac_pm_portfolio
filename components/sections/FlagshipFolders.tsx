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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-4">
      {studies.map((study) => (
        <FlagshipFolder key={study.id} study={study} />
      ))}
    </div>
  );
}
