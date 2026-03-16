interface Props {
  spirit: string;
  size?: number;
}

export default function SpiritIcon({ spirit, size = 16 }: Props) {
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

  // default: tequila / agave
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M12 22v-8M12 14c-2-3-5-6-5-10h10c0 4-3 7-5 10z" />
      <path d="M9 2l3 2 3-2" />
    </svg>
  );
}
