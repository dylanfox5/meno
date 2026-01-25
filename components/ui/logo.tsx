interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <div className={`text-primary ${className}`}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="vineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "currentColor", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "currentColor", stopOpacity: 0.7 }}
            />
          </linearGradient>
        </defs>
        <g id="vine-logo-large">
          <path
            d="M 60 140 Q 80 110 90 80 Q 100 50 100 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 90 80 Q 70 70 55 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 100 50 Q 120 40 135 30"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <ellipse
            cx="100"
            cy="22"
            rx="12"
            ry="18"
            fill="url(#vineGradient)"
            opacity="0.9"
            transform="rotate(-10 100 22)"
          />
          <ellipse
            cx="52"
            cy="58"
            rx="11"
            ry="16"
            fill="url(#vineGradient)"
            opacity="0.85"
            transform="rotate(-45 52 58)"
          />
          <ellipse
            cx="138"
            cy="28"
            rx="11"
            ry="16"
            fill="url(#vineGradient)"
            opacity="0.85"
            transform="rotate(30 138 28)"
          />
          <ellipse
            cx="82"
            cy="95"
            rx="10"
            ry="14"
            fill="url(#vineGradient)"
            opacity="0.8"
            transform="rotate(-60 82 95)"
          />
          <ellipse
            cx="105"
            cy="60"
            rx="9"
            ry="13"
            fill="url(#vineGradient)"
            opacity="0.75"
            transform="rotate(20 105 60)"
          />
          <circle cx="100" cy="30" r="4" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}
