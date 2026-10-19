import { renderHeader, attachHeaderEvents } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { renderHomeView, attachHomeEvents } from './views/HomeView.js';
import { renderMovieDetailsView, attachMovieDetailsEvents } from './views/MovieDetailsView.js';
import { renderSeatSelectionView, attachSeatSelectionEvents } from './views/SeatSelectionView.js';
import { renderCheckoutView, attachCheckoutEvents } from './views/CheckoutView.js';
import { renderConfirmationView, attachConfirmationEvents } from './views/ConfirmationView.js';
import { renderTicketLookupView, attachTicketLookupEvents } from './views/TicketLookupView.js';
import { renderAdminLoginView, attachAdminLoginEvents } from './views/AdminLoginView.js';
import { renderAdminDashboardView } from './views/AdminDashboardView.js';
import { renderAdminMoviesView, attachAdminMoviesEvents } from './views/AdminMoviesView.js';
import { renderAdminScreensView, attachAdminScreensEvents } from './views/AdminScreensView.js';
import { renderAdminShowtimesView, attachAdminShowtimesEvents } from './views/AdminShowtimesView.js';
import { renderAdminBookingsView, attachAdminBookingsEvents } from './views/AdminBookingsView.js';
import { renderAdminReportsView, attachAdminReportsEvents } from './views/AdminReportsView.js';
import { renderAdminSettingsView, attachAdminSettingsEvents } from './views/AdminSettingsView.js';
import { api } from './api.js';

export async function navigate() {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  const rawHash = window.location.hash || '#/';
  const [routePart, queryPart] = rawHash.split('?');
  const queryParams = new URLSearchParams(queryPart || '');

  // Render loading skeleton momentarily if switching major views
  let contentHtml = '';
  let attachEventsFn: (() => void) | null = null;

  // Match routes
  if (routePart === '#/' || routePart === '' || routePart === '#/showtimes' || routePart === '#/experience') {
    contentHtml = await renderHomeView();
    attachEventsFn = attachHomeEvents;
  } else if (routePart.startsWith('#/movie/')) {
    const movieId = routePart.replace('#/movie/', '');
    contentHtml = await renderMovieDetailsView(movieId);
    attachEventsFn = attachMovieDetailsEvents;
  } else if (routePart.startsWith('#/book/')) {
    const showId = routePart.replace('#/book/', '');
    contentHtml = await renderSeatSelectionView(showId);
    attachEventsFn = attachSeatSelectionEvents;
  } else if (routePart === '#/checkout') {
    contentHtml = await renderCheckoutView();
    attachEventsFn = attachCheckoutEvents;
  } else if (routePart.startsWith('#/confirmation/')) {
    const ref = routePart.replace('#/confirmation/', '');
    const contact = queryParams.get('contact') || undefined;
    contentHtml = await renderConfirmationView(ref, contact);
    attachEventsFn = attachConfirmationEvents;
  } else if (routePart === '#/my-tickets') {
    contentHtml = await renderTicketLookupView();
    attachEventsFn = attachTicketLookupEvents;
  } else if (routePart === '#/admin') {
    const isAuth = await api.checkAdminAuth();
    if (isAuth) {
      window.location.hash = '#/admin/dashboard';
    } else {
      window.location.hash = '#/admin/login';
    }
    return;
  } else if (routePart === '#/admin/login') {
    contentHtml = await renderAdminLoginView();
    attachEventsFn = attachAdminLoginEvents;
  } else if (routePart === '#/admin/dashboard') {
    contentHtml = await renderAdminDashboardView();
  } else if (routePart === '#/admin/movies') {
    contentHtml = await renderAdminMoviesView();
    attachEventsFn = attachAdminMoviesEvents;
  } else if (routePart === '#/admin/screens') {
    contentHtml = await renderAdminScreensView();
    attachEventsFn = attachAdminScreensEvents;
  } else if (routePart === '#/admin/shows') {
    contentHtml = await renderAdminShowtimesView();
    attachEventsFn = attachAdminShowtimesEvents;
  } else if (routePart === '#/admin/bookings') {
    contentHtml = await renderAdminBookingsView();
    attachEventsFn = attachAdminBookingsEvents;
  } else if (routePart === '#/admin/reports') {
    contentHtml = await renderAdminReportsView();
    attachEventsFn = attachAdminReportsEvents;
  } else if (routePart === '#/admin/settings') {
    contentHtml = await renderAdminSettingsView();
    attachEventsFn = attachAdminSettingsEvents;
  } else {
    // 404 Fallback
    contentHtml = `
      <div class="max-w-md mx-auto px-4 py-24 text-center">
        <h2 class="text-2xl font-bold font-heading text-white">404 &middot; Page Not Found</h2>
        <p class="text-xs text-slate-400 mt-2">The page you requested does not exist or was moved.</p>
        <a href="#/" class="mt-4 inline-block px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg">Return to Movies</a>
      </div>
    `;
  }

  // Inject full template: Header + Content + Footer
  appEl.innerHTML = `
    ${renderHeader()}
    <div class="flex-1 flex flex-col">${contentHtml}</div>
    ${renderFooter()}
  `;

  // Attach common layout events
  attachHeaderEvents();

  // Attach view specific events
  if (attachEventsFn) {
    attachEventsFn();
  }

  // Scroll to top
  window.scrollTo(0, 0);
}
