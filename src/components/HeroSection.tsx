import React from 'react';
import { Movie, CityName } from '../types/cinema';
import { SafeImage } from './SafeImage';
import { Ticket } from 'lucide-react';

interface HeroSectionProps {
  activeMovie: Movie;
  nowShowingMovies: Movie[];
  upcomingMovies: Movie[];
  selectedCity: CityName;
  onSelectMovie: (movie: Movie) => void;
  onOpenBooking: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeMovie,
  nowShowingMovies,
  upcomingMovies,
  selectedCity,
  onSelectMovie,
  onOpenBooking,
  onOpenDetails
}) => {
  return (
    <section className="relative w-full border-b border-white/10 overflow-hidden bg-[#070a10]">
      
      {/* Backdrop Banner Layer with High-Contrast Scrim matching Screenshot */}
      <div className="absolute inset-0 z-0">
        <img
          key={activeMovie.id}
          src={activeMovie.bannerUrl}
          alt={`${activeMovie.title} Banner`}
          className="w-full h-full object-cover object-center filter brightness-[0.5] contrast-[1.2] scale-105 transition-all duration-700"
          loading="eager"
        />
        {/* Multi-tier Lateral & Vertical Scrim for Absolute Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070c] via-[#05070c]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-[#05070c]/50 to-black/40" />
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[200px] sm:h-[300px] bg-amber-500/10 blur-[100px] sm:blur-[140px] pointer-events-none rounded-full" />
      </div>

      {/* Hero Main Content Grid matching Screenshot */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT 7-8 COLS: Featured Premiere Info & CTAs */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3.5 sm:space-y-4 pt-1 sm:pt-2 lg:pt-4 pr-0 lg:pr-4">
            
            {/* Tagline */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase text-amber-400">
              <span>FEATURED PREMIERE</span>
              <span className="text-slate-500">&middot;</span>
              <span>{selectedCity.toUpperCase()} EXCLUSIVE</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-[4.2rem] font-black font-heading text-white tracking-tight leading-[1.1] sm:leading-[1.05] drop-shadow-2xl break-words">
              {activeMovie.title}
            </h1>

            {/* Badges Row matching Screenshot */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs text-slate-300 font-medium">
              <span className="px-2 py-0.5 rounded-md border border-amber-500/60 bg-amber-500/15 text-amber-300 font-bold font-mono text-[10px] sm:text-[11px] shadow-sm">
                {activeMovie.contentRating}
              </span>
              <span className="text-slate-500">&middot;</span>
              <span className="font-mono text-slate-200">{activeMovie.durationMinutes} min</span>
              <span className="text-slate-500">&middot;</span>
              <span className="text-slate-200">{activeMovie.genre.join(', ')}</span>
              <span className="text-slate-500 hidden sm:inline">&middot;</span>
              <span className="text-slate-300 hidden sm:inline">{activeMovie.language}</span>
              {activeMovie.subtitles && (
                <>
                  <span className="text-slate-500 hidden sm:inline">&middot;</span>
                  <span className="text-slate-400 hidden sm:inline">{activeMovie.subtitles}</span>
                </>
              )}
            </div>

            {/* Synopsis matching Screenshot */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-300/90 leading-relaxed max-w-2xl pt-0.5 line-clamp-3 sm:line-clamp-none">
              {activeMovie.synopsis}
            </p>

            {/* Director & Cast matching Screenshot */}
            <div className="text-[11px] sm:text-xs text-slate-400 pt-0.5">
              <span className="text-slate-200 font-semibold">Director:</span> {activeMovie.director} &middot;{' '}
              <span className="text-slate-200 font-semibold">Cast:</span> {activeMovie.cast.slice(0, 3).join(', ')}
            </div>

            {/* Action Buttons Row matching Screenshot */}
            <div className="pt-3 sm:pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              
              {/* Button 1: Glowing Gold Glass Pill Button for "BOOK TICKETS" */}
              <button
                onClick={() => onOpenBooking(activeMovie)}
                className="btn-gold-glass w-full sm:w-auto justify-center px-7 sm:px-8 py-3 text-xs sm:text-sm font-bold flex items-center gap-2.5 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Ticket className="w-4 h-4 text-amber-300 stroke-[2.2]" />
                <span>BOOK TICKETS</span>
              </button>

              {/* Button 2: Brushed Metallic Aluminum Pill Button for "View Showtimes & Details" */}
              <button
                onClick={() => onOpenDetails(activeMovie)}
                className="btn-brushed-metal w-full sm:w-auto text-center px-6 sm:px-8 py-3 text-xs sm:text-sm cursor-pointer"
              >
                View Showtimes & Details
              </button>

            </div>

          </div>

          {/* RIGHT 4-5 COLS: "Now Showing" and "Coming Soon" Glassy Panel matching Screenshot */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#0a0f18]/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-3.5 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-4 sm:space-y-5 mt-2 lg:mt-0">
            
            {/* Now Showing Section */}
            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-3 px-1">
                <h3 className="text-xs sm:text-sm font-bold font-heading text-white tracking-wide">Now Showing</h3>
                <span className="text-[9px] sm:text-[10px] font-mono text-amber-400/90">{selectedCity} IMAX</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {nowShowingMovies.slice(0, 6).map((movie) => {
                  const isSelected = movie.id === activeMovie.id;
                  const primaryShowtime = movie.showtimes?.[0] || '15:00';
                  return (
                    <button
                      key={movie.id}
                      onClick={() => onSelectMovie(movie)}
                      className={`group text-left flex flex-col rounded-xl overflow-hidden p-1 transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'card-gold-glow'
                          : 'border border-white/10 bg-[#0e1422]/70 hover:border-white/30 hover:bg-[#0e1422]'
                      }`}
                    >
                      <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-slate-950">
                        <SafeImage
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="transition-transform duration-300 group-hover:scale-105"
                          loading="eager"
                        />
                      </div>
                      <div className="p-0.5 sm:p-1 text-center w-full">
                        <span className="block text-[9px] sm:text-[10px] font-semibold text-slate-200 truncate group-hover:text-amber-400">
                          {movie.title}
                        </span>
                        <span className="block text-[8px] sm:text-[9px] font-mono text-amber-400 font-bold mt-0.5">
                          {primaryShowtime}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="pt-2.5 sm:pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2.5 sm:mb-3 px-1">
                <h3 className="text-xs sm:text-sm font-bold font-heading text-white tracking-wide">Coming Soon</h3>
                <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">Upcoming</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {upcomingMovies.slice(0, 3).map((movie) => {
                  const isSelected = movie.id === activeMovie.id;
                  return (
                    <button
                      key={movie.id}
                      onClick={() => onSelectMovie(movie)}
                      className={`group text-left flex flex-col rounded-xl overflow-hidden p-1 transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'card-gold-glow'
                          : 'border border-white/10 bg-[#0e1422]/70 hover:border-white/30 hover:bg-[#0e1422]'
                      }`}
                    >
                      <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-slate-950">
                        <SafeImage
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-0.5 sm:p-1 text-center w-full">
                        <span className="block text-[9px] sm:text-[10px] font-semibold text-slate-300 truncate group-hover:text-amber-400">
                          {movie.title}
                        </span>
                        <span className="block text-[8px] sm:text-[9px] font-mono text-slate-400 mt-0.5">
                          {movie.releaseDate}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
