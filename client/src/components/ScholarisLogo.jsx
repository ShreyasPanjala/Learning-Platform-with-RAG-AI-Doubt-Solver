import React from 'react';

/**
 * Scholaris Academic Brand Mark
 * Crafted in the editorial ink & sand design language.
 */
export function ScholarisIcon({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Scholarly Mortarboard / Academic Diamond Crest */}
      <path 
        d="M12 2L2 7L12 12L22 7L12 2Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Lower academic gown / open knowledge pages */}
      <path 
        d="M6 10.5V16.5C6 16.5 8.5 19 12 19C15.5 19 18 16.5 18 16.5V10.5" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Tassel cord and beacon */}
      <path 
        d="M22 7V14" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <circle cx="22" cy="15" r="1.2" fill={color} />
      {/* Central grounded knowledge core */}
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

export default function ScholarisLogo({ size = 'md', showBadge = false, badgeText = 'RAG v1.0' }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-3">
      {/* Solid Pitch-Black Editorial Badge with Scholaris Crest */}
      <div className={`${iconSizes[size] || iconSizes.md} rounded-lg bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] shadow-[2px_2px_0px_#5C5853] transition-transform`}>
        <ScholarisIcon className="w-5 h-5 text-[#ECE8E3]" />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2">
          <span className={`${textSizes[size] || textSizes.md} font-extrabold tracking-[0.14em] text-[#0D0D0D] uppercase font-display`}>
            SCHOLARIS
          </span>
          {showBadge && (
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-[#0D0D0D] text-[#ECE8E3] rounded-sm">
              {badgeText}
            </span>
          )}
        </div>
        <p className="text-[10px] text-[#5C5853] font-bold tracking-[0.18em] uppercase">
          RAG AI Doubt Solver &amp; Academic Intelligence
        </p>
      </div>
    </div>
  );
}
