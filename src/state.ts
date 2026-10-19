import { CinemaSettings, Movie, Screen, Showtime } from './types.js';

export interface BookingState {
  showId: string | null;
  movieId: string | null;
  screenId: string | null;
  selectedSeats: string[]; // ['A-1', 'A-2']
  holdId: string | null;
  holdExpiresAt: string | null;
  movie?: Movie;
  screen?: Screen;
  show?: Showtime;
}

class AppState {
  public settings: CinemaSettings = {
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

  public selectedCity: string = 'Karachi';

  public currentBooking: BookingState = {
    showId: null,
    movieId: null,
    screenId: null,
    selectedSeats: [],
    holdId: null,
    holdExpiresAt: null
  };

  public setCity(city: string) {
    this.selectedCity = city;
    localStorage.setItem('cineverse_city', city);
  }

  public init() {
    const savedCity = localStorage.getItem('cineverse_city');
    if (savedCity) this.selectedCity = savedCity;
  }

  public resetBooking() {
    this.currentBooking = {
      showId: null,
      movieId: null,
      screenId: null,
      selectedSeats: [],
      holdId: null,
      holdExpiresAt: null
    };
  }
}

export const state = new AppState();
state.init();
