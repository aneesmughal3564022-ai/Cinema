import React, { useState, useEffect } from 'react';
import { Movie, CityName, BookingTicket } from '../types/cinema';
import { INITIAL_MOVIES, CINEMA_LOCATIONS } from '../data/moviesData';
import {
  LayoutDashboard,
  Film,
  Armchair,
  CalendarClock,
  ScanLine,
  TrendingUp,
  Settings,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  Search,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  RefreshCw,
  Clock,
  MapPin,
  Sparkles,
  Ticket
} from 'lucide-react';

interface AdminPortalProps {
  onExit: () => void;
}

interface AdminBookingRecord {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  movieTitle: string;
  city: CityName;
  theater: string;
  showtime: string;
  seats: string[];
  totalPrice: number;
  paymentMethod: string;
  status: 'confirmed' | 'checked-in' | 'cancelled';
  bookedAt: string;
}

const INITIAL_BOOKINGS: AdminBookingRecord[] = [
  {
    id: 'bk-1',
    reference: 'CVP-KAR-7842',
    customerName: 'Hamza Tariq',
    customerPhone: '03001234567',
    movieTitle: 'The Legend of Maula Jatt',
    city: 'Karachi',
    theater: 'Royal IMAX Karachi',
    showtime: '18:15 Today',
    seats: ['D-5', 'D-6'],
    totalPrice: 3400,
    paymentMethod: 'JazzCash',
    status: 'checked-in',
    bookedAt: '14:20'
  },
  {
    id: 'bk-2',
    reference: 'CVP-LHR-9104',
    customerName: 'Ayesha Malik',
    customerPhone: '03219876543',
    movieTitle: 'Kamli',
    city: 'Lahore',
    theater: 'VIP Gold Lounge Lahore',
    showtime: '19:30 Today',
    seats: ['B-3', 'B-4'],
    totalPrice: 2800,
    paymentMethod: 'Easypaisa',
    status: 'confirmed',
    bookedAt: '15:05'
  },
  {
    id: 'bk-3',
    reference: 'CVP-ISB-3312',
    customerName: 'Bilal Khan',
    customerPhone: '03335551234',
    movieTitle: 'London Nahi Jaunga',
    city: 'Islamabad',
    theater: 'Centaurus Arena Islamabad',
    showtime: '21:00 Today',
    seats: ['F-7', 'F-8', 'F-9'],
    totalPrice: 4200,
    paymentMethod: 'Credit Card',
    status: 'confirmed',
    bookedAt: '15:45'
  },
  {
    id: 'bk-4',
    reference: 'CVP-KAR-4491',
    customerName: 'Zainab Fatima',
    customerPhone: '03124449876',
    movieTitle: 'Na Maloom Afraad 2',
    city: 'Karachi',
    theater: 'Royal IMAX Karachi',
    showtime: '21:30 Today',
    seats: ['E-1', 'E-2'],
    totalPrice: 2600,
    paymentMethod: 'JazzCash',
    status: 'confirmed',
    bookedAt: '16:10'
  }
];

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExit }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cineverse_admin_auth') === 'true';
  });
  const [password, setPassword] = useState<string>('CinemaAdmin2026!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'movies' | 'screens' | 'shows' | 'bookings' | 'reports' | 'settings'
  >('dashboard');

  // Management State
  const [moviesList, setMoviesList] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('cineverse_admin_movies');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });

  const [bookingsList, setBookingsList] = useState<AdminBookingRecord[]>(() => {
    const saved = localStorage.getItem('cineverse_admin_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Turnstile scanner input
  const [scanRefInput, setScanRefInput] = useState<string>('CVP-KAR-7842');
  const [scannedTicket, setScannedTicket] = useState<AdminBookingRecord | null>(INITIAL_BOOKINGS[0]);
  const [scanStatusMsg, setScanStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Settings State
  const [settings, setSettings] = useState({
    seatHoldMinutes: 10,
    bookingCutoffMinutes: 15,
    maxSeatsPerOrder: 8,
    vipSurchargePkr: 500,
    enableAutoCheckIn: true
  });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // New Movie Modal State
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [newMovieForm, setNewMovieForm] = useState({
    title: '',
    synopsis: '',
    genre: 'Action, Drama',
    durationMinutes: 135,
    language: 'Urdu',
    contentRating: 'PG-13' as const,
    director: '',
    cast: '',
    startingPrice: 1200,
    posterUrl: '/images/maula_jatt_hero.jpg',
    status: 'now-showing' as const
  });

  // Handle Hash sub-routes like #/admin/movies, #/admin/bookings
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('/admin/movies')) setActiveTab('movies');
    else if (hash.includes('/admin/screens')) setActiveTab('screens');
    else if (hash.includes('/admin/shows')) setActiveTab('shows');
    else if (hash.includes('/admin/bookings')) setActiveTab('bookings');
    else if (hash.includes('/admin/reports')) setActiveTab('reports');
    else if (hash.includes('/admin/settings')) setActiveTab('settings');
    else if (hash.includes('/admin/dashboard')) setActiveTab('dashboard');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'CinemaAdmin2026!' || password === 'admin' || password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('cineverse_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator credentials. Hint: use CinemaAdmin2026!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cineverse_admin_auth');
  };

  const handleCheckInTicket = (reference: string) => {
    const updated = bookingsList.map((b) => {
      if (b.reference.toLowerCase() === reference.toLowerCase()) {
        return { ...b, status: 'checked-in' as const };
      }
      return b;
    });
    setBookingsList(updated);
    localStorage.setItem('cineverse_admin_bookings', JSON.stringify(updated));

    const matched = updated.find((b) => b.reference.toLowerCase() === reference.toLowerCase());
    if (matched) {
      setScannedTicket(matched);
      setScanStatusMsg({
        text: `TICKET VALIDATED! Access granted to ${matched.customerName} for seats ${matched.seats.join(', ')}.`,
        type: 'success'
      });
    }
  };

  const handleScanLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = scanRefInput.trim().toUpperCase();
    const found = bookingsList.find((b) => b.reference.toUpperCase() === query);
    if (found) {
      setScannedTicket(found);
      setScanStatusMsg({
        text: `Record found for reference ${found.reference}. Status: ${found.status.toUpperCase()}`,
        type: found.status === 'checked-in' ? 'info' : 'success'
      });
    } else {
      setScannedTicket(null);
      setScanStatusMsg({
        text: `No booking found for reference "${query}". Please check the spelling.`,
        type: 'error'
      });
    }
  };

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    const movie: Movie = {
      id: `mov-${Date.now()}`,
      title: newMovieForm.title,
      slug: newMovieForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      synopsis: newMovieForm.synopsis,
      posterUrl: newMovieForm.posterUrl,
      bannerUrl: newMovieForm.posterUrl,
      genre: newMovieForm.genre.split(',').map((g) => g.trim()),
      durationMinutes: Number(newMovieForm.durationMinutes),
      language: newMovieForm.language,
      contentRating: newMovieForm.contentRating,
      releaseDate: new Date().toISOString().split('T')[0],
      director: newMovieForm.director || 'Pakistani Cinema Director',
      cast: newMovieForm.cast.split(',').map((c) => c.trim()),
      status: newMovieForm.status,
      showtimes: ['15:00', '18:15', '21:30'],
      formats: ['IMAX Dual Laser 3D', 'VIP Gold Lounge', 'Dolby Atmos'],
      startingPrice: Number(newMovieForm.startingPrice)
    };

    const updated = [movie, ...moviesList];
    setMoviesList(updated);
    localStorage.setItem('cineverse_admin_movies', JSON.stringify(updated));
    setIsAddMovieModalOpen(false);
    setNewMovieForm({
      title: '',
      synopsis: '',
      genre: 'Action, Drama',
      durationMinutes: 135,
      language: 'Urdu',
      contentRating: 'PG-13',
      director: '',
      cast: '',
      startingPrice: 1200,
      posterUrl: '/images/maula_jatt_hero.jpg',
      status: 'now-showing'
    });
  };

  const handleDeleteMovie = (id: string) => {
    if (confirm('Are you sure you want to remove this movie from catalog?')) {
      const updated = moviesList.filter((m) => m.id !== id);
      setMoviesList(updated);
      localStorage.setItem('cineverse_admin_movies', JSON.stringify(updated));
    }
  };

  const handleToggleMovieStatus = (id: string) => {
    const updated = moviesList.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          status: (m.status === 'now-showing' ? 'upcoming' : 'now-showing') as 'now-showing' | 'upcoming'
        };
      }
      return m;
    });
    setMoviesList(updated);
    localStorage.setItem('cineverse_admin_movies', JSON.stringify(updated));
  };

  // If user is not authenticated, show Luxury Admin Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
        {/* Top Header */}
        <header className="border-b border-white/10 bg-[#080d18]/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="gold-gradient-text text-xl font-black font-heading tracking-wider">CINEVERSE</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold">
              Box Office Command
            </span>
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-300 transition-colors cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </header>

        {/* Center Login Card */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a101d] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6 relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <ShieldCheck className="w-7 h-7 stroke-[2]" />
              </div>
              <h1 className="text-2xl font-black font-heading text-white tracking-tight">
                Cinema Management Portal
              </h1>
              <p className="text-xs text-slate-400">
                Authorized box office command & turnstile validation for Pakistan operations.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  Admin Authority ID
                </label>
                <input
                  type="text"
                  value="admin@cineverse.pk"
                  readOnly
                  className="w-full bg-[#050811] border border-slate-800 text-slate-400 text-xs px-3.5 py-3 rounded-xl cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 font-mono">
                    Security Passcode
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-mono"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter security passcode"
                    className="w-full bg-[#050811] border border-slate-700 focus:border-amber-400 text-xs text-white px-3.5 py-3 rounded-xl font-mono focus:outline-none transition-colors"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3.5 top-3.5" />
                </div>
              </div>

              {/* Quick Fill Demo Helper */}
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-slate-400 flex items-center justify-between">
                <span>
                  Demo Pass: <strong className="text-amber-300 font-mono">CinemaAdmin2026!</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setPassword('CinemaAdmin2026!')}
                  className="text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  Fill Demo
                </button>
              </div>

              <button
                type="submit"
                className="btn-gold-luxury w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Lock className="w-4 h-4" />
                <span>Enter Admin Console</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={onExit}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                &larr; Back to Public Cinema Website
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4 text-[11px] font-mono text-slate-600 border-t border-white/5">
          CineVerse Pakistan Multi-Screen Management OS &middot; Secure Terminal v3.4
        </footer>
      </div>
    );
  }

  // Calculate Real-time Statistics
  const totalRevenue = bookingsList.reduce((acc, b) => acc + (b.status !== 'cancelled' ? b.totalPrice : 0), 4850000);
  const totalBookingsCount = bookingsList.length + 180;
  const checkedInCount = bookingsList.filter((b) => b.status === 'checked-in').length;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Admin Operational Header */}
      <header className="sticky top-0 z-40 bg-[#080d19]/95 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="gold-gradient-text text-xl font-black font-heading tracking-wider">CINEVERSE</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold">
              Admin OS
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>HQ Operations: Karachi &middot; Lahore &middot; Islamabad (Live)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            title="Return to Public Cinema Website"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Body with Responsive Navigation */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#090f1d] border-b md:border-b-0 md:border-r border-white/10 shrink-0 p-3 sm:p-5 flex md:flex-col justify-between gap-4 overflow-x-auto md:overflow-visible">
          <div className="space-y-1 sm:space-y-6 w-full flex md:flex-col gap-1 md:gap-0">
            <div className="hidden md:block px-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
                ADMIN NAVIGATION
              </span>
              <span className="text-xs font-bold text-slate-300 font-heading">
                Multiplex Command
              </span>
            </div>

            <nav className="flex md:flex-col gap-1 w-full shrink-0">
              <button
                onClick={() => { setActiveTab('dashboard'); window.location.hash = '#/admin/dashboard'; }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard & KPIs</span>
              </button>

              <button
                onClick={() => { setActiveTab('movies'); window.location.hash = '#/admin/movies'; }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'movies'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Film className="w-4 h-4 shrink-0" />
                <span>Pakistani Movies ({moviesList.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('screens'); window.location.hash = '#/admin/screens'; }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'screens'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Armchair className="w-4 h-4 shrink-0" />
                <span>Halls & Seat Layouts</span>
              </button>

              <button
                onClick={() => { setActiveTab('shows'); window.location.hash = '#/admin/shows'; }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'shows'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <CalendarClock className="w-4 h-4 shrink-0" />
                <span>Showtimes & Schedules</span>
              </button>

              <button
                onClick={() => { setActiveTab('bookings'); window.location.hash = '#/admin/bookings'; }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ScanLine className="w-4 h-4 shrink-0" />
                <span>Turnstile Check-In</span>
              </button>

              <button
                onClick={() => { setActiveTab('reports'); window.location.hash = '#/admin/reports'; }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'reports'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>Financial Reports</span>
              </button>

              <button
                onClick={() => { setActiveTab('settings'); window.location.hash = '#/admin/settings'; }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Cinema Settings</span>
              </button>
            </nav>
          </div>

          <div className="hidden md:block pt-6 border-t border-white/10 px-3 space-y-2 text-[11px] font-mono text-slate-500">
            <div>Role: <span className="text-amber-400 font-bold">Chief Executive Admin</span></div>
            <div>Database: <span className="text-slate-300">CineVerse Cloud PK</span></div>
            <div>Sync: <span className="text-emerald-400 font-bold">100% Real-time</span></div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl overflow-y-auto">
          
          {/* ================= TAB 1: DASHBOARD & KPIS ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h1 className="text-2xl font-black font-heading text-white">Box Office Overview</h1>
                  <p className="text-xs text-slate-400">Live ticket metrics, occupancy rates, and turnstile activity</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Turnstiles Open
                  </span>
                </div>
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
                  <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>TODAY'S REVENUE</span>
                    <span className="text-amber-400 font-bold">PKR</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white">
                    Rs. {totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span>&uarr; +18.4% vs yesterday</span>
                  </div>
                </div>

                <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
                  <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>TICKETS SOLD TODAY</span>
                    <span className="text-slate-500 font-bold">Bookings</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white">
                    {totalBookingsCount}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Across Karachi, Lahore & Islamabad
                  </div>
                </div>

                <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
                  <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>AVERAGE OCCUPANCY</span>
                    <span className="text-amber-400 font-bold">%</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-amber-300">
                    86.4%
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold">
                    Royal IMAX selling at capacity
                  </div>
                </div>

                <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-5 space-y-2 relative overflow-hidden">
                  <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>ACTIVE HALLS</span>
                    <span className="text-slate-500 font-bold">Screens</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white">
                    6 Halls / 24 Shows
                  </div>
                  <div className="text-[11px] text-slate-400">
                    All projection lasers nominal
                  </div>
                </div>
              </div>

              {/* Recent Bookings Live Stream Table */}
              <div className="bg-[#0a101d] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-lg font-bold font-heading text-white">Recent Box Office Admissions</h2>
                    <p className="text-xs text-slate-400">Real-time ticket issuance & turnstile status</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Scanner & Validator</span>
                    <span>&rarr;</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                        <th className="pb-3 font-semibold">REFERENCE</th>
                        <th className="pb-3 font-semibold">CUSTOMER</th>
                        <th className="pb-3 font-semibold">MOVIE</th>
                        <th className="pb-3 font-semibold">SEATS</th>
                        <th className="pb-3 font-semibold">THEATER</th>
                        <th className="pb-3 font-semibold">AMOUNT</th>
                        <th className="pb-3 font-semibold">STATUS</th>
                        <th className="pb-3 font-semibold text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookingsList.map((bk) => (
                        <tr key={bk.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 font-mono font-bold text-amber-400">{bk.reference}</td>
                          <td className="py-3 text-white font-medium">
                            <div>{bk.customerName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{bk.customerPhone}</div>
                          </td>
                          <td className="py-3 text-slate-300 font-medium">{bk.movieTitle}</td>
                          <td className="py-3 font-mono text-slate-200">
                            {bk.seats.map((s) => (
                              <span key={s} className="inline-block bg-white/10 px-1.5 py-0.5 rounded mr-1 text-[10px]">
                                {s}
                              </span>
                            ))}
                          </td>
                          <td className="py-3 text-slate-400 text-[11px]">{bk.theater}</td>
                          <td className="py-3 font-mono font-bold text-white">Rs. {bk.totalPrice}</td>
                          <td className="py-3">
                            {bk.status === 'checked-in' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" /> Checked In
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Confirmed
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            {bk.status !== 'checked-in' && (
                              <button
                                onClick={() => handleCheckInTicket(bk.reference)}
                                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Admit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: MOVIE CATALOG ================= */}
          {activeTab === 'movies' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h1 className="text-2xl font-black font-heading text-white">Pakistani Movie Catalog</h1>
                  <p className="text-xs text-slate-400">Manage movie titles, posters, statuses, and pricing</p>
                </div>
                <button
                  onClick={() => setIsAddMovieModalOpen(true)}
                  className="btn-gold-luxury px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Pakistani Movie</span>
                </button>
              </div>

              {/* Grid of Movies */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {moviesList.map((m) => (
                  <div
                    key={m.id}
                    className="bg-[#0b1120] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-400/30 transition-all shadow-xl"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={m.posterUrl || m.bannerUrl}
                          alt={m.title}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent" />
                        <span
                          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                            m.status === 'now-showing'
                              ? 'bg-emerald-500/90 text-white'
                              : 'bg-amber-500/90 text-slate-950'
                          }`}
                        >
                          {m.status === 'now-showing' ? 'Now Showing' : 'Coming Soon'}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="text-base font-bold font-heading text-white line-clamp-1">{m.title}</h3>
                        <div className="text-[11px] text-slate-400 line-clamp-2">{m.synopsis}</div>
                        <div className="pt-2 flex flex-wrap gap-1">
                          {m.genre.map((g) => (
                            <span key={g} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                              {g}
                            </span>
                          ))}
                        </div>
                        <div className="pt-2 text-xs font-mono text-slate-400 flex items-center justify-between">
                          <span>Director: <strong className="text-slate-200">{m.director}</strong></span>
                          <span>Base: <strong className="text-amber-400">Rs. {m.startingPrice || 1200}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-white/10 flex items-center justify-between gap-2 bg-[#090e1b]">
                      <button
                        onClick={() => handleToggleMovieStatus(m.id)}
                        className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 cursor-pointer"
                      >
                        {m.status === 'now-showing' ? 'Switch to Upcoming' : 'Switch to Now Showing'}
                      </button>

                      <button
                        onClick={() => handleDeleteMovie(m.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        title="Delete Movie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: HALLS & SCREENS ================= */}
          {activeTab === 'screens' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl font-black font-heading text-white">Multiplex Halls & Seat Layouts</h1>
                <p className="text-xs text-slate-400">Screen dimensions, projector lasers, and luxury seating tiers</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Object.entries(CINEMA_LOCATIONS).map(([key, loc]) => (
                  <div key={key} className="bg-[#0b1120] border border-white/10 rounded-2xl p-6 space-y-5">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400">{loc.city} FLAGSHIP</div>
                      <h3 className="text-lg font-bold font-heading text-white">{loc.name}</h3>
                      <p className="text-xs text-slate-400">{loc.theater}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#080d18] border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Projection:</span>
                        <strong className="text-amber-400">4K Dual Laser</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Audio Soundscape:</span>
                        <strong className="text-white">Dolby Atmos 128-ch</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Seat Capacity:</span>
                        <strong className="text-white font-mono">120 Seats</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>VIP Gold Recliners:</span>
                        <strong className="text-amber-400 font-mono">24 Recliners</strong>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-mono text-slate-400 block">Supported Formats:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {loc.formats.map((f) => (
                          <span key={f} className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Mini Visual Seat Grid representation */}
                    <div className="pt-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2 text-center">Screen Front</span>
                      <div className="w-full h-1.5 bg-gradient-to-r from-amber-400/20 via-amber-400 to-amber-400/20 rounded-full mb-3" />
                      <div className="grid grid-cols-8 gap-1 opacity-70">
                        {Array.from({ length: 32 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-3 rounded-sm ${
                              i < 8 ? 'bg-amber-400/60' : i % 5 === 0 ? 'bg-rose-500/50' : 'bg-slate-700'
                            }`}
                            title={`Seat ${i + 1}`}
                          />
                        ))}
                      </div>
                      <div className="mt-2 text-[10px] font-mono text-slate-500 text-center">
                        Active Show: <span className="text-emerald-400 font-bold">Maula Jatt 18:15 (88% Sold)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: SHOWTIMES ================= */}
          {activeTab === 'shows' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h1 className="text-2xl font-black font-heading text-white">Daily Showtimes & Schedules</h1>
                  <p className="text-xs text-slate-400">Scheduled screenings for Today, Tomorrow, and Weekend</p>
                </div>
              </div>

              <div className="bg-[#0b1120] border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-300 font-mono text-[11px]">
                      <th className="p-3.5 font-semibold">HALL / CITY</th>
                      <th className="p-3.5 font-semibold">MOVIE</th>
                      <th className="p-3.5 font-semibold">START TIME</th>
                      <th className="p-3.5 font-semibold">FORMAT</th>
                      <th className="p-3.5 font-semibold">TICKET PRICE</th>
                      <th className="p-3.5 font-semibold">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 text-white font-bold">Royal IMAX (Karachi)</td>
                      <td className="p-3.5 text-amber-300 font-semibold">The Legend of Maula Jatt</td>
                      <td className="p-3.5 text-emerald-400 font-bold">15:00 Today</td>
                      <td className="p-3.5 text-slate-300">IMAX Laser 3D</td>
                      <td className="p-3.5 text-white font-bold">Rs. 1,600</td>
                      <td className="p-3.5"><span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">Open (94% Sold)</span></td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 text-white font-bold">Royal IMAX (Karachi)</td>
                      <td className="p-3.5 text-amber-300 font-semibold">The Legend of Maula Jatt</td>
                      <td className="p-3.5 text-emerald-400 font-bold">18:15 Today</td>
                      <td className="p-3.5 text-slate-300">IMAX Laser 3D</td>
                      <td className="p-3.5 text-white font-bold">Rs. 1,700</td>
                      <td className="p-3.5"><span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded text-[10px]">Sold Out</span></td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 text-white font-bold">VIP Gold Lounge (Lahore)</td>
                      <td className="p-3.5 text-amber-300 font-semibold">Kamli</td>
                      <td className="p-3.5 text-emerald-400 font-bold">16:30 Today</td>
                      <td className="p-3.5 text-slate-300">VIP Gold Recliner</td>
                      <td className="p-3.5 text-white font-bold">Rs. 1,400</td>
                      <td className="p-3.5"><span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">Open (72% Sold)</span></td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 text-white font-bold">VIP Gold Lounge (Lahore)</td>
                      <td className="p-3.5 text-amber-300 font-semibold">Kamli</td>
                      <td className="p-3.5 text-emerald-400 font-bold">19:30 Today</td>
                      <td className="p-3.5 text-slate-300">VIP Gold Recliner</td>
                      <td className="p-3.5 text-white font-bold">Rs. 1,500</td>
                      <td className="p-3.5"><span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">Open (85% Sold)</span></td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 text-white font-bold">Centaurus Arena (Islamabad)</td>
                      <td className="p-3.5 text-amber-300 font-semibold">London Nahi Jaunga</td>
                      <td className="p-3.5 text-emerald-400 font-bold">18:00 Today</td>
                      <td className="p-3.5 text-slate-300">Dolby Atmos 4K</td>
                      <td className="p-3.5 text-white font-bold">Rs. 1,300</td>
                      <td className="p-3.5"><span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">Open (65% Sold)</span></td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 text-white font-bold">Centaurus Arena (Islamabad)</td>
                      <td className="p-3.5 text-amber-300 font-semibold">London Nahi Jaunga</td>
                      <td className="p-3.5 text-emerald-400 font-bold">21:00 Today</td>
                      <td className="p-3.5 text-slate-300">Dolby Atmos 4K</td>
                      <td className="p-3.5 text-white font-bold">Rs. 1,400</td>
                      <td className="p-3.5"><span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">Open (80% Sold)</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 5: TURNSTILE CHECK-IN ================= */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl font-black font-heading text-white">Turnstile Scanner & Ticket Validation</h1>
                <p className="text-xs text-slate-400">Validate booking references, check-in patrons, and verify ticket validity</p>
              </div>

              {/* Reference Search Bar */}
              <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
                <form onSubmit={handleScanLookup} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={scanRefInput}
                      onChange={(e) => setScanRefInput(e.target.value)}
                      placeholder="Enter Booking Reference (e.g. CVP-KAR-7842)..."
                      className="w-full bg-[#060911] border border-slate-700 focus:border-amber-400 pl-10 pr-4 py-3 rounded-xl text-xs text-white font-mono focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-gold-luxury px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Scan & Verify Ticket
                  </button>
                </form>

                {/* Quick Test Codes */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Quick Samples:</span>
                  {['CVP-KAR-7842', 'CVP-LHR-9104', 'CVP-ISB-3312', 'CVP-KAR-4491'].map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setScanRefInput(code);
                        const match = bookingsList.find((b) => b.reference === code);
                        if (match) {
                          setScannedTicket(match);
                          setScanStatusMsg({
                            text: `Loaded ticket ${code}. Status: ${match.status.toUpperCase()}`,
                            type: 'info'
                          });
                        }
                      }}
                      className="text-[11px] font-mono bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 px-2 py-0.5 rounded cursor-pointer"
                    >
                      {code}
                    </button>
                  ))}
                </div>

                {scanStatusMsg && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      scanStatusMsg.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                        : scanStatusMsg.type === 'info'
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                        : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {scanStatusMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{scanStatusMsg.text}</span>
                  </div>
                )}
              </div>

              {/* Scanned Result Card */}
              {scannedTicket && (
                <div className="bg-[#0b1120] border border-amber-500/30 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                        OFFICIAL CINEVERSE DIGITAL PASS
                      </span>
                      <h2 className="text-xl font-bold font-heading text-white">{scannedTicket.movieTitle}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                          scannedTicket.status === 'checked-in'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {scannedTicket.status === 'checked-in' ? 'ADMITTED (CHECKED-IN)' : 'CONFIRMED PASS'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="bg-[#060911] p-3 rounded-xl border border-white/5">
                      <span className="text-slate-500 block text-[10px]">REFERENCE</span>
                      <strong className="text-amber-400 text-sm">{scannedTicket.reference}</strong>
                    </div>

                    <div className="bg-[#060911] p-3 rounded-xl border border-white/5">
                      <span className="text-slate-500 block text-[10px]">PATRON NAME</span>
                      <strong className="text-white text-sm">{scannedTicket.customerName}</strong>
                    </div>

                    <div className="bg-[#060911] p-3 rounded-xl border border-white/5">
                      <span className="text-slate-500 block text-[10px]">SEATS RESERVED</span>
                      <strong className="text-emerald-400 text-sm">{scannedTicket.seats.join(', ')}</strong>
                    </div>

                    <div className="bg-[#060911] p-3 rounded-xl border border-white/5">
                      <span className="text-slate-500 block text-[10px]">SETTLED AMOUNT</span>
                      <strong className="text-white text-sm">Rs. {scannedTicket.totalPrice} ({scannedTicket.paymentMethod})</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="text-xs text-slate-400">
                      Multiplex: <strong className="text-white">{scannedTicket.theater}</strong> &middot; Show: <strong className="text-amber-400">{scannedTicket.showtime}</strong>
                    </div>

                    {scannedTicket.status !== 'checked-in' ? (
                      <button
                        onClick={() => handleCheckInTicket(scannedTicket.reference)}
                        className="btn-gold-luxury w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Authorize Turnstile Admittance</span>
                      </button>
                    ) : (
                      <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Patron Already Checked In (Entry Verified)</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 6: REPORTS & REVENUE ================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl font-black font-heading text-white">Financial & Occupancy Analytics</h1>
                <p className="text-xs text-slate-400">City breakdown, gross ticketing margin, and format popularity</p>
              </div>

              {/* City Revenue Performance */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Karachi (Royal IMAX)</span>
                    <span className="text-amber-400 font-mono font-bold">48.2%</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white">Rs. 2,340,000</div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '48.2%' }} />
                  </div>
                  <div className="text-[11px] text-slate-400">Average ticket: Rs. 1,650</div>
                </div>

                <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Lahore (Platinum VIP)</span>
                    <span className="text-amber-400 font-mono font-bold">33.4%</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white">Rs. 1,620,000</div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '33.4%' }} />
                  </div>
                  <div className="text-[11px] text-slate-400">Average ticket: Rs. 1,450</div>
                </div>

                <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Islamabad (Centaurus)</span>
                    <span className="text-amber-400 font-mono font-bold">18.4%</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-white">Rs. 890,000</div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '18.4%' }} />
                  </div>
                  <div className="text-[11px] text-slate-400">Average ticket: Rs. 1,350</div>
                </div>
              </div>

              {/* Format Popularity */}
              <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold font-heading text-white">Gross Share by Cinematic Format</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>IMAX Dual Laser 3D (The Legend of Maula Jatt)</span>
                      <strong className="text-amber-400 font-mono">56%</strong>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full" style={{ width: '56%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>VIP Gold Recliner Suite (Kamli, London Nahi Jaunga)</span>
                      <strong className="text-amber-400 font-mono">28%</strong>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400/80 h-full" style={{ width: '28%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Standard Dolby Atmos 4K Digital</span>
                      <strong className="text-amber-400 font-mono">16%</strong>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-400/50 h-full" style={{ width: '16%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 7: SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn max-w-2xl">
              <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl font-black font-heading text-white">Cinema Operational Settings</h1>
                <p className="text-xs text-slate-400">Box office rules, seat hold duration, and ticketing policies</p>
              </div>

              {settingsSavedToast && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Configuration saved successfully and broadcasted to all multiplexes!</span>
                </div>
              )}

              <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Atomic Seat Hold Timeout (Minutes)
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">Duration seats are locked while patron completes checkout</p>
                  <input
                    type="number"
                    value={settings.seatHoldMinutes}
                    onChange={(e) => setSettings({ ...settings, seatHoldMinutes: Number(e.target.value) })}
                    className="w-full bg-[#060911] border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Booking Cutoff Before Showtime (Minutes)
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">Online sales cease this many minutes prior to screening start</p>
                  <input
                    type="number"
                    value={settings.bookingCutoffMinutes}
                    onChange={(e) => setSettings({ ...settings, bookingCutoffMinutes: Number(e.target.value) })}
                    className="w-full bg-[#060911] border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Maximum Tickets Per Patron Order
                  </label>
                  <input
                    type="number"
                    value={settings.maxSeatsPerOrder}
                    onChange={(e) => setSettings({ ...settings, maxSeatsPerOrder: Number(e.target.value) })}
                    className="w-full bg-[#060911] border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    VIP Gold Recliner Luxury Surcharge (PKR)
                  </label>
                  <input
                    type="number"
                    value={settings.vipSurchargePkr}
                    onChange={(e) => setSettings({ ...settings, vipSurchargePkr: Number(e.target.value) })}
                    className="w-full bg-[#060911] border border-slate-700 text-white text-xs px-3.5 py-2.5 rounded-xl font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSettingsSavedToast(true);
                      setTimeout(() => setSettingsSavedToast(false), 3000);
                    }}
                    className="btn-gold-luxury px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 cursor-pointer"
                  >
                    Save Operational Settings
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Add Movie Modal */}
      {isAddMovieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0b1120] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold font-heading text-white">Add New Pakistani Movie</h3>
              <button
                onClick={() => setIsAddMovieModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddMovie} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quaid-e-Azam Zindabad"
                  value={newMovieForm.title}
                  onChange={(e) => setNewMovieForm({ ...newMovieForm, title: e.target.value })}
                  className="w-full bg-[#060911] border border-slate-700 text-white px-3 py-2 rounded-xl focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Synopsis</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Compelling story description..."
                  value={newMovieForm.synopsis}
                  onChange={(e) => setNewMovieForm({ ...newMovieForm, synopsis: e.target.value })}
                  className="w-full bg-[#060911] border border-slate-700 text-white px-3 py-2 rounded-xl focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Director</label>
                  <input
                    type="text"
                    placeholder="e.g. Nabeel Qureshi"
                    value={newMovieForm.director}
                    onChange={(e) => setNewMovieForm({ ...newMovieForm, director: e.target.value })}
                    className="w-full bg-[#060911] border border-slate-700 text-white px-3 py-2 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Starting Price (PKR)</label>
                  <input
                    type="number"
                    value={newMovieForm.startingPrice}
                    onChange={(e) => setNewMovieForm({ ...newMovieForm, startingPrice: Number(e.target.value) })}
                    className="w-full bg-[#060911] border border-slate-700 text-white px-3 py-2 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={newMovieForm.durationMinutes}
                    onChange={(e) => setNewMovieForm({ ...newMovieForm, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-[#060911] border border-slate-700 text-white px-3 py-2 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={newMovieForm.status}
                    onChange={(e) => setNewMovieForm({ ...newMovieForm, status: e.target.value as any })}
                    className="w-full bg-[#060911] border border-slate-700 text-white px-3 py-2 rounded-xl cursor-pointer"
                  >
                    <option value="now-showing">Now Showing</option>
                    <option value="upcoming">Coming Soon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Cast (comma separated)</label>
                <input
                  type="text"
                  placeholder="Fahad Mustafa, Mahira Khan, Javed Sheikh"
                  value={newMovieForm.cast}
                  onChange={(e) => setNewMovieForm({ ...newMovieForm, cast: e.target.value })}
                  className="w-full bg-[#060911] border border-slate-700 text-white px-3 py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Poster Image URL</label>
                <input
                  type="text"
                  value={newMovieForm.posterUrl}
                  onChange={(e) => setNewMovieForm({ ...newMovieForm, posterUrl: e.target.value })}
                  className="w-full bg-[#060911] border border-slate-700 text-white px-3 py-2 rounded-xl font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMovieModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold-luxury px-6 py-2 rounded-xl font-bold cursor-pointer"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
