import React from 'react';
import { Movie, CityName } from '../types/cinema';
import { SafeImage } from './SafeImage';
import { Search, Filter } from 'lucide-react';

interface MovieCatalogProps {
  movies: Movie[];
  activeTab: 'now-showing' | 'upcoming';
  setActiveTab: (tab: 'now-showing' | 'upcoming') => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: CityName;
  onOpenBooking: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
}

const GENRES = ['All', 'Action', 'Drama', 'Period Epic', 'Comedy', 'Romance', 'Military', 'Sci-Fi'];

export const MovieCatalog: React.FC<MovieCatalogProps> = ({
  movies,
  activeTab,
  setActiveTab,
  selectedGenre,
  setSelectedGenre,
  searchQuery,
  setSearchQuery,
  selectedCity,
  onOpenBooking,
  onSelectMovie
}) => {
  const filteredMovies = movies.filter((m) => {
    const matchesTab = m.status === activeTab;
    const matchesGenre = selectedGenre === 'All' || m.genre.some(g => g.toLowerCase() === selectedGenre.toLowerCase());
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      m.title.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q) ||
      m.cast.some(c => c.toLowerCase().includes(q)) ||
      m.genre.some(g => g.toLowerCase().includes(q))
    );
    return matchesTab && matchesGenre && matchesSearch;
  });

  return (
    <section id="movies-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 w-full">
      
      {/* Section Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-400 tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pakistani Blockbusters & Global Premieres
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            All Cinema Schedules
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Showing in {selectedCity} &middot; Clifton Royal IMAX, Gulberg Gold Lounge & Centaurus Arena
          </p>
        </div>

        {/* Tabs & Search Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Tab switcher */}
          <div className="flex items-center p-1 bg-[#0c111d] border border-white/10 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveTab('now-showing')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'now-showing'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Now Showing
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Coming Soon
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search movies, cast, director..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c111d]/90 border border-white/10 text-xs text-slate-100 pl-9 pr-4 py-2.5 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-all shadow-inner"
            />
            <Search className="w-3.5 h-3.5 text-amber-400/70 absolute inset-y-0 left-3 my-auto pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-5 scrollbar-none text-xs">
        <span className="text-slate-500 font-medium shrink-0 mr-1 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          Genre:
        </span>
        {GENRES.map((g) => {
          const isAct = selectedGenre.toLowerCase() === g.toLowerCase();
          return (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-4 py-1.5 font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isAct
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10 font-semibold'
                  : 'text-slate-400 hover:text-white bg-[#0c111d] border border-white/5 hover:border-white/10'
              }`}
            >
              {g === 'All' ? 'All Genres' : g}
            </button>
          );
        })}
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 pt-2">
        {filteredMovies.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-3xl">
            <h3 className="text-lg font-bold text-white font-heading">No Films Match Your Search</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn't find any films matching "{searchQuery}". Try clearing filters.
            </p>
            <button
              onClick={() => {
                setSelectedGenre('All');
                setSearchQuery('');
                setActiveTab('now-showing');
              }}
              className="mt-5 btn-gold-luxury px-5 py-2 text-xs rounded-xl cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredMovies.map((movie) => (
            <article
              key={movie.id}
              className="group relative flex flex-col bg-[#0a0e18]/85 backdrop-blur-xl border border-white/10 hover:border-amber-400/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(245,158,11,0.18)] hover:-translate-y-1.5"
            >
              {/* Poster */}
              <div 
                onClick={() => onSelectMovie(movie)}
                className="relative aspect-[3/4] overflow-hidden bg-slate-950 block cursor-pointer"
              >
                <SafeImage
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Badges on Poster */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#05070c]/85 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                    {movie.contentRating}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#05070c]/85 text-slate-300 border border-white/10 backdrop-blur-md">
                    {movie.durationMinutes}m
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b1120] to-transparent pointer-events-none" />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] font-mono tracking-wider text-amber-400/90 font-medium truncate uppercase">
                    {movie.genre.slice(0, 2).join(' · ')}
                  </div>

                  <h3 
                    onClick={() => onSelectMovie(movie)}
                    className="text-lg font-bold font-heading text-white group-hover:text-amber-400 transition-colors line-clamp-1 mt-1 cursor-pointer"
                  >
                    {movie.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {movie.synopsis}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                  <div className="text-xs font-mono">
                    {movie.status === 'now-showing' ? (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Showing Daily
                      </span>
                    ) : (
                      <span className="text-slate-400">Releases {movie.releaseDate}</span>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenBooking(movie)}
                    className="btn-gold-luxury px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shadow-md transition-transform group-hover:scale-105 cursor-pointer"
                  >
                    {movie.status === 'now-showing' ? 'Book Tickets' : 'Details'}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

    </section>
  );
};
