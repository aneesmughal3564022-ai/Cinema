export function renderAdminLayout(title: string, contentHtml: string): string {
  const currentHash = window.location.hash || '#/admin/dashboard';

  const navItems = [
    { label: 'Dashboard', hash: '#/admin/dashboard', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
    { label: 'Movie Catalog', hash: '#/admin/movies', icon: 'M19.82 2H4.18C2.97 2 2 2.97 2 4.18v15.64C2 21.03 2.97 22 4.18 22h15.64c1.21 0 2.18-.97 2.18-2.18V4.18C22 2.97 21.03 2 19.82 2zM7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5' },
    { label: 'Halls & Seats', hash: '#/admin/screens', icon: 'M2 12h20M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6' },
    { label: 'Showtimes', hash: '#/admin/shows', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
    { label: 'Bookings & Check-in', hash: '#/admin/bookings', icon: 'M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z' },
    { label: 'Reports & Revenue', hash: '#/admin/reports', icon: 'M18 20V10M12 20V4M6 20v-6' },
    { label: 'Settings', hash: '#/admin/settings', icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' }
  ];

  return `
    <div class="flex-1 flex flex-col md:flex-row bg-[#080C15] min-h-[calc(100vh-60px)]">
      
      <!-- Admin Sidebar Navigation -->
      <aside class="w-full md:w-64 bg-[#0B1120] border-r border-slate-800 shrink-0 p-4 space-y-6">
        <div class="px-2 py-1">
          <span class="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">ADMINISTRATIVE CONSOLE</span>
          <span class="text-xs font-bold text-slate-300 font-heading">Cinema Management Operations</span>
        </div>

        <nav class="space-y-1">
          ${navItems.map(item => {
            const isActive = currentHash.startsWith(item.hash);
            return `
              <a
                href="${item.hash}"
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }"
              >
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${item.icon}"/></svg>
                <span>${item.label}</span>
              </a>
            `;
          }).join('')}
        </nav>

        <div class="pt-6 border-t border-slate-800/80 px-2 space-y-2 text-[11px] text-slate-500 font-mono">
          <div>Role: <span class="text-amber-400 font-bold">Privileged Admin</span></div>
          <div>Location: <span class="text-slate-300">Pakistan HQ</span></div>
          <div>Currency: <span class="text-slate-300">PKR (Rs.)</span></div>
        </div>
      </aside>

      <!-- Main Admin Content Area -->
      <main class="flex-1 p-6 sm:p-8 max-w-7xl overflow-y-auto">
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-2xl font-extrabold font-heading text-white tracking-tight">${title}</h1>
            <p class="text-xs text-slate-400 mt-0.5">Control center for bookings, movies, screens, and ticket verification</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Live Online
            </span>
          </div>
        </div>

        ${contentHtml}
      </main>

    </div>
  `;
}
