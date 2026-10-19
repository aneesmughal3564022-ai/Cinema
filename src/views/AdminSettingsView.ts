import { api } from '../api.js';
import { CinemaSettings } from '../types.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showToast } from '../components/Toast.js';

let settings: CinemaSettings | null = null;

export async function renderAdminSettingsView(): Promise<string> {
  const isAuth = await api.checkAdminAuth();
  if (!isAuth) {
    window.location.hash = '#/admin/login';
    return '';
  }

  try {
    settings = await api.getAdminSettings();
  } catch (e: any) {
    return renderAdminLayout('Cinema Settings', `
      <div class="p-8 text-center text-xs text-rose-400">Failed to load settings: ${e.message}</div>
    `);
  }

  const content = `
    <div class="max-w-3xl space-y-8">
      
      <form id="cinema-settings-form" class="bg-slate-900/80 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        
        <div>
          <h2 class="text-base font-bold font-heading text-white">General Cinema Configuration</h2>
          <p class="text-xs text-slate-400">Brand identity, operational parameters, and contact channels</p>
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block font-medium text-slate-300 mb-1">Cinema Enterprise Brand Name</label>
            <input
              id="set-cinema-name"
              type="text"
              value="${escapeHtml(settings.cinemaName)}"
              required
              class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label class="block font-medium text-slate-300 mb-1">Brand Tagline / Slogan</label>
            <input
              id="set-tagline"
              type="text"
              value="${escapeHtml(settings.brandTagline)}"
              class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-medium text-slate-300 mb-1">Operating Currency</label>
              <input
                id="set-currency"
                type="text"
                value="${escapeHtml(settings.currency)}"
                required
                class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label class="block font-medium text-slate-300 mb-1">Currency Symbol</label>
              <input
                id="set-symbol"
                type="text"
                value="${escapeHtml(settings.currencySymbol)}"
                required
                class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label class="block font-medium text-slate-300 mb-1">Timezone</label>
            <input
              id="set-timezone"
              type="text"
              value="${escapeHtml(settings.timezone)}"
              required
              class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
            />
            <span class="text-[11px] text-slate-500 mt-1 block">Default: Asia/Karachi (PKT UTC+5)</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-medium text-slate-300 mb-1">Support Helpline</label>
              <input
                id="set-phone"
                type="text"
                value="${escapeHtml(settings.contactPhone)}"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label class="block font-medium text-slate-300 mb-1">Support Email</label>
              <input
                id="set-email"
                type="email"
                value="${escapeHtml(settings.contactEmail)}"
                class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800">
          <h2 class="text-base font-bold font-heading text-white">Booking & Turnaround Parameters</h2>
          <p class="text-xs text-slate-400">Concurrency timing, seat hold expiry, and buffer settings</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label class="block font-medium text-slate-300 mb-1">Seat Hold Duration (Minutes)</label>
            <input
              id="set-hold-dur"
              type="number"
              min="2"
              max="15"
              value="${settings.holdDurationMinutes}"
              required
              class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
            />
            <span class="text-[11px] text-slate-500 mt-1 block">Holds expire automatically</span>
          </div>

          <div>
            <label class="block font-medium text-slate-300 mb-1">Turnaround Cleaning Buffer (Minutes)</label>
            <input
              id="set-buffer"
              type="number"
              min="10"
              max="60"
              value="${settings.turnaroundBufferMinutes}"
              required
              class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
            />
            <span class="text-[11px] text-slate-500 mt-1 block">Prevents schedule overlap</span>
          </div>

          <div>
            <label class="block font-medium text-slate-300 mb-1">Convenience Fee / Ticket (PKR)</label>
            <input
              id="set-fee"
              type="number"
              min="0"
              max="500"
              value="${settings.convenienceFeePerTicket}"
              required
              class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="submit"
            id="save-settings-btn"
            class="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors"
          >
            Save Cinema Settings
          </button>
        </div>

      </form>

    </div>
  `;

  return renderAdminLayout('Cinema Configuration Settings', content);
}

export function attachAdminSettingsEvents(): void {
  const form = document.getElementById('cinema-settings-form') as HTMLFormElement | null;
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cinemaName = (document.getElementById('set-cinema-name') as HTMLInputElement).value.trim();
    const brandTagline = (document.getElementById('set-tagline') as HTMLInputElement).value.trim();
    const currency = (document.getElementById('set-currency') as HTMLInputElement).value.trim();
    const currencySymbol = (document.getElementById('set-symbol') as HTMLInputElement).value.trim();
    const timezone = (document.getElementById('set-timezone') as HTMLInputElement).value.trim();
    const contactPhone = (document.getElementById('set-phone') as HTMLInputElement).value.trim();
    const contactEmail = (document.getElementById('set-email') as HTMLInputElement).value.trim();
    const holdDurationMinutes = parseInt((document.getElementById('set-hold-dur') as HTMLInputElement).value, 10);
    const turnaroundBufferMinutes = parseInt((document.getElementById('set-buffer') as HTMLInputElement).value, 10);
    const convenienceFeePerTicket = parseInt((document.getElementById('set-fee') as HTMLInputElement).value, 10);

    try {
      await api.updateAdminSettings({
        cinemaName,
        brandTagline,
        currency,
        currencySymbol,
        timezone,
        contactPhone,
        contactEmail,
        holdDurationMinutes,
        turnaroundBufferMinutes,
        convenienceFeePerTicket
      });
      showToast('Cinema configuration saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings.', 'error');
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
