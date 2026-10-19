import { api } from '../api.js';
import { DashboardStats } from '../types.js';
import { renderAdminLayout } from './AdminLayout.js';

export async function renderAdminDashboardView(): Promise<string> {
  const isAuth = await api.checkAdminAuth();
  if (!isAuth) {
    window.location.hash = '#/admin/login';
    return '';
  }

  let stats: DashboardStats;
  try {
    stats = await api.getAdminDashboard();
  } catch (e: any) {
    return renderAdminLayout('Dashboard', `
      <div class="p-8 text-center text-xs text-rose-400">Failed to load admin stats: ${e.message}</div>
    `);
  }

  const content = `
    <div class="space-y-8">
      
      <!-- Top KPI Metric Cards (60-30-10 discipline) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Card 1: Today's Revenue in PKR -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span class="font-medium">Today's Revenue</span>
            <span class="text-amber-400 font-mono text-[11px]">PKR</span>
          </div>
          <div class="text-2xl font-extrabold font-mono text-white">
            Rs. ${stats.todayRevenue.toLocaleString()}
          </div>
          <div class="text-[11px] text-emerald-400 flex items-center gap-1">
            <span>&uarr; Verified settled bookings</span>
          </div>
        </div>

        <!-- Card 2: Bookings Today -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span class="font-medium">Bookings Today</span>
            <span class="text-slate-500 font-mono text-[11px]">Reservations</span>
          </div>
          <div class="text-2xl font-extrabold font-mono text-white">
            ${stats.todayBookingsCount}
          </div>
          <div class="text-[11px] text-slate-400">
            Across Karachi, Lahore & Islamabad
          </div>
        </div>

        <!-- Card 3: Average Occupancy Rate -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span class="font-medium">Average Occupancy</span>
            <span class="text-amber-400 font-mono text-[11px]">%</span>
          </div>
          <div class="text-2xl font-extrabold font-mono text-amber-400">
            ${stats.averageOccupancyRate}%
          </div>
          <div class="text-[11px] text-slate-400">
            Auditorium seat utilization
          </div>
        </div>

        <!-- Card 4: Upcoming Shows -->
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span class="font-medium">Upcoming Shows</span>
            <span class="text-slate-500 font-mono text-[11px]">Active</span>
          </div>
          <div class="text-2xl font-extrabold font-mono text-white">
            ${stats.upcomingShowsCount}
          </div>
          <div class="text-[11px] text-slate-400">
            ${stats.cancellationsCount} cancellations handled
          </div>
        </div>

      </div>

      <!-- CHARTS SECTION: Sales Trend & Screen Occupancy -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Sales Trend Bar Chart (Last 7 Days) -->
        <div class="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold font-heading text-white">Gross Ticket Revenue (Last 7 Days)</h3>
            <span class="text-[11px] font-mono text-slate-400">Amounts in PKR</span>
          </div>

          <div class="h-48 flex items-end justify-between gap-2 pt-6 px-2">
            ${renderRevenueTrendBars(stats.salesByDate)}
          </div>
        </div>

        <!-- Occupancy by Screen -->
        <div class="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold font-heading text-white">Occupancy by Cinema Hall</h3>
            <span class="text-[11px] font-mono text-slate-400">Capacity Share</span>
          </div>

          <div class="space-y-4 pt-2">
            ${stats.occupancyByScreen.map(sc => `
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-300 font-medium">${sc.screenName}</span>
                  <span class="font-mono text-amber-400 font-bold">${sc.occupancyPercent}%</span>
                </div>
                <div class="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div class="bg-gradient-to-r from-amber-500 to-amber-300 h-2 rounded-full" style="width: ${Math.min(100, sc.occupancyPercent)}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- RECENT BOOKINGS TABLE & QUICK VERIFICATION -->
      <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-bold font-heading text-white">Recent Customer Bookings</h3>
            <p class="text-xs text-slate-400">Latest completed reservations across all screens</p>
          </div>
          <div class="flex items-center gap-2">
            <a href="#/admin/bookings" class="px-3 py-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-md transition-colors">
              Manage & Check-in &rarr;
            </a>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th class="py-2.5 px-3">Reference</th>
                <th class="py-2.5 px-3">Customer</th>
                <th class="py-2.5 px-3">Seats</th>
                <th class="py-2.5 px-3">Total (PKR)</th>
                <th class="py-2.5 px-3">Payment</th>
                <th class="py-2.5 px-3">Status</th>
                <th class="py-2.5 px-3">Booked At</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono">
              ${stats.recentBookings.map(b => `
                <tr class="hover:bg-slate-800/40 transition-colors">
                  <td class="py-2.5 px-3 font-bold text-amber-400">${b.bookingReference}</td>
                  <td class="py-2.5 px-3 font-sans text-slate-200">
                    <div>${escapeHtml(b.customerName)}</div>
                    <div class="text-[10px] text-slate-400">${b.customerPhone}</div>
                  </td>
                  <td class="py-2.5 px-3 text-slate-300">
                    ${b.seats.map(s => s.seatId).join(', ')}
                  </td>
                  <td class="py-2.5 px-3 text-white font-bold">
                    Rs. ${b.total.toLocaleString()}
                  </td>
                  <td class="py-2.5 px-3 uppercase text-[11px]">
                    <span class="${b.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}">
                      ${b.paymentMethod} (${b.paymentStatus})
                    </span>
                  </td>
                  <td class="py-2.5 px-3 text-[11px]">
                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${
                      b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      b.status === 'checked-in' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }">
                      ${b.status.toUpperCase()}
                    </span>
                  </td>
                  <td class="py-2.5 px-3 text-slate-400 text-[11px]">
                    ${new Date(b.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  return renderAdminLayout('Cinema Overview Dashboard', content);
}

function renderRevenueTrendBars(salesByDate: { date: string; amount: number; bookings: number }[]): string {
  if (!salesByDate.length) return '';
  const maxAmount = Math.max(...salesByDate.map(s => s.amount), 5000);

  return salesByDate.map(day => {
    const heightPercent = Math.max(10, Math.round((day.amount / maxAmount) * 100));
    const label = new Date(day.date).toLocaleDateString([], { weekday: 'narrow', month: 'numeric', day: 'numeric' });
    return `
      <div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
        <div class="text-[10px] font-mono text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Rs.${Math.round(day.amount / 1000)}k
        </div>
        <div class="w-full max-w-[36px] bg-amber-400/20 hover:bg-amber-400 rounded-t transition-all" style="height: ${heightPercent}%;"></div>
        <span class="text-[10px] font-mono text-slate-400 truncate w-full text-center">${label}</span>
      </div>
    `;
  }).join('');
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
