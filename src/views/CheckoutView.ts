import { api } from '../api.js';
import { state } from '../state.js';
import { showToast } from '../components/Toast.js';
import { renderImage, getMoviePosterUrl } from '../utils/images.js';

let holdTimerInterval: NodeJS.Timeout | null = null;

export async function renderCheckoutView(): Promise<string> {
  const booking = state.currentBooking;
  if (!booking.showId || !booking.selectedSeats.length || !booking.show || !booking.screen || !booking.movie) {
    return `
      <div class="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 class="text-xl font-bold text-white">No Active Booking Session</h2>
        <p class="text-xs text-slate-400 mt-2">You haven't selected any seats yet or your session has expired.</p>
        <a href="#/" class="mt-4 inline-block px-5 py-2.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg">
          Browse Movies
        </a>
      </div>
    `;
  }

  const { movie, screen, show, selectedSeats } = booking;
  const startTime = new Date(show.startTime);
  const formattedDate = startTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  // Calculate pricing breakdown
  let subtotal = 0;
  const seatDetails = selectedSeats.map(id => {
    const s = screen.seatLayout.find(seat => seat.id === id);
    const price = show.basePrice + (s?.priceModifier || 0);
    subtotal += price;
    return { id, type: s?.seatType || 'standard', price };
  });

  const fee = state.settings.convenienceFeePerTicket * selectedSeats.length;
  const total = subtotal + fee;

  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      
      <!-- Stepper / Header -->
      <div class="mb-8">
        <a href="#/book/${show.id}" class="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 mb-3">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back to Seat Selection
        </a>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-semibold uppercase tracking-widest text-amber-400">Step 3 of 4 &middot; Checkout</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">Review & Complete Booking</h1>
          </div>
          <!-- 5-Minute Hold Timer Banner -->
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <svg class="w-4 h-4 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Seats Reserved For:</span>
            <span id="checkout-hold-timer" class="font-bold text-amber-200">04:59</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Customer Form & Payment Method -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Contact Details Form -->
          <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 class="text-base font-bold font-heading text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Contact Details (For Digital QR Ticket)
            </h2>

            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Full Name <span class="text-rose-400">*</span></label>
                <input
                  id="cust-name"
                  type="text"
                  placeholder="e.g. Asad Khan"
                  required
                  class="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Mobile Number <span class="text-rose-400">*</span></label>
                  <input
                    id="cust-phone"
                    type="tel"
                    placeholder="0300-1234567"
                    required
                    class="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Email Address <span class="text-rose-400">*</span></label>
                  <input
                    id="cust-email"
                    type="email"
                    placeholder="asad@example.com"
                    required
                    class="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">City</label>
                <select id="cust-city" class="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400">
                  <option value="Karachi" ${state.selectedCity === 'Karachi' ? 'selected' : ''}>Karachi (Clifton / DHA)</option>
                  <option value="Lahore" ${state.selectedCity === 'Lahore' ? 'selected' : ''}>Lahore (Gulberg / DHA)</option>
                  <option value="Islamabad" ${state.selectedCity === 'Islamabad' ? 'selected' : ''}>Islamabad (Centaurus Mall)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Payment Options (Tailored for Pakistan) -->
          <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 class="text-base font-bold font-heading text-white flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              Select Payment Method
            </h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="payment-methods">
              
              <label class="payment-card relative flex items-start gap-3 p-3.5 rounded-lg border border-amber-500/50 bg-amber-500/10 cursor-pointer transition-all">
                <input type="radio" name="paymentMethod" value="jazzcash" checked class="mt-1 text-amber-400 focus:ring-amber-400" />
                <div>
                  <span class="block text-xs font-bold text-white">JazzCash</span>
                  <span class="block text-[11px] text-slate-400 mt-0.5">Instant Mobile Wallet / Voucher</span>
                </div>
              </label>

              <label class="payment-card relative flex items-start gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700 transition-all">
                <input type="radio" name="paymentMethod" value="easypaisa" class="mt-1 text-amber-400 focus:ring-amber-400" />
                <div>
                  <span class="block text-xs font-bold text-white">Easypaisa</span>
                  <span class="block text-[11px] text-slate-400 mt-0.5">Direct Wallet Transfer / OTC</span>
                </div>
              </label>

              <label class="payment-card relative flex items-start gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700 transition-all">
                <input type="radio" name="paymentMethod" value="card" class="mt-1 text-amber-400 focus:ring-amber-400" />
                <div>
                  <span class="block text-xs font-bold text-white">Visa / Mastercard / PayPak</span>
                  <span class="block text-[11px] text-slate-400 mt-0.5">Debit or Credit Card</span>
                </div>
              </label>

              <label class="payment-card relative flex items-start gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700 transition-all">
                <input type="radio" name="paymentMethod" value="counter" class="mt-1 text-amber-400 focus:ring-amber-400" />
                <div>
                  <span class="block text-xs font-bold text-white">Pay at Box Office</span>
                  <span class="block text-[11px] text-slate-400 mt-0.5">Pay in Cash/Card at Cinema Counter</span>
                </div>
              </label>

            </div>
          </div>

          <!-- Policy Consent Checkbox -->
          <div class="flex items-start gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-lg text-xs text-slate-400">
            <input
              id="policy-consent"
              type="checkbox"
              checked
              class="mt-0.5 rounded text-amber-400 focus:ring-amber-400 border-slate-700"
            />
            <label for="policy-consent" class="cursor-pointer leading-relaxed">
              I agree to CineVerse Pakistan's <span class="text-slate-300 underline">Admission Rules</span> and understand tickets may be cancelled up to 3 hours prior to showtime.
            </label>
          </div>

        </div>

        <!-- Right Column: Order Summary & Confirm Action -->
        <div class="lg:col-span-5">
          <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5 sticky top-28">
            <h2 class="text-base font-bold font-heading text-white border-b border-slate-800 pb-3">
              Booking Summary
            </h2>

            <!-- Movie Info Preview -->
            <div class="flex items-center gap-3">
              <div class="w-14 h-20 rounded-xl overflow-hidden glass-panel shrink-0 shadow-md">
                ${renderImage({
                  src: getMoviePosterUrl(movie.id, movie.posterUrl),
                  alt: movie.title,
                  className: 'w-full h-full object-cover',
                  loading: 'eager'
                })}
              </div>
              <div>
                <h3 class="text-sm font-bold text-white font-heading">${escapeHtml(movie.title)}</h3>
                <span class="text-[11px] text-amber-400 font-mono font-semibold">${movie.contentRating} &middot; ${movie.language}</span>
                <p class="text-xs text-slate-400 mt-0.5">${screen.name}</p>
                <p class="text-xs text-slate-300 font-mono">${formattedDate} &middot; ${formattedTime}</p>
              </div>
            </div>

            <!-- Seat Breakdown -->
            <div class="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div class="text-slate-400 font-medium">Selected Seats (${selectedSeats.length}):</div>
              <div class="flex flex-wrap gap-1.5">
                ${selectedSeats.map(id => `
                  <span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[11px] font-bold">
                    ${id}
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Detailed Price Calculations -->
            <div class="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-300">
              <div class="flex justify-between">
                <span class="text-slate-400">Tickets Subtotal:</span>
                <span class="font-mono text-white">Rs. ${subtotal.toLocaleString()} PKR</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Convenience & IT Fee (Rs. ${state.settings.convenienceFeePerTicket} &times; ${selectedSeats.length}):</span>
                <span class="font-mono text-white">Rs. ${fee.toLocaleString()} PKR</span>
              </div>
              <div class="flex justify-between text-slate-400">
                <span>GST / Taxes:</span>
                <span class="font-mono text-emerald-400">Included</span>
              </div>
              <div class="flex justify-between pt-3 border-t border-slate-800 text-sm font-bold text-white">
                <span>Grand Total:</span>
                <span class="text-base font-mono text-amber-400">Rs. ${total.toLocaleString()} PKR</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              id="confirm-booking-btn"
              class="w-full btn-gold-luxury py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xl"
            >
              <svg class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
              <span>Confirm & Issue Ticket</span>
            </button>

            <p class="text-[11px] text-center text-slate-400 leading-normal">
              🔒 Guaranteed atomic booking. Your tickets and scannable QR verification code will generate immediately.
            </p>
          </div>
        </div>

      </div>

    </div>
  `;
}

export function attachCheckoutEvents(): void {
  const confirmBtn = document.getElementById('confirm-booking-btn') as HTMLButtonElement | null;
  const timerDisplay = document.getElementById('checkout-hold-timer');

  // Start hold countdown
  let timeLeft = 299;
  if (holdTimerInterval) clearInterval(holdTimerInterval);
  holdTimerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(holdTimerInterval!);
      showToast('Your seat hold has expired. Returning to seat selection.', 'error');
      if (state.currentBooking.showId) {
        window.location.hash = `#/book/${state.currentBooking.showId}`;
      }
      return;
    }
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    if (timerDisplay) {
      timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }, 1000);

  // Payment radio styling
  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.payment-card').forEach(c => {
        c.className = 'payment-card relative flex items-start gap-3 p-3.5 rounded-lg border border-slate-800 bg-slate-950 cursor-pointer hover:border-slate-700 transition-all';
      });
      const card = (e.target as HTMLElement).closest('.payment-card');
      if (card) {
        card.className = 'payment-card relative flex items-start gap-3 p-3.5 rounded-lg border border-amber-500/50 bg-amber-500/10 cursor-pointer transition-all';
      }
    });
  });

  // Confirm booking
  confirmBtn?.addEventListener('click', async () => {
    const nameInput = document.getElementById('cust-name') as HTMLInputElement;
    const phoneInput = document.getElementById('cust-phone') as HTMLInputElement;
    const emailInput = document.getElementById('cust-email') as HTMLInputElement;
    const cityInput = document.getElementById('cust-city') as HTMLSelectElement;
    const consentInput = document.getElementById('policy-consent') as HTMLInputElement;
    const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const city = cityInput.value;
    const paymentMethod = (paymentRadio?.value || 'counter') as any;

    if (!name) {
      showToast('Please enter your full name.', 'error');
      nameInput.focus();
      return;
    }
    if (!phone || phone.length < 10) {
      showToast('Please enter a valid Pakistani contact phone number (e.g. 0300-1234567).', 'error');
      phoneInput.focus();
      return;
    }
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      emailInput.focus();
      return;
    }
    if (!consentInput.checked) {
      showToast('Please accept the admission and cancellation policy.', 'error');
      return;
    }

    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `
      <svg class="w-4 h-4 animate-spin text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <span>Processing Booking & QR Code...</span>
    `;

    try {
      const res = await api.confirmBooking({
        showId: state.currentBooking.showId!,
        seatIds: state.currentBooking.selectedSeats,
        holdId: state.currentBooking.holdId || undefined,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        city,
        paymentMethod
      });

      if (holdTimerInterval) clearInterval(holdTimerInterval);
      state.resetBooking();
      showToast(`Booking ${res.booking.bookingReference} confirmed successfully!`, 'success');
      window.location.hash = `#/confirmation/${res.booking.bookingReference}?contact=${encodeURIComponent(phone)}`;
    } catch (err: any) {
      showToast(err.message || 'Booking confirmation failed.', 'error');
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `
        <svg class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
        <span>Confirm & Issue Ticket</span>
      `;
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
