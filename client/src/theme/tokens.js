/**
 * VOYAGER Design System Tokens
 * Inspired by Daniel Korpai's "Space Themed Website Design and Animation"
 * Vintage Ink scientific illustration, archival warm cream canvas (#ECE8E3),
 * deep space pitch black void cutouts (#0D0D0D), and dimensional retro typography.
 */

export const tokens = {
  colors: {
    // Primary Archival Canvas
    canvas: '#ECE8E3',
    canvasElevated: '#F5F2ED',
    canvasMuted: '#E2DED8',
    
    // Deep Space Pitch Black Void
    void: '#0D0D0D',
    voidSurface: '#161616',
    voidElevated: '#202020',
    
    // Typography Colors
    textInk: '#0D0D0D',
    textInkMuted: '#5C5853',
    textInkDim: '#8A857E',
    
    // Starlight text on dark void
    textStarlight: '#F0ECE8',
    textStarlightMuted: '#A6A29C',
    textStarlightDim: '#706D67',
    
    // Line & Border Rules
    borderArchival: '#C8C4BD',
    borderArchivalLight: '#DDD9D2',
    borderVoid: '#2D2B28',
    borderVoidLight: '#3D3B37',
    
    // Starlight Accent & Cosmic Tint
    accentAmber: '#D97706',
    accentCyan: '#0284C7',
    accentSepia: '#92400E',
    accentEmerald: '#059669',
  },
  
  // Typography Hierarchy
  typography: {
    fontDisplay: '"Syne", sans-serif',
    fontSerif: '"Newsreader", "Playfair Display", Georgia, serif',
    fontSans: '"Space Grotesk", "Inter", -apple-system, sans-serif',
    fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  
  // Radii Scale (Editorial Crisp Meets Soft Fluid Blobs)
  radius: {
    sharp: '2px',
    control: '8px',
    card: '16px',
    panel: '24px',
    pill: '9999px',
  },
  
  // Dimensional Shadows & Extrusions
  shadows: {
    display3D: '4px 4px 0px #0D0D0D',
    display3DLight: '3px 3px 0px #ECE8E3',
    cardInk: '0 8px 24px -4px rgba(13, 13, 13, 0.08)',
    cardVoid: '0 16px 36px -8px rgba(0, 0, 0, 0.65)',
  }
};

export default tokens;
