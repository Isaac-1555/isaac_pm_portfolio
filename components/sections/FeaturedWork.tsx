import { caseStudies, type CaseStudy } from "@/app/case-studies/data";
import { FeaturedWorkClient } from "./FeaturedWorkClient";

function pick(id: string): CaseStudy {
  const found = caseStudies.find((c) => c.id === id);
  if (!found) throw new Error(`Case study not found: ${id}`);
  return found;
}

export function FeaturedWork() {
  const studies = [
    pick("satbrain"),
    pick("tux"),
    pick("pocket-resume"),
    pick("notebucket"),
  ];
  const missionIds = ["MSSN-01", "MSSN-02", "MSSN-03", "MSSN-04"] as const;
  return (
    <FeaturedWorkClient
      studies={studies}
      missionIds={missionIds}
    />
  );
}
