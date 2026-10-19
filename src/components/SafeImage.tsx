import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/maula_jatt_hero.jpg',
  loading = 'lazy'
}) => {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#0c111d] ${!loaded ? 'skeleton-shimmer' : ''}`}>
      <img
        src={currentSrc}
        alt={alt}
        loading={loading}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
          }
          setLoaded(true);
        }}
      />
    </div>
  );
};
