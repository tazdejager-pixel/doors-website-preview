import React from 'react';

interface WordmarkProps {
  /** colour of the wordmark text */
  tone?: 'ivory' | 'onyx' | 'gold';
  /** show the keyhole-O motif glyph before the wordmark */
  glyph?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const toneMap: Record<string, string> = {
  ivory: '#F5F1E8',
  onyx: '#0A0908',
  gold: '#C9A961',
};

const sizeMap: Record<string, string> = {
  sm: 'text-base',
  md: 'text-xl sm:text-2xl',
  lg: 'text-2xl sm:text-3xl',
};

/**
 * The DOORS wordmark. The two O's overlap to form a keyhole — rendered as a
 * small inline glyph that sits before the wide-tracked serif lettering, with
 * the brushed-gold keyhole drop at its centre.
 */
export const Wordmark: React.FC<WordmarkProps> = ({
  tone = 'ivory',
  glyph = true,
  className = '',
  size = 'md',
}) => {
  const colour = toneMap[tone];
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {glyph && (
        <svg width="30" height="22" viewBox="0 0 44 30" fill="none" aria-hidden className="shrink-0">
          <circle cx="17" cy="15" r="11" stroke="#C9A961" strokeWidth="1.6" />
          <circle cx="27" cy="15" r="11" stroke="#C9A961" strokeWidth="1.6" />
          <path
            d="M22 11.5a2.4 2.4 0 1 1 0 4.8l1.3 5.2h-2.6l1.3-5.2a2.4 2.4 0 0 1 0-4.8z"
            fill="#C9A961"
          />
        </svg>
      )}
      <span
        className={`font-serif tracking-[0.42em] leading-none ${sizeMap[size]}`}
        style={{ color: colour }}
      >
        DOORS
      </span>
    </span>
  );
};

/**
 * The nested-arch doorway device — a secondary brand mark used as a quiet
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
