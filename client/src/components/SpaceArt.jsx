import React from 'react';

/**
 * High-detail vintage ink scientific space illustrations matching
 * Daniel Korpai's "Space Themed Website Design and Animation" (Marcato Studio)
 */

export function VoyagerSpiralMark({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="14" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
      <path
        d="M16 5C9.925 5 5 9.925 5 16C5 22.075 9.925 27 16 27C22.075 27 27 22.075 27 16C27 11.03 23.15 7.08 18.25 7.08C13.83 7.08 10.33 10.45 10.33 14.88C10.33 18.75 13.08 21.88 16.92 21.88C20.08 21.88 22.5 19.45 22.5 16.29C22.5 13.88 20.67 11.96 18.25 11.96C16.33 11.96 14.83 13.46 14.83 15.38C14.83 16.71 15.92 17.79 17.25 17.79"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="17.25" cy="17.79" r="1.5" fill={color} />
    </svg>
  );
}

export function AstronautIllustration({ className = "w-64 h-64" }) {
  return (
    <svg viewBox="0 0 280 280" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Curved floating umbilical tether cord */}
      <path
        d="M130 190 C120 220, 80 250, 40 240 C10 230, 20 270, 0 280"
        stroke="#0D0D0D"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="4 2"
      />
      
      {/* Life Support Backpack */}
      <rect x="85" y="80" width="45" height="75" rx="8" fill="#F0ECE8" stroke="#0D0D0D" strokeWidth="3" />
      <line x1="95" y1="95" x2="120" y2="95" stroke="#0D0D0D" strokeWidth="2" />
      <line x1="95" y1="105" x2="120" y2="105" stroke="#0D0D0D" strokeWidth="2" />
      <line x1="95" y1="115" x2="115" y2="115" stroke="#0D0D0D" strokeWidth="2" />

      {/* Main Spacesuit Torso */}
      <path
        d="M115 90 C130 85, 165 85, 180 90 C190 100, 195 135, 190 155 C185 165, 120 165, 115 155 Z"
        fill="#F5F2ED"
        stroke="#0D0D0D"
        strokeWidth="3.5"
      />

      {/* Chest Control Box & Pressure Gauges */}
      <rect x="135" y="105" width="28" height="24" rx="4" fill="#0D0D0D" stroke="#0D0D0D" strokeWidth="2" />
      <circle cx="143" cy="115" r="3" fill="#ECE8E3" />
      <circle cx="153" cy="115" r="3" fill="#ECE8E3" />
      <line x1="140" y1="123" x2="158" y2="123" stroke="#ECE8E3" strokeWidth="1.5" />

      {/* Spacesuit Helmet & Visor */}
      <circle cx="150" cy="62" r="30" fill="#F5F2ED" stroke="#0D0D0D" strokeWidth="3.5" />
      <path
        d="M136 50 C142 45, 165 45, 172 50 C177 56, 177 68, 172 74 C165 79, 142 79, 136 74 C131 68, 131 56, 136 50 Z"
        fill="#0D0D0D"
        stroke="#0D0D0D"
        strokeWidth="2"
      />
      {/* Visor Glare Reflection */}
      <path d="M142 53 Q152 48 162 52" stroke="#ECE8E3" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="166" cy="57" r="1.5" fill="#ECE8E3" />

      {/* Left Arm & Glove (Reaching outward) */}
      <path
        d="M120 95 C105 105, 90 120, 85 135 C82 145, 80 155, 75 160"
        stroke="#0D0D0D"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="75" cy="162" r="8" fill="#F0ECE8" stroke="#0D0D0D" strokeWidth="3" />
      {/* Glove fingers */}
      <path d="M72 165 C68 170, 68 175, 71 178" stroke="#0D0D0D" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M76 166 C75 172, 76 177, 79 179" stroke="#0D0D0D" strokeWidth="2.5" strokeLinecap="round" />

      {/* Right Arm & Glove (Floating gracefully) */}
      <path
        d="M175 95 C195 105, 215 115, 225 125 C232 132, 235 140, 238 145"
        stroke="#0D0D0D"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="239" cy="148" r="8" fill="#F0ECE8" stroke="#0D0D0D" strokeWidth="3" />

      {/* Left Leg & Boot (Bending forward in zero-G) */}
      <path
        d="M132 160 C125 185, 115 205, 105 220"
        stroke="#0D0D0D"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M103 222 L85 225 C80 226, 78 232, 82 236 L108 238 C115 238, 118 230, 112 225 Z"
        fill="#0D0D0D"
        stroke="#0D0D0D"
        strokeWidth="2"
      />

      {/* Right Leg & Boot (Trailing behind) */}
      <path
        d="M168 160 C180 185, 195 205, 210 225"
        stroke="#0D0D0D"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M208 226 L226 232 C231 234, 230 240, 225 242 L200 242 C194 242, 192 235, 198 229 Z"
        fill="#0D0D0D"
        stroke="#0D0D0D"
        strokeWidth="2"
      />

      {/* Subtle cross-hatch ink shading */}
      <line x1="125" y1="120" x2="132" y2="128" stroke="#0D0D0D" strokeWidth="1.2" />
      <line x1="128" y1="115" x2="135" y2="123" stroke="#0D0D0D" strokeWidth="1.2" />
      <line x1="131" y1="110" x2="138" y2="118" stroke="#0D0D0D" strokeWidth="1.2" />
    </svg>
  );
}

export function SaturnIllustration({ className = "w-48 h-32" }) {
  return (
    <svg viewBox="0 0 240 160" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Tilted Concentric Rings - Back Arc */}
      <path
        d="M20 80 C20 45, 220 45, 220 80"
        stroke="#0D0D0D"
        strokeWidth="3.5"
        strokeDasharray="6 2"
        opacity="0.8"
      />
      <path
        d="M40 80 C40 55, 200 55, 200 80"
        stroke="#0D0D0D"
        strokeWidth="2"
        opacity="0.6"
      />

      {/* Planetary Body Globe */}
      <circle cx="120" cy="80" r="45" fill="#F5F2ED" stroke="#0D0D0D" strokeWidth="3.5" />
      
      {/* Planetary Latitudinal Atmospheric Bands */}
      <path d="M78 68 Q120 74 162 68" stroke="#0D0D0D" strokeWidth="2.2" />
      <path d="M75 80 Q120 86 165 80" stroke="#0D0D0D" strokeWidth="2.8" />
      <path d="M78 92 Q120 98 162 92" stroke="#0D0D0D" strokeWidth="2.2" />
      
      {/* Planetary Stippled Shading */}
      <path d="M85 102 Q120 108 155 102" stroke="#0D0D0D" strokeWidth="1.5" strokeDasharray="2 3" />
      <path d="M95 112 Q120 116 145 112" stroke="#0D0D0D" strokeWidth="1.2" strokeDasharray="1 3" />

      {/* Tilted Concentric Rings - Front Arc */}
      <path
        d="M10 80 C10 120, 230 120, 230 80"
        stroke="#0D0D0D"
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M25 80 C25 110, 215 110, 215 80"
        stroke="#0D0D0D"
        strokeWidth="2.2"
        fill="none"
      />
      <path
        d="M40 80 C40 100, 200 100, 200 80"
        stroke="#0D0D0D"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        fill="none"
      />
    </svg>
  );
}

export function MoonIllustration({ className = "w-36 h-36" }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Moon Globe with ink texture */}
      <circle cx="80" cy="80" r="65" fill="#F5F2ED" stroke="#0D0D0D" strokeWidth="3.5" />
      
      {/* Primary Crater 1 */}
      <circle cx="60" cy="65" r="14" stroke="#0D0D0D" strokeWidth="2.5" fill="#E8E3DA" />
      <path d="M52 62 Q58 58 66 63" stroke="#0D0D0D" strokeWidth="1.8" />
      
      {/* Primary Crater 2 */}
      <circle cx="105" cy="85" r="18" stroke="#0D0D0D" strokeWidth="2.5" fill="#E8E3DA" />
      <path d="M96 82 Q105 76 114 83" stroke="#0D0D0D" strokeWidth="2" />
      <line x1="102" y1="92" x2="112" y2="92" stroke="#0D0D0D" strokeWidth="1.2" strokeDasharray="2 2" />

      {/* Small Craters */}
      <circle cx="95" cy="50" r="7" stroke="#0D0D0D" strokeWidth="2" />
      <circle cx="65" cy="105" r="9" stroke="#0D0D0D" strokeWidth="2" />
      <circle cx="45" cy="90" r="5" stroke="#0D0D0D" strokeWidth="1.5" />
      <circle cx="120" cy="115" r="6" stroke="#0D0D0D" strokeWidth="1.5" />

      {/* Outer Shading Crescent */}
      <path
        d="M80 15 C116 15, 145 44, 145 80 C145 116, 116 145, 80 145 C105 130, 115 105, 115 80 C115 55, 105 30, 80 15 Z"
        fill="#0D0D0D"
        opacity="0.12"
      />
    </svg>
  );
}

export function UfoIllustration({ className = "w-36 h-36" }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Downward Conical Tractor Beam */}
      <polygon
        points="55,50 105,50 140,150 20,150"
        fill="url(#ufo-beam-grad)"
        stroke="#0D0D0D"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <defs>
        <linearGradient id="ufo-beam-grad" x1="80" y1="50" x2="80" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0D0D0D" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0D0D0D" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* UFO Saucer Cockpit Glass Dome */}
      <path
        d="M60 38 C60 22, 100 22, 100 38 Z"
        fill="#F0ECE8"
        stroke="#0D0D0D"
        strokeWidth="3"
      />
      <circle cx="75" cy="30" r="1.5" fill="#0D0D0D" />
      <circle cx="85" cy="30" r="1.5" fill="#0D0D0D" />

      {/* UFO Main Disc Hull */}
      <ellipse cx="80" cy="42" rx="42" ry="11" fill="#F5F2ED" stroke="#0D0D0D" strokeWidth="3.5" />
      
      {/* Propulsion Portholes */}
      <circle cx="50" cy="43" r="2.5" fill="#0D0D0D" />
      <circle cx="65" cy="45" r="2.5" fill="#0D0D0D" />
      <circle cx="80" cy="46" r="2.5" fill="#0D0D0D" />
      <circle cx="95" cy="45" r="2.5" fill="#0D0D0D" />
      <circle cx="110" cy="43" r="2.5" fill="#0D0D0D" />
    </svg>
  );
}

export function TelescopeIllustration({ className = "w-40 h-48" }) {
  return (
    <svg viewBox="0 0 160 180" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Refractor Telescope Barrel */}
      <path
        d="M40 70 L110 35 L118 48 L48 83 Z"
        fill="#F5F2ED"
        stroke="#0D0D0D"
        strokeWidth="3"
      />
      {/* Large Front Objective Lens Cap */}
      <line x1="110" y1="35" x2="118" y2="48" stroke="#0D0D0D" strokeWidth="6" strokeLinecap="round" />
      {/* Eyepiece Extension */}
      <rect x="30" y="74" width="14" height="8" rx="2" transform="rotate(-27 30 74)" fill="#0D0D0D" />
      <circle cx="28" cy="80" r="5" fill="#F0ECE8" stroke="#0D0D0D" strokeWidth="2.5" />

      {/* Swivel Mount & Pivot Axis */}
      <circle cx="80" cy="62" r="7" fill="#0D0D0D" />
      <rect x="76" y="67" width="8" height="18" rx="2" fill="#0D0D0D" />

      {/* Tripod Legs */}
      <line x1="80" y1="84" x2="40" y2="165" stroke="#0D0D0D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="80" y1="84" x2="80" y2="170" stroke="#0D0D0D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="80" y1="84" x2="120" y2="165" stroke="#0D0D0D" strokeWidth="3.5" strokeLinecap="round" />
      
      {/* Tripod Cross Brace */}
      <line x1="55" y1="125" x2="105" y2="125" stroke="#0D0D0D" strokeWidth="2" strokeDasharray="3 2" />
    </svg>
  );
}
