export type TopoMarkerGroup = "featured" | "work" | "blog";

export interface TopoMarker {
  /** Matches case study id, work item id, or blog post slug */
  id: string;
  label: string;
  group: TopoMarkerGroup;
  /** Position on the topographic map, in % of the hero area */
  x: number;
  y: number;
}

/**
 * Single source of truth for markers on the shared topographic background.
 * The marker whose id matches the current page is highlighted in tech teal.
 * When adding a project or blog post, add an entry here.
 */
export const topoMarkers: TopoMarker[] = [
  // Featured works (case studies) — /work + /case-studies
  // Coordinates avoid the hero text block (left-center of the header).
  { id: "tux", label: "Tux", group: "featured", x: 8, y: 10 },
  { id: "satbrain", label: "SatBrain", group: "featured", x: 88, y: 18 },
  { id: "pocket-resume", label: "PocketResume", group: "featured", x: 70, y: 85 },
  { id: "notebucket", label: "NoteBucket", group: "featured", x: 92, y: 62 },

  // Other work items — /work grid
  { id: "barcode-lists", label: "Barcode-Lists", group: "work", x: 36, y: 14 },
  { id: "phone-barcode", label: "Phone-Barcode", group: "work", x: 44, y: 22 },
  { id: "ez-resume", label: "Ez-Resume", group: "work", x: 70, y: 30 },
  { id: "summarease", label: "Summarease", group: "work", x: 78, y: 50 },
  { id: "anickie", label: "Anickie", group: "work", x: 70, y: 68 },
  { id: "coachgg", label: "CoachGG", group: "work", x: 84, y: 78 },
  { id: "betteryt", label: "BetterYT", group: "work", x: 18, y: 22 },
  { id: "d4c", label: "D4C", group: "work", x: 56, y: 10 },
  { id: "pigeon", label: "Pigeon", group: "work", x: 40, y: 90 },

  // Blog posts — /blog
  { id: "blog-notebucket", label: "Notes Deep Dive", group: "blog", x: 10, y: 88 },
  { id: "blog-barcode-lists", label: "Coop Workflow", group: "blog", x: 94, y: 38 },
  { id: "blog-d4c", label: "Agent Build", group: "blog", x: 20, y: 8 },
];
