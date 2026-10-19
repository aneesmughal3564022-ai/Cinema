import React, { useState } from 'react';
import { CityName } from '../types/cinema';
import { Ticket, MapPin, ChevronDown, Menu, X, Film, ShieldCheck } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (tab: string) => {
    onNavigateTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080c14]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Left: Brand Wordmark matching Screenshot */}
        <a 
          href="#/" 
          onClick={(e) => { e.preventDefault(); handleMobileNav('movies'); }}
          className="text-lg sm:text-2xl font-black font-heading tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-95 transition-all flex items-center gap-2 group cursor-pointer"
        >
          <img 
            src="/favicon.svg" 
            alt="CineVerse Logo" 
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform" 
          />
          <div className="flex items-center">
            <span className="gold-gradient-text tracking-wider text-xl sm:text-2xl font-black">CINE</span>
            <span className="text-white tracking-wider text-xl sm:text-2xl font-black ml-1">VERSE</span>
            <span className="text-[9px] sm:text-[11px] uppercase font-mono font-bold tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/40 px-1.5 sm:px-2 py-0.5 rounded-md ml-1.5 sm:ml-2">
              PK
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation Links matching Screenshot */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-sm font-medium text-slate-300">
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
            onClick={() => {
              window.location.hash = '#/admin';
            }}
            className="transition-colors whitespace-nowrap px-2 py-2 text-slate-400 hover:text-amber-300 text-xs font-mono"
          >
            Admin Portal
          </a>
        </nav>

        {/* Right: City Selector & Gold Ticket Button + Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-3.5 shrink-0">
          {/* Brushed Glass Location Pill */}
          <div className="relative glass-pill-location px-2.5 sm:px-4 py-1 sm:py-1.5 flex items-center cursor-pointer hover:border-amber-400/40 transition-colors">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-rose-500 mr-1.5 sm:mr-2 shadow-[0_0_8px_rgba(244,63,94,0.8)] shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value as CityName)}
              className="appearance-none bg-transparent text-[11px] sm:text-xs font-semibold text-white pr-4 sm:pr-6 cursor-pointer focus:outline-none"
            >
              <option value="Karachi" className="bg-[#121620] text-white">Karachi</option>
              <option value="Lahore" className="bg-[#121620] text-white">Lahore</option>
              <option value="Islamabad" className="bg-[#121620] text-white">Islamabad</option>
            </select>
            <ChevronDown className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-300 pointer-events-none absolute right-1.5 sm:right-3" />
          </div>

          {/* Embossed 3D Gold Ticket Button matching Screenshot */}
          <button
            onClick={onOpenTicketLookup}
            className="btn-gold-ticket-embossed w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-950 transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            title="View My Tickets"
            aria-label="View My Tickets"
          >
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-[#241705] stroke-[2.2]" />
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 border border-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#090d16]/98 backdrop-blur-2xl px-4 py-5 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleMobileNav('movies')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                activeNavTab === 'movies'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span>Movies & Schedules</span>
              <Film className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleMobileNav('showtimes')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                activeNavTab === 'showtimes'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Showtimes & Theaters
            </button>
            <button
              onClick={() => handleMobileNav('experience')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                activeNavTab === 'experience'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              IMAX & VIP Experiences
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenTicketLookup();
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 flex items-center justify-between"
            >
              <span>Find My Digital Ticket</span>
              <Ticket className="w-4 h-4 text-amber-400" />
            </button>
            <a
              href="#/admin"
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.location.hash = '#/admin';
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:bg-white/5 flex items-center justify-between"
            >
              <span>Admin Box Office Portal</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
