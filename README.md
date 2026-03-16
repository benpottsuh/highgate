# Highgate Cocktail Academy

A mobile-first internal web app for bartenders, barbacks, and managers. Training and reference tool for the Highgate cocktail menu.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tooling)
- **Tailwind CSS v4**
- **React Router v7** (client-side routing)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Project Structure

```
src/
├── components/       # Shared UI components
│   ├── BottomNav.tsx     # Mobile persistent bottom navigation
│   ├── Chip.tsx          # Reusable filter chip / tag badge
│   ├── CocktailCard.tsx  # Cocktail list card
│   ├── Layout.tsx        # App shell (desktop nav + content + mobile nav)
│   ├── SearchInput.tsx   # Search input with clear button
│   ├── SectionCard.tsx   # Section overview card
│   └── TechniqueCard.tsx # Technique list card
├── data/             # Seed data and access utilities
│   ├── cocktails.ts      # 8 sample cocktails
│   ├── sections.ts       # 4 menu sections
│   ├── techniques.ts     # 5 bar techniques
│   └── index.ts          # Lookups, filters, and helpers
├── pages/            # Route-level page components
│   ├── Home.tsx
│   ├── Cocktails.tsx
│   ├── CocktailDetail.tsx
│   ├── SectionOverview.tsx
│   ├── Techniques.tsx
│   └── TechniqueDetail.tsx
├── types/
│   └── index.ts          # TypeScript interfaces
├── App.tsx               # Router configuration
├── main.tsx              # Entry point
└── index.css             # Design system and global styles
```

## Routes

| Route | Description |
|---|---|
| `/` | Home — section cards, quick actions |
| `/cocktails` | All cocktails — search + filter by section/spirit |
| `/cocktails/:id` | Cocktail detail — spec, selling guide, prep, videos |
| `/sections/:id` | Section overview — filtered cocktail list |
| `/techniques` | Techniques list |
| `/techniques/:id` | Technique detail — description + key points |

## Plugging in Real Data

Replace the arrays in `src/data/cocktails.ts`, `src/data/sections.ts`, and `src/data/techniques.ts` with your real menu data. The TypeScript interfaces in `src/types/index.ts` define the expected shape — your Excel export just needs to match those fields.

## Future Enhancements

- Authentication (currently structured for it, no auth in v1)
- Real video embeds (currently placeholder URLs)
- Backend API / database (currently in-memory seed data)
- Quiz/training mode
