import React from 'react';
import { Cog } from 'lucide-react';

export const EngineeringBackgroundTheme: React.FC = () => {
  return (
    <div
      id="engineering-theme-backdrop"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Ultra-subtle CAD Engineering Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B1E3D08_1px,transparent_1px),linear-gradient(to_bottom,#0B1E3D08_1px,transparent_1px)] bg-[size:48px_48px]"></div>

      {/* 2. Secondary fine millimeter grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1565D804_1px,transparent_1px),linear-gradient(to_bottom,#1565D804_1px,transparent_1px)] bg-[size:12px_12px]"></div>

      {/* 3. Subtle Technical Compass & Gear Watermarks */}
      {/* Top Left Giant Technical Gear */}
      <div className="absolute -top-28 -left-28 w-96 h-96 opacity-[0.035] animate-[spin_60s_linear_infinite] text-[#0B1E3D]">
        <Cog className="w-full h-full stroke-[1]" />
      </div>

      {/* Mid Right Floating Technical Gear */}
      <div className="absolute top-1/3 -right-32 w-80 h-80 opacity-[0.03] animate-[spin_45s_linear_infinite_reverse] text-[#1565D8]">
        <Cog className="w-full h-full stroke-[1]" />
      </div>

      {/* Bottom Left Gear */}
      <div className="absolute bottom-20 -left-24 w-72 h-72 opacity-[0.025] animate-[spin_50s_linear_infinite] text-[#0B1E3D]">
        <Cog className="w-full h-full stroke-[1]" />
      </div>

      {/* 4. Architectural & Mechanical Dimension Schematics (Subtle SVG Overlays) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] stroke-slate-900 fill-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Crosshair marker */}
          <pattern id="cad-crosshair" width="192" height="192" patternUnits="userSpaceOnUse">
            <path d="M 96,88 L 96,104 M 88,96 L 104,96" strokeWidth="0.75" stroke="#0B1E3D" />
            <circle cx="96" cy="96" r="3" strokeWidth="0.5" stroke="#1565D8" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#cad-crosshair)" />

        {/* Top-Right Blueprint Dimension Annotations */}
        <g transform="translate(100, 140)" className="hidden md:block">
          <circle cx="0" cy="0" r="45" strokeDasharray="3 3" strokeWidth="0.75" />
          <circle cx="0" cy="0" r="90" strokeDasharray="6 4" strokeWidth="0.75" />
          <line x1="-110" y1="0" x2="110" y2="0" strokeDasharray="2 2" strokeWidth="0.5" />
          <line x1="0" y1="-110" x2="0" y2="110" strokeDasharray="2 2" strokeWidth="0.5" />
          <text x="12" y="-12" fill="#0B1E3D" fontSize="8" fontFamily="monospace" fontWeight="bold">
            R=90.00mm
          </text>
          <text x="12" y="24" fill="#1565D8" fontSize="7" fontFamily="monospace">
            Ø 180 TOL ±0.02
          </text>
        </g>

        {/* Bottom-Right Isometric Coordinate Lines */}
        <g transform="translate(1200, 680)" className="hidden lg:block">
          <line x1="0" y1="0" x2="150" y2="86.6" strokeWidth="0.75" />
          <line x1="0" y1="0" x2="-150" y2="86.6" strokeWidth="0.75" />
          <line x1="0" y1="0" x2="0" y2="-150" strokeWidth="0.75" />
          <text x="160" y="90" fill="#0B1E3D" fontSize="8" fontFamily="monospace">AXIS-X [30°]</text>
          <text x="-210" y="90" fill="#0B1E3D" fontSize="8" fontFamily="monospace">AXIS-Y [150°]</text>
          <text x="-15" y="-160" fill="#1565D8" fontSize="8" fontFamily="monospace">AXIS-Z [90°]</text>
        </g>
      </svg>

      {/* 5. Edge Technical Ruler / Measurement Ticks */}
      <div className="absolute top-0 bottom-0 left-0 w-2 border-r border-slate-900/5 hidden sm:flex flex-col justify-between py-6 opacity-30">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="w-full flex items-center">
            <span className={`h-px bg-slate-900 ${i % 4 === 0 ? 'w-2' : 'w-1'}`} />
          </div>
        ))}
      </div>

      <div className="absolute top-0 bottom-0 right-0 w-2 border-l border-slate-900/5 hidden sm:flex flex-col justify-between py-6 opacity-30">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="w-full flex items-center justify-end">
            <span className={`h-px bg-slate-900 ${i % 4 === 0 ? 'w-2' : 'w-1'}`} />
          </div>
        ))}
      </div>
    </div>
  );
};
