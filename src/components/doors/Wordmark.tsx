import React from 'react';

interface WordmarkProps {
  /** which colourway of the official Primary Wordmark to show */
  tone?: 'ivory' | 'onyx' | 'gold';
  /** retained for API compatibility; no longer used (the mark is the full logo) */
  glyph?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const toneMap: Record<string, string> = {
  ivory: '#F5F1E8',
  onyx: '#0A0908',
  gold: '#C9A961',
};

// Official Primary Wordmark (overlapping-O keyhole) in each colourway.
// Files live in public/logo and are served under the app base path.
const logoForTone: Record<string, string> = {
  ivory: 'logo/doors-white.svg',
  onyx: 'logo/doors-black.svg',
  gold: 'logo/doors-gold.svg',
};

const heightForSize: Record<string, string> = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
};

/**
 * The DOORS Primary Wordmark - the official logo lockup with the overlapping
 * O's forming the keyhole. Rendered from the supplied vector logo (not drawn in
 * code), so it matches the brand exactly. `tone` picks the colourway.
 */
export const Wordmark: React.FC<WordmarkProps> = ({
  tone = 'ivory',
  className = '',
  size = 'md',
}) => {
  const src = `${import.meta.env.BASE_URL}${logoForTone[tone]}`;
  return (
    <img
      src={src}
      alt="DOORS"
      className={`${heightForSize[size]} w-auto object-contain ${className}`}
    />
  );
};

// Wordmark only, tagline cropped out. Used inline inside a sentence, where the
// full lockup's strapline would be unreadable and would break the line.
const inlineLogoForTone: Record<string, string> = {
  ivory: 'logo/doors-wordmark-white.svg',
  onyx: 'logo/doors-wordmark-black.svg',
  gold: 'logo/doors-wordmark-gold.svg',
};

/**
 * The brand name as it appears INSIDE running text - "BrandName began with a
 * simple conviction". Client request 28/07/2026: wherever the name appears as
 * written text, show the logo instead. She circled a body-copy sentence, so this
 * has to sit in the line of type, not just in headers.
 *
 * Rendered at cap height and nudged onto the baseline so the sentence still
 * reads as a sentence. The accessible name stays "DOORS", so screen readers,
 * search engines and copy-paste all still get the word.
 */
export const BrandName: React.FC<{ tone?: 'ivory' | 'onyx' | 'gold'; className?: string }> = ({
  tone = 'onyx',
  className = '',
}) => (
  <img
    src={`${import.meta.env.BASE_URL}${inlineLogoForTone[tone]}`}
    alt="DOORS"
    className={`inline-block w-auto align-baseline ${className}`}
    style={{ height: '0.78em', transform: 'translateY(0.04em)' }}
  />
);

/**
 * The nested-arch doorway device - a secondary brand mark used as a quiet
 * ornament between sections or beside small labels.
 */
export const DoorwayMark: React.FC<{ className?: string; tone?: 'gold' | 'ivory' | 'onyx' }> = ({
  className = '',
  tone = 'gold',
}) => (
  <svg viewBox="0 0 40 56" fill="none" className={className} aria-hidden>
    <path d="M4 56V24a16 16 0 0 1 32 0v32" stroke={toneMap[tone]} strokeWidth="1.2" />
    <path d="M11 56V26a9 9 0 0 1 18 0v30" stroke={toneMap[tone]} strokeWidth="1" opacity="0.7" />
    <path d="M18 56V30a2 2 0 0 1 4 0v26" stroke={toneMap[tone]} strokeWidth="0.9" opacity="0.5" />
  </svg>
);

export default Wordmark;
