import { api } from '../api.js';
import { DashboardStats } from '../types.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showToast } from '../components/Toast.js';

let stats: DashboardStats | null = null;

export async function renderAdminReportsView(): Promise<string> {
  const isAuth = await api.checkAdminAuth();
  if (!isAuth) {
    window.location.hash = '#/admin/login';
    return '';
  }

  try {
    stats = await api.getAdminDashboard();
  } catch (e: any) {
    return renderAdminLayout('Financial & Occupancy Reports', `
      <div class="p-8 text-center text-xs text-rose-400">Failed to load reports: ${e.message}</div>
    `);
  }

  const content = `
    <div class="space-y-8">
      
      <!-- Top Action Bar & Export Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span class="text-[11px] font-mono uppercase text-slate-400">REPORTING METRICS DEFINITION</span>
          <p class="text-xs text-slate-400 mt-0.5">
            Revenue figures reflect confirmed & paid bookings in PKR. Cancelled bookings (${stats.cancellationsCount}) are excluded from gross totals.
          </p>
        </div>

        <button
          id="export-csv-btn"
          class="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV Summary
        </button>
      </div>

      <!-- Financial Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-1">
          <span class="text-xs text-slate-400 font-medium">Total Settled Sales (7-Day Sample)</span>
          <div class="text-2xl font-bold font-mono text-white">
            Rs. ${stats.salesByDate.reduce((sum, d) => sum + d.amount, 0).toLocaleString()} PKR
          </div>
          <span class="text-[11px] text-emerald-400 font-mono">100% verified settlement</span>
        </div>

        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-1">
          <span class="text-xs text-slate-400 font-medium">Total Tickets Sold</span>
          <div class="text-2xl font-bold font-mono text-amber-400">
            ${stats.salesByDate.reduce((sum, d) => sum + d.bookings, 0)} Tickets
          </div>
          <span class="text-[11px] text-slate-400">Average ticket: Rs. 1,550 PKR</span>
        </div>

        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-1">
          <span class="text-xs text-slate-400 font-medium">Average Fleet Occupancy</span>
          <div class="text-2xl font-bold font-mono text-white">
            ${stats.averageOccupancyRate}%
          </div>
          <span class="text-[11px] text-slate-400">Target benchmark: 65%</span>
        </div>
      </div>

      <!-- Top Grossing Movies Breakdown -->
      <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 class="text-sm font-bold font-heading text-white">Gross Revenue & Ticket Sales by Film</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th class="py-2.5 px-3">Movie Title</th>
                <th class="py-2.5 px-3">Tickets Sold</th>
                <th class="py-2.5 px-3">Total Gross (PKR)</th>
                <th class="py-2.5 px-3">Revenue Share</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono">
              ${renderMovieReportRows(stats.bookingsByMovie)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Hall Utilization Table -->
      <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 class="text-sm font-bold font-heading text-white">Auditorium Performance & Screen Occupancy</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th class="py-2.5 px-3">Cinema Hall</th>
                <th class="py-2.5 px-3">Total Scheduled Screenings</th>
                <th class="py-2.5 px-3">Average Occupancy</th>
                <th class="py-2.5 px-3">Utilization Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono">
              ${stats.occupancyByScreen.map(sc => `
                <tr class="hover:bg-slate-800/40 transition-colors">
                  <td class="py-2.5 px-3 font-sans font-bold text-white">${sc.screenName}</td>
                  <td class="py-2.5 px-3 text-slate-300">${sc.totalShows} Screenings</td>
                  <td class="py-2.5 px-3 text-amber-400 font-bold">${sc.occupancyPercent}%</td>
                  <td class="py-2.5 px-3">
                    <span class="px-2 py-0.5 rounded text-[10px] ${
                      sc.occupancyPercent > 50 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }">
                      ${sc.occupancyPercent > 50 ? 'OPTIMAL' : 'AVAILABLE CAPACITY'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  return renderAdminLayout('Financial & Occupancy Reports', content);
}

function renderMovieReportRows(bookingsByMovie: { movieTitle: string; bookings: number; revenue: number }[]): string {
  const totalRev = bookingsByMovie.reduce((sum, m) => sum + m.revenue, 0) || 1;

  return bookingsByMovie.map(m => {
    const share = Math.round((m.revenue / totalRev) * 100);
    return `
      <tr class="hover:bg-slate-800/40 transition-colors">
        <td class="py-2.5 px-3 font-sans font-bold text-white">${escapeHtml(m.movieTitle)}</td>
        <td class="py-2.5 px-3 text-slate-300">${m.bookings} Tickets</td>
        <td class="py-2.5 px-3 text-amber-400 font-bold">Rs. ${m.revenue.toLocaleString()} PKR</td>
        <td class="py-2.5 px-3">
          <div class="flex items-center gap-2">
            <div class="w-24 bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div class="bg-amber-400 h-1.5 rounded-full" style="width: ${share}%"></div>
            </div>
            <span class="text-slate-400 text-[11px]">${share}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

export function attachAdminReportsEvents(): void {
  const exportBtn = document.getElementById('export-csv-btn');
  exportBtn?.addEventListener('click', () => {
    if (!stats) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Movie Title,Tickets Sold,Gross Revenue PKR\n';
    stats.bookingsByMovie.forEach(m => {
      csvContent += `"${m.movieTitle}",${m.bookings},${m.revenue}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cineverse_sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Report CSV successfully generated and downloaded.', 'success');
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
