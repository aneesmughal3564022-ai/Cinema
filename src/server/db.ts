import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import QRCode from 'qrcode';
import {
  Movie,
  Screen,
  Showtime,
  SeatHold,
  Booking,
  BookingSeat,
  CinemaSettings,
  AuditLog,
  DashboardStats,
  Seat
} from '../types.js';
import { generatePosterSvg } from '../utils/posterArt.js';

interface DatabaseSchema {
  movies: Movie[];
  screens: Screen[];
  shows: Showtime[];
  holds: SeatHold[];
  bookings: Booking[];
  settings: CinemaSettings;
  auditLogs: AuditLog[];
  admin: {
    email: string;
    passwordHash: string;
    salt: string;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cinema.json');

// Password helper
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, salt: string, hash: string): boolean {
  const check = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(check, 'hex'), Buffer.from(hash, 'hex'));
}

// Generate screen seats
function createDefaultSeatLayout(screenId: string, rows: number, seatsPerRow: number): Seat[] {
  const seats: Seat[] = [];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];

  for (let r = 0; r < rows; r++) {
    const rowLabel = rowLetters[r] || `R${r + 1}`;
    // Assign types: front/mid are standard, back rows are premium or VIP
    let seatType: 'standard' | 'premium' | 'vip' = 'standard';
    let priceModifier = 0;

    if (r === rows - 1) {
      seatType = 'vip';
      priceModifier = 700;
    } else if (r >= rows - 3) {
      seatType = 'premium';
      priceModifier = 350;
    }

    for (let s = 1; s <= seatsPerRow; s++) {
      seats.push({
        id: `${rowLabel}-${s}`,
        screenId,
        rowLabel,
        seatNumber: s,
        seatType,
        isActive: true,
        priceModifier
      });
    }
  }
  return seats;
}

// Initial Seed Data
function getSeedData(): DatabaseSchema {
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const adminPasswordHash = hashPassword('CinemaAdmin2026!', adminSalt);

  const screens: Screen[] = [
    {
      id: 'scr-karachi-imax',
      name: 'Screen 1 - Royal IMAX Karachi',
      location: 'Karachi - Clifton Waterfront',
      format: 'IMAX 3D',
      rows: 6,
      seatsPerRow: 10,
      capacity: 60,
      status: 'active',
      seatLayout: createDefaultSeatLayout('scr-karachi-imax', 6, 10)
    },
    {
      id: 'scr-lahore-gold',
      name: 'Screen 2 - VIP Gold Lounge Lahore',
      location: 'Lahore - Gulberg Heights',
      format: 'VIP Lounge',
      rows: 5,
      seatsPerRow: 10,
      capacity: 50,
      status: 'active',
      seatLayout: createDefaultSeatLayout('scr-lahore-gold', 5, 10)
    },
    {
      id: 'scr-islamabad-atmos',
      name: 'Screen 3 - Centaurus Arena Islamabad',
      location: 'Islamabad - Centaurus Mall',
      format: 'Dolby Atmos',
      rows: 5,
      seatsPerRow: 10,
      capacity: 50,
      status: 'active',
      seatLayout: createDefaultSeatLayout('scr-islamabad-atmos', 5, 10)
    }
  ];

  const movies: Movie[] = [
    {
      id: 'mov-maula-jatt',
      title: 'The Legend of Maula Jatt',
      slug: 'the-legend-of-maula-jatt',
      synopsis: 'An epic tale of rivalry, honor, and raw vengeance. Maula Jatt, a fierce prizefighter with a tortured past, seeks vengeance against his mortal enemy Noori Natt, the fiercest warrior in the land of Punjab.',
      posterUrl: '/images/maula_jatt_hero.jpg',
      bannerUrl: '/images/maula_jatt_hero.jpg',
      genre: ['Action', 'Drama', 'Period Epic'],
      durationMinutes: 153,
      language: 'Punjabi / Urdu',
      subtitles: 'English Subtitles',
      contentRating: 'A',
      releaseDate: '2026-10-15',
      director: 'Bilal Lashari',
      cast: ['Fawad Khan', 'Mahira Khan', 'Hamza Ali Abbasi', 'Humaima Malick', 'Gohar Rasheed'],
      trailerUrl: 'https://www.youtube.com/watch?v=sBWq_P7t7-U',
      status: 'now-showing',
      isFeatured: true
    },
    {
      id: 'mov-kamli',
      title: 'Kamli',
      slug: 'kamli',
      synopsis: 'A poetic psychological drama exploring unspoken love, longing, and mystery in rural Punjab. Hina waits yearningly for her missing husband until a mysterious wanderer ignites dormant passions.',
      posterUrl: '/images/kamli_art.jpg',
      bannerUrl: '/images/kamli_art.jpg',
      genre: ['Drama', 'Mystery', 'Romance'],
      durationMinutes: 142,
      language: 'Urdu',
      subtitles: 'English Subtitles',
      contentRating: 'U',
      releaseDate: '2026-10-12',
      director: 'Sarmad Khoosat',
      cast: ['Saba Qamar', 'Hamza Khawaja', 'Sania Saeed', 'Nimra Bucha'],
      status: 'now-showing',
      isFeatured: false
    },
    {
      id: 'mov-na-maloom-afraad',
      title: 'Na Maloom Afraad 2',
      slug: 'na-maloom-afraad-2',
      synopsis: 'Farhan, Moon, and Shakeel reunite for another chaotic, high-stakes comedy adventure when an elusive Sheikh\'s gold toilet goes missing during an extravagant destination wedding in Dubai.',
      posterUrl: '/images/na_maloom_poster.jpg',
      bannerUrl: '/images/na_maloom_poster.jpg',
      genre: ['Comedy', 'Action', 'Crime'],
      durationMinutes: 138,
      language: 'Urdu',
      subtitles: 'English Subtitles',
      contentRating: 'PG-13',
      releaseDate: '2026-10-24',
      director: 'Nabeel Qureshi',
      cast: ['Fahad Mustafa', 'Javed Sheikh', 'Mohsin Abbas Haider', 'Hania Aamir'],
      status: 'now-showing',
      isFeatured: false
    },
    {
      id: 'mov-jpna-2',
      title: 'Jawani Phir Nahi Ani 2',
      slug: 'jawani-phir-nahi-ani-2',
      synopsis: 'The ultimate festive Pakistani comedy romance adventure. Sherry and his friends travel to Turkey for another hilarious rollercoaster ride of love, misunderstandings, and high society chaos.',
      posterUrl: '/images/jpna_poster.jpg',
      bannerUrl: '/images/jpna_poster.jpg',
      genre: ['Comedy', 'Romance', 'Adventure'],
      durationMinutes: 160,
      language: 'Urdu',
      subtitles: 'English Subtitles',
      contentRating: 'U',
      releaseDate: '2026-10-18',
      director: 'Nadeem Baig',
      cast: ['Humayun Saeed', 'Fahad Mustafa', 'Ahmed Ali Butt', 'Vasay Chaudhry', 'Mawra Hocane', 'Kubra Khan'],
      status: 'now-showing',
      isFeatured: false
    },
    {
      id: 'mov-parwaaz',
      title: 'Parwaaz Hai Junoon',
      slug: 'parwaaz-hai-junoon',
      synopsis: 'A heartfelt tribute to the Pakistan Air Force, depicting the lives, cadets training, high-octane aerial dogfights, patriotism, and emotional sacrifices of courageous fighter pilots.',
      posterUrl: '/images/parwaaz_poster.jpg',
      bannerUrl: '/images/parwaaz_poster.jpg',
      genre: ['Action', 'Drama', 'Military'],
      durationMinutes: 130,
      language: 'Urdu',
      subtitles: 'English Subtitles',
      contentRating: 'U',
      releaseDate: '2026-11-05',
      director: 'Haseeb Hassan',
      cast: ['Hamza Ali Abbasi', 'Hania Aamir', 'Ahad Raza Mir', 'Shaz Khan'],
      status: 'upcoming',
      isFeatured: false
    },
    {
      id: 'mov-london',
      title: 'London Nahi Jaunga',
      slug: 'london-nahi-jaunga',
      synopsis: 'A grand romantic comedy drama that spans from rustic Punjab villages to the bustling cityscapes of London. Jameel travels all the way to London to win back the woman he loves against family traditions.',
      posterUrl: '/images/london_poster.jpg',
      bannerUrl: '/images/london_poster.jpg',
      genre: ['Romance', 'Comedy', 'Drama'],
      durationMinutes: 155,
      language: 'Urdu',
      subtitles: 'English Subtitles',
      contentRating: 'PG-13',
      releaseDate: '2026-11-12',
      director: 'Nadeem Baig',
      cast: ['Humayun Saeed', 'Mehwish Hayat', 'Kubra Khan', 'Sohail Ahmed', 'Gohar Rasheed'],
      status: 'upcoming',
      isFeatured: false
    },
    {
      id: 'mov-dune-2',
      title: 'Dune: Part Two',
      slug: 'dune-part-two',
      synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between love and the fate of the universe, he prevents a terrible future only he can foresee.',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80',
      genre: ['Sci-Fi', 'Adventure', 'Action'],
      durationMinutes: 166,
      language: 'English',
      subtitles: 'Urdu Subtitles',
      contentRating: 'PG-13',
      releaseDate: '2026-10-10',
      director: 'Denis Villeneuve',
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Josh Brolin', 'Austin Butler'],
      status: 'now-showing',
      isFeatured: false
    },
    {
      id: 'mov-oppenheimer',
      title: 'Oppenheimer',
      slug: 'oppenheimer',
      synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb, followed by the political persecution and moral turbulence of the atomic age.',
      posterUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
      genre: ['Biography', 'Drama', 'History'],
      durationMinutes: 180,
      language: 'English',
      subtitles: 'Urdu Subtitles',
      contentRating: 'A',
      releaseDate: '2026-10-08',
      director: 'Christopher Nolan',
      cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
      status: 'now-showing',
      isFeatured: false
    }
  ];

  // Dynamic showtimes generation for Today, Tomorrow, and Next Day
  const now = new Date();
  const shows: Showtime[] = [];
  const timeslots = [
    { hour: 13, min: 30, base: 1200 },
    { hour: 17, min: 0,  base: 1400 },
    { hour: 20, min: 30, base: 1600 },
    { hour: 23, min: 45, base: 1300 }
  ];

  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + dayOffset);

    // Karachi Screen shows
    const slot1 = timeslots[0];
    const s1Start = new Date(targetDate);
    s1Start.setHours(slot1.hour, slot1.min, 0, 0);
    const s1End = new Date(s1Start.getTime() + 153 * 60000);
    shows.push({
      id: `show-karachi-${dayOffset}-1`,
      movieId: 'mov-maula-jatt',
      screenId: 'scr-karachi-imax',
      startTime: s1Start.toISOString(),
      endTime: s1End.toISOString(),
      basePrice: slot1.base,
      status: 'scheduled'
    });

    const slot2 = timeslots[2];
    const s2Start = new Date(targetDate);
    s2Start.setHours(slot2.hour, slot2.min, 0, 0);
    const s2End = new Date(s2Start.getTime() + 166 * 60000);
    shows.push({
      id: `show-karachi-${dayOffset}-2`,
      movieId: 'mov-dune-2',
      screenId: 'scr-karachi-imax',
      startTime: s2Start.toISOString(),
      endTime: s2End.toISOString(),
      basePrice: slot2.base + 200,
      status: 'scheduled'
    });

    // Lahore Screen shows
    const slot3 = timeslots[1];
    const s3Start = new Date(targetDate);
    s3Start.setHours(slot3.hour, slot3.min, 0, 0);
    const s3End = new Date(s3Start.getTime() + 180 * 60000);
    shows.push({
      id: `show-lahore-${dayOffset}-1`,
      movieId: 'mov-oppenheimer',
      screenId: 'scr-lahore-gold',
      startTime: s3Start.toISOString(),
      endTime: s3End.toISOString(),
      basePrice: 1500,
      status: 'scheduled'
    });

    const slot4 = timeslots[2];
    const s4Start = new Date(targetDate);
    s4Start.setHours(slot4.hour, slot4.min, 0, 0);
    const s4End = new Date(s4Start.getTime() + 153 * 60000);
    shows.push({
      id: `show-lahore-${dayOffset}-2`,
      movieId: 'mov-maula-jatt',
      screenId: 'scr-lahore-gold',
      startTime: s4Start.toISOString(),
      endTime: s4End.toISOString(),
      basePrice: 1600,
      status: 'scheduled'
    });

    // Islamabad Screen shows
    const s5Start = new Date(targetDate);
    s5Start.setHours(15, 0, 0, 0);
    const s5End = new Date(s5Start.getTime() + 142 * 60000);
    shows.push({
      id: `show-isb-${dayOffset}-1`,
      movieId: 'mov-kamli',
      screenId: 'scr-islamabad-atmos',
      startTime: s5Start.toISOString(),
      endTime: s5End.toISOString(),
      basePrice: 1100,
      status: 'scheduled'
    });

    const s6Start = new Date(targetDate);
    s6Start.setHours(19, 30, 0, 0);
    const s6End = new Date(s6Start.getTime() + 166 * 60000);
    shows.push({
      id: `show-isb-${dayOffset}-2`,
      movieId: 'mov-dune-2',
      screenId: 'scr-islamabad-atmos',
      startTime: s6Start.toISOString(),
      endTime: s6End.toISOString(),
      basePrice: 1350,
      status: 'scheduled'
    });
  }

  // Pre-seed sample bookings
  const bookings: Booking[] = [
    {
      id: 'bkg-demo-1',
      bookingReference: 'CVP-PK-7842',
      showId: shows[0].id,
      movieId: 'mov-maula-jatt',
      screenId: 'scr-karachi-imax',
      seats: [
        { seatId: 'D-5', rowLabel: 'D', seatNumber: 5, seatType: 'premium', price: 1550 },
        { seatId: 'D-6', rowLabel: 'D', seatNumber: 6, seatType: 'premium', price: 1550 }
      ],
      subtotal: 3100,
      fee: 100,
      total: 3200,
      customerName: 'Hamza Tariq',
      customerEmail: 'hamza.tariq@gmail.com',
      customerPhone: '03001234567',
      city: 'Karachi',
      paymentMethod: 'jazzcash',
      paymentStatus: 'paid',
      status: 'confirmed',
      verificationToken: 'c7f9e8a1b2c3d4e5f601',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'bkg-demo-2',
      bookingReference: 'CVP-PK-9124',
      showId: shows[1].id,
      movieId: 'mov-dune-2',
      screenId: 'scr-karachi-imax',
      seats: [
        { seatId: 'F-4', rowLabel: 'F', seatNumber: 4, seatType: 'vip', price: 2500 },
        { seatId: 'F-5', rowLabel: 'F', seatNumber: 5, seatType: 'vip', price: 2500 }
      ],
      subtotal: 5000,
      fee: 100,
      total: 5100,
      customerName: 'Ayesha Malik',
      customerEmail: 'ayesha.m@yahoo.com',
      customerPhone: '03219876543',
      city: 'Karachi',
      paymentMethod: 'easypaisa',
      paymentStatus: 'paid',
      status: 'checked-in',
      checkedInAt: new Date().toISOString(),
      verificationToken: 'a1b2c3d4e5f678901234',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ];

  const settings: CinemaSettings = {
    cinemaName: 'CineVerse Pakistan',
    brandTagline: 'Pakistan\'s Premier Luxury Cinema & Entertainment Destination',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    timezone: 'Asia/Karachi',
    contactEmail: 'boxoffice@cineverse.pk',
    contactPhone: '+92 (21) 111-246-382',
    locations: [
      'Karachi - Clifton Waterfront',
      'Lahore - Gulberg Heights',
      'Islamabad - Centaurus Mall'
    ],
    holdDurationMinutes: 5,
    turnaroundBufferMinutes: 30,
    bookingCutoffMinutes: 15,
    convenienceFeePerTicket: 50,
    allowCancellationHoursBeforeShow: 3
  };

  const auditLogs: AuditLog[] = [
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      adminEmail: 'admin@cineverse.pk',
      action: 'SYSTEM_INITIALIZED',
      details: 'CineVerse Pakistan Cinema Management System successfully seeded and started.'
    }
  ];

  return {
    movies,
    screens,
    shows,
    holds: [],
    bookings,
    settings,
    auditLogs,
    admin: {
      email: 'admin@cineverse.pk',
      passwordHash: adminPasswordHash,
      salt: adminSalt
    }
  };
}

class Database {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;
  private activeSessions = new Map<string, { email: string; expiresAt: number }>();

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
    this.startHoldCleanupLoop();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load DB file, reinitializing default seed:', e);
    }
    const seed = getSeedData();
    this.saveImmediate(seed);
    return seed;
  }

  private save() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.saveImmediate(this.data);
    }, 200);
  }

  private saveImmediate(data: DatabaseSchema) {
    try {
      this.ensureDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to DB file:', err);
    }
  }

  private startHoldCleanupLoop() {
    setInterval(() => {
      this.cleanExpiredHolds();
    }, 20000);
  }

  public cleanExpiredHolds() {
    const now = new Date().toISOString();
    const beforeCount = this.data.holds.length;
    this.data.holds = this.data.holds.filter(h => h.expiresAt > now);
    if (this.data.holds.length !== beforeCount) {
      this.save();
    }
  }

  // --- Auth & Admin Session Management ---
  public loginAdmin(password: string): { success: boolean; token?: string; error?: string } {
    const admin = this.data.admin;
    if (!verifyPassword(password, admin.salt, admin.passwordHash)) {
      return { success: false, error: 'Invalid administrator credentials.' };
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    this.activeSessions.set(token, { email: admin.email, expiresAt });
    this.logAudit('ADMIN_LOGIN', `Admin logged in from session.`);
    return { success: true, token };
  }

  public verifyAdminToken(token: string | undefined): boolean {
    if (!token) return false;
    const session = this.activeSessions.get(token);
    if (!session) return false;
    if (session.expiresAt < Date.now()) {
      this.activeSessions.delete(token);
      return false;
    }
    return true;
  }

  public logoutAdmin(token: string) {
    this.activeSessions.delete(token);
  }

  // --- Audit Logs ---
  public logAudit(action: string, details: string, email = 'admin@cineverse.pk') {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      adminEmail: email,
      action,
      details
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs.pop();
    }
    this.save();
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  // --- Public Settings ---
  public getSettings(): CinemaSettings {
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<CinemaSettings>): CinemaSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.logAudit('SETTINGS_UPDATED', 'Cinema operational parameters updated.');
    this.save();
    return this.data.settings;
  }

  // --- Movies ---
  public getMovies(includeArchived = false): Movie[] {
    if (includeArchived) return this.data.movies;
    return this.data.movies.filter(m => m.status !== 'archived');
  }

  public getMovieById(id: string): Movie | undefined {
    return this.data.movies.find(m => m.id === id || m.slug === id);
  }

  public createMovie(movieData: Omit<Movie, 'id'>): Movie {
    const id = `mov-${Date.now()}`;
    const slug = movieData.slug || movieData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Auto poster if missing
    let posterUrl = movieData.posterUrl;
    if (!posterUrl) {
      posterUrl = generatePosterSvg({
        title: movieData.title,
        theme: 'action',
        rating: movieData.contentRating || 'PG-13',
        genre: movieData.genre?.[0] || 'Drama',
        duration: `${movieData.durationMinutes} min`
      });
    }

    const movie: Movie = {
      ...movieData,
      id,
      slug,
      posterUrl
    };
    this.data.movies.push(movie);
    this.logAudit('MOVIE_CREATED', `Created movie: ${movie.title}`);
    this.save();
    return movie;
  }

  public updateMovie(id: string, updates: Partial<Movie>): Movie | null {
    const idx = this.data.movies.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.movies[idx] = { ...this.data.movies[idx], ...updates };
    this.logAudit('MOVIE_UPDATED', `Updated movie: ${this.data.movies[idx].title}`);
    this.save();
    return this.data.movies[idx];
  }

  public archiveMovie(id: string): { success: boolean; message: string } {
    const movie = this.getMovieById(id);
    if (!movie) return { success: false, message: 'Movie not found.' };

    // Check future bookings
    const now = new Date().toISOString();
    const activeShowIds = this.data.shows
      .filter(s => s.movieId === id && s.startTime > now && s.status === 'scheduled')
      .map(s => s.id);

    const hasActiveBookings = this.data.bookings.some(b => 
      activeShowIds.includes(b.showId) && b.status === 'confirmed'
    );

    if (hasActiveBookings) {
      return {
        success: false,
        message: 'Cannot archive movie: patrons have confirmed future bookings. Please reschedule or refund first.'
      };
    }

    movie.status = 'archived';
    this.logAudit('MOVIE_ARCHIVED', `Archived movie: ${movie.title}`);
    this.save();
    return { success: true, message: `Movie "${movie.title}" archived successfully.` };
  }

  // --- Screens & Halls ---
  public getScreens(): Screen[] {
    return this.data.screens;
  }

  public getScreenById(id: string): Screen | undefined {
    return this.data.screens.find(s => s.id === id);
  }

  public createScreen(screenData: Omit<Screen, 'id' | 'seatLayout' | 'capacity'>): Screen {
    const id = `scr-${Date.now()}`;
    const seatLayout = createDefaultSeatLayout(id, screenData.rows, screenData.seatsPerRow);
    const screen: Screen = {
      ...screenData,
      id,
      capacity: seatLayout.length,
      seatLayout
    };
    this.data.screens.push(screen);
    this.logAudit('SCREEN_CREATED', `Created cinema hall: ${screen.name}`);
    this.save();
    return screen;
  }

  public updateScreen(id: string, updates: Partial<Screen>): Screen | null {
    const idx = this.data.screens.findIndex(s => s.id === id);
    if (idx === -1) return null;

    const current = this.data.screens[idx];
    let newLayout = current.seatLayout;

    // If rows or seatsPerRow changed, regenerate layout preserving existing modifications if needed
    if (
      (updates.rows && updates.rows !== current.rows) ||
      (updates.seatsPerRow && updates.seatsPerRow !== current.seatsPerRow)
    ) {
      const rows = updates.rows || current.rows;
      const seatsPerRow = updates.seatsPerRow || current.seatsPerRow;
      newLayout = createDefaultSeatLayout(id, rows, seatsPerRow);
      updates.capacity = newLayout.length;
      updates.seatLayout = newLayout;
    }

    this.data.screens[idx] = { ...current, ...updates };
    this.logAudit('SCREEN_UPDATED', `Updated hall: ${this.data.screens[idx].name}`);
    this.save();
    return this.data.screens[idx];
  }

  // --- Showtimes with Conflict Validation ---
  public getShows(options?: { date?: string; movieId?: string; screenId?: string }): (Showtime & { movie?: Movie; screen?: Screen; bookedSeatsCount?: number })[] {
    this.cleanExpiredHolds();
    let shows = this.data.shows;

    if (options?.movieId) {
      shows = shows.filter(s => s.movieId === options.movieId);
    }
    if (options?.screenId) {
      shows = shows.filter(s => s.screenId === options.screenId);
    }
    if (options?.date) {
      // YYYY-MM-DD
      shows = shows.filter(s => s.startTime.startsWith(options.date!));
    }

    // Attach movie and screen info
    return shows.map(s => {
      const movie = this.data.movies.find(m => m.id === s.movieId);
      const screen = this.data.screens.find(sc => sc.id === s.screenId);
      const bookedSeatsCount = this.data.bookings
        .filter(b => b.showId === s.id && b.status !== 'cancelled')
        .reduce((sum, b) => sum + b.seats.length, 0);

      return {
        ...s,
        movie,
        screen,
        bookedSeatsCount
      };
    });
  }

  public getShowById(id: string) {
    this.cleanExpiredHolds();
    const show = this.data.shows.find(s => s.id === id);
    if (!show) return null;

    const movie = this.data.movies.find(m => m.id === show.movieId);
    const screen = this.data.screens.find(sc => sc.id === show.screenId);

    // Collect all booked seat IDs for this show
    const bookedSeatIds = new Set<string>();
    this.data.bookings
      .filter(b => b.showId === show.id && b.status !== 'cancelled')
      .forEach(b => {
        b.seats.forEach(s => bookedSeatIds.add(s.seatId));
      });

    // Collect currently held seat IDs
    const now = new Date().toISOString();
    const heldSeatIds = new Map<string, string>(); // seatId -> holdId
    this.data.holds
      .filter(h => h.showId === show.id && h.expiresAt > now)
      .forEach(h => {
        h.seatIds.forEach(id => heldSeatIds.set(id, h.id));
      });

    return {
      ...show,
      movie,
      screen,
      bookedSeatIds: Array.from(bookedSeatIds),
      heldSeatIds: Array.from(heldSeatIds.entries()).map(([seatId, holdId]) => ({ seatId, holdId }))
    };
  }

  public createShow(showData: {
    movieId: string;
    screenId: string;
    startTime: string;
    basePrice: number;
  }): { success: boolean; show?: Showtime; error?: string } {
    const movie = this.getMovieById(showData.movieId);
    if (!movie) return { success: false, error: 'Specified movie does not exist.' };
    const screen = this.getScreenById(showData.screenId);
    if (!screen) return { success: false, error: 'Specified screen does not exist.' };

    const startTime = new Date(showData.startTime);
    if (isNaN(startTime.getTime())) {
      return { success: false, error: 'Invalid start time.' };
    }

    // Calculate end time = startTime + movie duration + turnaround buffer
    const durationMs = movie.durationMinutes * 60 * 1000;
    const bufferMs = this.data.settings.turnaroundBufferMinutes * 60 * 1000;
    const endTime = new Date(startTime.getTime() + durationMs);

    // Overlap Conflict Detection with turnaround buffer
    const startWithBuffer = new Date(startTime.getTime() - bufferMs);
    const endWithBuffer = new Date(endTime.getTime() + bufferMs);

    const hasConflict = this.data.shows.some(existingShow => {
      if (existingShow.screenId !== showData.screenId || existingShow.status === 'cancelled') {
        return false;
      }
      const existingStart = new Date(existingShow.startTime);
      const existingEnd = new Date(existingShow.endTime);

      // (existingStart < endWithBuffer && existingEnd > startWithBuffer)
      return existingStart < endWithBuffer && existingEnd > startWithBuffer;
    });

    if (hasConflict) {
      return {
        success: false,
        error: `Schedule Conflict: Another show is scheduled in ${screen.name} within the ${this.data.settings.turnaroundBufferMinutes}-minute cleaning/turnaround buffer window.`
      };
    }

    const id = `show-${Date.now()}`;
    const show: Showtime = {
      id,
      movieId: showData.movieId,
      screenId: showData.screenId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      basePrice: showData.basePrice,
      status: 'scheduled'
    };

    this.data.shows.push(show);
    this.logAudit('SHOW_SCHEDULED', `Scheduled ${movie.title} in ${screen.name} for ${startTime.toLocaleString()}`);
    this.save();
    return { success: true, show };
  }

  public cancelShow(id: string): { success: boolean; message: string } {
    const show = this.data.shows.find(s => s.id === id);
    if (!show) return { success: false, message: 'Show not found.' };

    show.status = 'cancelled';

    // Release any active holds
    this.data.holds = this.data.holds.filter(h => h.showId !== id);

    // Count affected bookings
    const affected = this.data.bookings.filter(b => b.showId === id && b.status === 'confirmed');
    affected.forEach(b => {
      b.status = 'cancelled';
    });

    this.logAudit('SHOW_CANCELLED', `Cancelled show ${id}. ${affected.length} customer bookings flagged for resolution.`);
    this.save();
    return {
      success: true,
      message: `Show cancelled. ${affected.length} customer bookings have been flagged.`
    };
  }

  // --- Seat Holds (Atomic Concurrency Protection) ---
  public holdSeats(showId: string, seatIds: string[], sessionId: string): {
    success: boolean;
    holdId?: string;
    expiresAt?: string;
    error?: string;
  } {
    this.cleanExpiredHolds();
    const show = this.data.shows.find(s => s.id === showId);
    if (!show || show.status !== 'scheduled') {
      return { success: false, error: 'Show is not available for booking.' };
    }

    if (!seatIds.length) {
      return { success: false, error: 'Please select at least one seat.' };
    }

    // Check if seats are already booked
    const bookedSeatIds = new Set<string>();
    this.data.bookings
      .filter(b => b.showId === showId && b.status !== 'cancelled')
      .forEach(b => b.seats.forEach(s => bookedSeatIds.add(s.seatId)));

    for (const seatId of seatIds) {
      if (bookedSeatIds.has(seatId)) {
        return { success: false, error: `Seat ${seatId} was just reserved by another patron. Please pick another seat.` };
      }
    }

    // Check if seats are held by someone else
    const now = new Date();
    for (const hold of this.data.holds) {
      if (hold.showId === showId && hold.expiresAt > now.toISOString() && hold.sessionId !== sessionId) {
        for (const seatId of seatIds) {
          if (hold.seatIds.includes(seatId)) {
            return { success: false, error: `Seat ${seatId} is temporarily held by another customer. Please reselect.` };
          }
        }
      }
    }

    // Remove any previous holds for this session and show
    this.data.holds = this.data.holds.filter(h => !(h.showId === showId && h.sessionId === sessionId));

    const holdDurationMs = this.data.settings.holdDurationMinutes * 60 * 1000;
    const expiresAt = new Date(Date.now() + holdDurationMs).toISOString();
    const holdId = `hold-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const newHold: SeatHold = {
      id: holdId,
      showId,
      seatIds,
      sessionId,
      expiresAt
    };

    this.data.holds.push(newHold);
    this.save();

    return {
      success: true,
      holdId,
      expiresAt
    };
  }

  public releaseHold(holdId: string, sessionId?: string): boolean {
    const prevLen = this.data.holds.length;
    this.data.holds = this.data.holds.filter(h => {
      if (h.id === holdId) {
        if (sessionId && h.sessionId !== sessionId) return true; // only owner can release
        return false;
      }
      return true;
    });
    if (this.data.holds.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Confirm Booking (Atomic Transaction & Server-Side Price Verification) ---
  public async confirmBooking(payload: {
    showId: string;
    seatIds: string[];
    holdId?: string;
    sessionId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    city: string;
    paymentMethod: 'jazzcash' | 'easypaisa' | 'card' | 'counter';
  }): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    this.cleanExpiredHolds();

    const show = this.data.shows.find(s => s.id === payload.showId);
    if (!show || show.status !== 'scheduled') {
      return { success: false, error: 'Show is not active or has been cancelled.' };
    }

    const screen = this.data.screens.find(s => s.id === show.screenId);
    if (!screen) {
      return { success: false, error: 'Screen not found.' };
    }

    if (!payload.seatIds || payload.seatIds.length === 0) {
      return { success: false, error: 'No seats selected.' };
    }

    // Verify hold: If holdId supplied, verify it hasn't expired and matches session
    const now = new Date();
    if (payload.holdId) {
      const hold = this.data.holds.find(h => h.id === payload.holdId);
      if (!hold || hold.expiresAt <= now.toISOString()) {
        return {
          success: false,
          error: 'Your 5-minute seat hold has expired. Please select seats again.'
        };
      }
    }

    // Concurrency double-check: Ensure no seat is already confirmed
    const bookedSeatIds = new Set<string>();
    this.data.bookings
      .filter(b => b.showId === payload.showId && b.status !== 'cancelled')
      .forEach(b => b.seats.forEach(s => bookedSeatIds.add(s.seatId)));

    for (const seatId of payload.seatIds) {
      if (bookedSeatIds.has(seatId)) {
        return {
          success: false,
          error: `Seat ${seatId} has already been booked. Transaction aborted.`
        };
      }
    }

    // SERVER-SIDE PRICE CALCULATION (Never trust client prices)
    const bookingSeats: BookingSeat[] = [];
    let subtotal = 0;

    for (const seatId of payload.seatIds) {
      const screenSeat = screen.seatLayout.find(s => s.id === seatId);
      if (!screenSeat || !screenSeat.isActive) {
        return { success: false, error: `Invalid seat selection: ${seatId}` };
      }

      const seatPrice = show.basePrice + (screenSeat.priceModifier || 0);
      subtotal += seatPrice;

      bookingSeats.push({
        seatId: screenSeat.id,
        rowLabel: screenSeat.rowLabel,
        seatNumber: screenSeat.seatNumber,
        seatType: screenSeat.seatType,
        price: seatPrice
      });
    }

    const fee = this.data.settings.convenienceFeePerTicket * bookingSeats.length;
    const total = subtotal + fee;

    // Generate unique non-guessable reference & verification token
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const bookingReference = `CVP-PK-${randomHex}`;
    const verificationToken = crypto.randomBytes(16).toString('hex');
    const bookingId = `bkg-${Date.now()}-${randomHex}`;

    // Generate scannable QR Code Data URL containing verification token
    let qrCodeDataUrl = '';
    try {
      const qrPayload = JSON.stringify({
        ref: bookingReference,
        token: verificationToken,
        showId: show.id,
        seats: bookingSeats.map(s => s.seatId),
        cine: 'CineVerse Pakistan'
      });
      qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
        errorCorrectionLevel: 'H',
        margin: 2,
        color: {
          dark: '#080C15',
          light: '#FFFFFF'
        }
      });
    } catch (err) {
      console.warn('QR code generation notice:', err);
    }

    const booking: Booking = {
      id: bookingId,
      bookingReference,
      showId: show.id,
      movieId: show.movieId,
      screenId: show.screenId,
      seats: bookingSeats,
      subtotal,
      fee,
      total,
      customerName: payload.customerName.trim(),
      customerEmail: payload.customerEmail.trim(),
      customerPhone: payload.customerPhone.trim(),
      city: payload.city || 'Karachi',
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'counter' ? 'pending' : 'paid',
      status: 'confirmed',
      verificationToken,
      qrCodeDataUrl,
      createdAt: new Date().toISOString()
    };

    // ATOMIC COMMIT: Save booking and remove hold
    this.data.bookings.push(booking);
    this.data.holds = this.data.holds.filter(h => h.id !== payload.holdId && h.sessionId !== payload.sessionId);
    this.logAudit(
      'BOOKING_CONFIRMED',
      `Booking ${bookingReference} confirmed for ${booking.customerName} (${bookingSeats.length} seats, Rs. ${total})`
    );
    this.save();

    return {
      success: true,
      booking
    };
  }

  // --- Secure Customer Booking Lookup ---
  public lookupBooking(reference: string, contactVerification: string): Booking | null {
    const cleanRef = reference.trim().toUpperCase();
    const cleanContact = contactVerification.trim().toLowerCase();

    const booking = this.data.bookings.find(b => b.bookingReference === cleanRef);
    if (!booking) return null;

    // Strict customer privacy verification: must match phone or email
    const emailMatch = booking.customerEmail.toLowerCase() === cleanContact;
    const phoneMatch = booking.customerPhone.replace(/[^0-9]/g, '') === cleanContact.replace(/[^0-9]/g, '');

    if (!emailMatch && !phoneMatch) {
      return null; // Deny access to prevent IDOR snooping
    }

    return booking;
  }

  // --- Ticket Check-In (Single-Use Admin Action) ---
  public checkInTicket(identifier: string, adminEmail: string): {
    status: 'success' | 'already_checked_in' | 'not_found' | 'cancelled';
    message: string;
    booking?: Booking;
    movie?: Movie;
    screen?: Screen;
    show?: Showtime;
  } {
    const clean = identifier.trim();
    // Identifier can be either bookingReference OR verificationToken
    const booking = this.data.bookings.find(b => 
      b.bookingReference.toUpperCase() === clean.toUpperCase() || 
      b.verificationToken === clean
    );

    if (!booking) {
      return { status: 'not_found', message: 'No valid ticket found with this reference or QR token.' };
    }

    if (booking.status === 'cancelled') {
      return { status: 'cancelled', message: 'This ticket was cancelled or refunded. Entry denied.' };
    }

    const movie = this.data.movies.find(m => m.id === booking.movieId);
    const screen = this.data.screens.find(s => s.id === booking.screenId);
    const show = this.data.shows.find(sh => sh.id === booking.showId);

    if (booking.status === 'checked-in') {
      return {
        status: 'already_checked_in',
        message: `ALREADY USED: This ticket was already checked in at ${new Date(booking.checkedInAt || '').toLocaleTimeString()}. Duplicate entry rejected!`,
        booking,
        movie,
        screen,
        show
      };
    }

    // Mark as checked in
    booking.status = 'checked-in';
    booking.checkedInAt = new Date().toISOString();
    this.logAudit('TICKET_CHECKED_IN', `Ticket ${booking.bookingReference} checked in by ${adminEmail}`, adminEmail);
    this.save();

    return {
      status: 'success',
      message: `Verified successfully! Welcome ${booking.customerName} (${booking.seats.length} Tickets).`,
      booking,
      movie,
      screen,
      show
    };
  }

  // --- Admin Bookings Queries ---
  public getBookings(options?: {
    search?: string;
    status?: string;
    movieId?: string;
    screenId?: string;
    date?: string;
  }): (Booking & { movie?: Movie; screen?: Screen; show?: Showtime })[] {
    let result = [...this.data.bookings];

    if (options?.status) {
      result = result.filter(b => b.status === options.status);
    }
    if (options?.movieId) {
      result = result.filter(b => b.movieId === options.movieId);
    }
    if (options?.screenId) {
      result = result.filter(b => b.screenId === options.screenId);
    }
    if (options?.date) {
      result = result.filter(b => b.createdAt.startsWith(options.date!));
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(b => 
        b.bookingReference.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        b.customerPhone.includes(q)
      );
    }

    return result.reverse().map(b => ({
      ...b,
      movie: this.data.movies.find(m => m.id === b.movieId),
      screen: this.data.screens.find(s => s.id === b.screenId),
      show: this.data.shows.find(sh => sh.id === b.showId)
    }));
  }

  // --- Analytics & Dashboard Stats ---
  public getDashboardStats(): DashboardStats {
    const today = new Date().toISOString().slice(0, 10);
    const bookings = this.data.bookings;
    const shows = this.data.shows;

    const validBookings = bookings.filter(b => b.status !== 'cancelled');
    const todayBookings = validBookings.filter(b => b.createdAt.startsWith(today));
    const todayRevenue = todayBookings.reduce((sum, b) => sum + b.total, 0);

    const now = new Date().toISOString();
    const upcomingShows = shows.filter(s => s.startTime > now && s.status === 'scheduled');

    // Calculate occupancy across all active shows
    let totalCapacity = 0;
    let totalSeatsBooked = 0;
    const occupancyByScreenMap = new Map<string, { totalSeats: number; bookedSeats: number; showCount: number }>();

    for (const screen of this.data.screens) {
      occupancyByScreenMap.set(screen.id, { totalSeats: 0, bookedSeats: 0, showCount: 0 });
    }

    for (const show of shows) {
      const screen = this.data.screens.find(s => s.id === show.screenId);
      if (!screen) continue;
      const bookedCount = validBookings
        .filter(b => b.showId === show.id)
        .reduce((sum, b) => sum + b.seats.length, 0);

      totalCapacity += screen.capacity;
      totalSeatsBooked += bookedCount;

      const scStat = occupancyByScreenMap.get(screen.id);
      if (scStat) {
        scStat.totalSeats += screen.capacity;
        scStat.bookedSeats += bookedCount;
        scStat.showCount += 1;
      }
    }

    const averageOccupancyRate = totalCapacity > 0 ? Math.round((totalSeatsBooked / totalCapacity) * 100) : 0;

    // Sales by last 7 days
    const salesByDate: { date: string; amount: number; bookings: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayBookings = validBookings.filter(b => b.createdAt.startsWith(dateStr));
      const amount = dayBookings.reduce((sum, b) => sum + b.total, 0);
      salesByDate.push({
        date: dateStr,
        amount,
        bookings: dayBookings.length
      });
    }

    // Occupancy by Screen
    const occupancyByScreen = Array.from(occupancyByScreenMap.entries()).map(([screenId, data]) => {
      const screen = this.data.screens.find(s => s.id === screenId);
      const percent = data.totalSeats > 0 ? Math.round((data.bookedSeats / data.totalSeats) * 100) : 0;
      return {
        screenName: screen?.name || screenId,
        occupancyPercent: percent,
        totalShows: data.showCount
      };
    });

    // Bookings by Movie
    const movieBookingsMap = new Map<string, { bookings: number; revenue: number }>();
    for (const movie of this.data.movies) {
      movieBookingsMap.set(movie.id, { bookings: 0, revenue: 0 });
    }
    for (const b of validBookings) {
      const m = movieBookingsMap.get(b.movieId);
      if (m) {
        m.bookings += b.seats.length;
        m.revenue += b.total;
      }
    }

    const bookingsByMovie = Array.from(movieBookingsMap.entries())
      .map(([movieId, data]) => {
        const movie = this.data.movies.find(m => m.id === movieId);
        return {
          movieTitle: movie?.title || movieId,
          bookings: data.bookings,
          revenue: data.revenue
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    const cancellationsCount = bookings.filter(b => b.status === 'cancelled').length;

    return {
      todayBookingsCount: todayBookings.length,
      todayRevenue,
      averageOccupancyRate,
      upcomingShowsCount: upcomingShows.length,
      totalMoviesCount: this.data.movies.filter(m => m.status !== 'archived').length,
      cancellationsCount,
      recentBookings: this.getBookings().slice(0, 8),
      salesByDate,
      occupancyByScreen,
      bookingsByMovie
    };
  }
}

export const db = new Database();
