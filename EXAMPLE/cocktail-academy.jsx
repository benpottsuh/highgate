import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────
const SECTIONS = {
  signature: {
    id: "signature",
    name: "Signature Cocktails",
    accent: "#B8860B",
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    desc: "Original creations crafted for the Highgate program — our bartenders' showcase.",
  },
  classic: {
    id: "classic",
    name: "Classic Cocktails",
    accent: "#8B4513",
    bg: "linear-gradient(135deg, #2d1b00 0%, #1a1a2e 100%)",
    desc: "Time-tested recipes executed to Highgate standards.",
  },
  "pool-beach": {
    id: "pool-beach",
    name: "Pool & Beach",
    accent: "#2E8B8B",
    bg: "linear-gradient(135deg, #0a2e2e 0%, #1a3a4a 100%)",
    desc: "Refreshing, easy-drinking cocktails for sun-soaked service.",
  },
  "zero-proof": {
    id: "zero-proof",
    name: "Zero Proof",
    accent: "#6B8E23",
    bg: "linear-gradient(135deg, #1a2e1a 0%, #2e3a1a 100%)",
    desc: "Thoughtful non-alcoholic options with equal craft and care.",
  },
};

const COCKTAILS = [
  {
    slug: "applegate-spritz",
    name: "Applegate Spritz",
    section: "signature",
    spirit: "Vodka",
    style: "Highball",
    tagline: "Refreshing & Vibrant Highball",
    flavor: ["Citrus-forward", "Mildly spicy", "Refreshing"],
    photo: null,
    overview: "A bright, effervescent take on the classic spritz using green apple and a touch of jalapeño heat.",
    selling: [
      "Recommend for guests who like light, refreshing drinks with a kick",
      "Perfect poolside or as a pre-dinner opener",
      "Talk about the house-made apple-jalapeño syrup",
    ],
    spec: [
      { amount: "1.5 oz", ingredient: "Ketel One Vodka" },
      { amount: "0.75 oz", ingredient: "Green apple juice" },
      { amount: "0.5 oz", ingredient: "Jalapeño-apple syrup" },
      { amount: "0.75 oz", ingredient: "Fresh lemon juice" },
      { amount: "Top", ingredient: "Soda water" },
    ],
    technique: "Shake & Strain",
    glass: "Highball",
    ice: "Collins cube",
    garnish: "Apple fan + mint sprig",
    cheatSheet: "1.5 vodka / 0.75 apple / 0.5 syrup / 0.75 lemon / soda",
    batch: {
      yield: "20 servings",
      items: [
        "750ml Ketel One Vodka",
        "375ml Green apple juice",
        "250ml Jalapeño-apple syrup",
        "375ml Fresh lemon juice",
      ],
    },
    prep: ["Jalapeño-Apple Syrup", "Green Apple Juice (fresh press)"],
  },
  {
    slug: "jasmine-highball",
    name: "Jasmine Pearl Highball",
    section: "signature",
    spirit: "Gin",
    style: "Highball",
    tagline: "Floral & Elegant Highball",
    flavor: ["Floral", "Delicate", "Crisp"],
    photo: null,
    overview: "A refined gin highball layered with jasmine tea and a silky melon espuma cap.",
    selling: [
      "Great for gin lovers and guests exploring lighter cocktails",
      "Works beautifully at dinner or as an afternoon sipper",
      "Highlight the house jasmine tea infusion and melon foam",
    ],
    spec: [
      { amount: "1.5 oz", ingredient: "Hendrick's Gin" },
      { amount: "1 oz", ingredient: "Jasmine tea concentrate" },
      { amount: "0.5 oz", ingredient: "Honey syrup" },
      { amount: "0.75 oz", ingredient: "Fresh lemon juice" },
      { amount: "Top", ingredient: "Chilled soda" },
      { amount: "Float", ingredient: "Melon espuma" },
    ],
    technique: "Build in glass, top & float",
    glass: "Highball",
    ice: "Collins cube",
    garnish: "Jasmine blossom + lemon twist",
    cheatSheet: "1.5 gin / 1 jasmine / 0.5 honey / 0.75 lemon / soda / espuma",
    batch: {
      yield: "20 servings",
      items: [
        "750ml Hendrick's Gin",
        "500ml Jasmine tea concentrate",
        "250ml Honey syrup",
        "375ml Fresh lemon juice",
      ],
    },
    prep: ["Jasmine Tea Concentrate", "Honey Syrup (2:1)", "Melon Espuma"],
  },
  {
    slug: "old-fashioned",
    name: "Highgate Old Fashioned",
    section: "classic",
    spirit: "Whiskey",
    style: "Stirred / Rocks",
    tagline: "Bold & Timeless Stirred Cocktail",
    flavor: ["Rich", "Warm spice", "Caramel notes"],
    photo: null,
    overview: "Our house take on the Old Fashioned — rich bourbon, demerara, and a careful balance of aromatic bitters.",
    selling: [
      "The go-to for whiskey drinkers and classic cocktail fans",
      "Ideal after dinner or as a nightcap",
      "Mention the hand-cut ice and demerara syrup",
    ],
    spec: [
      { amount: "2 oz", ingredient: "Woodford Reserve Bourbon" },
      { amount: "0.25 oz", ingredient: "Demerara syrup (2:1)" },
      { amount: "2 dashes", ingredient: "Angostura bitters" },
      { amount: "1 dash", ingredient: "Orange bitters" },
    ],
    technique: "Stir over ice, strain",
    glass: "Rocks",
    ice: "Large cube",
    garnish: "Expressed orange peel",
    cheatSheet: "2 bourbon / 0.25 demerara / 2 ango / 1 orange bitters",
    batch: null,
    prep: ["Demerara Syrup (2:1)"],
  },
  {
    slug: "tropical-freeze",
    name: "Tropical Freeze",
    section: "pool-beach",
    spirit: "Rum",
    style: "Frozen",
    tagline: "Fruity & Frozen Poolside Blend",
    flavor: ["Tropical", "Sweet", "Icy-smooth"],
    photo: null,
    overview: "A vibrant frozen blend of rum, passion fruit, and coconut — built for pool decks.",
    selling: [
      "Perfect for guests who want something fun and tropical",
      "The ideal pool & beach order — easy drinking, big flavor",
      "Made with real passion fruit purée, not mix",
    ],
    spec: [
      { amount: "1.5 oz", ingredient: "Plantation 3 Star Rum" },
      { amount: "1 oz", ingredient: "Passion fruit purée" },
      { amount: "0.75 oz", ingredient: "Coconut cream" },
      { amount: "0.75 oz", ingredient: "Fresh lime juice" },
      { amount: "0.5 oz", ingredient: "Simple syrup" },
      { amount: "1 cup", ingredient: "Crushed ice" },
    ],
    technique: "Blend until smooth",
    glass: "Hurricane",
    ice: "Blended",
    garnish: "Pineapple wedge + umbrella",
    cheatSheet: "1.5 rum / 1 passion / 0.75 coconut / 0.75 lime / 0.5 simple / blend",
    batch: null,
    prep: ["Passion Fruit Purée", "Coconut Cream"],
  },
  {
    slug: "garden-tonic",
    name: "Garden Tonic",
    section: "zero-proof",
    spirit: "NA",
    style: "Highball",
    tagline: "Herbaceous & Crisp NA Highball",
    flavor: ["Herbal", "Bright", "Clean finish"],
    photo: null,
    overview: "A sophisticated zero-proof highball with cucumber, basil, and premium tonic.",
    selling: [
      "For guests skipping alcohol but wanting a thoughtful drink",
      "Great any time of day — lunch, dinner, poolside",
      "Emphasize the fresh herbs and house cucumber water",
    ],
    spec: [
      { amount: "2 oz", ingredient: "Cucumber water" },
      { amount: "0.75 oz", ingredient: "Fresh lime juice" },
      { amount: "0.5 oz", ingredient: "Basil syrup" },
      { amount: "Top", ingredient: "Fever-Tree tonic" },
    ],
    technique: "Build in glass",
    glass: "Highball",
    ice: "Collins cube",
    garnish: "Cucumber ribbon + basil leaf",
    cheatSheet: "2 cucumber / 0.75 lime / 0.5 basil syrup / tonic",
    batch: null,
    prep: ["Cucumber Water", "Basil Syrup"],
  },
];

const TECHNIQUES = [
  {
    id: "shaking",
    name: "Shaking",
    desc: "The foundation of citrus and spirit cocktails.",
    detail:
      "A proper shake chills, dilutes, and aerates your cocktail. Aim for 10–12 seconds of hard, deliberate shaking.",
    points: [
      "Fill shaker tin 2/3 with ice — use fresh, quality cubes",
      "Seal firmly and shake with force, not just motion",
      "10–12 seconds for standard shakes; 15+ for egg white drinks",
      "Double-strain through a Hawthorne and fine mesh for citrus cocktails",
      "Always taste the drink before serving",
    ],
  },
  {
    id: "stirring",
    name: "Stirring",
    desc: "For spirit-forward cocktails requiring clarity and silk.",
    detail:
      "Stirring preserves the texture and clarity of spirit-forward drinks. The goal is controlled dilution with zero aeration.",
    points: [
      "Use a mixing glass filled 2/3 with cracked ice",
      "Bar spoon held between fingers — stir from the wrist, not the arm",
      "30–45 rotations for proper dilution and chill",
      "Strain with a julep strainer for mixing glass, Hawthorne for tin",
      "Serve immediately — stirred drinks warm fast",
    ],
  },
  {
    id: "highballs",
    name: "Building Highballs",
    desc: "Speed, precision, and proper carbonation.",
    detail:
      "Highballs are the highest-volume drink in the program. Speed matters, but so does proper ice, pour order, and carbonation.",
    points: [
      "Always use a Collins cube or large format ice",
      "Spirit first, then modifier, then top with soda/tonic",
      "Pour carbonated liquid gently down the inside of the glass",
      "One gentle bar-spoon lift to integrate — never over-stir",
      "Garnish and serve immediately",
    ],
  },
  {
    id: "garnish",
    name: "Garnish Standards",
    desc: "Garnish is presentation — treat it like plating.",
    detail:
      "Every garnish should be intentional, fresh, and cleanly executed. No wilted herbs, no sloppy cuts.",
    points: [
      "Prep all garnishes fresh each shift — no day-old citrus wheels",
      "Express citrus peels over the drink, then place",
      "Herb garnishes: clap once between palms to release oils",
      "Keep garnish station organized with mise containers and damp towels",
      "If it doesn't look right, redo it",
    ],
  },
  {
    id: "bar-setup",
    name: "Bar Setup & Breakdown",
    desc: "A clean, organized bar is a fast bar.",
    detail:
      "Consistent setup and breakdown routines are the backbone of efficient service. Every shift starts and ends the same way.",
    points: [
      "Follow the posted station diagram — every bottle and tool in its place",
      "Check par levels for syrups, juices, and garnishes before service",
      "Ice wells filled, backup ice ready, glassware polished and racked",
      "Breakdown: clean as you go, deep-clean wells, restock for next shift",
      "Communicate shortages to the manager before you run out, not after",
    ],
  },
];

const FILTER_CHIPS = [
  { label: "Tequila", type: "spirit" },
  { label: "Whiskey", type: "spirit" },
  { label: "Vodka", type: "spirit" },
  { label: "Gin", type: "spirit" },
  { label: "Rum", type: "spirit" },
  { label: "NA", type: "spirit" },
];

// ─── SPIRIT / STYLE ICONS (SVG inline) ──────────────────────────────
function SpiritIcon({ spirit, size = 16 }) {
  const s = spirit?.toLowerCase();
  const c = "currentColor";
  if (s === "vodka")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <rect x="8" y="2" width="8" height="20" rx="2" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="10" y1="2" x2="10" y2="7" />
        <line x1="14" y1="2" x2="14" y2="7" />
      </svg>
    );
  if (s === "gin")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <path d="M12 2v4M12 6c-3 0-5 4-5 9s2 7 5 7 5-4 5-7-2-9-5-9z" />
        <circle cx="12" cy="13" r="1.5" fill={c} />
      </svg>
    );
  if (s === "whiskey")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <path d="M7 3h10l-1 18H8L7 3z" />
        <line x1="7" y1="3" x2="17" y2="3" />
        <path d="M9 12h6" />
      </svg>
    );
  if (s === "rum")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <path d="M8 4h8l-1.5 16h-5L8 4z" />
        <path d="M10 4c0-1 1-2 2-2s2 1 2 2" />
        <path d="M9 10h6" />
      </svg>
    );
  if (s === "na")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" />
        <path d="M9 9l6 6M15 9l-6 6" />
      </svg>
    );
  // default tequila / agave
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M12 22v-8M12 14c-2-3-5-6-5-10h10c0 4-3 7-5 10z" />
      <path d="M9 2l3 2 3-2" />
    </svg>
  );
}

function GlassIcon({ glass, size = 16 }) {
  const c = "currentColor";
  const g = glass?.toLowerCase();
  if (g === "rocks")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <path d="M5 6h14l-2 14H7L5 6z" />
        <line x1="5" y1="6" x2="19" y2="6" />
      </svg>
    );
  if (g === "coupe")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <path d="M5 4c0 5 3 8 7 8s7-3 7-8" />
        <line x1="12" y1="12" x2="12" y2="20" />
        <line x1="8" y1="20" x2="16" y2="20" />
      </svg>
    );
  // default highball / hurricane
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M7 2h10l-1.5 20h-7L7 2z" />
      <line x1="7" y1="2" x2="17" y2="2" />
    </svg>
  );
}

// ─── CHEVRON ─────────────────────────────────────────────────────────
function ChevronRight({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
function ChevronLeft({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="15 6 9 12 15 18" />
    </svg>
  );
}

function SearchIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

function PlayIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.55)" />
      <polygon points="10,8 17,12 10,16" fill="white" />
    </svg>
  );
}

// ─── NAV ICONS ───────────────────────────────────────────────────────
function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" />
    </svg>
  );
}
function CocktailIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M5 3h14l-7 9v7h-0l0-7L5 3z" />
      <line x1="8" y1="19" x2="16" y2="19" />
      <line x1="12" y1="12" x2="12" y2="19" />
    </svg>
  );
}
function TechIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} />
      <rect x="14" y="3" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} />
      <rect x="3" y="14" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} />
      <rect x="14" y="14" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} />
    </svg>
  );
}
function HeartIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21C12 21 4 14.5 4 8.5 4 5.42 6.42 3 9.5 3c1.74 0 3.41.81 4.5 2.09A6.04 6.04 0 0118.5 3C21.58 3 24 5.42 24 8.5 24 14.5 12 21 12 21z" transform="translate(-2,0)" />
    </svg>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #F5F0EB;
  --bg-card: #FFFFFF;
  --bg-dark: #1C1917;
  --text: #1C1917;
  --text-muted: #78716C;
  --text-light: #A8A29E;
  --accent-gold: #B8860B;
  --accent-warm: #92400E;
  --border: #E7E0D8;
  --radius: 14px;
  --radius-sm: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
  --shadow-lg: 0 4px 20px rgba(0,0,0,0.08);
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;
  --nav-height: 64px;
  --top-height: 56px;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

body { background: var(--bg); }

.app-shell {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--bg);
  font-family: var(--font-body);
  color: var(--text);
  position: relative;
  overflow-x: hidden;
}

/* ── TOP BAR ─── */
.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--top-height);
  display: flex;
  align-items: center;
  padding: 0 18px;
  background: rgba(245,240,235,0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.top-bar-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  letter-spacing: -0.01em;
  color: var(--text);
}
.top-bar-back {
  background: none;
  border: none;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
  margin-right: 8px;
}

/* ── BOTTOM NAV ─── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  height: calc(var(--nav-height) + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-light);
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 6px 12px;
  transition: color 0.15s;
}
.nav-item.active {
  color: var(--accent-gold);
}

/* ── CONTENT ─── */
.content {
  padding-bottom: calc(var(--nav-height) + var(--safe-bottom) + 20px);
}

/* ── HOME ─── */
.home-hero {
  padding: 28px 18px 18px;
}
.home-hero h1 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text);
}
.home-hero p {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 6px;
  font-weight: 500;
}

.section-tiles {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 18px;
  margin-top: 20px;
}
.section-tile {
  border-radius: var(--radius);
  padding: 22px 20px;
  color: #fff;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: none;
  text-align: left;
  width: 100%;
  font-family: var(--font-body);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.section-tile:active {
  transform: scale(0.985);
}
.section-tile h3 {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
  position: relative;
  z-index: 1;
}
.section-tile span {
  font-size: 12px;
  opacity: 0.7;
  font-weight: 500;
  position: relative;
  z-index: 1;
}
.section-tile::after {
  content: '';
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
}

.technique-tile {
  margin: 12px 18px 0;
  border-radius: var(--radius);
  padding: 20px;
  background: var(--bg-dark);
  color: #fff;
  cursor: pointer;
  border: none;
  text-align: left;
  width: calc(100% - 36px);
  font-family: var(--font-body);
  transition: transform 0.12s ease;
}
.technique-tile:active { transform: scale(0.985); }
.technique-tile h3 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
}
.technique-tile span {
  font-size: 12px;
  opacity: 0.6;
  font-weight: 500;
}

.filter-row {
  display: flex;
  gap: 8px;
  padding: 20px 18px 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.filter-row::-webkit-scrollbar { display: none; }
.chip {
  flex-shrink: 0;
  padding: 7px 16px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--bg-card);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  transition: all 0.12s;
  white-space: nowrap;
}
.chip:active, .chip.active {
  background: var(--text);
  color: #fff;
  border-color: var(--text);
}

/* ── COCKTAIL LIST ─── */
.search-wrap {
  padding: 16px 18px 0;
}
.search-input {
  width: 100%;
  padding: 11px 14px 11px 40px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  background: var(--bg-card);
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s;
}
.search-input:focus {
  border-color: var(--accent-gold);
}
.search-icon {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
  pointer-events: none;
}

.cocktail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 18px 0;
}
.cocktail-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 14px;
  border: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: var(--font-body);
  box-shadow: var(--shadow);
  transition: transform 0.1s, box-shadow 0.1s;
}
.cocktail-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-lg);
}
.cocktail-thumb {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.6);
}
.cocktail-card-info {
  flex: 1;
  min-width: 0;
}
.cocktail-card-info h4 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 2px;
}
.cocktail-card-section {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 3px;
}
.cocktail-card-tagline {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cocktail-card-icons {
  display: flex;
  gap: 6px;
  color: var(--text-light);
  margin-top: 5px;
}
.cocktail-card-chev {
  flex-shrink: 0;
  color: var(--text-light);
}

/* ── FILTER CHIPS ROW (cocktails page) ─── */
.filter-section {
  display: flex;
  gap: 8px;
  padding: 12px 18px 0;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.filter-section::-webkit-scrollbar { display: none; }

/* ── DETAIL PAGE ─── */
.detail-header {
  padding: 20px 18px 16px;
}
.detail-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.tag-section {
  background: var(--accent-gold);
  color: #fff;
}
.tag-spirit {
  background: rgba(28,25,23,0.08);
  color: var(--text);
}
.tag-style {
  background: rgba(28,25,23,0.05);
  color: var(--text-muted);
}
.detail-header h1 {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.detail-hero-photo {
  width: calc(100% - 36px);
  margin: 0 18px;
  height: 180px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.4);
  font-size: 13px;
  font-weight: 500;
}

.detail-block {
  padding: 20px 18px;
  border-top: 1px solid var(--border);
}
.detail-block h2 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text);
}
.detail-block h3 {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 14px 0 6px;
}
.detail-block p {
  font-size: 14px;
  line-height: 1.55;
  color: var(--text);
}
.detail-block ul {
  list-style: none;
  padding: 0;
}
.detail-block ul li {
  font-size: 14px;
  line-height: 1.55;
  color: var(--text);
  padding: 3px 0;
  padding-left: 14px;
  position: relative;
}
.detail-block ul li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 11px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-gold);
}

.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 7px 0;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  font-size: 14px;
}
.spec-amount {
  font-weight: 600;
  color: var(--accent-warm);
  flex-shrink: 0;
  width: 80px;
}
.spec-ingredient {
  flex: 1;
  color: var(--text);
}

.meta-row {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: var(--text-muted);
  padding: 5px 0;
}
.meta-row svg {
  flex-shrink: 0;
}

.cheat-sheet {
  background: var(--bg-dark);
  color: #fff;
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  font-family: 'DM Sans', monospace;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  margin-top: 10px;
}

.video-placeholder {
  background: var(--bg-dark);
  border-radius: var(--radius);
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  color: #fff;
  margin-bottom: 10px;
  cursor: pointer;
}
.video-placeholder span {
  font-size: 11px;
  opacity: 0.5;
}

.prep-link {
  display: inline-block;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-gold);
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

/* ── SECTION OVERVIEW ─── */
.section-header {
  padding: 28px 18px 20px;
  color: #fff;
  border-radius: 0 0 var(--radius) var(--radius);
}
.section-header h1 {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 6px;
}
.section-header p {
  font-size: 13px;
  opacity: 0.75;
  line-height: 1.4;
}

/* ── TECHNIQUES ─── */
.technique-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 16px;
  border: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: var(--font-body);
  box-shadow: var(--shadow);
  transition: transform 0.1s;
}
.technique-card:active { transform: scale(0.98); }
.technique-card h4 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 2px;
}
.technique-card p {
  font-size: 12px;
  color: var(--text-muted);
}

/* ── DETAIL: Technique ─── */
.technique-detail-header {
  padding: 24px 18px 16px;
}
.technique-detail-header h1 {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 800;
}

/* ── FOOTER ACTIONS ─── */
.footer-actions {
  display: flex;
  gap: 10px;
  padding: 16px 18px;
  border-top: 1px solid var(--border);
}
.btn-secondary {
  flex: 1;
  padding: 11px 0;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: transparent;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  transition: background 0.12s;
}
.btn-secondary:active {
  background: rgba(0,0,0,0.04);
}

/* ── EMPTY STATE ─── */
.empty-state {
  text-align: center;
  padding: 48px 18px;
  color: var(--text-light);
  font-size: 14px;
}

/* ── ANIMATION ─── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in {
  animation: fadeUp 0.3s ease both;
}
.fade-in-1 { animation-delay: 0.04s; }
.fade-in-2 { animation-delay: 0.08s; }
.fade-in-3 { animation-delay: 0.12s; }
.fade-in-4 { animation-delay: 0.16s; }
.fade-in-5 { animation-delay: 0.2s; }
`;

// ─── APP ─────────────────────────────────────────────────────────────
export default function App() {
  const [route, setRoute] = useState("/home");
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [route]);

  const navigate = (r, f = null) => {
    setRoute(r);
    if (f !== undefined) setFilter(f);
    setSearch("");
  };

  const activeTab = route.startsWith("/technique")
    ? "techniques"
    : route.startsWith("/cocktail") || route.startsWith("/section")
    ? "cocktails"
    : route === "/favorites"
    ? "favorites"
    : "home";

  // filter cocktails
  const filteredCocktails = COCKTAILS.filter((c) => {
    if (filter && c.spirit.toLowerCase() !== filter.toLowerCase() && c.section !== filter)
      return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // ── Render screens ──
  function renderScreen() {
    // HOME
    if (route === "/home") {
      return (
        <div className="content">
          <div className="home-hero fade-in">
            <h1>Highgate<br />Cocktail Academy</h1>
            <p>Internal cocktail &amp; training guide</p>
          </div>
          <div className="section-tiles">
            {Object.values(SECTIONS).map((s, i) => (
              <button
                key={s.id}
                className={`section-tile fade-in fade-in-${i + 1}`}
                style={{ background: s.bg }}
                onClick={() => navigate(`/sections/${s.id}`)}
              >
                <h3>{s.name}</h3>
                <span>{COCKTAILS.filter((c) => c.section === s.id).length} cocktails</span>
              </button>
            ))}
            <button
              className="technique-tile fade-in fade-in-5"
              onClick={() => navigate("/techniques")}
            >
              <h3>Learn Techniques</h3>
              <span>{TECHNIQUES.length} guides</span>
            </button>
          </div>
          <div className="filter-row fade-in fade-in-5" style={{paddingBottom: 8}}>
            {FILTER_CHIPS.map((c) => (
              <button
                key={c.label}
                className="chip"
                onClick={() => navigate("/cocktails", c.label)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // ALL COCKTAILS
    if (route === "/cocktails") {
      return (
        <div className="content">
          <div className="search-wrap fade-in" style={{ position: "relative" }}>
            <span className="search-icon"><SearchIcon /></span>
            <input
              className="search-input"
              placeholder="Search cocktails…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-section fade-in fade-in-1">
            <button
              className={`chip ${!filter ? "active" : ""}`}
              onClick={() => setFilter(null)}
            >
              All
            </button>
            {Object.values(SECTIONS).map((s) => (
              <button
                key={s.id}
                className={`chip ${filter === s.id ? "active" : ""}`}
                onClick={() => setFilter(filter === s.id ? null : s.id)}
              >
                {s.name.replace(" Cocktails", "")}
              </button>
            ))}
          </div>
          <div className="filter-section fade-in fade-in-2" style={{ paddingTop: 6 }}>
            {FILTER_CHIPS.map((c) => (
              <button
                key={c.label}
                className={`chip ${filter === c.label ? "active" : ""}`}
                onClick={() => setFilter(filter === c.label ? null : c.label)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="cocktail-list">
            {filteredCocktails.length === 0 && (
              <div className="empty-state">No cocktails match your filters.</div>
            )}
            {filteredCocktails.map((c, i) => {
              const sec = SECTIONS[c.section];
              return (
                <button
                  key={c.slug}
                  className={`cocktail-card fade-in fade-in-${Math.min(i + 1, 5)}`}
                  onClick={() => navigate(`/cocktails/${c.slug}`)}
                >
                  <div
                    className="cocktail-thumb"
                    style={{ background: sec?.bg || "#333" }}
                  >
                    <GlassIcon glass={c.glass} size={26} />
                  </div>
                  <div className="cocktail-card-info">
                    <div className="cocktail-card-section" style={{ color: sec?.accent }}>
                      {sec?.name}
                    </div>
                    <h4>{c.name}</h4>
                    <div className="cocktail-card-tagline">{c.tagline}</div>
                    <div className="cocktail-card-icons">
                      <SpiritIcon spirit={c.spirit} size={14} />
                      <GlassIcon glass={c.glass} size={14} />
                    </div>
                  </div>
                  <div className="cocktail-card-chev">
                    <ChevronRight />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // SECTION OVERVIEW
    const sectionMatch = route.match(/^\/sections\/(.+)/);
    if (sectionMatch) {
      const sec = SECTIONS[sectionMatch[1]];
      if (!sec) return <div className="empty-state">Section not found.</div>;
      const sectionCocktails = COCKTAILS.filter((c) => c.section === sec.id);
      return (
        <div className="content">
          <div className="section-header fade-in" style={{ background: sec.bg }}>
            <h1>{sec.name}</h1>
            <p>{sec.desc}</p>
          </div>
          <div className="cocktail-list" style={{ paddingTop: 16 }}>
            {sectionCocktails.map((c, i) => (
              <button
                key={c.slug}
                className={`cocktail-card fade-in fade-in-${Math.min(i + 1, 5)}`}
                onClick={() => navigate(`/cocktails/${c.slug}`)}
              >
                <div className="cocktail-thumb" style={{ background: sec.bg }}>
                  <GlassIcon glass={c.glass} size={26} />
                </div>
                <div className="cocktail-card-info">
                  <h4>{c.name}</h4>
                  <div className="cocktail-card-tagline">{c.tagline}</div>
                  <div className="cocktail-card-icons">
                    <SpiritIcon spirit={c.spirit} size={14} />
                    <GlassIcon glass={c.glass} size={14} />
                  </div>
                </div>
                <div className="cocktail-card-chev"><ChevronRight /></div>
              </button>
            ))}
          </div>
          <div className="footer-actions">
            <button className="btn-secondary" onClick={() => navigate("/cocktails")}>
              View all cocktails
            </button>
          </div>
        </div>
      );
    }

    // COCKTAIL DETAIL
    const detailMatch = route.match(/^\/cocktails\/(.+)/);
    if (detailMatch) {
      const c = COCKTAILS.find((x) => x.slug === detailMatch[1]);
      if (!c) return <div className="empty-state">Cocktail not found.</div>;
      const sec = SECTIONS[c.section];
      return (
        <div className="content">
          <div className="detail-header fade-in">
            <div className="detail-tags">
              <span className="tag tag-section" style={{ background: sec?.accent }}>{sec?.name}</span>
              <span className="tag tag-spirit">{c.spirit}</span>
              <span className="tag tag-style">{c.style}</span>
            </div>
            <h1>{c.name}</h1>
          </div>
          <div
            className="detail-hero-photo fade-in fade-in-1"
            style={{ background: sec?.bg || "#333" }}
          >
            <GlassIcon glass={c.glass} size={48} />
          </div>

          {/* Block 1: Overview */}
          <div className="detail-block fade-in fade-in-2">
            <h2>Overview</h2>
            <p>{c.overview}</p>
            <h3>Flavor Profile</h3>
            <ul>
              {c.flavor.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <h3>Selling Guide</h3>
            <ul>
              {c.selling.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Block 2: Spec */}
          <div className="detail-block fade-in fade-in-3">
            <h2>Single-Serve Spec</h2>
            {c.spec.map((s, i) => (
              <div className="spec-row" key={i}>
                <span className="spec-amount">{s.amount}</span>
                <span className="spec-ingredient">{s.ingredient}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              <div className="meta-row">
                <TechIcon active={false} /> <span>Technique: {c.technique}</span>
              </div>
              <div className="meta-row">
                <GlassIcon glass={c.glass} size={16} /> <span>Glass: {c.glass} · Ice: {c.ice}</span>
              </div>
              <div className="meta-row">
                <span style={{ fontSize: 15, marginRight: 2 }}>🌿</span> <span>Garnish: {c.garnish}</span>
              </div>
            </div>
            <div className="cheat-sheet">{c.cheatSheet}</div>
          </div>

          {/* Block 3: Batch & Prep */}
          <div className="detail-block fade-in fade-in-4">
            <h2>Batch &amp; Prep</h2>
            {c.batch ? (
              <>
                <h3>Batch Recipe ({c.batch.yield})</h3>
                <ul>
                  {c.batch.items.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                No batch recipe — this cocktail is built to order.
              </p>
            )}
            {c.prep.length > 0 && (
              <>
                <h3>Prep Components</h3>
                <ul>
                  {c.prep.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                <span className="prep-link">See full prep method in Prep Library →</span>
              </>
            )}
          </div>

          {/* Block 4: Videos */}
          <div className="detail-block fade-in fade-in-5">
            <h2>Videos</h2>
            <div className="video-placeholder">
              <PlayIcon />
              <span>Prep video · 2 min</span>
            </div>
            <div className="video-placeholder">
              <PlayIcon />
              <span>Execution video · 1 min</span>
            </div>
          </div>

          <div className="footer-actions">
            <button className="btn-secondary" onClick={() => navigate(`/sections/${c.section}`)}>
              Back to {sec?.name}
            </button>
            <button className="btn-secondary" onClick={() => navigate("/cocktails")}>
              All cocktails
            </button>
          </div>
        </div>
      );
    }

    // TECHNIQUES OVERVIEW
    if (route === "/techniques") {
      return (
        <div className="content">
          <div className="home-hero fade-in">
            <h1>Techniques<br />&amp; Standards</h1>
            <p>Execution guides for the Highgate program</p>
          </div>
          <div className="cocktail-list">
            {TECHNIQUES.map((t, i) => (
              <button
                key={t.id}
                className={`technique-card fade-in fade-in-${Math.min(i + 1, 5)}`}
                onClick={() => navigate(`/techniques/${t.id}`)}
              >
                <div>
                  <h4>{t.name}</h4>
                  <p>{t.desc}</p>
                </div>
                <ChevronRight />
              </button>
            ))}
          </div>
        </div>
      );
    }

    // TECHNIQUE DETAIL
    const techMatch = route.match(/^\/techniques\/(.+)/);
    if (techMatch) {
      const t = TECHNIQUES.find((x) => x.id === techMatch[1]);
      if (!t) return <div className="empty-state">Technique not found.</div>;
      return (
        <div className="content">
          <div className="technique-detail-header fade-in">
            <h1>{t.name}</h1>
          </div>
          <div className="detail-block fade-in fade-in-1" style={{ borderTop: "none", paddingTop: 0 }}>
            <p>{t.detail}</p>
            <h3>Key Points</h3>
            <ul>
              {t.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="detail-block fade-in fade-in-2">
            <div className="video-placeholder" style={{height: 100}}>
              <PlayIcon />
              <span>Watch technique video</span>
            </div>
          </div>
          <div className="footer-actions">
            <button className="btn-secondary" onClick={() => navigate("/techniques")}>
              All techniques
            </button>
          </div>
        </div>
      );
    }

    // FAVORITES (placeholder)
    if (route === "/favorites") {
      return (
        <div className="content">
          <div className="home-hero fade-in">
            <h1>Favorites</h1>
            <p>Your saved cocktails and techniques</p>
          </div>
          <div className="empty-state fade-in fade-in-1">
            Coming soon — save your go-to recipes here.
          </div>
        </div>
      );
    }

    return <div className="empty-state">Page not found.</div>;
  }

  // derive back button logic
  const showBack =
    route !== "/home" &&
    route !== "/cocktails" &&
    route !== "/techniques" &&
    route !== "/favorites";

  const backTarget = route.startsWith("/cocktails/")
    ? "/cocktails"
    : route.startsWith("/sections/")
    ? "/home"
    : route.startsWith("/techniques/")
    ? "/techniques"
    : "/home";

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell" ref={scrollRef}>
        {/* TOP BAR */}
        <div className="top-bar">
          {showBack && (
            <button className="top-bar-back" onClick={() => navigate(backTarget)}>
              <ChevronLeft size={18} />
              Back
            </button>
          )}
          {!showBack && <span className="top-bar-title">Highgate Academy</span>}
        </div>

        {renderScreen()}

        {/* BOTTOM NAV */}
        <div className="bottom-nav">
          <button className={`nav-item ${activeTab === "home" ? "active" : ""}`} onClick={() => navigate("/home")}>
            <HomeIcon active={activeTab === "home"} />
            Home
          </button>
          <button className={`nav-item ${activeTab === "cocktails" ? "active" : ""}`} onClick={() => { setFilter(null); navigate("/cocktails"); }}>
            <CocktailIcon active={activeTab === "cocktails"} />
            Cocktails
          </button>
          <button className={`nav-item ${activeTab === "techniques" ? "active" : ""}`} onClick={() => navigate("/techniques")}>
            <TechIcon active={activeTab === "techniques"} />
            Techniques
          </button>
          <button className={`nav-item ${activeTab === "favorites" ? "active" : ""}`} onClick={() => navigate("/favorites")}>
            <HeartIcon active={activeTab === "favorites"} />
            Favorites
          </button>
        </div>
      </div>
    </>
  );
}
