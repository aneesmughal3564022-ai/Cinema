import { api } from '../api.js';
import { Screen } from '../types.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showToast } from '../components/Toast.js';

let screensList: Screen[] = [];
let activeScreenId = '';

export async function renderAdminScreensView(): Promise<string> {
  const isAuth = await api.checkAdminAuth();
  if (!isAuth) {
    window.location.hash = '#/admin/login';
    return '';
  }

  try {
    screensList = await api.getAdminScreens();
    if (!activeScreenId && screensList.length) {
      activeScreenId = screensList[0].id;
    }
  } catch (e: any) {
    return renderAdminLayout('Halls & Seat Layout', `
      <div class="p-8 text-center text-xs text-rose-400">Failed to load screens: ${e.message}</div>
    `);
  }

  const activeScreen = screensList.find(s => s.id === activeScreenId) || screensList[0];

  const content = `
    <div class="space-y-6">
      
      <!-- Screen Selection Tabs -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div class="flex flex-wrap items-center gap-2">
          ${screensList.map(sc => `
            <button
              data-screen-tab="${sc.id}"
              class="screen-tab-btn px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                sc.id === activeScreenId
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }"
            >
              ${sc.name} (${sc.capacity} seats)
            </button>
          `).join('')}
        </div>

        <button
          id="open-add-screen-modal-btn"
          class="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Cinema Hall
        </button>
      </div>

      <!-- Active Screen Details & Config -->
      ${activeScreen ? `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Screen Information & Dimensions -->
          <div class="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 class="text-sm font-bold font-heading text-white border-b border-slate-800 pb-2">
              Hall Configuration
            </h3>

            <form id="screen-edit-form" class="space-y-3.5 text-xs">
              <div>
                <label class="block text-slate-400 mb-1">Hall Name</label>
                <input id="edit-screen-name" type="text" value="${escapeHtml(activeScreen.name)}" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400" />
              </div>

              <div>
                <label class="block text-slate-400 mb-1">Cinema Location</label>
                <input id="edit-screen-loc" type="text" value="${escapeHtml(activeScreen.location)}" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400" />
              </div>

              <div>
                <label class="block text-slate-400 mb-1">Projection / Audio Format</label>
                <select id="edit-screen-format" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400">
                  <option value="IMAX 3D" ${activeScreen.format === 'IMAX 3D' ? 'selected' : ''}>IMAX 3D with Laser</option>
                  <option value="Dolby Atmos" ${activeScreen.format === 'Dolby Atmos' ? 'selected' : ''}>Dolby Atmos 7.1</option>
                  <option value="VIP Lounge" ${activeScreen.format === 'VIP Lounge' ? 'selected' : ''}>VIP Gold Lounge</option>
                  <option value="Standard 4K" ${activeScreen.format === 'Standard 4K' ? 'selected' : ''}>Standard 4K Digital</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-slate-400 mb-1">Rows</label>
                  <input id="edit-screen-rows" type="number" min="3" max="15" value="${activeScreen.rows}" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">Seats / Row</label>
                  <input id="edit-screen-seats-per-row" type="number" min="4" max="25" value="${activeScreen.seatsPerRow}" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400" />
                </div>
              </div>

              <div class="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
                <div>Total Capacity: <span class="text-amber-400 font-bold">${activeScreen.capacity} Seats</span></div>
                <div>Status: <span class="text-emerald-400 font-bold">ACTIVE</span></div>
              </div>

              <button
                type="submit"
                class="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                Update Dimensions & Layout
              </button>
            </form>
          </div>

          <!-- Right: Visual Layout Editor / Preview -->
          <div class="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-5">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 class="text-sm font-bold font-heading text-white">Visual Seat Layout Preview</h3>
                <span class="text-xs text-slate-400">Click any seat to toggle Standard &harr; Premium &harr; VIP Recliner</span>
              </div>
              <div class="flex items-center gap-3 text-[11px] text-slate-400">
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-slate-800 border border-slate-600"></span> Standard</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-slate-800 border border-amber-500/50"></span> Premium</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-amber-950/40 border border-amber-500 text-amber-300"></span> VIP</span>
              </div>
            </div>

            <!-- Curved Screen Indicator -->
            <div class="w-full max-w-md mx-auto flex flex-col items-center">
              <div class="w-full h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-t-full"></div>
              <span class="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-1">SCREEN POSITION</span>
            </div>

            <!-- Seat Grid -->
            <div class="overflow-x-auto py-4 flex justify-center">
              <div class="inline-flex flex-col gap-2 min-w-[320px]">
                ${renderAdminSeatGrid(activeScreen)}
              </div>
            </div>

          </div>

        </div>
      ` : ''}

    </div>
  `;

  return renderAdminLayout('Halls & Seat Layout', content);
}

function renderAdminSeatGrid(screen: Screen): string {
  const rowGroups = new Map<string, typeof screen.seatLayout>();
  for (const s of screen.seatLayout) {
    const list = rowGroups.get(s.rowLabel) || [];
    list.push(s);
    rowGroups.set(s.rowLabel, list);
  }

  return Array.from(rowGroups.entries()).map(([rowLabel, seats]) => {
    seats.sort((a, b) => a.seatNumber - b.seatNumber);
    return `
      <div class="flex items-center justify-center gap-2">
        <span class="w-5 text-xs font-mono font-bold text-slate-500 text-center">${rowLabel}</span>
        <div class="flex items-center gap-1.5">
          ${seats.map(seat => {
            let seatColor = 'bg-slate-800 border-slate-700 text-slate-400';
            if (seat.seatType === 'vip') {
              seatColor = 'bg-amber-950/40 border-amber-500 text-amber-300';
            } else if (seat.seatType === 'premium') {
              seatColor = 'bg-slate-800 border-amber-500/50 text-amber-200';
            }
            return `
              <div
                class="w-7 h-7 rounded border text-[10px] font-mono flex items-center justify-center cursor-default ${seatColor}"
                title="${seat.id} (${seat.seatType})"
              >
                ${seat.seatNumber}
              </div>
            `;
          }).join('')}
        </div>
        <span class="w-5 text-xs font-mono font-bold text-slate-500 text-center">${rowLabel}</span>
      </div>
    `;
  }).join('');
}

export function attachAdminScreensEvents(): void {
  // Tab switcher
  document.querySelectorAll('.screen-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeScreenId = (e.currentTarget as HTMLElement).getAttribute('data-screen-tab') || '';
      window.location.hash = '#/admin/screens';
    });
  });

  // Edit form submit
  const form = document.getElementById('screen-edit-form') as HTMLFormElement | null;
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!activeScreenId) return;

    const name = (document.getElementById('edit-screen-name') as HTMLInputElement).value.trim();
    const location = (document.getElementById('edit-screen-loc') as HTMLInputElement).value.trim();
    const format = (document.getElementById('edit-screen-format') as HTMLSelectElement).value as any;
    const rows = parseInt((document.getElementById('edit-screen-rows') as HTMLInputElement).value, 10);
    const seatsPerRow = parseInt((document.getElementById('edit-screen-seats-per-row') as HTMLInputElement).value, 10);

    try {
      await api.updateScreen(activeScreenId, { name, location, format, rows, seatsPerRow });
      showToast('Hall configuration updated!', 'success');
      window.location.hash = '#/admin/screens';
    } catch (err: any) {
      showToast(err.message || 'Failed to update hall configuration.', 'error');
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
