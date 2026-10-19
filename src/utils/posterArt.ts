/**
 * Elegant SVG Artwork Generator for Cinema Posters & Backdrops
 * Guaranteed 100% resilient rendering with zero external network dependencies.
 */

interface PosterOptions {
  title: string;
  theme: 'warrior' | 'scifi' | 'noir' | 'atomic' | 'comedy' | 'action';
  rating: string;
  genre: string;
  duration: string;
}

export function generatePosterSvg(options: PosterOptions): string {
  const { title, theme, rating, genre, duration } = options;

  let bgGradient = '';
  let accentColor = '#E5A93C';
  let artElements = '';

  switch (theme) {
    case 'warrior':
      bgGradient = '<stop offset="0%" stop-color="#1c0a00" /><stop offset="50%" stop-color="#2a1205" /><stop offset="100%" stop-color="#0a0503" />';
      accentColor = '#f59e0b';
      artElements = `
        <!-- Dramatic warrior axe & atmospheric embers -->
        <circle cx="200" cy="220" r="140" fill="url(#fireGlow)" opacity="0.6" />
        <path d="M160,110 L240,110 L260,190 L200,270 L140,190 Z" fill="#b45309" opacity="0.4" />
        <path d="M190,130 L210,130 L220,380 L180,380 Z" fill="#78350f" />
        <!-- Blade cross -->
        <path d="M120,180 Q200,140 280,180 Q250,220 200,210 Q150,220 120,180 Z" fill="#e2e8f0" opacity="0.9" />
        <circle cx="200" cy="180" r="12" fill="#d97706" />
        <!-- Sparks -->
        <circle cx="140" cy="120" r="3" fill="#fde68a" opacity="0.8" />
        <circle cx="250" cy="140" r="2.5" fill="#fde68a" opacity="0.9" />
        <circle cx="180" cy="90" r="4" fill="#fbbf24" opacity="0.7" />
        <circle cx="270" cy="240" r="3" fill="#f59e0b" opacity="0.6" />
      `;
      break;

    case 'scifi':
      bgGradient = '<stop offset="0%" stop-color="#0c192c" /><stop offset="60%" stop-color="#2d1b09" /><stop offset="100%" stop-color="#070b12" />';
      accentColor = '#38bdf8';
      artElements = `
        <!-- Desert dunes & twin moons -->
        <circle cx="290" cy="110" r="38" fill="#e0f2fe" opacity="0.85" />
        <circle cx="110" cy="80" r="20" fill="#bae6fd" opacity="0.6" />
        <!-- Dunes -->
        <path d="M-20,340 Q120,240 260,290 T420,310 L420,540 L-20,540 Z" fill="#d97706" opacity="0.5" />
        <path d="M-20,380 Q160,300 340,360 T420,370 L420,540 L-20,540 Z" fill="#b45309" opacity="0.8" />
        <!-- Silhouetted traveler -->
        <ellipse cx="210" cy="290" rx="9" ry="14" fill="#0f172a" />
        <path d="M200,300 L220,300 L225,350 L195,350 Z" fill="#0f172a" />
      `;
      break;

    case 'atomic':
      bgGradient = '<stop offset="0%" stop-color="#260f04" /><stop offset="45%" stop-color="#451a03" /><stop offset="100%" stop-color="#0a0502" />';
      accentColor = '#fb923c';
      artElements = `
        <!-- Atomic blast horizon & particle rings -->
        <circle cx="200" cy="240" r="160" fill="url(#fireGlow)" opacity="0.4" />
        <ellipse cx="200" cy="230" rx="140" ry="30" fill="none" stroke="#fdba74" stroke-width="2" opacity="0.6" transform="rotate(-20 200 230)" />
        <ellipse cx="200" cy="230" rx="140" ry="30" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.5" transform="rotate(25 200 230)" />
        <ellipse cx="200" cy="230" rx="140" ry="30" fill="none" stroke="#f97316" stroke-width="1.5" opacity="0.7" transform="rotate(70 200 230)" />
        <circle cx="200" cy="230" r="24" fill="#ffedd5" />
      `;
      break;

    case 'noir':
      bgGradient = '<stop offset="0%" stop-color="#0f172a" /><stop offset="60%" stop-color="#1e1b4b" /><stop offset="100%" stop-color="#020617" />';
      accentColor = '#a855f7';
      artElements = `
        <!-- Metropolitan neon skyline & rain -->
        <rect x="50" y="160" width="45" height="260" fill="#1e293b" opacity="0.7" />
        <rect x="110" y="110" width="55" height="310" fill="#334155" opacity="0.8" />
        <rect x="180" y="140" width="70" height="280" fill="#1e293b" opacity="0.9" />
        <rect x="270" y="190" width="50" height="230" fill="#334155" opacity="0.6" />
        <line x1="80" y1="50" x2="60" y2="350" stroke="#c084fc" stroke-width="1.5" opacity="0.3" stroke-dasharray="8 12" />
        <line x1="220" y1="40" x2="200" y2="380" stroke="#38bdf8" stroke-width="1.5" opacity="0.4" stroke-dasharray="10 14" />
        <circle cx="200" cy="100" r="50" fill="#c084fc" opacity="0.25" />
      `;
      break;

    case 'action':
      bgGradient = '<stop offset="0%" stop-color="#18181b" /><stop offset="50%" stop-color="#27272a" /><stop offset="100%" stop-color="#09090b" />';
      accentColor = '#ef4444';
      artElements = `
        <!-- High-octane speed diagonals & gold crest -->
        <polygon points="40,80 360,180 340,240 20,140" fill="#dc2626" opacity="0.25" />
        <polygon points="80,180 380,260 360,310 60,230" fill="#f59e0b" opacity="0.25" />
        <circle cx="200" cy="210" r="65" fill="none" stroke="#e2e8f0" stroke-width="4" opacity="0.8" />
        <polygon points="175,175 240,210 175,245" fill="#f8fafc" />
      `;
      break;

    default: // comedy / drama
      bgGradient = '<stop offset="0%" stop-color="#1e1b4b" /><stop offset="50%" stop-color="#172554" /><stop offset="100%" stop-color="#030712" />';
      accentColor = '#facc15';
      artElements = `
        <circle cx="200" cy="190" r="110" fill="url(#fireGlow)" opacity="0.35" />
        <path d="M120,200 Q200,270 280,200" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round" />
        <circle cx="160" cy="160" r="14" fill="#f8fafc" />
        <circle cx="240" cy="160" r="14" fill="#f8fafc" />
      `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" width="100%" height="100%" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          ${bgGradient}
        </linearGradient>
        <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="textFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="transparent" />
          <stop offset="40%" stop-color="#080C15" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#080C15" stop-opacity="0.98" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="400" height="560" fill="url(#bgGrad)" />

      <!-- Art Layer -->
      ${artElements}

      <!-- Bottom Gradient Scrim for Legibility -->
      <rect y="260" width="400" height="300" fill="url(#textFade)" />

      <!-- Top CineVerse Brand Stamp -->
      <text x="28" y="44" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="600" letter-spacing="2">CINEVERSE PAKISTAN</text>
      <rect x="330" y="28" width="42" height="22" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1" />
      <text x="351" y="43" fill="${accentColor}" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">${rating}</text>

      <!-- Bottom Details -->
      <text x="28" y="430" fill="${accentColor}" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" letter-spacing="1">${genre.toUpperCase()} · ${duration}</text>
      
      <text x="28" y="475" fill="#f8fafc" font-family="'Outfit', sans-serif" font-size="28" font-weight="800" letter-spacing="-0.5">
        ${escapeXml(title.length > 22 ? title.slice(0, 20) + '...' : title)}
      </text>

      <line x1="28" y1="505" x2="372" y2="505" stroke="#334155" stroke-width="1" stroke-dasharray="4 4" />
      <text x="28" y="528" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="500">NOW SHOWING IN ULTRA DOLBY & IMAX</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
