import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db } from './src/server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Admin Authentication Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token || !db.verifyAdminToken(token)) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
    return;
  }
  next();
}

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// Public Cinema Config & Settings
app.get('/api/public/config', (_req, res) => {
  res.json({
    settings: db.getSettings(),
    screens: db.getScreens().map(s => ({ id: s.id, name: s.name, location: s.location, format: s.format }))
  });
});

// Published Movies
app.get('/api/public/movies', (_req, res) => {
  res.json(db.getMovies());
});

app.get('/api/public/movies/:id', (req, res) => {
  const movie = db.getMovieById(req.params.id);
  if (!movie) {
    res.status(404).json({ error: 'Movie not found.' });
    return;
  }
  const shows = db.getShows({ movieId: movie.id });
  res.json({ movie, shows });
});

// Showtimes
app.get('/api/public/shows', (req, res) => {
  const { date, movieId, screenId } = req.query;
  const shows = db.getShows({
    date: date as string | undefined,
    movieId: movieId as string | undefined,
    screenId: screenId as string | undefined
  });
  res.json(shows);
});

// Specific Show + Seat Layout & Availability
app.get('/api/public/shows/:id', (req, res) => {
  const showDetails = db.getShowById(req.params.id);
  if (!showDetails) {
    res.status(404).json({ error: 'Show not found.' });
    return;
  }
  res.json(showDetails);
});

// Hold Seats (5-minute hold)
app.post('/api/public/holds', (req, res) => {
  const { showId, seatIds, sessionId } = req.body;
  if (!showId || !seatIds || !sessionId) {
    res.status(400).json({ error: 'Missing required hold parameters.' });
    return;
  }
  const result = db.holdSeats(showId, seatIds, sessionId);
  if (!result.success) {
    res.status(409).json({ error: result.error });
    return;
  }
  res.json(result);
});

// Release Hold
app.post('/api/public/holds/release', (req, res) => {
  const { holdId, sessionId } = req.body;
  if (!holdId) {
    res.status(400).json({ error: 'Missing holdId.' });
    return;
  }
  const released = db.releaseHold(holdId, sessionId);
  res.json({ success: released });
});

// Confirm Booking (Atomic & Server Price Verified)
app.post('/api/public/bookings', async (req, res) => {
  const {
    showId,
    seatIds,
    holdId,
    sessionId,
    customerName,
    customerEmail,
    customerPhone,
    city,
    paymentMethod
  } = req.body;

  if (!showId || !seatIds?.length || !customerName || !customerEmail || !customerPhone) {
    res.status(400).json({ error: 'Please provide all required customer and seat details.' });
    return;
  }

  const result = await db.confirmBooking({
    showId,
    seatIds,
    holdId,
    sessionId: sessionId || 'guest',
    customerName,
    customerEmail,
    customerPhone,
    city: city || 'Karachi',
    paymentMethod: paymentMethod || 'counter'
  });

  if (!result.success) {
    res.status(409).json({ error: result.error });
    return;
  }

  res.status(201).json(result);
});

// Secure Booking Lookup (Requires Reference + Verified Phone or Email)
app.post('/api/public/bookings/lookup', (req, res) => {
  const { bookingReference, contactVerification } = req.body;
  if (!bookingReference || !contactVerification) {
    res.status(400).json({ error: 'Please provide booking reference and your registered email or phone.' });
    return;
  }

  const booking = db.lookupBooking(bookingReference, contactVerification);
  if (!booking) {
    res.status(404).json({ error: 'No matching booking found. Please check your reference and phone/email.' });
    return;
  }

  const movie = db.getMovieById(booking.movieId);
  const screen = db.getScreenById(booking.screenId);
  const show = db.getShowById(booking.showId);

  res.json({
    booking,
    movie,
    screen,
    show
  });
});

// ==========================================
// ADMIN AUTH & MANAGEMENT API
// ==========================================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'Password is required.' });
    return;
  }
  const result = db.loginAdmin(password);
  if (!result.success) {
    res.status(401).json({ error: result.error });
    return;
  }
  res.json(result);
});

app.post('/api/admin/logout', (req, res) => {
  const token = req.headers.authorization?.slice(7);
  if (token) db.logoutAdmin(token);
  res.json({ success: true });
});

app.get('/api/admin/me', requireAdmin, (_req, res) => {
  res.json({ email: 'admin@cineverse.pk', role: 'admin' });
});

// Admin Dashboard KPIs & Charts
app.get('/api/admin/dashboard', requireAdmin, (_req, res) => {
  res.json(db.getDashboardStats());
});

// Admin Movies Management
app.get('/api/admin/movies', requireAdmin, (_req, res) => {
  res.json(db.getMovies(true));
});

app.post('/api/admin/movies', requireAdmin, (req, res) => {
  const movie = db.createMovie(req.body);
  res.status(201).json(movie);
});

app.put('/api/admin/movies/:id', requireAdmin, (req, res) => {
  const updated = db.updateMovie(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Movie not found.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/admin/movies/:id', requireAdmin, (req, res) => {
  const result = db.archiveMovie(req.params.id);
  if (!result.success) {
    res.status(409).json({ error: result.message });
    return;
  }
  res.json(result);
});

// Admin Screens & Seats
app.get('/api/admin/screens', requireAdmin, (_req, res) => {
  res.json(db.getScreens());
});

app.post('/api/admin/screens', requireAdmin, (req, res) => {
  const screen = db.createScreen(req.body);
  res.status(201).json(screen);
});

app.put('/api/admin/screens/:id', requireAdmin, (req, res) => {
  const updated = db.updateScreen(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Screen not found.' });
    return;
  }
  res.json(updated);
});

// Admin Showtimes & Conflict Checking
app.get('/api/admin/shows', requireAdmin, (req, res) => {
  const { date, movieId, screenId } = req.query;
  res.json(db.getShows({
    date: date as string | undefined,
    movieId: movieId as string | undefined,
    screenId: screenId as string | undefined
  }));
});

app.post('/api/admin/shows', requireAdmin, (req, res) => {
  const result = db.createShow(req.body);
  if (!result.success) {
    res.status(409).json({ error: result.error });
    return;
  }
  res.status(201).json(result.show);
});

app.delete('/api/admin/shows/:id', requireAdmin, (req, res) => {
  const result = db.cancelShow(req.params.id);
  res.json(result);
});

// Admin Bookings & Ticket Check-In
app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  const { search, status, movieId, screenId, date } = req.query;
  const bookings = db.getBookings({
    search: search as string | undefined,
    status: status as string | undefined,
    movieId: movieId as string | undefined,
    screenId: screenId as string | undefined,
    date: date as string | undefined
  });
  res.json(bookings);
});

app.post('/api/admin/check-in', requireAdmin, (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    res.status(400).json({ error: 'Please scan QR or enter a booking reference.' });
    return;
  }
  const result = db.checkInTicket(identifier, 'admin@cineverse.pk');
  res.json(result);
});

// Admin Reports
app.get('/api/admin/reports', requireAdmin, (_req, res) => {
  const stats = db.getDashboardStats();
  res.json(stats);
});

// Admin Settings
app.get('/api/admin/settings', requireAdmin, (_req, res) => {
  res.json(db.getSettings());
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// Audit Logs
app.get('/api/admin/audit-logs', requireAdmin, (_req, res) => {
  res.json(db.getAuditLogs());
});

// ==========================================
// VITE DEV SERVER / STATIC SERVING
// ==========================================

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CineVerse Pakistan] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
