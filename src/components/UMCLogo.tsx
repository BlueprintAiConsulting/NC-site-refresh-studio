interface UMCLogoProps {
  className?: string;
  size?: number;
}

export function UMCLogo({ className = "", size = 40 }: UMCLogoProps) {
  return (
    <svg
      viewBox="0 0 100 140"
      width={size}
      height={size * 1.4}
      className={className}
      aria-label="United Methodist Church Cross and Flame"
      role="img"
    >
      {/* Cross - Black */}
      <rect x="40" y="0" width="20" height="100" fill="currentColor" className="text-foreground" />
      <rect x="20" y="25" width="60" height="20" fill="currentColor" className="text-foreground" />
      
      {/* Flame - Two tongues of fire */}
      {/* Left flame */}
      <path
        d="M30 105 C30 85, 45 80, 45 95 C45 75, 35 70, 35 55 C50 70, 48 85, 48 100 C48 110, 38 115, 30 105"
        fill="hsl(var(--umc-red))"
      />
      {/* Right flame */}
      <path
        d="M70 105 C70 85, 55 80, 55 95 C55 75, 65 70, 65 55 C50 70, 52 85, 52 100 C52 110, 62 115, 70 105"
        fill="hsl(var(--umc-red))"
      />
    </svg>
  );
}
