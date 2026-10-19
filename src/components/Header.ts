import { state } from '../state.js';

export function renderHeader(): string {
  const currentHash = window.location.hash || '#/';
  const isAdmin = currentHash.startsWith('#/admin');

  if (isAdmin) {
    return `
      <header class="sticky top-0 z-40 w-full bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between gap-8">
        <div class="flex items-center gap-3">
          <a href="#/admin/dashboard" class="text-lg font-bold font-heading tracking-tight text-amber-400 whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            CineVerse Admin
          </a>
          <span class="text-xs text-slate-500 font-mono hidden sm:inline">Portal v1.0</span>
        </div>

        <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#/admin/dashboard" class="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${currentHash.includes('dashboard') ? 'text-amber-400 font-semibold' : ''}">Dashboard</a>
          <a href="#/admin/movies" class="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${currentHash.includes('movies') ? 'text-amber-400 font-semibold' : ''}">Movies</a>
          <a href="#/admin/screens" class="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${currentHash.includes('screens') ? 'text-amber-400 font-semibold' : ''}">Halls & Seats</a>
          <a href="#/admin/shows" class="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${currentHash.includes('shows') ? 'text-amber-400 font-semibold' : ''}">Showtimes</a>
          <a href="#/admin/bookings" class="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${currentHash.includes('bookings') ? 'text-amber-400 font-semibold' : ''}">Bookings & Check-in</a>
          <a href="#/admin/reports" class="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${currentHash.includes('reports') ? 'text-amber-400 font-semibold' : ''}">Reports</a>
          <a href="#/admin/settings" class="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${currentHash.includes('settings') ? 'text-amber-400 font-semibold' : ''}">Settings</a>
        </nav>

        <div class="flex items-center gap-3 shrink-0">
          <a href="#/" class="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 rounded-md transition-colors whitespace-nowrap">
            Public Website
          </a>
          <button id="admin-logout-btn" class="px-3.5 py-1.5 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 border border-rose-500/20 rounded-md transition-colors whitespace-nowrap">
            Sign Out
          </button>
        </div>
      </header>
    `;
  }

  return `
    <header class="sticky top-0 z-40 w-full bg-[#05070c]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-8">
        
        <!-- Zone 1: Brand Wordmark -->
        <a href="#/" class="text-xl font-extrabold font-heading tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-95 transition-all flex items-center gap-2.5 group">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
            C
          </div>
          <span class="tracking-tight"><span class="gold-gradient-text font-black">CINE</span>VERSE</span>
          <span class="text-[10px] uppercase font-mono tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">PK</span>
        </a>

        <!-- Zone 2: Navigation Links matching screenshot -->
        <nav class="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <a href="#/" class="px-5 py-2 rounded-xl bg-gradient-to-b from-[#1c2438] to-[#0c111d] border border-amber-500/40 text-amber-300 font-bold shadow-md shadow-amber-500/10 transition-all">Movies</a>
          <a href="#/showtimes" class="px-3 py-1.5 hover:text-amber-400 transition-colors whitespace-nowrap">Showtimes</a>
          <a href="#/experience" class="px-3 py-1.5 hover:text-amber-400 transition-colors whitespace-nowrap">IMAX & VIP</a>
          <a href="#/my-tickets" class="px-3 py-1.5 hover:text-amber-400 transition-colors whitespace-nowrap">Find My Ticket</a>
          <a href="#/admin" class="px-3 py-1.5 text-slate-400 hover:text-slate-200 text-[11px] font-mono transition-colors">Admin Portal</a>
        </nav>

        <!-- Zone 3: City Selector & Gold Ticket Button -->
        <div class="flex items-center gap-3 shrink-0">
          <!-- City Switcher -->
          <div class="relative hidden sm:block">
            <select id="city-selector" class="appearance-none bg-[#0c111d] border border-white/10 text-xs font-semibold text-slate-200 pl-3 pr-8 py-2 rounded-xl cursor-pointer hover:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-400 shadow-inner">
              <option value="Karachi" ${state.selectedCity === 'Karachi' ? 'selected' : ''}>📍 Karachi</option>
              <option value="Lahore" ${state.selectedCity === 'Lahore' ? 'selected' : ''}>📍 Lahore</option>
              <option value="Islamabad" ${state.selectedCity === 'Islamabad' ? 'selected' : ''}>📍 Islamabad</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-amber-400/80">
              <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </div>
          </div>

          <!-- Gold Ticket Button matching screenshot -->
          <a href="#/my-tickets" class="btn-gold-luxury p-2.5 rounded-xl shadow-md flex items-center justify-center text-slate-950 transition-transform hover:scale-105" title="View Tickets">
            <svg class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
            </svg>
          </a>

          <!-- Mobile Menu Button -->
          <button id="mobile-menu-btn" class="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none" aria-label="Toggle menu">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>

      </div>

      <!-- Mobile dropdown -->
      <div id="mobile-menu" class="hidden md:hidden border-t border-slate-800 bg-[#0B1120] px-4 pt-3 pb-5 space-y-3">
        <div class="mb-2">
          <label class="block text-xs text-slate-400 mb-1">Select Cinema City:</label>
          <select id="mobile-city-selector" class="w-full bg-slate-900 border border-slate-700 text-sm text-slate-200 p-2 rounded-lg">
            <option value="Karachi" ${state.selectedCity === 'Karachi' ? 'selected' : ''}>Karachi - Clifton Waterfront</option>
            <option value="Lahore" ${state.selectedCity === 'Lahore' ? 'selected' : ''}>Lahore - Gulberg Heights</option>
            <option value="Islamabad" ${state.selectedCity === 'Islamabad' ? 'selected' : ''}>Islamabad - Centaurus Mall</option>
          </select>
        </div>
        <a href="#/" class="block text-sm font-medium text-slate-200 hover:text-amber-400 py-1.5">Movies</a>
        <a href="#/showtimes" class="block text-sm font-medium text-slate-200 hover:text-amber-400 py-1.5">Showtimes & Schedules</a>
        <a href="#/experience" class="block text-sm font-medium text-slate-200 hover:text-amber-400 py-1.5">IMAX & VIP Lounges</a>
        <a href="#/my-tickets" class="block text-sm font-medium text-slate-200 hover:text-amber-400 py-1.5">Find My Ticket</a>
        <a href="#/admin" class="block text-xs font-mono text-slate-400 hover:text-amber-400 pt-2 border-t border-slate-800">Admin Management Portal</a>
      </div>
    </header>
  `;
}

export function attachHeaderEvents(): void {
  // Mobile toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // City selector events
  const citySelect = document.getElementById('city-selector') as HTMLSelectElement | null;
  citySelect?.addEventListener('change', (e) => {
    state.setCity((e.target as HTMLSelectElement).value);
    window.dispatchEvent(new CustomEvent('city-changed', { detail: state.selectedCity }));
  });

  const mobileCitySelect = document.getElementById('mobile-city-selector') as HTMLSelectElement | null;
  mobileCitySelect?.addEventListener('change', (e) => {
    state.setCity((e.target as HTMLSelectElement).value);
    window.dispatchEvent(new CustomEvent('city-changed', { detail: state.selectedCity }));
  });

  // Admin Logout
  const logoutBtn = document.getElementById('admin-logout-btn');
  logoutBtn?.addEventListener('click', async () => {
    localStorage.removeItem('cineverse_admin_token');
    window.location.hash = '#/admin/login';
  });
}
