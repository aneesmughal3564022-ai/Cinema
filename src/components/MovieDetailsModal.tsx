import React from 'react';
import { Movie, CityName } from '../types/cinema';
import { SafeImage } from './SafeImage';
import { X, Play, Clock, Film, Award } from 'lucide-react';

interface MovieDetailsModalProps {
  movie: Movie;
  selectedCity: CityName;
  onClose: () => void;
  onBookNow: (movie: Movie) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  selectedCity,
  onClose,
  onBookNow
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0c121d] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        
        {/* Header with Backdrop Image */}
        <div className="relative h-48 sm:h-72 w-full overflow-hidden shrink-0">
          <img
            src={movie.bannerUrl}
            alt={movie.title}
            className="w-full h-full object-cover filter brightness-[0.55] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c121d] via-[#0c121d]/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-amber-400 font-bold mb-0.5 sm:mb-1">
                <span>{selectedCity.toUpperCase()} EXCLUSIVE</span>
                <span>&middot;</span>
                <span>{movie.contentRating}</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-heading text-white">{movie.title}</h2>
            </div>
            {movie.trailerUrl && (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-gold-luxury px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Trailer</span>
              </a>
            )}
          </div>
        </div>

        {/* Body Details */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            
            <div className="md:col-span-4 hidden md:block">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden glass-panel shadow-lg">
                <SafeImage src={movie.posterUrl} alt={movie.title} />
              </div>
            </div>

            <div className="md:col-span-8 space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300 font-mono">
                <span className="flex items-center gap-1 text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  {movie.durationMinutes} Min
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1 text-slate-200">
                  <Film className="w-3.5 h-3.5" />
                  {movie.genre.join(', ')}
                </span>
                <span className="hidden sm:inline">&middot;</span>
                <span className="hidden sm:flex items-center gap-1 text-slate-400">
                  <Award className="w-3.5 h-3.5" />
                  {movie.language}
                </span>
              </div>

              <div>
                <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Synopsis</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {movie.synopsis}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">DIRECTOR</span>
                  <span className="text-white font-semibold">{movie.director}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">RELEASE DATE</span>
                  <span className="text-amber-400 font-semibold">{movie.releaseDate}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">FEATURED CAST</span>
                  <span className="text-slate-200">{movie.cast.join(', ')}</span>
                </div>
              </div>

              <div className="pt-3 sm:pt-4">
                <button
                  onClick={() => {
                    onClose();
                    onBookNow(movie);
                  }}
                  className="w-full btn-gold-luxury py-2.5 sm:py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book Tickets for this Movie &rarr;</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
