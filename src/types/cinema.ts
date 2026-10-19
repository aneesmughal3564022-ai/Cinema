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
  contentRating: 'U' | 'PG' | 'PG-13' | 'A';
  releaseDate: string;
  director: string;
  cast: string[];
  trailerUrl?: string;
  status: 'now-showing' | 'upcoming';
  isFeatured?: boolean;
  showtimes?: string[];
  formats?: string[];
  startingPrice?: number;
}

export type CityName = 'Karachi' | 'Lahore' | 'Islamabad';

export interface CinemaLocation {
  city: CityName;
  name: string;
  theater: string;
  formats: string[];
}

export interface BookingTicket {
  reference: string;
  movieTitle: string;
  movieId: string;
  city: CityName;
  theater: string;
  date: string;
  time: string;
  seats: string[];
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  timestamp: string;
  qrCodeUrl?: string;
}
