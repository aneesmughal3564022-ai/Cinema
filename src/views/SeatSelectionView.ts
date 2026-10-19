import { api } from '../api.js';
import { Movie, Screen, Showtime, Seat } from '../types.js';
import { state } from '../state.js';
import { showToast } from '../components/Toast.js';

let currentShowData: (Showtime & {
  movie: Movie;
  screen: Screen;
  bookedSeatIds: string[];
  heldSeatIds: { seatId: string; holdId: string }[];
}) | null = null;

let selectedSeatIds: Set<string> = new Set();
let holdCountdownTimer: NodeJS.Timeout | null = null;
let holdSecondsRemaining = 300; // 5 minutes

export async function renderSeatSelectionView(showId: string): Promise<string> {
  // Clear any existing timer
  if (holdCountdownTimer) {
    clearInterval(holdCountdownTimer);
    holdCountdownTimer = null;
  }
  selectedSeatIds.clear();

  try {
    currentShowData = await api.getShowDetails(showId);
  } catch (e: any) {
    return `
      <div class="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 class="text-xl font-bold text-white">Show Not Found</h2>
        <p class="text-xs text-slate-400 mt-2">${e.message || 'Unable to retrieve show details.'}</p>
        <a href="#/" class="mt-4 inline-block px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg">Return to Movies</a>
      </div>
    `;
  }

  const { movie, screen, startTime, basePrice } = currentShowData;
  const formattedTime = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const formattedDate = new Date(startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return `
    <div class="w-full flex flex-col flex-1 pb-24">
      
      <!-- Top Show Header Strip -->
      <div class="border-b border-slate-800 bg-[#0B1120]/80 sticky top-16 z-30 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-4">
            <a href="#/movie/${movie.id}" class="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Change Show
            </a>
            <div class="h-4 w-px bg-slate-800"></div>
            <div>
              <h2 class="text-sm font-bold text-white font-heading">${escapeHtml(movie.title)}</h2>
              <div class="text-[11px] text-slate-400 font-mono">
                ${screen.name} &middot; <span class="text-amber-400">${formattedDate} at ${formattedTime}</span>
              </div>
            </div>
          </div>

          <!-- Active Seat Hold Status Banner -->
          <div id="hold-timer-container" class="hidden items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <svg class="w-4 h-4 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <span>Hold Active:</span>
            <span id="hold-timer-display" class="font-bold text-amber-200">05:00</span>
          </div>
        </div>
      </div>

      <!-- SEAT MAP CONTAINER -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 pt-10 w-full flex flex-col items-center">
        
        <!-- Screen Curve Indicator -->
        <div class="w-full max-w-2xl flex flex-col items-center mb-10">
          <div class="w-full h-3 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-t-full shadow-lg shadow-amber-400/20"></div>
          <div class="w-full h-8 cinema-screen-glow"></div>
          <span class="text-[11px] font-mono uppercase tracking-widest text-slate-400 mt-1">
            SCREEN &middot; ALL EYES THIS WAY
          </span>
        </div>

        <!-- Legend (Clear distinction per Section 6.5) -->
        <div class="flex flex-wrap items-center justify-center gap-5 sm:gap-8 pb-8 text-xs text-slate-400 border-b border-slate-800/80 w-full">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-md border border-slate-600 bg-slate-800 flex items-center justify-center text-[9px] text-slate-400"></span>
            <span>Available (Standard Rs. ${basePrice})</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-md border border-amber-500/50 bg-amber-500/20 flex items-center justify-center text-[9px] text-amber-300"></span>
            <span>Premium (+Rs. 350)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-md border border-amber-400 bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[9px]">✓</span>
            <span>Selected</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-md border border-slate-800 bg-slate-950/80 text-slate-600 flex items-center justify-center text-[9px]">✕</span>
            <span>Booked / Reserved</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-md border border-orange-500/40 bg-orange-950/40 text-orange-400 flex items-center justify-center text-[9px]">⌛</span>
            <span>Temporary Hold</span>
          </div>
        </div>

        <!-- Interactive Seat Grid -->
        <div class="w-full overflow-x-auto py-8 flex justify-center">
          <div class="inline-flex flex-col gap-2.5 min-w-[340px] px-4">
            ${renderSeatsGrid(screen, currentShowData.bookedSeatIds, currentShowData.heldSeatIds)}
          </div>
        </div>

      </div>

      <!-- FLOATING LIVE ORDER SUMMARY BAR -->
      <div class="fixed bottom-0 inset-x-0 z-40 bg-[#0B1120]/95 border-t border-slate-800 backdrop-blur-md py-4 px-4 sm:px-8">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div class="flex items-center gap-6">
            <div>
              <span class="text-xs text-slate-400">Selected Seats:</span>
              <div id="selected-seats-labels" class="text-sm font-mono font-bold text-white mt-0.5">
                None selected yet
              </div>
            </div>
            
            <div class="h-8 w-px bg-slate-800 hidden sm:block"></div>

            <div>
              <span class="text-xs text-slate-400">Total Amount:</span>
              <div id="live-total-display" class="text-lg font-mono font-extrabold text-amber-400 mt-0.5">
                Rs. 0 PKR
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              id="proceed-checkout-btn"
              disabled
              class="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 btn-gold-luxury disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Hold & Proceed to Checkout</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>

        </div>
      </div>

    </div>
  `;
}

function renderSeatsGrid(screen: Screen, bookedIds: string[], heldIds: { seatId: string; holdId: string }[]): string {
  const bookedSet = new Set(bookedIds);
  const heldMap = new Map(heldIds.map(h => [h.seatId, h.holdId]));

  // Group seats by row
  const rowGroups = new Map<string, Seat[]>();
  for (const s of screen.seatLayout) {
    const list = rowGroups.get(s.rowLabel) || [];
    list.push(s);
    rowGroups.set(s.rowLabel, list);
  }

  return Array.from(rowGroups.entries()).map(([rowLabel, seats]) => {
    // Sort seats by seatNumber
    seats.sort((a, b) => a.seatNumber - b.seatNumber);

    return `
      <div class="flex items-center justify-center gap-2 sm:gap-3">
        <!-- Row Label Left -->
        <span class="w-5 text-xs font-mono font-bold text-slate-500 text-center">${rowLabel}</span>

        <!-- Seats in Row -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          ${seats.map((seat, index) => {
            const isBooked = bookedSet.has(seat.id);
            const isHeld = heldMap.has(seat.id);
            const isAisle = index === Math.floor(seats.length / 2);

            let seatClasses = '';
            let content = seat.seatNumber.toString();
            let disabledAttr = '';

            if (isBooked) {
              seatClasses = 'bg-slate-950/80 border-slate-900 text-slate-700 cursor-not-allowed';
              content = '✕';
              disabledAttr = 'disabled';
            } else if (isHeld) {
              seatClasses = 'bg-orange-950/40 border-orange-500/40 text-orange-400 cursor-not-allowed';
              content = '⌛';
              disabledAttr = 'disabled';
            } else if (seat.seatType === 'vip') {
              seatClasses = 'bg-amber-950/30 border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20';
            } else if (seat.seatType === 'premium') {
              seatClasses = 'bg-slate-800 border-amber-500/30 text-slate-300 hover:border-amber-400';
            } else {
              seatClasses = 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500';
            }

            return `
              ${isAisle ? '<div class="w-3 sm:w-6"></div>' : ''}
              <button
                data-seat-id="${seat.id}"
                data-seat-price="${(currentShowData?.basePrice || 1200) + (seat.priceModifier || 0)}"
                data-seat-label="${seat.rowLabel}-${seat.seatNumber}"
                ${disabledAttr}
                class="seat-btn w-7 h-7 sm:w-8 sm:h-8 rounded-md border text-[11px] font-mono font-medium flex items-center justify-center transition-all ${seatClasses}"
                title="${seat.rowLabel}-${seat.seatNumber} (${seat.seatType.toUpperCase()}) - Rs. ${(currentShowData?.basePrice || 1200) + (seat.priceModifier || 0)}"
              >
                ${content}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Row Label Right -->
        <span class="w-5 text-xs font-mono font-bold text-slate-500 text-center">${rowLabel}</span>
      </div>
    `;
  }).join('');
}

export function attachSeatSelectionEvents(): void {
  const proceedBtn = document.getElementById('proceed-checkout-btn') as HTMLButtonElement | null;

  document.querySelectorAll('.seat-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLButtonElement;
      const seatId = target.getAttribute('data-seat-id');
      if (!seatId) return;

      if (selectedSeatIds.has(seatId)) {
        selectedSeatIds.delete(seatId);
        target.classList.remove('bg-amber-400', 'text-slate-950', 'border-amber-300', 'font-bold');
      } else {
        if (selectedSeatIds.size >= 8) {
          showToast('Maximum 8 tickets allowed per booking.', 'info');
          return;
        }
        selectedSeatIds.add(seatId);
        target.classList.add('bg-amber-400', 'text-slate-950', 'border-amber-300', 'font-bold');
      }

      updateLiveSummary();
    });
  });

  proceedBtn?.addEventListener('click', async () => {
    if (!selectedSeatIds.size || !currentShowData) return;

    proceedBtn.disabled = true;
    proceedBtn.innerHTML = `
      <svg class="w-4 h-4 animate-spin text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <span>Reserving Seats...</span>
    `;

    try {
      // Create temporary 5-minute hold on the server
      const holdRes = await api.holdSeats(currentShowData.id, Array.from(selectedSeatIds));

      state.currentBooking = {
        showId: currentShowData.id,
        movieId: currentShowData.movieId,
        screenId: currentShowData.screenId,
        selectedSeats: Array.from(selectedSeatIds),
        holdId: holdRes.holdId,
        holdExpiresAt: holdRes.expiresAt,
        movie: currentShowData.movie,
        screen: currentShowData.screen,
        show: currentShowData
      };

      showToast('Seats temporarily held for 5 minutes! Proceeding to checkout.', 'success');
      window.location.hash = '#/checkout';
    } catch (err: any) {
      showToast(err.message || 'Failed to hold seats. Someone may have just selected them.', 'error');
      // Refresh show details to show updated availability
      if (currentShowData) {
        window.location.hash = `#/book/${currentShowData.id}`;
      }
    } finally {
      proceedBtn.disabled = false;
    }
  });
}

function updateLiveSummary() {
  const labelsContainer = document.getElementById('selected-seats-labels');
  const totalContainer = document.getElementById('live-total-display');
  const proceedBtn = document.getElementById('proceed-checkout-btn') as HTMLButtonElement | null;

  if (!currentShowData) return;

  if (selectedSeatIds.size === 0) {
    if (labelsContainer) labelsContainer.textContent = 'None selected yet';
    if (totalContainer) totalContainer.textContent = 'Rs. 0 PKR';
    if (proceedBtn) proceedBtn.disabled = true;
    return;
  }

  let subtotal = 0;
  const labels: string[] = [];

  for (const sId of selectedSeatIds) {
    const seatObj = currentShowData.screen.seatLayout.find(s => s.id === sId);
    if (seatObj) {
      const price = currentShowData.basePrice + (seatObj.priceModifier || 0);
      subtotal += price;
      labels.push(sId);
    }
  }

  const fee = state.settings.convenienceFeePerTicket * selectedSeatIds.size;
  const total = subtotal + fee;

  if (labelsContainer) labelsContainer.textContent = `${labels.join(', ')} (${selectedSeatIds.size} ${selectedSeatIds.size === 1 ? 'seat' : 'seats'})`;
  if (totalContainer) totalContainer.textContent = `Rs. ${total.toLocaleString()} PKR`;
  if (proceedBtn) proceedBtn.disabled = false;
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
