/**
 * High-definition transparent front-facing eyewear PNG data URIs.
 * Used as default try-on images when a custom tryOnImage is not uploaded by the admin.
 */

export function getDefaultTryOnImage(frameShape: string, color: string = '#111111'): string {
  const shape = (frameShape || 'wayfarer').toLowerCase();
  
  // High-contrast, clean transparent SVG vector rendered to data URI
  let svgContent = '';

  switch (shape) {
    case 'aviator':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
        <defs>
          <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1a2e26" stop-opacity="0.85"/>
            <stop offset="50%" stop-color="#111c17" stop-opacity="0.75"/>
            <stop offset="100%" stop-color="#2a4537" stop-opacity="0.9"/>
          </linearGradient>
          <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
            <stop offset="40%" stop-color="#ffffff" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- Aviator Left Teardrop -->
        <path d="M 80 45 C 135 35, 195 38, 208 58 C 218 75, 205 130, 155 138 C 105 142, 68 116, 72 80 Z" fill="url(#lens)" stroke="#d4af37" stroke-width="6"/>
        <path d="M 80 45 C 135 35, 195 38, 208 58 C 218 75, 205 130, 155 138 C 105 142, 68 116, 72 80 Z" fill="url(#glare)"/>
        <!-- Aviator Right Teardrop -->
        <path d="M 420 45 C 365 35, 305 38, 292 58 C 282 75, 295 130, 345 138 C 395 142, 432 116, 428 80 Z" fill="url(#lens)" stroke="#d4af37" stroke-width="6"/>
        <path d="M 420 45 C 365 35, 305 38, 292 58 C 282 75, 295 130, 345 138 C 395 142, 432 116, 428 80 Z" fill="url(#glare)"/>
        <!-- Double Brow Bar & Bridge -->
        <line x1="185" y1="42" x2="315" y2="42" stroke="#d4af37" stroke-width="6" stroke-linecap="round"/>
        <path d="M 200 62 Q 250 50 300 62" stroke="#d4af37" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- Temples -->
        <line x1="72" y1="65" x2="20" y2="58" stroke="#d4af37" stroke-width="7" stroke-linecap="round"/>
        <line x1="428" y1="65" x2="480" y2="58" stroke="#d4af37" stroke-width="7" stroke-linecap="round"/>
      </svg>`;
      break;

    case 'round':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
        <defs>
          <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#141a24" stop-opacity="0.82"/>
            <stop offset="100%" stop-color="#1f2937" stop-opacity="0.9"/>
          </linearGradient>
          <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
            <stop offset="35%" stop-color="transparent" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- Left Circular Rim -->
        <circle cx="140" cy="90" r="62" fill="url(#lens)" stroke="#222226" stroke-width="8"/>
        <circle cx="140" cy="90" r="62" fill="url(#glare)"/>
        <!-- Right Circular Rim -->
        <circle cx="360" cy="90" r="62" fill="url(#lens)" stroke="#222226" stroke-width="8"/>
        <circle cx="360" cy="90" r="62" fill="url(#glare)"/>
        <!-- Arched Keyhole Bridge -->
        <path d="M 202 85 Q 250 68 298 85" stroke="#222226" stroke-width="7" fill="none" stroke-linecap="round"/>
        <!-- Temples -->
        <line x1="78" y1="88" x2="25" y2="82" stroke="#222226" stroke-width="8" stroke-linecap="round"/>
        <line x1="422" y1="88" x2="475" y2="82" stroke="#222226" stroke-width="8" stroke-linecap="round"/>
      </svg>`;
      break;

    case 'clubmaster':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
        <defs>
          <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#111827" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#030712" stop-opacity="0.92"/>
          </linearGradient>
          <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
            <stop offset="40%" stop-color="transparent" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- Left Brow Acetate Cap -->
        <path d="M 70 52 C 110 42, 185 45, 212 68 L 212 80 C 175 72, 100 70, 70 78 Z" fill="#4a2a18"/>
        <!-- Left Gold Rim & Lens -->
        <path d="M 78 76 C 75 125, 145 142, 190 138 C 208 135, 214 110, 212 76 Z" fill="url(#lens)" stroke="#d4af37" stroke-width="4.5"/>
        <path d="M 78 76 C 75 125, 145 142, 190 138 C 208 135, 214 110, 212 76 Z" fill="url(#glare)"/>
        
        <!-- Right Brow Acetate Cap -->
        <path d="M 430 52 C 390 42, 315 45, 288 68 L 288 80 C 325 72, 400 70, 430 78 Z" fill="#4a2a18"/>
        <!-- Right Gold Rim & Lens -->
        <path d="M 422 76 C 425 125, 355 142, 310 138 C 292 135, 286 110, 288 76 Z" fill="url(#lens)" stroke="#d4af37" stroke-width="4.5"/>
        <path d="M 422 76 C 425 125, 355 142, 310 138 C 292 135, 286 110, 288 76 Z" fill="url(#glare)"/>

        <!-- Gold Keyhole Bridge -->
        <path d="M 212 68 Q 250 52 288 68" stroke="#d4af37" stroke-width="5.5" fill="none" stroke-linecap="round"/>
        <!-- Temple Pins -->
        <rect x="66" y="56" width="9" height="5" rx="2" fill="#d4af37"/>
        <rect x="425" y="56" width="9" height="5" rx="2" fill="#d4af37"/>
      </svg>`;
      break;

    case 'cat-eye':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
        <defs>
          <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/>
          </linearGradient>
          <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
            <stop offset="30%" stop-color="transparent" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- Left Winged Rim -->
        <path d="M 52 35 C 115 38, 190 48, 210 70 C 208 118, 135 142, 92 124 C 65 110, 45 75, 52 35 Z" fill="url(#lens)" stroke="#111111" stroke-width="12" stroke-linejoin="round"/>
        <path d="M 52 35 C 115 38, 190 48, 210 70 C 208 118, 135 142, 92 124 C 65 110, 45 75, 52 35 Z" fill="url(#glare)"/>
        <!-- Right Winged Rim -->
        <path d="M 448 35 C 385 38, 310 48, 290 70 C 292 118, 365 142, 408 124 C 435 110, 455 75, 448 35 Z" fill="url(#lens)" stroke="#111111" stroke-width="12" stroke-linejoin="round"/>
        <path d="M 448 35 C 385 38, 310 48, 290 70 C 292 118, 365 142, 408 124 C 435 110, 455 75, 448 35 Z" fill="url(#glare)"/>
        <!-- Bridge -->
        <path d="M 210 70 Q 250 60 290 70" stroke="#111111" stroke-width="9" fill="none" stroke-linecap="round"/>
      </svg>`;
      break;

    case 'hexagonal':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
        <defs>
          <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#18181b" stop-opacity="0.82"/>
            <stop offset="100%" stop-color="#27272a" stop-opacity="0.9"/>
          </linearGradient>
          <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
            <stop offset="40%" stop-color="transparent" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- Left Hexagon -->
        <polygon points="140,32 195,60 195,124 140,152 85,124 85,60" fill="url(#lens)" stroke="#d4af37" stroke-width="6" stroke-linejoin="round"/>
        <polygon points="140,32 195,60 195,124 140,152 85,124 85,60" fill="url(#glare)"/>
        <!-- Right Hexagon -->
        <polygon points="360,32 415,60 415,124 360,152 305,124 305,60" fill="url(#lens)" stroke="#d4af37" stroke-width="6" stroke-linejoin="round"/>
        <polygon points="360,32 415,60 415,124 360,152 305,124 305,60" fill="url(#glare)"/>
        <!-- Bridge -->
        <line x1="195" y1="88" x2="305" y2="88" stroke="#d4af37" stroke-width="6" stroke-linecap="round"/>
      </svg>`;
      break;

    case 'rimless':
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
        <defs>
          <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1e293b" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.75"/>
          </linearGradient>
          <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
            <stop offset="35%" stop-color="transparent" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- Left Floating Lens -->
        <rect x="80" y="48" width="125" height="92" rx="25" fill="url(#lens)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
        <rect x="80" y="48" width="125" height="92" rx="25" fill="url(#glare)"/>
        <!-- Left Titanium Mounts -->
        <circle cx="86" cy="72" r="4.5" fill="#e2e8f0"/>
        <circle cx="198" cy="72" r="4.5" fill="#e2e8f0"/>
        
        <!-- Right Floating Lens -->
        <rect x="295" y="48" width="125" height="92" rx="25" fill="url(#lens)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
        <rect x="295" y="48" width="125" height="92" rx="25" fill="url(#glare)"/>
        <!-- Right Titanium Mounts -->
        <circle cx="301" cy="72" r="4.5" fill="#e2e8f0"/>
        <circle cx="414" cy="72" r="4.5" fill="#e2e8f0"/>

        <!-- Beta-Titanium Floating Bridge -->
        <path d="M 198 72 Q 250 54 301 72" stroke="#e2e8f0" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      </svg>`;
      break;

    case 'wayfarer':
    default:
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">
        <defs>
          <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a" stop-opacity="0.88"/>
            <stop offset="100%" stop-color="#020617" stop-opacity="0.95"/>
          </linearGradient>
          <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
            <stop offset="35%" stop-color="transparent" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- Left Trapezoid Rim -->
        <path d="M 70 42 L 210 46 L 200 130 C 196 142, 90 142, 80 128 Z" fill="url(#lens)" stroke="#111113" stroke-width="12" stroke-linejoin="round"/>
        <path d="M 70 42 L 210 46 L 200 130 C 196 142, 90 142, 80 128 Z" fill="url(#glare)"/>
        <!-- Silver Diamond Rivet -->
        <rect x="62" y="50" width="8" height="5" rx="1.5" fill="#e2e8f0"/>
        
        <!-- Right Trapezoid Rim -->
        <path d="M 430 42 L 290 46 L 300 130 C 304 142, 410 142, 420 128 Z" fill="url(#lens)" stroke="#111113" stroke-width="12" stroke-linejoin="round"/>
        <path d="M 430 42 L 290 46 L 300 130 C 304 142, 410 142, 420 128 Z" fill="url(#glare)"/>
        <!-- Silver Diamond Rivet -->
        <rect x="430" y="50" width="8" height="5" rx="1.5" fill="#e2e8f0"/>

        <!-- Sculpted Center Bridge -->
        <path d="M 205 52 Q 250 42 295 52" stroke="#111113" stroke-width="11" fill="none" stroke-linecap="round"/>
        <!-- Temples -->
        <line x1="65" y1="52" x2="18" y2="48" stroke="#111113" stroke-width="12" stroke-linecap="round"/>
        <line x1="435" y1="52" x2="482" y2="48" stroke="#111113" stroke-width="12" stroke-linecap="round"/>
      </svg>`;
      break;
  }

  // Return as clean data URI
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}
