import React from 'react';

interface BackgroundRotatingGearsProps {
  className?: string;
}

export const BackgroundRotatingGears: React.FC<BackgroundRotatingGearsProps> = ({
  className = ''
}) => {
  return (
    <div 
      className={`pointer-events-none fixed inset-0 overflow-hidden select-none z-0 opacity-[0.04] dark:opacity-[0.055] ${className}`}
      aria-hidden="true"
    >
      {/* Top Right Meshing Gear Pair (Hero Section) */}
      <div className="absolute -top-16 -right-16 md:-top-20 md:-right-20 w-[420px] h-[420px] md:w-[580px] md:h-[580px] text-[var(--ink)]">
        <svg 
          viewBox="0 0 500 500" 
          fill="none" 
          stroke="currentColor" 
          className="w-full h-full animate-gear-slow origin-center"
        >
          {/* Main Large Drive Gear */}
          <circle cx="250" cy="250" r="180" strokeWidth="3" />
          <circle cx="250" cy="250" r="155" strokeWidth="1.5" strokeDasharray="6,4" />
          <circle cx="250" cy="250" r="90" strokeWidth="2.5" />
          <circle cx="250" cy="250" r="45" strokeWidth="3" fill="currentColor" fillOpacity="0.1" />
          {/* Shaft keyway */}
          <rect x="242" y="195" width="16" height="20" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
          {/* 20 Involute Gear Teeth */}
          {[0, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180, 198, 216, 234, 252, 270, 288, 306, 324, 342].map((deg) => (
            <path
              key={`main-tooth-${deg}`}
              d="M 235 60 L 240 38 L 260 38 L 265 60 Z"
              transform={`rotate(${deg} 250 250)`}
              fill="currentColor"
              fillOpacity="0.15"
              strokeWidth="2"
            />
          ))}
          {/* Spokes */}
          <line x1="250" y1="95" x2="250" y2="405" strokeWidth="2.5" />
          <line x1="95" y1="250" x2="405" y2="250" strokeWidth="2.5" />
          <line x1="140" y1="140" x2="360" y2="360" strokeWidth="2" />
          <line x1="140" y1="360" x2="360" y2="140" strokeWidth="2" />
        </svg>
      </div>

      {/* Meshing Pinion Gear in Upper Right */}
      <div className="absolute top-[280px] -right-10 md:top-[340px] md:right-32 w-[220px] h-[220px] md:w-[280px] md:h-[280px] text-[var(--blue)]">
        <svg 
          viewBox="0 0 300 300" 
          fill="none" 
          stroke="currentColor" 
          className="w-full h-full animate-gear-reverse origin-center"
        >
          <circle cx="150" cy="150" r="105" strokeWidth="2.5" />
          <circle cx="150" cy="150" r="88" strokeWidth="1.2" strokeDasharray="5,3" />
          <circle cx="150" cy="150" r="48" strokeWidth="2" />
          <circle cx="150" cy="150" r="22" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
          {/* 14 Gear Teeth */}
          {[0, 25.7, 51.4, 77.1, 102.8, 128.5, 154.2, 180, 205.7, 231.4, 257.1, 282.8, 308.5, 334.2].map((deg, i) => (
            <path
              key={`pinion-tooth-${i}`}
              d="M 140 40 L 143 25 L 157 25 L 160 40 Z"
              transform={`rotate(${deg} 150 150)`}
              fill="currentColor"
              fillOpacity="0.15"
              strokeWidth="1.8"
            />
          ))}
          <line x1="150" y1="62" x2="150" y2="238" strokeWidth="1.8" />
          <line x1="62" y1="150" x2="238" y2="150" strokeWidth="1.8" />
        </svg>
      </div>

      {/* Subtle Planetary Gear in Mid Left (Trabalhos/Serviços area) */}
      <div className="absolute top-[1100px] -left-24 md:top-[1250px] md:-left-20 w-[360px] h-[360px] md:w-[460px] md:h-[460px] text-[var(--ink)]">
        <svg 
          viewBox="0 0 400 400" 
          fill="none" 
          stroke="currentColor" 
          className="w-full h-full animate-gear-slow origin-center"
        >
          <circle cx="200" cy="200" r="145" strokeWidth="2.5" />
          <circle cx="200" cy="200" r="120" strokeWidth="1.5" strokeDasharray="6,4" />
          <circle cx="200" cy="200" r="75" strokeWidth="2" />
          <circle cx="200" cy="200" r="32" strokeWidth="2.5" fill="currentColor" fillOpacity="0.08" />
          {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
            <path
              key={`mid-gear-${deg}`}
              d="M 191 50 L 194 34 L 206 34 L 209 50 Z"
              transform={`rotate(${deg} 200 200)`}
              fill="currentColor"
              fillOpacity="0.12"
              strokeWidth="2"
            />
          ))}
          {/* Internal planetary satellite circles */}
          <circle cx="200" cy="100" r="24" strokeWidth="1.5" />
          <circle cx="286" cy="250" r="24" strokeWidth="1.5" />
          <circle cx="114" cy="250" r="24" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Secondary Companion Gear for Mid Left */}
      <div className="absolute top-[1380px] left-36 md:top-[1580px] md:left-48 w-[190px] h-[190px] text-[var(--blue)]">
        <svg 
          viewBox="0 0 200 200" 
          fill="none" 
          stroke="currentColor" 
          className="w-full h-full animate-gear-reverse origin-center"
        >
          <circle cx="100" cy="100" r="70" strokeWidth="2" />
          <circle cx="100" cy="100" r="35" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="15" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <path
              key={`small-gear-${deg}`}
              d="M 94 28 L 96 16 L 104 16 L 106 28 Z"
              transform={`rotate(${deg} 100 100)`}
              fill="currentColor"
              fillOpacity="0.15"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
