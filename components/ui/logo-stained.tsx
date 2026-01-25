interface LogoStainedProps {
  className?: string;
}

export function LogoStained({ className = "w-8 h-8" }: LogoStainedProps) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="lightGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#d1fae5", stopOpacity: 0.9 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#a7f3d0", stopOpacity: 0.85 }}
            />
          </linearGradient>

          <linearGradient id="skyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#bae6fd", stopOpacity: 0.9 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#7dd3fc", stopOpacity: 0.85 }}
            />
          </linearGradient>

          <linearGradient id="tealGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#5eead4", stopOpacity: 0.9 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#2dd4bf", stopOpacity: 0.85 }}
            />
          </linearGradient>

          <linearGradient id="oceanBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#38bdf8", stopOpacity: 0.9 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#0284c7", stopOpacity: 0.85 }}
            />
          </linearGradient>

          <linearGradient id="emeraldGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#34d399", stopOpacity: 0.9 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#10b981", stopOpacity: 0.85 }}
            />
          </linearGradient>

          <linearGradient id="cyanBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#a5f3fc", stopOpacity: 0.9 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#67e8f9", stopOpacity: 0.85 }}
            />
          </linearGradient>

          <linearGradient id="mintTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#99f6e4", stopOpacity: 0.9 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#5eead4", stopOpacity: 0.85 }}
            />
          </linearGradient>
        </defs>

        <g id="glass-panels">
          <path
            d="M 70 30 L 100 20 L 130 30 L 100 50 Z"
            fill="url(#cyanBlue)"
          />
          <path d="M 50 70 Q 50 40 70 30 L 100 50 Z" fill="url(#lightGreen)" />
          <path d="M 150 70 Q 150 40 130 30 L 100 50 Z" fill="url(#skyBlue)" />
          <path
            d="M 50 70 L 100 50 L 100 110 L 50 130 Z"
            fill="url(#emeraldGreen)"
          />
          <path
            d="M 150 70 L 100 50 L 100 110 L 150 130 Z"
            fill="url(#oceanBlue)"
          />
          <path
            d="M 50 130 L 100 110 L 100 180 L 50 180 Z"
            fill="url(#tealGreen)"
          />
          <path
            d="M 150 130 L 100 110 L 100 180 L 150 180 Z"
            fill="url(#mintTeal)"
          />
        </g>

        <g
          id="leading"
          stroke="#1f2937"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="100" y1="20" x2="100" y2="180" />
          <line x1="50" y1="70" x2="150" y2="70" />
          <line x1="50" y1="130" x2="150" y2="130" />
          <line x1="50" y1="70" x2="100" y2="50" />
          <line x1="150" y1="70" x2="100" y2="50" />
          <line x1="70" y1="30" x2="100" y2="50" />
          <line x1="130" y1="30" x2="100" y2="50" />
          <line x1="50" y1="130" x2="100" y2="110" />
          <line x1="150" y1="130" x2="100" y2="110" />
        </g>

        <path
          d="M 50 180 L 50 70 Q 50 40 70 30 L 100 20 L 130 30 Q 150 40 150 70 L 150 180 Z"
          fill="none"
          stroke="#1f2937"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
