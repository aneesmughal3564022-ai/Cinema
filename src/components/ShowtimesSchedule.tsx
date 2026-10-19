import React, { useState } from 'react';
import { Movie, CityName } from '../types/cinema';
import { CINEMA_LOCATIONS } from '../data/moviesData';
import { Clock, Calendar, Film, Sparkles, MapPin, Ticket, ChevronRight, CheckCircle2 } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface ShowtimesScheduleProps {
  movies: Movie[];
  selectedCity: CityName;
  onOpenBooking: (movie: Movie, preselectedTime?: string) => void;
  onSelectMovie: (movie: Movie) => void;
}

export const ShowtimesSchedule: React.FC<ShowtimesScheduleProps> = ({
  movies,
  selectedCity,
  onOpenBooking,
  onSelectMovie
}) => {
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow' | 'weekend'>('today');
  const [timeFilter, setTimeFilter] = useState<'all' | 'matinee' | 'evening' | 'night'>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');

  const cinema = CINEMA_LOCATIONS[selectedCity];

  // Filter only movies that have showtimes
  const activeMoviesWithShows = movies.filter((m) => m.showtimes && m.showtimes.length > 0);

  // Helper to test if a time string falls into filter
  const isTimeInFilter = (timeStr: string) => {
    if (timeFilter === 'all') return true;
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (timeFilter === 'matinee') return hour >= 12 && hour < 16;
    if (timeFilter === 'evening') return hour >= 16 && hour < 20;
    if (timeFilter === 'night') return hour >= 20 || hour < 2;
    return true;
  };

  return (
    <section id="showtimes-schedule" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-6 w-full">
      
      {/* Header Container */}
      <div className="bg-[#0b101e] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Title and City Badge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Cinema Timings & Daily Schedules</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white tracking-tight">
              Which Movie Plays At What Time?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Playing in <strong className="text-white">{selectedCity}</strong> &middot; {cinema?.name || 'Premier Multiplex'} ({cinema?.theater || 'Main Screen'})
              </span>
            </p>
          </div>

          {/* Date Selector Tabs */}
          <div className="flex items-center p-1 bg-[#060912] border border-white/10 rounded-xl self-start lg:self-auto shadow-inner">
            <button
              onClick={() => setSelectedDay('today')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDay === 'today'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today (19 Oct)
            </button>
            <button
              onClick={() => setSelectedDay('tomorrow')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDay === 'tomorrow'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tomorrow (20 Oct)
            </button>
            <button
              onClick={() => setSelectedDay('weekend')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDay === 'weekend'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekend Special
            </button>
          </div>
        </div>

        {/* Time of Day & Format Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          
          {/* Time Slot Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-mono text-slate-500 mr-1 hidden sm:inline">Time Slot:</span>
            {[
              { id: 'all', label: 'All Hours' },
              { id: 'matinee', label: 'Matinee (12 PM - 4 PM)' },
              { id: 'evening', label: 'Prime Evening (4 PM - 8 PM)' },
              { id: 'night', label: 'Late Night (8 PM - 12 AM)' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTimeFilter(f.id as any)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer ${
                  timeFilter === f.id
                    ? 'bg-white/20 text-amber-300 border border-amber-400/60 font-bold shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Atomic Seat Locks Active</span>
          </div>
        </div>

        {/* Movie-by-Movie Showtimes List */}
        <div className="space-y-4 pt-2">
          {activeMoviesWithShows.map((movie) => {
            const visibleShowtimes = (movie.showtimes || []).filter(isTimeInFilter);
            if (timeFilter !== 'all' && visibleShowtimes.length === 0) return null;

            return (
              <div
                key={movie.id}
                className="bg-[#070b14] border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
              >
                {/* Left Side: Poster + Movie Details */}
                <div className="flex items-center gap-3.5 sm:gap-4 w-full md:w-5/12">
                  <div
                    onClick={() => onSelectMovie(movie)}
                    className="relative w-16 sm:w-20 aspect-[2/3] rounded-xl overflow-hidden bg-slate-950 shrink-0 cursor-pointer shadow-md group-hover:scale-105 transition-transform"
                  >
                    <SafeImage
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {movie.contentRating}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {movie.durationMinutes}m
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">&middot;</span>
                      <span className="text-[10px] font-mono text-slate-300 truncate">
                        {movie.language}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectMovie(movie)}
                      className="text-base sm:text-lg font-bold font-heading text-white group-hover:text-amber-400 transition-colors cursor-pointer truncate"
                    >
                      {movie.title}
                    </h3>

                    <div className="text-[11px] text-slate-400 truncate">
                      {movie.genre.slice(0, 2).join(' · ')} &middot; Dir: <span className="text-slate-300">{movie.director}</span>
                    </div>

                    <div className="text-[10px] font-mono text-amber-400/90 flex items-center gap-1 pt-0.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{cinema?.name || 'Screen 1 & 2'} &middot; Dual Laser</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Clickable Time Badges */}
                <div className="w-full md:w-7/12 flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="flex flex-wrap items-center gap-2">
                    {visibleShowtimes.map((time, idx) => {
                      const isSoldOut = time === '18:15' && movie.id === 'mov-maula-jatt';
                      const isFillingFast = idx === 1;

                      return (
                        <button
                          key={time}
                          disabled={isSoldOut}
                          onClick={() => onOpenBooking(movie, time)}
                          className={`relative group/btn px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center min-w-[76px] sm:min-w-[88px] ${
                            isSoldOut
                              ? 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed opacity-60'
                              : 'bg-[#0f172a] hover:bg-amber-400 hover:text-slate-950 text-white border border-white/10 hover:border-amber-400 shadow-md active:scale-95'
                          }`}
                          title={isSoldOut ? 'Screening Sold Out' : `Book ${movie.title} for ${time}`}
                        >
                          <span className="text-xs sm:text-sm font-black font-mono tracking-tight group-hover/btn:text-slate-950">
                            {time}
                          </span>
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 group-hover/btn:text-slate-900 font-semibold">
                            {isSoldOut ? 'Sold Out' : isFillingFast ? 'Fast Filling' : 'Available'}
                          </span>
                          <span className="text-[9px] font-mono text-amber-400 group-hover/btn:text-slate-950 font-bold">
                            Rs. {movie.startingPrice || 1200}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Action Button */}
                  <button
                    onClick={() => onOpenBooking(movie)}
                    className="btn-gold-luxury w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 shrink-0"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Book Ticket</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Information Callout Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              All showtimes reflect current local timezone in Pakistan. Gate opens 20 minutes prior to screening.
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-400 font-bold whitespace-nowrap">
            Zero Booking Fee via JazzCash / Easypaisa
          </span>
        </div>

      </div>
    </section>
  );
};
