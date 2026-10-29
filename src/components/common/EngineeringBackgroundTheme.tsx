import React from 'react';

export const EngineeringBackgroundTheme: React.FC = () => {
  return (
    <div
      id="engineering-theme-backdrop"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-40 dark:opacity-20"
    >
      {/* Subtle Technical Engineering Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25"
      />
    </div>
  );
};
