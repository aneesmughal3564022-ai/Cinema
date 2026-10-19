import React from 'react';
import { CityName } from '../types/cinema';
import { Ticket, MapPin, ChevronDown } from 'lucide-react';

interface CinemaHeaderProps {
  selectedCity: CityName;
  onCityChange: (city: CityName) => void;
  onOpenTicketLookup: () => void;
  onNavigateTab: (tab: string) => void;
  activeNavTab: string;
}

export const CinemaHeader: React.FC<CinemaHeaderProps> = ({
  selectedCity,
  onCityChange,
  onOpenTicketLookup,
  onNavigateTab,
  activeNavTab
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080c14]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark matching Screenshot */}
        <a 
          href="#/" 
          onClick={(e) => { e.preventDefault(); onNavigateTab('movies'); }}
          className="text-2xl font-black font-heading tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-95 transition-all flex items-center group cursor-pointer"
        >
          <span className="gold-gradient-text tracking-wider text-2xl font-black">CINE</span>
          <span className="text-white tracking-wider text-2xl font-black ml-1.5">VERSE</span>
          <span className="text-[11px] uppercase font-mono font-bold tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/40 px-2 py-0.5 rounded-md ml-2">
            PK
          </span>
        </a>

        {/* Zone 2: Navigation Links matching Screenshot */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigateTab('movies')}
            className={`transition-all duration-200 cursor-pointer ${
              activeNavTab === 'movies'
                ? 'glass-tab-active font-bold px-5 py-2 rounded-t-xl'
                : 'hover:text-amber-300 text-slate-300 px-3 py-2'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => onNavigateTab('showtimes')}
            className={`transition-colors whitespace-nowrap cursor-pointer px-2 py-2 hover:text-amber-300 ${
              activeNavTab === 'showtimes' ? 'text-amber-300 font-bold' : 'text-slate-300'
            }`}
          >
            Showtimes
          </button>
          <button
            onClick={() => onNavigateTab('experience')}
            className={`transition-colors whitespace-nowrap cursor-pointer px-2 py-2 hover:text-amber-300 ${
              activeNavTab === 'experience' ? 'text-amber-300 font-bold' : 'text-slate-300'
            }`}
          >
            IMAX & VIP
          </button>
          <button
            onClick={onOpenTicketLookup}
            className="transition-colors whitespace-nowrap cursor-pointer px-2 py-2 hover:text-amber-300 text-slate-300"
          >
            Find My Ticket
          </button>
          <a
            href="#/admin"
            className="transition-colors whitespace-nowrap px-2 py-2 text-slate-400 hover:text-amber-300 text-xs font-mono"
          >
            Admin Portal
          </a>
        </nav>

        {/* Zone 3: City Selector & Gold Ticket Button matching Screenshot */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* Brushed Glass Location Pill matching Screenshot */}
          <div className="relative glass-pill-location px-4 py-1.5 flex items-center cursor-pointer hover:border-amber-400/40 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 shadow-[0_0_8px_rgba(244,63,94,0.8)] shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value as CityName)}
              className="appearance-none bg-transparent text-xs font-semibold text-white pr-6 cursor-pointer focus:outline-none"
            >
              <option value="Karachi" className="bg-[#121620] text-white">Karachi</option>
              <option value="Lahore" className="bg-[#121620] text-white">Lahore</option>
              <option value="Islamabad" className="bg-[#121620] text-white">Islamabad</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-300 pointer-events-none absolute right-3" />
          </div>

          {/* Embossed 3D Gold Ticket Button matching Screenshot */}
          <button
            onClick={onOpenTicketLookup}
            className="btn-gold-ticket-embossed w-10 h-10 flex items-center justify-center text-slate-950 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="View My Tickets"
            aria-label="View My Tickets"
          >
            <Ticket className="w-5 h-5 text-[#241705] stroke-[2.2]" />
          </button>
        </div>

      </div>
    </header>
  );
};
