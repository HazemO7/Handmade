import React from 'react';

/**
 * Reusable Marquee / Ticker Component
 * Creates an infinite, seamless scrolling ribbon.
 *
 * @param {Array} items - Array of strings or JSX elements to display
 * @param {Number} speed - Duration in seconds for one full loop (default: 32)
 * @param {Boolean} reverse - Whether to scroll in reverse direction
 * @param {Boolean} pauseOnHover - Pause scrolling when user hovers
 * @param {String} className - Additional classes for container wrapper
 * @param {String} itemClassName - Classes for individual items
 * @param {ReactNode} separator - Separator between items (e.g. ✦ icon)
 */
const Marquee = ({
  items = [],
  speed = 32,
  reverse = false,
  pauseOnHover = true,
  className = '',
  itemClassName = '',
  separator = '✦',
}) => {
  if (!items || items.length === 0) return null;

  // We repeat items to ensure the loop is completely seamless on any viewport width
  const renderItemSet = (setKey) => (
    <div key={setKey} className="flex items-center flex-shrink-0">
      {items.map((item, index) => (
        <React.Fragment key={`${setKey}-${index}`}>
          <span className={`inline-flex items-center whitespace-nowrap ${itemClassName}`}>
            {item}
          </span>
          {separator && (
            <span className="inline-flex items-center justify-center select-none opacity-80" aria-hidden="true">
              {separator}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const animationClass = reverse ? 'animate-marquee-reverse' : 'animate-marquee';
  const animationStyle = {
    animationDuration: `${speed}s`,
  };

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 3%, black 97%, transparent)' }}
    >
      <div
        className={`${animationClass} ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={animationStyle}
      >
        {/* Render 4 sets so there is never a gap on high-res displays */}
        {renderItemSet('set-1')}
        {renderItemSet('set-2')}
        {renderItemSet('set-3')}
        {renderItemSet('set-4')}
      </div>
    </div>
  );
};

export default Marquee;
