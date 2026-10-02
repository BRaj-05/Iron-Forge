import type { CSSProperties } from "react";

export function Logo({ size = 38, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      style={{ display: "block", flex: "0 0 auto", ...style }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" fill="url(#logoGradient)" />
      <rect x="7" y="21" width="4" height="6" rx="1" fill="white" />
      <rect x="13" y="18" width="3.5" height="12" rx="1.2" fill="white" />
      <rect x="19" y="22" width="10" height="4" rx="1.2" fill="white" />
      <rect x="31.5" y="18" width="3.5" height="12" rx="1.2" fill="white" />
      <rect x="37" y="21" width="4" height="6" rx="1" fill="white" />
      <path d="M22.4 14.5C25.8 16.4 27.3 19 27 22.1C24.5 20.9 22.4 18.3 22.4 14.5Z" fill="#FFF7ED" opacity="0.82" />
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb923c" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
