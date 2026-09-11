import React from 'react';

interface EngineeringWatermarkProps {
  opacity?: string;
  className?: string;
}

export const EngineeringWatermark: React.FC<EngineeringWatermarkProps> = ({
  opacity = 'opacity-[0.038]',
  className = '',
}) => {
  return (
    <div 
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 ${opacity} ${className}`}
      aria-hidden="true"
    >
      <svg 
        className="w-full h-full text-slate-800" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 800 1130" 
        fill="none" 
        stroke="currentColor"
      >
        {/* Subtle engineering grid background */}
        <defs>
          <pattern id="cad-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
          </pattern>
          <pattern id="cad-subgrid" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        
        <rect width="800" height="1130" fill="url(#cad-grid)" />
        <rect width="800" height="1130" fill="url(#cad-subgrid)" />

        {/* Large Mechanical Gear in Top Right */}
        <g transform="translate(680, 160)" strokeWidth="1.5">
          <circle cx="0" cy="0" r="130" strokeWidth="2" />
          <circle cx="0" cy="0" r="110" strokeDasharray="6,4" />
          <circle cx="0" cy="0" r="60" strokeWidth="2" />
          <circle cx="0" cy="0" r="30" fill="currentColor" fillOpacity="0.1" />
          {/* Keyway */}
          <rect x="-6" y="-35" width="12" height="15" />
          {/* Gear Teeth */}
          {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map((deg) => (
            <path
              key={`tooth-${deg}`}
              d="M -12 -130 L -8 -150 L 8 -150 L 12 -130 Z"
              transform={`rotate(${deg})`}
              fill="currentColor"
              fillOpacity="0.2"
            />
          ))}
          {/* Internal spokes */}
          <line x1="-110" y1="0" x2="110" y2="0" strokeWidth="2" />
          <line x1="0" y1="-110" x2="0" y2="110" strokeWidth="2" />
          <line x1="-78" y1="-78" x2="78" y2="78" strokeWidth="1.5" />
          <line x1="-78" y1="78" x2="78" y2="-78" strokeWidth="1.5" />
        </g>

        {/* Meshing Secondary Pinion Gear */}
        <g transform="translate(540, 290)" strokeWidth="1.2">
          <circle cx="0" cy="0" r="70" />
          <circle cx="0" cy="0" r="35" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="15" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <path
              key={`pinion-${deg}`}
              d="M -8 -70 L -5 -82 L 5 -82 L 8 -70 Z"
              transform={`rotate(${deg})`}
              fill="currentColor"
              fillOpacity="0.2"
            />
          ))}
        </g>

        {/* Heavy Machinery / Crane Arm / Excavator Hydraulic Boom Silhouette in Center-Left */}
        <g transform="translate(60, 520)" strokeWidth="1.2">
          {/* Hydraulic Cylinder */}
          <rect x="20" y="40" width="180" height="24" rx="4" />
          <rect x="200" y="46" width="120" height="12" />
          <circle cx="20" cy="52" r="8" />
          <circle cx="320" cy="52" r="8" />

          {/* Boom Truss Schematic */}
          <line x1="10" y1="120" x2="360" y2="40" strokeWidth="2" />
          <line x1="20" y1="140" x2="350" y2="70" strokeWidth="2" />
          <line x1="50" y1="110" x2="60" y2="135" />
          <line x1="100" y1="98" x2="115" y2="128" />
          <line x1="150" y1="85" x2="170" y2="120" />
          <line x1="200" y1="72" x2="225" y2="110" />
          <line x1="250" y1="60" x2="280" y2="98" />
          <line x1="300" y1="48" x2="330" y2="85" />
          {/* Diagonal Bracing */}
          <line x1="50" y1="110" x2="115" y2="128" strokeDasharray="4,3" />
          <line x1="100" y1="98" x2="170" y2="120" strokeDasharray="4,3" />
          <line x1="150" y1="85" x2="225" y2="110" strokeDasharray="4,3" />
          <line x1="200" y1="72" x2="280" y2="98" strokeDasharray="4,3" />
        </g>

        {/* Large Mechanical Assembly in Bottom Center / Left */}
        <g transform="translate(140, 960)" strokeWidth="1.5">
          <circle cx="0" cy="0" r="110" />
          <circle cx="0" cy="0" r="90" strokeDasharray="5,4" />
          <circle cx="0" cy="0" r="50" />
          <circle cx="0" cy="0" r="22" fill="currentColor" fillOpacity="0.15" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <path
              key={`gear-bot-${deg}`}
              d="M -10 -110 L -6 -126 L 6 -126 L 10 -110 Z"
              transform={`rotate(${deg})`}
              fill="currentColor"
              fillOpacity="0.2"
            />
          ))}
          {/* Planetary gears inside */}
          <circle cx="0" cy="-68" r="18" />
          <circle cx="58" cy="34" r="18" />
          <circle cx="-58" cy="34" r="18" />
        </g>

        {/* Technical Dimension Lines & Engineering Caliper Marks in Bottom Right */}
        <g transform="translate(620, 980)" strokeWidth="1">
          {/* Horizontal Dimension Arrow */}
          <line x1="-120" y1="0" x2="120" y2="0" />
          <path d="M -120 0 L -110 -4 L -110 4 Z" fill="currentColor" />
          <path d="M 120 0 L 110 -4 L 110 4 Z" fill="currentColor" />
          <line x1="-120" y1="-15" x2="-120" y2="15" />
          <line x1="120" y1="-15" x2="120" y2="15" />
          <text x="0" y="-8" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="currentColor" stroke="none">
            R120.00 ± 0.05
          </text>

          {/* Caliper / Vernier Guide Lines */}
          <line x1="-80" y1="30" x2="80" y2="30" strokeWidth="1.5" />
          {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((pos) => (
            <line key={`tick-${pos}`} x1={pos} y1="30" x2={pos} y2="42" strokeWidth="1" />
          ))}
          {[-70, -50, -30, -10, 10, 30, 50, 70].map((pos) => (
            <line key={`subtick-${pos}`} x1={pos} y1="30" x2={pos} y2="36" strokeWidth="0.75" />
          ))}
        </g>

        {/* Technical Blueprint Border Accents */}
        <rect x="25" y="25" width="750" height="1080" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="10,6" />
        <rect x="35" y="35" width="730" height="1060" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    </div>
  );
};
