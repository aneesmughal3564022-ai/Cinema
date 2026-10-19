import { api } from '../api.js';
import { Booking, Movie, Screen, Showtime } from '../types.js';

let bookingData: {
  booking: Booking;
  movie: Movie;
  screen: Screen;
  show: Showtime;
} | null = null;

export async function renderConfirmationView(reference: string, contactVerification?: string): Promise<string> {
  try {
    // If contact verification is provided in query, lookup directly
    if (contactVerification) {
      bookingData = await api.lookupBooking(reference, contactVerification);
    } else {
      // Fallback lookup prompt if directly navigated without contact param
      return `
        <div class="max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
          </div>
          <h2 class="text-xl font-bold font-heading text-white">Verify Booking Ownership</h2>
          <p class="text-xs text-slate-400 leading-relaxed">
            For customer privacy, please enter the phone number or email used during booking to unlock your ticket for Reference <span class="font-mono text-amber-300 font-bold">${escapeHtml(reference)}</span>.
          </p>
          <div class="space-y-3 pt-2">
            <input
              id="confirm-lookup-contact"
              type="text"
              placeholder="e.g. 03001234567 or email"
              class="w-full bg-slate-900 border border-slate-700 text-xs text-white p-3 rounded-lg focus:outline-none focus:border-amber-400"
            />
            <button
              id="confirm-lookup-btn"
              data-ref="${escapeHtml(reference)}"
              class="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              Verify & View Ticket
            </button>
          </div>
        </div>
      `;
    }
  } catch (e: any) {
    return `
      <div class="max-w-md mx-auto px-4 py-24 text-center">
        <h2 class="text-lg font-bold text-white">Booking Not Found</h2>
        <p class="text-xs text-slate-400 mt-2">${e.message || 'Unable to retrieve your booking.'}</p>
        <a href="#/my-tickets" class="mt-4 inline-block px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg">Find My Ticket</a>
      </div>
    `;
  }

  if (!bookingData) {
    return `<div class="p-12 text-center text-xs text-slate-400">Loading digital ticket...</div>`;
  }

  const { booking, movie, screen, show } = bookingData;
  const startTime = new Date(show.startTime);
  const formattedDate = startTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const formattedTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full flex-1">
      
      <!-- Top Success Status Banner -->
      <div class="text-center space-y-2 mb-8">
        <div class="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <span class="text-xs font-bold uppercase tracking-widest text-emerald-400">Reservation Confirmed</span>
        <h1 class="text-2xl sm:text-3xl font-extrabold font-heading text-white">Your E-Ticket is Ready</h1>
        <p class="text-xs text-slate-400 max-w-md mx-auto">
          Please present this digital pass or save it to your phone for admission at the cinema turnstile.
        </p>
      </div>

      <!-- PREMIUM CINEMA BOARDING PASS / DIGITAL TICKET -->
      <div id="printable-ticket" class="bg-gradient-to-b from-[#111827] to-[#0B1120] border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl relative">
        
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent p-6 border-b border-slate-700/60 flex items-center justify-between">
          <div>
            <div class="text-[11px] font-mono uppercase tracking-widest text-amber-400">CINEVERSE PAKISTAN &middot; BOARDING PASS</div>
            <h2 class="text-xl sm:text-2xl font-black font-heading text-white mt-1">${escapeHtml(movie.title)}</h2>
            <div class="text-xs text-slate-300 font-medium mt-0.5">
              ${movie.language} &middot; Rated ${movie.contentRating} &middot; ${movie.durationMinutes} min
            </div>
          </div>
          <div class="text-right">
            <span class="text-[10px] uppercase font-mono text-slate-400 block">Booking Reference</span>
            <span class="text-sm sm:text-base font-mono font-extrabold text-amber-300 bg-slate-900/80 border border-amber-500/30 px-2.5 py-1 rounded inline-block mt-0.5">
              ${booking.bookingReference}
            </span>
          </div>
        </div>

        <!-- Ticket Body Grid -->
        <div class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <!-- Left Specs Column -->
          <div class="md:col-span-8 space-y-5">
            <div class="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span class="text-slate-400 block text-[11px]">Cinema Hall / Screen</span>
                <span class="text-sm font-bold text-white font-heading">${screen.name}</span>
                <span class="text-[11px] text-slate-400 block">${screen.location}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Show Date & Time</span>
                <span class="text-sm font-bold text-amber-400 font-mono">${formattedTime}</span>
                <span class="text-[11px] text-slate-300 block">${formattedDate}</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Reserved Seats</span>
                <div class="flex flex-wrap gap-1.5 mt-1">
                  ${booking.seats.map(s => `
                    <span class="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-bold text-xs">
                      ${s.seatId}
                    </span>
                  `).join('')}
                </div>
              </div>
              <div>
                <span class="text-slate-400 block text-[11px]">Guest Name</span>
                <span class="text-sm font-semibold text-white">${escapeHtml(booking.customerName)}</span>
                <span class="text-[11px] text-slate-400 font-mono block">${booking.customerPhone}</span>
              </div>
            </div>

            <div class="border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
              <div>
                <span class="text-slate-400">Total Paid:</span>
                <span class="text-sm font-mono font-bold text-white ml-1">Rs. ${booking.total.toLocaleString()} PKR</span>
              </div>
              <div>
                <span class="text-slate-400">Payment:</span>
                <span class="text-xs uppercase font-mono text-emerald-400 font-semibold ml-1">
                  ${booking.paymentMethod.toUpperCase()} (${booking.paymentStatus.toUpperCase()})
                </span>
              </div>
              <div>
                <span class="text-slate-400">Status:</span>
                <span class="text-xs font-mono font-semibold text-amber-400 ml-1">
                  ${booking.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <!-- Right QR Code Column -->
          <div class="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
            ${booking.qrCodeDataUrl ? `
              <div class="p-2 bg-white rounded-lg shadow-md mb-2">
                <img src="${booking.qrCodeDataUrl}" alt="Ticket QR Verification Code" class="w-36 h-36" />
              </div>
            ` : `
              <div class="w-36 h-36 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-600 mb-2">
                QR Unavailable
              </div>
            `}
            <span class="text-[10px] font-mono text-slate-400 tracking-wider uppercase">Scannable Entry Token</span>
            <span class="text-[10px] font-mono text-slate-500 break-all max-w-[150px] truncate mt-0.5">${booking.verificationToken}</span>
          </div>

        </div>

        <!-- Bottom Admission Notice -->
        <div class="bg-slate-950/80 px-6 py-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Turnstiles open 20 minutes prior to showtime &middot; Outside food prohibited</span>
          <span class="font-mono text-amber-400/80">Support: +92 (21) 111-246-382</span>
        </div>

      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-4 mt-8">
        <button
          onclick="window.print()"
          class="px-5 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
          Print / Save Pass
        </button>

        <a
          href="#/my-tickets"
          class="px-5 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/></svg>
          Retrieve Tickets Later
        </a>

        <a
          href="#/"
          class="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors"
        >
          Back to Home
        </a>
      </div>

    </div>
  `;
}

export function attachConfirmationEvents(): void {
  const verifyBtn = document.getElementById('confirm-lookup-btn');
  verifyBtn?.addEventListener('click', () => {
    const ref = verifyBtn.getAttribute('data-ref');
    const contactInput = document.getElementById('confirm-lookup-contact') as HTMLInputElement;
    if (ref && contactInput && contactInput.value.trim()) {
      window.location.hash = `#/confirmation/${ref}?contact=${encodeURIComponent(contactInput.value.trim())}`;
    }
  });
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case '\'': return '&#39;';
      default: return m;
    }
  });
}
