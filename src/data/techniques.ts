import type { Technique } from "../types";

export const techniques: Technique[] = [
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
