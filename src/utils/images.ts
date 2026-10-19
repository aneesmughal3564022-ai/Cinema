/**
 * CineVerse Pakistan — Premium Image Utility & Resilient Asset Resolver
 * Features authentic high-resolution Pakistani cinema imagery and bottom feature cards.
 */

export interface MovieMediaAssets {
  posterUrl: string;
  bannerUrl: string;
}

export const MOVIE_MEDIA_CATALOG: Record<string, MovieMediaAssets> = {
  'mov-maula-jatt': {
    posterUrl: '/images/maula_jatt_hero.jpg',
    bannerUrl: '/images/maula_jatt_hero.jpg'
  },
  'mov-kamli': {
    posterUrl: '/images/kamli_art.jpg',
    bannerUrl: '/images/kamli_art.jpg'
  },
  'mov-na-maloom-afraad': {
    posterUrl: '/images/na_maloom_poster.jpg',
    bannerUrl: '/images/na_maloom_poster.jpg'
  },
  'mov-jpna-2': {
    posterUrl: '/images/jpna_poster.jpg',
    bannerUrl: '/images/jpna_poster.jpg'
  },
  'mov-parwaaz': {
    posterUrl: '/images/parwaaz_poster.jpg',
    bannerUrl: '/images/parwaaz_poster.jpg'
  },
  'mov-london': {
    posterUrl: '/images/london_poster.jpg',
    bannerUrl: '/images/london_poster.jpg'
  },
  'mov-dune-2': {
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80'
  },
  'mov-oppenheimer': {
    posterUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80'
  }
};

export const FEATURE_CARDS_IMAGES = {
  theaters: '/images/vip_seat.jpg',
  policy: '/images/gold_ticket.jpg',
  operations: '/images/imax_screen.jpg'
};

export const DEFAULT_POSTER_FALLBACK = '/images/maula_jatt_hero.jpg';
export const DEFAULT_BANNER_FALLBACK = '/images/maula_jatt_hero.jpg';

export function getMoviePosterUrl(movieId: string, currentUrl?: string): string {
  if (currentUrl && (currentUrl.startsWith('/images/') || currentUrl.startsWith('http')) && !currentUrl.startsWith('data:image/svg')) {
    return currentUrl;
  }
  return MOVIE_MEDIA_CATALOG[movieId]?.posterUrl || DEFAULT_POSTER_FALLBACK;
}

export function getMovieBannerUrl(movieId: string, currentUrl?: string): string {
  if (currentUrl && (currentUrl.startsWith('/images/') || currentUrl.startsWith('http')) && !currentUrl.startsWith('data:image/svg')) {
    return currentUrl;
  }
  return MOVIE_MEDIA_CATALOG[movieId]?.bannerUrl || DEFAULT_BANNER_FALLBACK;
}

export function renderImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackSrc = DEFAULT_POSTER_FALLBACK,
  loading = 'lazy'
}: {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
}): string {
  const safeAlt = alt.replace(/"/g, '&quot;');
  const safeSrc = src || fallbackSrc;

  return `
    <div class="relative overflow-hidden bg-[#0d131f] skeleton-shimmer ${containerClassName}">
      <img
        src="${safeSrc}"
        alt="${safeAlt}"
        loading="${loading}"
        class="w-full h-full object-cover transition-opacity duration-500 opacity-0 ${className}"
        onload="this.classList.remove('opacity-0'); this.parentElement?.classList.remove('skeleton-shimmer');"
        onerror="this.onerror=null; this.src='${fallbackSrc}'; this.classList.remove('opacity-0'); this.parentElement?.classList.remove('skeleton-shimmer');"
      />
    </div>
  `;
}
