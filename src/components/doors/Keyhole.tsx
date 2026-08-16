import React from 'react';

/**
 * The keyhole out of the DOORS logo, lifted verbatim from the mark rather than
 * redrawn - this is the counter inside the overlapping O's in
 * public/logo/doors-gold.svg, so it is the same shape at any size.
 *
 * Takes its colour from `currentColor`, so set it on the parent (brand gold
 * #C9A961 on dark surfaces). Used as the bullet marker in place of a rule.
 */
const Keyhole: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="109.37 20.95 7.59 17.11"
    className={className}
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M116.96,38.06l-2.21-9.92c1.68-.9,2.47-2.69,1.96-4.48-.45-1.6-1.96-2.79-3.75-2.71s-3.13,1.38-3.48,3.04.48,3.35,2.06,4.18l-2.17,9.88h7.59Z" />
  </svg>
);

export default Keyhole;
