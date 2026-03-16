interface Props {
  glass: string;
  size?: number;
}

export default function GlassIcon({ glass, size = 16 }: Props) {
  const c = "currentColor";
  const g = glass?.toLowerCase();

  if (g === "rocks" || g === "rocks glass")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <path d="M5 6h14l-2 14H7L5 6z" />
        <line x1="5" y1="6" x2="19" y2="6" />
      </svg>
    );

  if (g === "coupe" || g?.includes("martini"))
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
        <path d="M5 4c0 5 3 8 7 8s7-3 7-8" />
        <line x1="12" y1="12" x2="12" y2="20" />
        <line x1="8" y1="20" x2="16" y2="20" />
      </svg>
    );

  // default: highball / hurricane / copa / tall glass
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5">
      <path d="M7 2h10l-1.5 20h-7L7 2z" />
      <line x1="7" y1="2" x2="17" y2="2" />
    </svg>
  );
}
