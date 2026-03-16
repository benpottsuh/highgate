// ── Section IDs ──
export type SectionId = "signature" | "classic" | "pool-beach" | "zero-proof";

// ── Base spirits ──
export type BaseSpirit = "Vodka" | "Gin" | "Tequila" | "Rum" | "Whiskey" | "NA";

// ── Spec line ──
export interface SpecItem {
  amount: string;
  ingredient: string;
}

// ── Batch recipe ──
export interface BatchRecipe {
  yield: string;
  items: string[];
}

// ── Core entities ──

export interface Cocktail {
  slug: string;
  name: string;
  section: SectionId;
  spirit: BaseSpirit;
  style: string;
  tagline: string;
  flavor: string[];
  photo: string | null;
  overview: string;
  selling: string[];
  spec: SpecItem[];
  technique: string;
  glass: string;
  ice: string;
  garnish: string;
  cheatSheet: string;
  batch: BatchRecipe | null;
  prep: string[];
}

export interface Section {
  id: SectionId;
  name: string;
  accent: string;
  bg: string;
  desc: string;
}

export interface Technique {
  id: string;
  name: string;
  desc: string;
  detail: string;
  points: string[];
}
