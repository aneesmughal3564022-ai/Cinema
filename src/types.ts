export type SeatType = 'standard' | 'premium' | 'vip';

export type SeatStatus = 'available' | 'selected' | 'held' | 'booked' | 'inaccessible';

export interface Seat {
  id: string;          // e.g. "A-1"
  screenId: string;
  rowLabel: string;    // "A", "B", ...
  seatNumber: number;  // 1, 2, ...
  seatType: SeatType;
  isActive: boolean;
  priceModifier?: number; // extra price in PKR
}

export interface Screen {
  id: string;
  name: string;
  location: string;
  format: 'IMAX 3D' | 'Dolby Atmos' | 'VIP Lounge' | 'Standard 4K';
  rows: number;
  seatsPerRow: number;
  capacity: number;
  seatLayout: Seat[];
  status: 'active' | 'maintenance';
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  posterUrl: string;
  bannerUrl: string;
  genre: string[];
  durationMinutes: number;
  language: string;
  subtitles?: string;
  contentRating: 'U' | 'PG-13' | 'A';
  releaseDate: string;
  director: string;
  cast: string[];
  trailerUrl?: string;
  status: 'now-showing' | 'upcoming' | 'archived';
  isFeatured?: boolean;
}

export interface Showtime {
  id: string;
  movieId: string;
  screenId: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  basePrice: number; // in PKR
  status: 'scheduled' | 'cancelled' | 'completed';
}

export interface SeatHold {
  id: string;
  showId: string;
  seatIds: string[];
  sessionId: string;
  expiresAt: string; // ISO 8601
}

export interface BookingSeat {
  seatId: string;
  rowLabel: string;
  seatNumber: number;
  seatType: SeatType;
  price: number;
}

export interface Booking {
  id: string;
  bookingReference: string; // e.g. "CVP-8921"
  showId: string;
  movieId: string;
  screenId: string;
  seats: BookingSeat[];
  subtotal: number;
  fee: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  paymentMethod: 'jazzcash' | 'easypaisa' | 'card' | 'counter';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  status: 'confirmed' | 'checked-in' | 'cancelled';
  verificationToken: string;
  qrCodeDataUrl?: string;
  checkedInAt?: string;
  createdAt: string;
}

export interface CinemaSettings {
  cinemaName: string;
  brandTagline: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  contactEmail: string;
  contactPhone: string;
  locations: string[];
  holdDurationMinutes: number;
  turnaroundBufferMinutes: number;
  bookingCutoffMinutes: number;
  convenienceFeePerTicket: number;
  allowCancellationHoursBeforeShow: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: string;
  details: string;
}

export interface DashboardStats {
  todayBookingsCount: number;
  todayRevenue: number;
  averageOccupancyRate: number;
  upcomingShowsCount: number;
  totalMoviesCount: number;
  cancellationsCount: number;
  recentBookings: Booking[];
  salesByDate: { date: string; amount: number; bookings: number }[];
  occupancyByScreen: { screenName: string; occupancyPercent: number; totalShows: number }[];
  bookingsByMovie: { movieTitle: string; bookings: number; revenue: number }[];
}
