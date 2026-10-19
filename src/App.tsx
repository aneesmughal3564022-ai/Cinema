import React, { useState, useEffect } from 'react';
import { Movie, CityName, BookingTicket } from './types/cinema';
import { INITIAL_MOVIES, CINEMA_LOCATIONS } from './data/moviesData';
import { CinemaHeader } from './components/CinemaHeader';
import { HeroSection } from './components/HeroSection';
import { FeatureCards } from './components/FeatureCards';
import { MovieCatalog } from './components/MovieCatalog';
import { BookingModal } from './components/BookingModal';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { TicketLookupModal } from './components/TicketLookupModal';
import { CinemaFooter } from './components/CinemaFooter';
import { AdminPortal } from './components/AdminPortal';

export const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '#/');
  const [movies] = useState<Movie[]>(INITIAL_MOVIES);
  const [selectedCity, setSelectedCity] = useState<CityName>('Karachi');
  const [activeHeroMovie, setActiveHeroMovie] = useState<Movie>(INITIAL_MOVIES[0]);
  const [activeTab, setActiveTab] = useState<'now-showing' | 'upcoming'>('now-showing');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNavTab, setActiveNavTab] = useState<string>('movies');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Modals state
  const [bookingMovie, setBookingMovie] = useState<Movie | null>(null);
  const [detailsMovie, setDetailsMovie] = useState<Movie | null>(null);
  const [isTicketLookupOpen, setIsTicketLookupOpen] = useState<boolean>(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState<boolean>(false);

  // Tickets History State
  const [recentTickets, setRecentTickets] = useState<BookingTicket[]>([
    {
      reference: 'CVP-KAR-7842',
      movieTitle: 'The Legend of Maula Jatt',
      movieId: 'mov-maula-jatt',
      city: 'Karachi',
      theater: 'Royal IMAX Karachi',
      date: 'Today',
      time: '18:15',
      seats: ['D-5', 'D-6'],
      totalPrice: 2500,
      customerName: 'Hamza Tariq',
      customerPhone: '03001234567',
      timestamp: '14:30'
    }
  ]);

  const handleTicketGenerated = (ticket: BookingTicket) => {
    setRecentTickets([ticket, ...recentTickets]);
  };

  const handleNavigateTab = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === 'showtimes' || tab === 'movies') {
      const catalogEl = document.getElementById('movies-catalog');
      catalogEl?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'experience') {
      setIsPolicyOpen(true);
    }
  };

  const nowShowingMovies = movies.filter(m => m.status === 'now-showing');
  const upcomingMovies = movies.filter(m => m.status === 'upcoming');

  // If URL hash points to Admin portal, render AdminPortal console
  if (currentHash.startsWith('#/admin')) {
    return (
      <AdminPortal
        onExit={() => {
          window.location.hash = '#/';
          setCurrentHash('#/');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#05070c] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Luxury Navigation Bar matching Screenshot */}
      <CinemaHeader
        selectedCity={selectedCity}
        onCityChange={(city: CityName) => setSelectedCity(city)}
        onOpenTicketLookup={() => setIsTicketLookupOpen(true)}
        onNavigateTab={handleNavigateTab}
        activeNavTab={activeNavTab}
      />

      {/* Hero Section & Right Cinema Selector matching Screenshot */}
      <main className="flex-1">
        <HeroSection
          activeMovie={activeHeroMovie}
          nowShowingMovies={nowShowingMovies}
          upcomingMovies={upcomingMovies}
          selectedCity={selectedCity}
          onSelectMovie={(movie) => setActiveHeroMovie(movie)}
          onOpenBooking={(movie) => setBookingMovie(movie)}
          onOpenDetails={(movie) => setDetailsMovie(movie)}
        />

        {/* Bottom Feature Cards matching Screenshot */}
        <FeatureCards
          onOpenExperience={() => setIsPolicyOpen(true)}
          onOpenPolicy={() => setIsPolicyOpen(true)}
        />

        {/* Comprehensive Pakistani Cinema Catalog */}
        <MovieCatalog
          movies={movies}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCity={selectedCity}
          onOpenBooking={(movie) => setBookingMovie(movie)}
          onSelectMovie={(movie) => {
            setActiveHeroMovie(movie);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>

      {/* Footer */}
      <CinemaFooter
        onOpenPolicy={() => setIsPolicyOpen(true)}
        onOpenTicketLookup={() => setIsTicketLookupOpen(true)}
      />

      {/* Booking & Seat Selection Modal */}
      {bookingMovie && (
        <BookingModal
          movie={bookingMovie}
          selectedCity={selectedCity}
          onClose={() => setBookingMovie(null)}
          onTicketGenerated={handleTicketGenerated}
        />
      )}

      {/* Movie Details Modal */}
      {detailsMovie && (
        <MovieDetailsModal
          movie={detailsMovie}
          selectedCity={selectedCity}
          onClose={() => setDetailsMovie(null)}
          onBookNow={(movie) => setBookingMovie(movie)}
        />
      )}

      {/* Digital Ticket Lookup Modal */}
      {isTicketLookupOpen && (
        <TicketLookupModal
          onClose={() => setIsTicketLookupOpen(false)}
          recentTickets={recentTickets}
        />
      )}

      {/* Theaters & Experience Modal */}
      {isPolicyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0c121d] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold font-heading text-white">CineVerse Luxury Standards</h3>
              <button
                onClick={() => setIsPolicyOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-amber-400 block font-mono">1. ROYAL IMAX DUAL LASER</strong>
                Featuring the largest commercial screens in Pakistan, 4K dual laser projection, and 12-channel surround sound.
              </p>
              <p>
                <strong className="text-amber-400 block font-mono">2. VIP GOLD RECLINERS</strong>
                Motorized plush leather recliners with at-seat gourmet food service and private table spaces.
              </p>
              <p>
                <strong className="text-amber-400 block font-mono">3. INSTANT QR CODE VERIFICATION</strong>
                Zero double bookings with atomic seat holds. Instant QR pass sent via SMS/Email and accepted at turnstiles.
              </p>
              <p>
                <strong className="text-amber-400 block font-mono">4. FREE CANCELLATION GUARANTEE</strong>
                Full ticket refund to your original payment method (JazzCash, Easypaisa, or Card) up to 3 hours before showtime.
              </p>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setIsPolicyOpen(false)}
                className="btn-gold-luxury px-6 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
