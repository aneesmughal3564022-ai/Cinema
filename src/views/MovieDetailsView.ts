import { api } from '../api.js';
import { Movie, Showtime } from '../types.js';
import { state } from '../state.js';
import { renderImage, getMoviePosterUrl, getMovieBannerUrl } from '../utils/images.js';

let selectedDate = '';
let currentMovie: Movie | null = null;
let currentShows: Showtime[] = [];

export async function renderMovieDetailsView(movieId: string): Promise<string> {
  try {
    const data = await api.getMovie(movieId);
    currentMovie = data.movie;
    currentShows = data.shows;
  } catch (e) {
    return `
      <div class="max-w-4xl mx-auto px-4 py-24 text-center">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold font-heading text-white">Movie Not Found</h2>
        <p class="text-xs text-slate-400 mt-2">The requested movie could not be retrieved from the catalog.</p>
        <a href="#/" class="mt-6 inline-block btn-gold-luxury px-6 py-2.5 text-xs rounded-xl">Return to Movies</a>
      </div>
    `;
  }

  // Pre-select today's date if not set
  if (!selectedDate) {
    selectedDate = new Date().toISOString().slice(0, 10);
  }

  const availableDates = generateAvailableDates();
  const posterUrl = getMoviePosterUrl(currentMovie.id, currentMovie.posterUrl);
  const bannerUrl = getMovieBannerUrl(currentMovie.id, currentMovie.bannerUrl);

  return `
    <div class="w-full flex flex-col flex-1 pb-24 bg-[#05070c]">
      
      <!-- Back Navigation Bar with Glassmorphism -->
      <div class="border-b border-white/10 bg-[#090d16]/80 backdrop-blur-md sticky top-16 z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <a href="#/" class="text-xs text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 font-medium">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Films
          </a>
          <div class="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span>Location:</span>
            <span class="text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">${state.selectedCity}</span>
          </div>
        </div>
      </div>

      <!-- IMMERSIVE BACKDROP & MOVIE HERO -->
      <div class="relative w-full overflow-hidden border-b border-white/10 py-12 lg:py-16">
        <!-- Banner Image Background with Multi-Tier Scrim -->
        <div class="absolute inset-0 z-0">
          <img
            src="${bannerUrl}"
            alt="${escapeHtml(currentMovie.title)} Backdrop"
            class="w-full h-full object-cover filter brightness-[0.4] contrast-[1.1] scale-105"
            loading="eager"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-[#05070c] via-[#05070c]/90 to-[#05070c]/70"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#05070c] via-[#05070c]/60 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            
            <!-- Movie Poster Card -->
            <div class="md:col-span-4 lg:col-span-3">
              <div class="aspect-[3/4] rounded-2xl overflow-hidden glass-panel-gold shadow-2xl">
                ${renderImage({
                  src: posterUrl,
                  alt: currentMovie.title,
                  className: 'transition-transform duration-700 hover:scale-105',
                  loading: 'eager'
                })}
              </div>
            </div>

            <!-- Movie Information Column -->
            <div class="md:col-span-8 lg:col-span-9 space-y-5">
              <!-- Content Badges -->
              <div class="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
                <span class="text-amber-400 font-bold border border-amber-500/40 bg-amber-500/15 px-2.5 py-0.5 rounded-md text-xs font-mono">
                  ${currentMovie.contentRating}
                </span>
                <span class="text-slate-500">&middot;</span>
                <span class="font-mono text-slate-200">${currentMovie.durationMinutes} Minutes</span>
                <span class="text-slate-500">&middot;</span>
                <span class="text-amber-300 font-semibold">${currentMovie.genre.join(', ')}</span>
                <span class="text-slate-500">&middot;</span>
                <span class="text-slate-300">${currentMovie.language}</span>
                ${currentMovie.subtitles ? `<span class="text-slate-500">&middot;</span><span class="text-slate-400">${currentMovie.subtitles}</span>` : ''}
              </div>

              <!-- Main Title -->
              <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-tight">
                ${escapeHtml(currentMovie.title)}
              </h1>

              <!-- Synopsis -->
              <p class="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                ${escapeHtml(currentMovie.synopsis)}
              </p>

              <!-- Technical & Cast Details Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-white/10">
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">Director:</span>
                  <span class="text-white font-semibold">${escapeHtml(currentMovie.director)}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">Audio Formats:</span>
                  <span class="text-amber-300 font-mono font-semibold">IMAX Dual Laser 7.1 &middot; Dolby Atmos</span>
                </div>
                <div class="sm:col-span-2">
                  <span class="text-slate-400 font-medium">Cast:</span>
                  <span class="text-slate-200 ml-1.5">${escapeHtml(currentMovie.cast.join(', '))}</span>
                </div>
              </div>

              <!-- Trailer action if present -->
              ${currentMovie.trailerUrl ? `
                <div class="pt-2">
                  <a
                    href="${currentMovie.trailerUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
                  >
                    <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Watch Official Theatrical Trailer
                  </a>
                </div>
              ` : ''}
            </div>

          </div>
        </div>
      </div>

      <!-- SHOWTIME SELECTION SECTION -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 w-full">
        <div class="space-y-8">
          <div>
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-400 tracking-widest uppercase mb-2">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Instant Seat Reservation
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-white">Select Date & Showtime</h2>
          </div>

          <!-- Date Selector Tabs with Luxury Styling -->
          <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            ${availableDates.map(d => {
              const isSelected = d.iso === selectedDate;
              return `
                <button
                  data-date="${d.iso}"
                  class="date-tab-btn flex flex-col items-center justify-center min-w-[96px] py-3.5 px-4 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 border-amber-300 font-bold shadow-lg shadow-amber-400/25 scale-[1.02]'
                      : 'bg-[#0c111d] text-slate-300 border-white/5 hover:border-white/20 hover:text-white'
                  }"
                >
                  <span class="text-[11px] uppercase tracking-wider ${isSelected ? 'text-slate-950 font-bold' : 'text-slate-400'}">${d.dayName}</span>
                  <span class="text-2xl font-heading font-black mt-0.5">${d.dayNumber}</span>
                  <span class="text-[10px] font-mono ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'}">${d.month}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Showtimes grouped by Hall / Format -->
          <div id="showtimes-container" class="space-y-6 pt-2">
            ${renderGroupedShowtimes()}
          </div>
        </div>
      </section>

    </div>
  `;
}

function generateAvailableDates(): { iso: string; dayName: string; dayNumber: number; month: string }[] {
  const dates = [];
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    dates.push({
      iso: d.toISOString().slice(0, 10),
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()],
      dayNumber: d.getDate(),
      month: monthNames[d.getMonth()]
    });
  }
  return dates;
}

function renderGroupedShowtimes(): string {
  if (!currentShows.length) {
    return `
      <div class="glass-panel rounded-2xl p-10 text-center">
        <p class="text-sm text-slate-400">No scheduled shows found for this movie.</p>
      </div>
    `;
  }

  // Filter shows by selected date
  const filtered = currentShows.filter(s => s.startTime.startsWith(selectedDate) && s.status === 'scheduled');

  if (!filtered.length) {
    return `
      <div class="glass-panel rounded-2xl p-10 text-center">
        <p class="text-sm text-slate-400">No screenings available for ${selectedDate}. Please select another date above.</p>
      </div>
    `;
  }

  // Group shows by screenId
  const groups = new Map<string, typeof filtered>();
  for (const s of filtered) {
    const list = groups.get(s.screenId) || [];
    list.push(s);
    groups.set(s.screenId, list);
  }

  return Array.from(groups.entries()).map(([screenId, shows]) => {
    const screenName = getScreenDisplayName(screenId);
    return `
      <div class="glass-panel rounded-2xl p-6 sm:p-8 space-y-5 border border-white/5 hover:border-amber-500/20 transition-colors">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <h3 class="text-lg font-bold text-white font-heading">${screenName}</h3>
            <span class="text-xs text-slate-400">Ultra-Plush Recliners &middot; 4K Dual Laser 12-Channel Surround</span>
          </div>
          <span class="text-xs text-amber-400 font-mono font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
            From Rs. ${shows[0].basePrice.toLocaleString()} PKR
          </span>
        </div>

        <div class="flex flex-wrap gap-4 pt-1">
          ${shows.map(show => {
            const time = new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            return `
              <a
                href="#/book/${show.id}"
                class="group flex flex-col items-center justify-center min-w-[140px] p-4 rounded-xl border border-white/10 bg-[#0c111d] hover:bg-gradient-to-br hover:from-amber-400 hover:to-amber-500 hover:border-amber-300 transition-all duration-300 text-center shadow-lg hover:shadow-amber-500/20 hover:scale-105"
              >
                <span class="text-lg font-black font-mono text-white group-hover:text-slate-950 transition-colors">
                  ${time}
                </span>
                <span class="text-xs font-mono text-amber-400 group-hover:text-slate-900 font-bold transition-colors mt-0.5">
                  Rs. ${show.basePrice.toLocaleString()}
                </span>
                <span class="text-[10px] uppercase font-mono tracking-wider text-slate-400 group-hover:text-slate-800 font-semibold transition-colors mt-1">
                  Pick Seats &rarr;
                </span>
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function getScreenDisplayName(screenId: string): string {
  if (screenId.includes('karachi')) return 'Screen 1 — Royal IMAX (Karachi Clifton)';
  if (screenId.includes('lahore')) return 'Screen 2 — VIP Gold Lounge (Lahore Gulberg)';
  if (screenId.includes('isb') || screenId.includes('islamabad')) return 'Screen 3 — Centaurus Arena (Islamabad)';
  return screenId;
}

export function attachMovieDetailsEvents(): void {
  document.querySelectorAll('.date-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectedDate = (e.currentTarget as HTMLElement).getAttribute('data-date') || '';
      const container = document.getElementById('showtimes-container');
      if (container) {
        container.innerHTML = renderGroupedShowtimes();
      }
      // Update active tab styles
      document.querySelectorAll('.date-tab-btn').forEach(b => {
        b.className = 'date-tab-btn flex flex-col items-center justify-center min-w-[96px] py-3.5 px-4 rounded-2xl border transition-all duration-200 bg-[#0c111d] text-slate-300 border-white/5 hover:border-white/20 hover:text-white';
      });
      const target = e.currentTarget as HTMLElement;
      target.className = 'date-tab-btn flex flex-col items-center justify-center min-w-[96px] py-3.5 px-4 rounded-2xl border transition-all duration-200 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 border-amber-300 font-bold shadow-lg shadow-amber-400/25 scale-[1.02]';
    });
  });
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
