import { api } from '../api.js';
import { Movie } from '../types.js';
import { state } from '../state.js';
import { renderImage, getMoviePosterUrl, getMovieBannerUrl, FEATURE_CARDS_IMAGES } from '../utils/images.js';

let moviesCache: Movie[] = [];
let activeTab: 'now-showing' | 'upcoming' = 'now-showing';
let activeGenre = 'all';
let searchQuery = '';
let activeHeroMovieId: string = 'mov-maula-jatt';

export async function renderHomeView(): Promise<string> {
  try {
    moviesCache = await api.getMovies();
  } catch (e) {
    console.error('Failed to fetch movies:', e);
  }

  // Find active movie or fallback to first
  const activeHeroMovie = moviesCache.find(m => m.id === activeHeroMovieId) || moviesCache[0];
  const nowShowingMovies = moviesCache.filter(m => m.status === 'now-showing');
  const upcomingMovies = moviesCache.filter(m => m.status === 'upcoming');

  return `
    <div class="w-full flex flex-col flex-1 pb-20 bg-[#05070c] text-slate-100">
      
      <!-- HERO & SIDEBAR COMBINED STAGE -->
      <section id="hero-main-stage" class="relative w-full border-b border-white/10 overflow-hidden bg-[#070a10]">
        
        <!-- Backdrop Banner Layer -->
        <div class="absolute inset-0 z-0">
          <img
            id="hero-banner-bg"
            src="${getMovieBannerUrl(activeHeroMovie.id, activeHeroMovie.bannerUrl)}"
            alt="${escapeHtml(activeHeroMovie.title)} Banner"
            class="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1] scale-105 transition-all duration-700"
            loading="eager"
          />
          <!-- Multi-tier Lateral & Vertical Scrim for Absolute Contrast -->
          <div class="absolute inset-0 bg-gradient-to-r from-[#05070c] via-[#05070c]/85 to-[#05070c]/50"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#05070c] via-transparent to-black/40"></div>
          <div class="absolute -top-32 left-1/4 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none"></div>
        </div>

        <!-- Hero Content Grid -->
        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT 7 COLS: Featured Premiere Info & CTAs -->
            <div id="hero-left-content" class="lg:col-span-8 space-y-5 pt-4 lg:pt-8 pr-0 lg:pr-6">
              
              <!-- Tagline -->
              <div class="flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-amber-400">
                <span>FEATURED PREMIERE</span>
                <span class="text-slate-600">&middot;</span>
                <span>${state.selectedCity.toUpperCase()} EXCLUSIVE</span>
              </div>

              <!-- Main Title -->
              <h1 id="hero-title" class="text-4xl sm:text-6xl lg:text-7xl font-black font-heading text-white tracking-tight leading-[1.05] drop-shadow-xl">
                ${escapeHtml(activeHeroMovie.title)}
              </h1>

              <!-- Badges Row -->
              <div class="flex flex-wrap items-center gap-2.5 text-xs text-slate-200 font-medium">
                <span class="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold font-mono text-[11px]">
                  ${activeHeroMovie.contentRating}
                </span>
                <span class="text-slate-500">&middot;</span>
                <span class="font-mono text-slate-200">${activeHeroMovie.durationMinutes} min</span>
                <span class="text-slate-500">&middot;</span>
                <span class="text-amber-200">${activeHeroMovie.genre.join(', ')}</span>
                <span class="text-slate-500">&middot;</span>
                <span class="text-slate-300">${activeHeroMovie.language}</span>
                ${activeHeroMovie.subtitles ? `<span class="text-slate-500">&middot;</span><span class="text-slate-400">${activeHeroMovie.subtitles}</span>` : ''}
              </div>

              <!-- Synopsis -->
              <p id="hero-synopsis" class="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                ${escapeHtml(activeHeroMovie.synopsis)}
              </p>

              <!-- Director & Cast -->
              <div id="hero-credits" class="text-xs text-slate-400 pt-1 space-y-1">
                <div>
                  <span class="text-slate-200 font-semibold">Director:</span> ${escapeHtml(activeHeroMovie.director)} &middot;
                  <span class="text-slate-200 font-semibold">Cast:</span> ${escapeHtml(activeHeroMovie.cast.slice(0, 4).join(', '))}
                </div>
              </div>

              <!-- Action Buttons Row matching Screenshot -->
              <div class="pt-4 flex flex-wrap items-center gap-4">
                <!-- Book Tickets Gold Button with ticket icon -->
                <a
                  id="hero-book-btn"
                  href="#/movie/${activeHeroMovie.id}"
                  class="btn-gold-luxury px-7 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xl shadow-amber-500/30 transition-transform hover:scale-105 active:scale-95"
                >
                  <svg class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                  </svg>
                  <span>BOOK TICKETS</span>
                </a>

                <!-- View Showtimes & Details Brushed Metallic Button -->
                <a
                  id="hero-details-btn"
                  href="#/movie/${activeHeroMovie.id}"
                  class="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-gradient-to-r from-slate-800/90 to-slate-700/80 hover:from-slate-700 hover:to-slate-600 border border-slate-600/70 hover:border-slate-500 shadow-md transition-all flex items-center gap-2"
                >
                  View Showtimes & Details
                </a>
              </div>

            </div>

            <!-- RIGHT 4-5 COLS: "Now Showing" and "Coming Soon" Grid Panel -->
            <div class="lg:col-span-4 bg-[#0a0f18]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-6">
              
              <!-- Now Showing Section -->
              <div>
                <div class="flex items-center justify-between mb-3 px-1">
                  <h3 class="text-sm font-bold font-heading text-white tracking-wide">Now Showing</h3>
                  <span class="text-[10px] font-mono text-amber-400">Karachi IMAX & VIP</span>
                </div>

                <div class="grid grid-cols-3 gap-2.5">
                  ${nowShowingMovies.map(m => {
                    const isSelected = m.id === activeHeroMovie.id;
                    const posterUrl = getMoviePosterUrl(m.id, m.posterUrl);
                    return `
                      <button
                        data-movie-id="${m.id}"
                        class="hero-card-select-btn group text-left flex flex-col rounded-xl overflow-hidden p-1 transition-all duration-200 ${
                          isSelected
                            ? 'border-2 border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/25 ring-1 ring-amber-400/40'
                            : 'border border-white/10 bg-[#0c121d]/70 hover:border-white/30 hover:bg-[#0c121d]'
                        }"
                      >
                        <div class="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-slate-950">
                          ${renderImage({
                            src: posterUrl,
                            alt: m.title,
                            className: 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
                            loading: 'eager'
                          })}
                        </div>
                        <div class="p-1 text-center w-full">
                          <span class="block text-[10px] font-semibold text-white truncate group-hover:text-amber-400">
                            ${escapeHtml(m.title)}
                          </span>
                          <span class="block text-[9px] font-mono text-amber-400/90 font-medium mt-0.5">
                            15:00
                          </span>
                        </div>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Coming Soon Section -->
              <div class="pt-3 border-t border-white/10">
                <div class="flex items-center justify-between mb-3 px-1">
                  <h3 class="text-sm font-bold font-heading text-white tracking-wide">Coming Soon</h3>
                  <span class="text-[10px] font-mono text-slate-400">Upcoming</span>
                </div>

                <div class="grid grid-cols-3 gap-2.5">
                  ${upcomingMovies.map(m => {
                    const isSelected = m.id === activeHeroMovie.id;
                    const posterUrl = getMoviePosterUrl(m.id, m.posterUrl);
                    return `
                      <button
                        data-movie-id="${m.id}"
                        class="hero-card-select-btn group text-left flex flex-col rounded-xl overflow-hidden p-1 transition-all duration-200 ${
                          isSelected
                            ? 'border-2 border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/25 ring-1 ring-amber-400/40'
                            : 'border border-white/10 bg-[#0c121d]/70 hover:border-white/30 hover:bg-[#0c121d]'
                        }"
                      >
                        <div class="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-slate-950">
                          ${renderImage({
                            src: posterUrl,
                            alt: m.title,
                            className: 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
                            loading: 'lazy'
                          })}
                        </div>
                        <div class="p-1 text-center w-full">
                          <span class="block text-[10px] font-semibold text-white truncate group-hover:text-amber-400">
                            ${escapeHtml(m.title)}
                          </span>
                          <span class="block text-[9px] font-mono text-slate-400 mt-0.5">
                            ${m.releaseDate}
                          </span>
                        </div>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <!-- BOTTOM STRIP: THREE FEATURED EXPERIENCE CARDS (MATCHING SCREENSHOT) -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20 w-full">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          <!-- Card 1: Our Theaters with VIP Recliner -->
          <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1120] p-5 shadow-2xl flex items-center justify-between gap-4 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
            <div class="space-y-1 max-w-[55%]">
              <span class="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">LUXURY SCREENS</span>
              <h3 class="text-base font-black font-heading text-white group-hover:text-amber-400 transition-colors">OUR THEATERS</h3>
              <p class="text-xs text-slate-400 leading-snug line-clamp-2">
                Showcasing world-class luxury recliners, Dolby Atmos sound & 4K laser projection.
              </p>
            </div>
            <div class="w-28 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg">
              <img src="${FEATURE_CARDS_IMAGES.theaters}" alt="Our Theaters VIP Chair" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>

          <!-- Card 2: Ticket & Booking Policy with Gold Ticket -->
          <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1120] p-5 shadow-2xl flex items-center justify-between gap-4 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
            <div class="space-y-1 max-w-[55%]">
              <span class="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">SMART TICKETING</span>
              <h3 class="text-base font-black font-heading text-white group-hover:text-amber-400 transition-colors">TICKET & BOOKING POLICY</h3>
              <p class="text-xs text-slate-400 leading-snug line-clamp-2">
                Instant digital QR tickets, easy free cancellations up to 3 hours prior.
              </p>
            </div>
            <div class="w-28 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg">
              <img src="${FEATURE_CARDS_IMAGES.policy}" alt="Gold Ticket" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>

          <!-- Card 3: Cinema Operations with IMAX Screen -->
          <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1120] p-5 shadow-2xl flex items-center justify-between gap-4 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1">
            <div class="space-y-1 max-w-[55%]">
              <span class="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">MULTIPLEX TECH</span>
              <h3 class="text-base font-black font-heading text-white group-hover:text-amber-400 transition-colors">CINEMA OPERATIONS</h3>
              <p class="text-xs text-slate-400 leading-snug line-clamp-2">
                Multi-screen scheduling, live seat holds & box office management.
              </p>
            </div>
            <div class="w-28 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg">
              <img src="${FEATURE_CARDS_IMAGES.operations}" alt="IMAX Screen" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>

        </div>
      </section>

      <!-- ALL PAKISTANI FILMS CATALOG SECTION -->
      <section id="movies-catalog" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 w-full">
        
        <!-- Section Header with Filters -->
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-400 tracking-widest uppercase mb-2">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Pakistani Blockbusters & Global Premieres
            </div>
            <h2 class="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              All Cinema Schedules
            </h2>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">
              Showing in ${state.selectedCity} &middot; Clifton Royal IMAX, Gulberg Gold Lounge & Centaurus Arena
            </p>
          </div>

          <!-- Tabs & Search Toolbar -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center p-1 bg-[#0c111d] border border-white/10 rounded-xl shadow-inner">
              <button
                id="tab-now-showing"
                class="px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'now-showing'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-400 hover:text-white'
                }"
              >
                Now Showing
              </button>
              <button
                id="tab-upcoming"
                class="px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === 'upcoming'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-400 hover:text-white'
                }"
              >
                Coming Soon
              </button>
            </div>

            <!-- Search -->
            <div class="relative min-w-[220px]">
              <input
                id="movie-search-input"
                type="text"
                placeholder="Search movies, cast, director..."
                value="${escapeHtml(searchQuery)}"
                class="w-full bg-[#0c111d]/90 border border-white/10 text-xs text-slate-100 pl-9 pr-4 py-2.5 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-all shadow-inner"
              />
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-amber-400/70">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Genre Pills -->
        <div class="flex items-center gap-2 overflow-x-auto py-5 scrollbar-none text-xs">
          <span class="text-slate-500 font-medium shrink-0 mr-1 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Genre:
          </span>
          ${renderGenreButtons()}
        </div>

        <!-- Movies Grid -->
        <div id="movies-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 pt-2">
          ${renderMovieCards()}
        </div>

      </section>

    </div>
  `;
}

function renderGenreButtons(): string {
  const genres = ['all', 'Action', 'Drama', 'Period Epic', 'Comedy', 'Romance', 'Military', 'Sci-Fi'];
  return genres.map(g => {
    const isAct = activeGenre.toLowerCase() === g.toLowerCase();
    return `
      <button
        data-genre="${g}"
        class="genre-filter-btn px-4 py-1.5 font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
          isAct
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10 font-semibold'
            : 'text-slate-400 hover:text-white bg-[#0c111d] border border-white/5 hover:border-white/10'
        }"
      >
        ${g === 'all' ? 'All Genres' : g}
      </button>
    `;
  }).join('');
}

function renderMovieCards(): string {
  let filtered = moviesCache.filter(m => m.status === activeTab);

  if (activeGenre !== 'all') {
    filtered = filtered.filter(m => m.genre.some(g => g.toLowerCase() === activeGenre.toLowerCase()));
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q) ||
      m.cast.some(c => c.toLowerCase().includes(q)) ||
      m.genre.some(g => g.toLowerCase().includes(q))
    );
  }

  if (!filtered.length) {
    return `
      <div class="col-span-full py-20 text-center glass-panel rounded-3xl">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-white font-heading">No Films Match Your Search</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          We couldn't find any films matching "${escapeHtml(searchQuery)}". Try resetting your filters.
        </p>
        <button id="clear-filters-btn" class="mt-5 btn-gold-luxury px-5 py-2 text-xs rounded-xl">
          Reset All Filters
        </button>
      </div>
    `;
  }

  return filtered.map(movie => {
    const posterUrl = getMoviePosterUrl(movie.id, movie.posterUrl);

    return `
      <article class="group relative flex flex-col bg-[#0b1120]/80 border border-white/5 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1">
        
        <!-- Movie Poster with Skeleton Shimmer -->
        <a href="#/movie/${movie.id}" class="relative aspect-[3/4] overflow-hidden bg-slate-950 block">
          ${renderImage({
            src: posterUrl,
            alt: movie.title,
            className: 'group-hover:scale-105 transition-transform duration-500',
            loading: 'lazy'
          })}

          <!-- Badges on Poster -->
          <div class="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#05070c]/85 text-amber-400 border border-amber-500/30 backdrop-blur-md">
              ${movie.contentRating}
            </span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#05070c]/85 text-slate-300 border border-white/10 backdrop-blur-md">
              ${movie.durationMinutes}m
            </span>
          </div>

          <!-- Bottom subtle gradient scrim -->
          <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b1120] to-transparent pointer-events-none"></div>
        </a>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <!-- Genre line -->
            <div class="text-[11px] font-mono tracking-wider text-amber-400/90 font-medium truncate uppercase">
              ${escapeHtml(movie.genre.slice(0, 2).join(' &middot; '))}
            </div>

            <a href="#/movie/${movie.id}" class="block mt-1">
              <h3 class="text-lg font-bold font-heading text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                ${escapeHtml(movie.title)}
              </h3>
            </a>

            <p class="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
              ${escapeHtml(movie.synopsis)}
            </p>
          </div>

          <div class="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
            <div class="text-xs font-mono">
              ${movie.status === 'now-showing' 
                ? '<span class="text-emerald-400 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Showing Daily</span>' 
                : `<span class="text-slate-400">Releases ${movie.releaseDate}</span>`}
            </div>

            <a
              href="#/movie/${movie.id}"
              class="btn-gold-luxury px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shadow-md transition-transform group-hover:scale-105"
            >
              ${movie.status === 'now-showing' ? 'Book Tickets' : 'Details'}
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

export function attachHomeEvents(): void {
  // Tabs
  const nowShowingBtn = document.getElementById('tab-now-showing');
  const upcomingBtn = document.getElementById('tab-upcoming');

  nowShowingBtn?.addEventListener('click', () => {
    activeTab = 'now-showing';
    rerenderFullCatalog();
  });

  upcomingBtn?.addEventListener('click', () => {
    activeTab = 'upcoming';
    rerenderFullCatalog();
  });

  // Search
  const searchInput = document.getElementById('movie-search-input') as HTMLInputElement | null;
  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    const grid = document.getElementById('movies-grid');
    if (grid) {
      grid.innerHTML = renderMovieCards();
      attachClearBtn();
    }
  });

  // Genres
  document.querySelectorAll('.genre-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeGenre = (e.currentTarget as HTMLElement).getAttribute('data-genre') || 'all';
      rerenderFullCatalog();
    });
  });

  // Interactive Hero Selection from Right Sidebar Cards
  document.querySelectorAll('.hero-card-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const movieId = (e.currentTarget as HTMLElement).getAttribute('data-movie-id');
      if (movieId) {
        activeHeroMovieId = movieId;
        const targetMovie = moviesCache.find(m => m.id === activeHeroMovieId);
        if (targetMovie) {
          updateHeroDisplay(targetMovie);
        }
      }
    });
  });

  attachClearBtn();
}

function updateHeroDisplay(movie: Movie) {
  const bannerBg = document.getElementById('hero-banner-bg') as HTMLImageElement | null;
  const heroTitle = document.getElementById('hero-title');
  const heroSynopsis = document.getElementById('hero-synopsis');
  const heroCredits = document.getElementById('hero-credits');
  const heroBookBtn = document.getElementById('hero-book-btn') as HTMLAnchorElement | null;
  const heroDetailsBtn = document.getElementById('hero-details-btn') as HTMLAnchorElement | null;

  if (bannerBg) {
    bannerBg.src = getMovieBannerUrl(movie.id, movie.bannerUrl);
  }
  if (heroTitle) {
    heroTitle.textContent = movie.title;
  }
  if (heroSynopsis) {
    heroSynopsis.textContent = movie.synopsis;
  }
  if (heroCredits) {
    heroCredits.innerHTML = `
      <div>
        <span class="text-slate-200 font-semibold">Director:</span> ${escapeHtml(movie.director)} &middot;
        <span class="text-slate-200 font-semibold">Cast:</span> ${escapeHtml(movie.cast.slice(0, 4).join(', '))}
      </div>
    `;
  }
  if (heroBookBtn) {
    heroBookBtn.href = `#/movie/${movie.id}`;
  }
  if (heroDetailsBtn) {
    heroDetailsBtn.href = `#/movie/${movie.id}`;
  }

  // Highlight selected card border in sidebar
  document.querySelectorAll('.hero-card-select-btn').forEach(b => {
    const bId = (b as HTMLElement).getAttribute('data-movie-id');
    if (bId === movie.id) {
      b.className = 'hero-card-select-btn group text-left flex flex-col rounded-xl overflow-hidden p-1 transition-all duration-200 border-2 border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/25 ring-1 ring-amber-400/40';
    } else {
      b.className = 'hero-card-select-btn group text-left flex flex-col rounded-xl overflow-hidden p-1 transition-all duration-200 border border-white/10 bg-[#0c121d]/70 hover:border-white/30 hover:bg-[#0c121d]';
    }
  });
}

function attachClearBtn() {
  document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
    activeGenre = 'all';
    searchQuery = '';
    activeTab = 'now-showing';
    const input = document.getElementById('movie-search-input') as HTMLInputElement | null;
    if (input) input.value = '';
    rerenderFullCatalog();
  });
}

function rerenderFullCatalog() {
  const container = document.getElementById('movies-catalog');
  if (container) {
    const grid = document.getElementById('movies-grid');
    if (grid) grid.innerHTML = renderMovieCards();

    // Update active tab buttons visually
    const nowShowingBtn = document.getElementById('tab-now-showing');
    const upcomingBtn = document.getElementById('tab-upcoming');
    if (nowShowingBtn && upcomingBtn) {
      if (activeTab === 'now-showing') {
        nowShowingBtn.className = 'px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold';
        upcomingBtn.className = 'px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 text-slate-400 hover:text-white';
      } else {
        upcomingBtn.className = 'px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold';
        nowShowingBtn.className = 'px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 text-slate-400 hover:text-white';
      }
    }

    // Update genre buttons
    document.querySelectorAll('.genre-filter-btn').forEach(btn => {
      const g = (btn as HTMLElement).getAttribute('data-genre') || 'all';
      const isAct = activeGenre.toLowerCase() === g.toLowerCase();
      btn.className = `genre-filter-btn px-4 py-1.5 font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
        isAct
          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10 font-semibold'
          : 'text-slate-400 hover:text-white bg-[#0c111d] border border-white/5 hover:border-white/10'
      }`;
    });

    attachClearBtn();
  }
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case '\'': return '&#39;';
      default: return m;
    }
  });
}
