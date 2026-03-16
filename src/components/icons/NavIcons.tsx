interface IconProps {
  active: boolean;
}

export function HomeIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" />
    </svg>
  );
}

export function CocktailIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M5 3h14l-7 9v7h-0l0-7L5 3z" />
      <line x1="8" y1="19" x2="16" y2="19" />
      <line x1="12" y1="12" x2="12" y2="19" />
    </svg>
  );
}

export function TechIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} />
      <rect x="14" y="3" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} />
      <rect x="3" y="14" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} />
      <rect x="14" y="14" width="7" height="7" rx="1" fill={active ? "currentColor" : "none"} />
    </svg>
  );
}

export function HeartIcon({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21C12 21 4 14.5 4 8.5 4 5.42 6.42 3 9.5 3c1.74 0 3.41.81 4.5 2.09A6.04 6.04 0 0118.5 3C21.58 3 24 5.42 24 8.5 24 14.5 12 21 12 21z" transform="translate(-2,0)" />
    </svg>
  );
}
