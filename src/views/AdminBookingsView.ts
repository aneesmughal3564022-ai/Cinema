import { api } from '../api.js';
import { Booking } from '../types.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showToast } from '../components/Toast.js';

let bookingsList: Booking[] = [];
let searchQuery = '';
let filterStatus = 'all';

export async function renderAdminBookingsView(): Promise<string> {
  const isAuth = await api.checkAdminAuth();
  if (!isAuth) {
    window.location.hash = '#/admin/login';
    return '';
  }

  try {
    bookingsList = await api.getAdminBookings({
      search: searchQuery || undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined
    });
  } catch (e: any) {
    return renderAdminLayout('Bookings & Ticket Check-In', `
      <div class="p-8 text-center text-xs text-rose-400">Failed to load bookings: ${e.message}</div>
    `);
  }

  const content = `
    <div class="space-y-8">
      
      <!-- QUICK CHECK-IN & QR SCANNER CONSOLE -->
      <div class="bg-gradient-to-r from-slate-900 to-[#111927] border border-amber-500/30 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div class="max-w-2xl space-y-3">
          <div class="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/></svg>
            Box Office / Gate Check-In Console
          </div>
          <h2 class="text-xl font-bold font-heading text-white">Turnstile Scanner & Ticket Verification</h2>
          <p class="text-xs text-slate-400 leading-relaxed">
            Scan physical or digital QR code, or enter the booking reference. The verification engine enforces single-use admittance and prevents counterfeit or duplicate entries.
          </p>

          <form id="check-in-form" class="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div class="relative flex-1 w-full">
              <input
                id="check-in-input"
                type="text"
                placeholder="Scan QR token or enter Reference (e.g. CVP-PK-7842)..."
                required
                class="w-full bg-slate-950 border border-slate-700 text-xs text-white pl-9 pr-3 py-3 rounded-lg font-mono focus:outline-none focus:border-amber-400 transition-colors uppercase"
              />
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-amber-400">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
              </div>
            </div>

            <button
              type="submit"
              id="check-in-submit-btn"
              class="w-full sm:w-auto px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors whitespace-nowrap"
            >
              Verify & Check In
            </button>
          </form>

          <!-- Check-in result alert container -->
          <div id="check-in-result" class="hidden mt-3 p-4 rounded-xl border text-xs"></div>
        </div>
      </div>

      <!-- BOOKINGS REPOSITORY -->
      <div class="space-y-4">
        
        <!-- Filter and Search Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="relative flex-1 max-w-sm">
            <input
              id="bookings-search-input"
              type="text"
              placeholder="Search reference, customer name, phone..."
              value="${escapeHtml(searchQuery)}"
              class="w-full bg-slate-900 border border-slate-700/80 text-xs text-white pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-amber-400"
            />
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>

          <!-- Status Filters -->
          <div class="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            ${['all', 'confirmed', 'checked-in', 'cancelled'].map(st => `
              <button
                data-status-filter="${st}"
                class="booking-status-tab px-3 py-1 rounded font-medium transition-colors ${
                  filterStatus === st ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }"
              >
                ${st === 'all' ? 'All Bookings' : st.toUpperCase()}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Bookings Data Table -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-950/40">
                  <th class="py-3 px-4">Reference</th>
                  <th class="py-3 px-4">Customer</th>
                  <th class="py-3 px-4">Reserved Seats</th>
                  <th class="py-3 px-4">Total Amount</th>
                  <th class="py-3 px-4">Payment</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4">Booked Date</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="bookings-tbody" class="divide-y divide-slate-800/60 font-mono">
                ${renderBookingsTableRows(bookingsList)}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `;

  return renderAdminLayout('Bookings & Ticket Check-In', content);
}

function renderBookingsTableRows(bookings: Booking[]): string {
  if (!bookings.length) {
    return `<tr><td colspan="8" class="p-8 text-center text-slate-500 font-sans">No matching bookings found.</td></tr>`;
  }

  return bookings.map(b => `
    <tr class="hover:bg-slate-800/40 transition-colors">
      <td class="py-3 px-4 font-bold text-amber-400">
        <a href="#/confirmation/${b.bookingReference}?contact=${encodeURIComponent(b.customerPhone)}" target="_blank" class="hover:underline flex items-center gap-1">
          ${b.bookingReference}
          <svg class="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </td>
      <td class="py-3 px-4 font-sans text-slate-200">
        <div class="font-medium">${escapeHtml(b.customerName)}</div>
        <div class="text-[10px] text-slate-400">${b.customerPhone} &middot; ${b.city}</div>
      </td>
      <td class="py-3 px-4 text-slate-300">
        ${b.seats.map(s => s.seatId).join(', ')}
      </td>
      <td class="py-3 px-4 text-white font-bold">
        Rs. ${b.total.toLocaleString()} PKR
      </td>
      <td class="py-3 px-4 uppercase text-[11px]">
        <span class="${b.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}">
          ${b.paymentMethod}
        </span>
      </td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${
          b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          b.status === 'checked-in' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }">
          ${b.status.toUpperCase()}
        </span>
      </td>
      <td class="py-3 px-4 text-slate-400 text-[11px]">
        ${new Date(b.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </td>
      <td class="py-3 px-4 text-right">
        ${b.status === 'confirmed' ? `
          <button
            data-quick-checkin="${b.bookingReference}"
            class="quick-checkin-btn px-2.5 py-1 text-[11px] font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
          >
            Check In
          </button>
        ` : b.status === 'checked-in' ? `
          <span class="text-[10px] text-slate-500">Checked In</span>
        ` : `
          <span class="text-[10px] text-rose-400">Cancelled</span>
        `}
      </td>
    </tr>
  `).join('');
}

export function attachAdminBookingsEvents(): void {
  const checkInForm = document.getElementById('check-in-form');
  const checkInInput = document.getElementById('check-in-input') as HTMLInputElement | null;
  const resultContainer = document.getElementById('check-in-result');
  const searchInput = document.getElementById('bookings-search-input') as HTMLInputElement | null;

  // Single-use Check-in validation
  checkInForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!checkInInput || !checkInInput.value.trim() || !resultContainer) return;

    const identifier = checkInInput.value.trim();
    resultContainer.classList.remove('hidden', 'bg-emerald-950/60', 'border-emerald-500', 'bg-rose-950/60', 'border-rose-500', 'bg-amber-950/60', 'border-amber-500');

    try {
      const res = await api.checkInTicket(identifier);

      if (res.status === 'success') {
        resultContainer.className = 'mt-3 p-4 rounded-xl border bg-emerald-950/60 border-emerald-500/50 text-emerald-200 text-xs';
        resultContainer.innerHTML = `
          <div class="flex items-center gap-2 font-bold text-emerald-300 text-sm">
            <svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
            ${escapeHtml(res.message)}
          </div>
          <div class="mt-2 text-slate-300 space-y-0.5 font-mono">
            <div>Booking Ref: <strong>${res.booking?.bookingReference}</strong> &middot; ${res.booking?.customerName}</div>
            <div>Hall: ${res.screen?.name} &middot; Seats: ${res.booking?.seats.map(s => s.seatId).join(', ')}</div>
          </div>
        `;
        showToast('Ticket verified and checked in!', 'success');
        refreshBookingsList();
      } else if (res.status === 'already_checked_in') {
        // Enforce duplicate prevention per Section 6.6
        resultContainer.className = 'mt-3 p-4 rounded-xl border bg-amber-950/60 border-amber-500/50 text-amber-200 text-xs';
        resultContainer.innerHTML = `
          <div class="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <svg class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            ${escapeHtml(res.message)}
          </div>
          <div class="mt-1 text-slate-300 font-mono">
            Booking ${res.booking?.bookingReference} was already scanned. Duplicate use blocked!
          </div>
        `;
        showToast('Duplicate ticket check-in rejected!', 'error');
      } else {
        resultContainer.className = 'mt-3 p-4 rounded-xl border bg-rose-950/60 border-rose-500/50 text-rose-200 text-xs';
        resultContainer.innerHTML = `
          <div class="flex items-center gap-2 font-bold text-rose-300 text-sm">
            <svg class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            ${escapeHtml(res.message)}
          </div>
        `;
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Check-in request failed.', 'error');
    }
  });

  // Search input
  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    refreshBookingsList();
  });

  // Status tabs
  document.querySelectorAll('.booking-status-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterStatus = (e.currentTarget as HTMLElement).getAttribute('data-status-filter') || 'all';
      window.location.hash = '#/admin/bookings';
    });
  });

  attachQuickCheckinButtons();
}

function attachQuickCheckinButtons() {
  document.querySelectorAll('.quick-checkin-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const ref = (e.currentTarget as HTMLElement).getAttribute('data-quick-checkin');
      if (!ref) return;

      try {
        const res = await api.checkInTicket(ref);
        if (res.status === 'success') {
          showToast(`Checked in ${ref} successfully!`, 'success');
          refreshBookingsList();
        } else {
          showToast(res.message, 'error');
        }
      } catch (err: any) {
        showToast(err.message || 'Check-in failed.', 'error');
      }
    });
  });
}

async function refreshBookingsList() {
  try {
    bookingsList = await api.getAdminBookings({
      search: searchQuery || undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined
    });
    const tbody = document.getElementById('bookings-tbody');
    if (tbody) {
      tbody.innerHTML = renderBookingsTableRows(bookingsList);
      attachQuickCheckinButtons();
    }
  } catch (err) {
    console.error('Failed to refresh bookings:', err);
  }
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
