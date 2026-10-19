import {
  Movie,
  Screen,
  Showtime,
  SeatHold,
  Booking,
  CinemaSettings,
  AuditLog,
  DashboardStats
} from './types.js';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    const token = localStorage.getItem('cineverse_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Session ID for customer holds
  public getSessionId(): string {
    let sid = sessionStorage.getItem('cineverse_session_id');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      sessionStorage.setItem('cineverse_session_id', sid);
    }
    return sid;
  }

  // --- Public APIs ---
  async getPublicConfig(): Promise<{ settings: CinemaSettings; screens: Partial<Screen>[] }> {
    const res = await fetch('/api/public/config');
    if (!res.ok) throw new Error('Failed to load cinema configuration.');
    return res.json();
  }

  async getMovies(): Promise<Movie[]> {
    const res = await fetch('/api/public/movies');
    if (!res.ok) throw new Error('Failed to load movies.');
    return res.json();
  }

  async getMovie(id: string): Promise<{ movie: Movie; shows: Showtime[] }> {
    const res = await fetch(`/api/public/movies/${id}`);
    if (!res.ok) throw new Error('Movie not found.');
    return res.json();
  }

  async getShows(params?: { date?: string; movieId?: string; screenId?: string }): Promise<Showtime[]> {
    const qs = new URLSearchParams();
    if (params?.date) qs.set('date', params.date);
    if (params?.movieId) qs.set('movieId', params.movieId);
    if (params?.screenId) qs.set('screenId', params.screenId);
    const res = await fetch(`/api/public/shows?${qs.toString()}`);
    if (!res.ok) throw new Error('Failed to load showtimes.');
    return res.json();
  }

  async getShowDetails(showId: string): Promise<Showtime & {
    movie: Movie;
    screen: Screen;
    bookedSeatIds: string[];
    heldSeatIds: { seatId: string; holdId: string }[];
  }> {
    const res = await fetch(`/api/public/shows/${showId}`);
    if (!res.ok) throw new Error('Failed to load show details.');
    return res.json();
  }

  async holdSeats(showId: string, seatIds: string[]): Promise<{ success: boolean; holdId: string; expiresAt: string }> {
    const res = await fetch('/api/public/holds', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        showId,
        seatIds,
        sessionId: this.getSessionId()
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to hold seats.');
    return data;
  }

  async releaseHold(holdId: string): Promise<void> {
    await fetch('/api/public/holds/release', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        holdId,
        sessionId: this.getSessionId()
      })
    });
  }

  async confirmBooking(payload: {
    showId: string;
    seatIds: string[];
    holdId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    city: string;
    paymentMethod: 'jazzcash' | 'easypaisa' | 'card' | 'counter';
  }): Promise<{ success: boolean; booking: Booking }> {
    const res = await fetch('/api/public/bookings', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        ...payload,
        sessionId: this.getSessionId()
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Booking confirmation failed.');
    return data;
  }

  async lookupBooking(bookingReference: string, contactVerification: string): Promise<{
    booking: Booking;
    movie: Movie;
    screen: Screen;
    show: Showtime;
  }> {
    const res = await fetch('/api/public/bookings/lookup', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        bookingReference,
        contactVerification
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Booking lookup failed.');
    return data;
  }

  // --- Admin APIs ---
  async adminLogin(password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid credentials.');
    localStorage.setItem('cineverse_admin_token', data.token);
    return data;
  }

  async adminLogout(): Promise<void> {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: this.getHeaders()
      });
    } finally {
      localStorage.removeItem('cineverse_admin_token');
    }
  }

  async checkAdminAuth(): Promise<boolean> {
    const token = localStorage.getItem('cineverse_admin_token');
    if (!token) return false;
    try {
      const res = await fetch('/api/admin/me', { headers: this.getHeaders() });
      return res.ok;
    } catch {
      return false;
    }
  }

  async getAdminDashboard(): Promise<DashboardStats> {
    const res = await fetch('/api/admin/dashboard', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load admin stats.');
    return res.json();
  }

  async getAdminMovies(): Promise<Movie[]> {
    const res = await fetch('/api/admin/movies', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load movies.');
    return res.json();
  }

  async createMovie(movie: Partial<Movie>): Promise<Movie> {
    const res = await fetch('/api/admin/movies', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(movie)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create movie.');
    return data;
  }

  async updateMovie(id: string, updates: Partial<Movie>): Promise<Movie> {
    const res = await fetch(`/api/admin/movies/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update movie.');
    return data;
  }

  async archiveMovie(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/admin/movies/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to archive movie.');
    return data;
  }

  async getAdminScreens(): Promise<Screen[]> {
    const res = await fetch('/api/admin/screens', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load screens.');
    return res.json();
  }

  async createScreen(screen: Partial<Screen>): Promise<Screen> {
    const res = await fetch('/api/admin/screens', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(screen)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create screen.');
    return data;
  }

  async updateScreen(id: string, updates: Partial<Screen>): Promise<Screen> {
    const res = await fetch(`/api/admin/screens/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update screen.');
    return data;
  }

  async getAdminShows(params?: { date?: string; movieId?: string; screenId?: string }): Promise<Showtime[]> {
    const qs = new URLSearchParams();
    if (params?.date) qs.set('date', params.date);
    if (params?.movieId) qs.set('movieId', params.movieId);
    if (params?.screenId) qs.set('screenId', params.screenId);
    const res = await fetch(`/api/admin/shows?${qs.toString()}`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load showtimes.');
    return res.json();
  }

  async createShow(showData: { movieId: string; screenId: string; startTime: string; basePrice: number }): Promise<Showtime> {
    const res = await fetch('/api/admin/shows', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(showData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to schedule show.');
    return data;
  }

  async cancelShow(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/admin/shows/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to cancel show.');
    return data;
  }

  async getAdminBookings(params?: { search?: string; status?: string; movieId?: string; date?: string }): Promise<Booking[]> {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.status) qs.set('status', params.status);
    if (params?.movieId) qs.set('movieId', params.movieId);
    if (params?.date) qs.set('date', params.date);
    const res = await fetch(`/api/admin/bookings?${qs.toString()}`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load bookings.');
    return res.json();
  }

  async checkInTicket(identifier: string): Promise<{
    status: 'success' | 'already_checked_in' | 'not_found' | 'cancelled';
    message: string;
    booking?: Booking;
    movie?: Movie;
    screen?: Screen;
    show?: Showtime;
  }> {
    const res = await fetch('/api/admin/check-in', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ identifier })
    });
    return res.json();
  }

  async getAdminSettings(): Promise<CinemaSettings> {
    const res = await fetch('/api/admin/settings', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load settings.');
    return res.json();
  }

  async updateAdminSettings(settings: Partial<CinemaSettings>): Promise<CinemaSettings> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings.');
    return data;
  }

  async getAdminAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/admin/audit-logs', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to load audit logs.');
    return res.json();
  }
}

export const api = new ApiClient();
