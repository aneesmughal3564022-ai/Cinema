import { api } from '../api.js';
import { Movie, Screen, Showtime } from '../types.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showToast } from '../components/Toast.js';

let showsList: Showtime[] = [];
let moviesList: Movie[] = [];
let screensList: Screen[] = [];
let selectedDate = new Date().toISOString().slice(0, 10);

export async function renderAdminShowtimesView(): Promise<string> {
  const isAuth = await api.checkAdminAuth();
  if (!isAuth) {
    window.location.hash = '#/admin/login';
    return '';
  }

  try {
    [showsList, moviesList, screensList] = await Promise.all([
      api.getAdminShows({ date: selectedDate }),
      api.getAdminMovies(),
      api.getAdminScreens()
    ]);
  } catch (e: any) {
    return renderAdminLayout('Showtime Scheduling', `
      <div class="p-8 text-center text-xs text-rose-400">Failed to load shows: ${e.message}</div>
    `);
  }

  const content = `
    <div class="space-y-6">
      
      <!-- Top Action & Date Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs text-slate-400 font-medium">Screening Date:</label>
          <input
            id="show-date-picker"
            type="date"
            value="${selectedDate}"
            class="bg-slate-900 border border-slate-700/80 text-xs text-white px-3 py-1.5 rounded-lg font-mono focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          id="open-add-show-modal-btn"
          class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Schedule New Showtime
        </button>
      </div>

      <!-- Turnaround Buffer Notice -->
      <div class="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
        <svg class="w-4 h-4 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>
          <strong>Automated Conflict Engine Active:</strong> The scheduler automatically calculates movie runtimes and enforces a 30-minute cleaning and audience turnaround buffer between shows in the same hall.
        </span>
      </div>

      <!-- Scheduled Shows Table -->
      <div class="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-950/40">
                <th class="py-3 px-4">Start Time</th>
                <th class="py-3 px-4">Movie</th>
                <th class="py-3 px-4">Cinema Hall</th>
                <th class="py-3 px-4">Base Ticket Price</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              ${renderShowRows()}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Showtime Modal -->
      <div id="show-modal" class="hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-base font-bold font-heading text-white">Schedule New Showtime</h3>
            <button id="close-show-modal-btn" class="text-slate-400 hover:text-white">&times;</button>
          </div>

          <form id="show-form" class="space-y-3.5 text-xs">
            <div>
              <label class="block font-medium text-slate-300 mb-1">Select Movie *</label>
              <select id="form-show-movie" required class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400">
                ${moviesList.filter(m => m.status !== 'archived').map(m => `
                  <option value="${m.id}">${escapeHtml(m.title)} (${m.durationMinutes} min &middot; ${m.language})</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Select Cinema Hall *</label>
              <select id="form-show-screen" required class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400">
                ${screensList.map(s => `
                  <option value="${s.id}">${escapeHtml(s.name)} (${s.capacity} seats)</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Date & Time *</label>
              <input
                id="form-show-start"
                type="datetime-local"
                required
                value="${selectedDate}T18:00"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Base Ticket Price (PKR) *</label>
              <input
                id="form-show-price"
                type="number"
                min="500"
                step="50"
                value="1400"
                required
                class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" id="cancel-show-btn" class="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white">Cancel</button>
              <button type="submit" id="save-show-btn" class="px-5 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold uppercase tracking-wider">Publish Show</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `;

  return renderAdminLayout('Showtime Scheduling', content);
}

function renderShowRows(): string {
  if (!showsList.length) {
    return `<tr><td colspan="6" class="p-8 text-center text-slate-500">No scheduled shows for ${selectedDate}.</td></tr>`;
  }

  return showsList.map(s => {
    const movie = moviesList.find(m => m.id === s.movieId);
    const screen = screensList.find(sc => sc.id === s.screenId);
    const startTime = new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const endTime = new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    return `
      <tr class="hover:bg-slate-800/40 transition-colors">
        <td class="py-3 px-4 font-mono font-bold text-amber-400">
          ${startTime}
          <span class="block text-[10px] text-slate-500 font-normal">Ends ${endTime}</span>
        </td>
        <td class="py-3 px-4 font-bold text-white">
          ${movie ? escapeHtml(movie.title) : s.movieId}
          <span class="block text-[10px] text-slate-400 font-mono">${movie?.durationMinutes} min &middot; ${movie?.contentRating}</span>
        </td>
        <td class="py-3 px-4 text-slate-300 font-medium">
          ${screen ? escapeHtml(screen.name) : s.screenId}
        </td>
        <td class="py-3 px-4 font-mono text-white">
          Rs. ${s.basePrice.toLocaleString()} PKR
        </td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${
            s.status === 'scheduled' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }">
            ${s.status.toUpperCase()}
          </span>
        </td>
        <td class="py-3 px-4 text-right">
          ${s.status === 'scheduled' ? `
            <button
              data-cancel-show-id="${s.id}"
              class="cancel-show-btn text-rose-400 hover:text-rose-300 transition-colors"
            >
              Cancel Show
            </button>
          ` : ''}
        </td>
      </tr>
    `;
  }).join('');
}

export function attachAdminShowtimesEvents(): void {
  const datePicker = document.getElementById('show-date-picker') as HTMLInputElement | null;
  datePicker?.addEventListener('change', (e) => {
    selectedDate = (e.target as HTMLInputElement).value;
    window.location.hash = '#/admin/shows';
  });

  const modal = document.getElementById('show-modal');
  const openBtn = document.getElementById('open-add-show-modal-btn');
  const closeBtn = document.getElementById('close-show-modal-btn');
  const cancelBtn = document.getElementById('cancel-show-btn');
  const form = document.getElementById('show-form') as HTMLFormElement | null;

  openBtn?.addEventListener('click', () => modal?.classList.remove('hidden'));
  closeBtn?.addEventListener('click', () => modal?.classList.add('hidden'));
  cancelBtn?.addEventListener('click', () => modal?.classList.add('hidden'));

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const movieId = (document.getElementById('form-show-movie') as HTMLSelectElement).value;
    const screenId = (document.getElementById('form-show-screen') as HTMLSelectElement).value;
    const startTimeStr = (document.getElementById('form-show-start') as HTMLInputElement).value;
    const basePrice = parseInt((document.getElementById('form-show-price') as HTMLInputElement).value, 10);

    const startTime = new Date(startTimeStr).toISOString();

    try {
      await api.createShow({ movieId, screenId, startTime, basePrice });
      showToast('Showtime successfully scheduled!', 'success');
      modal?.classList.add('hidden');
      window.location.hash = '#/admin/shows';
    } catch (err: any) {
      // Conflicts are caught and explained!
      showToast(err.message || 'Failed to schedule showtime.', 'error');
    }
  });

  document.querySelectorAll('.cancel-show-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-cancel-show-id');
      if (!id) return;
      if (!confirm('Are you sure you want to cancel this showtime? Confirmed bookings will be marked cancelled.')) return;

      try {
        const res = await api.cancelShow(id);
        showToast(res.message, 'success');
        window.location.hash = '#/admin/shows';
      } catch (err: any) {
        showToast(err.message || 'Failed to cancel show.', 'error');
      }
    });
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
