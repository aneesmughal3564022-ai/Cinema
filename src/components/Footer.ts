export function renderFooter(): string {
  const currentHash = window.location.hash || '#/';
  if (currentHash.startsWith('#/admin')) {
    return `
      <footer class="border-t border-slate-800 bg-[#0B1120] py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>CineVerse Pakistan Operational Management System &middot; v1.0 Production</div>
        <div class="font-mono">Timezone: Asia/Karachi (PKT) &middot; Currency: PKR (Rs.)</div>
      </footer>
    `;
  }

  return `
    <footer class="border-t border-slate-800/80 bg-[#060910] text-slate-400 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <!-- Col 1: Brand & Contact -->
          <div class="space-y-3">
            <a href="#/" class="text-xl font-extrabold font-heading text-white flex items-center gap-2">
              <span class="text-amber-400">CINE</span>VERSE
              <span class="text-[10px] uppercase font-mono tracking-widest text-amber-300/80 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">PK</span>
            </a>
            <p class="text-xs text-slate-400 leading-relaxed">
              Pakistan's premier luxury cinema destination. Featuring Royal IMAX with Laser, Dolby Atmos 7.1, and VIP Gold Class Lounges across Karachi, Lahore, and Islamabad.
            </p>
            <div class="text-xs text-slate-300 font-mono pt-1">
              Helpline: <span class="text-amber-400">+92 (21) 111-246-382</span>
            </div>
          </div>

          <!-- Col 2: Locations in Pakistan -->
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Our Cinema Theaters</h4>
            <ul class="text-xs space-y-2 text-slate-400">
              <li>Karachi &middot; Clifton Beachfront Luxury IMAX</li>
              <li>Lahore &middot; Gulberg Heights Gold Lounge</li>
              <li>Islamabad &middot; Centaurus Mall Mega Multiplex</li>
              <li>Rawalpindi &middot; Bahria Town Arena (Opening Soon)</li>
            </ul>
          </div>

          <!-- Col 3: Customer Care -->
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Ticket & Booking Policy</h4>
            <ul class="text-xs space-y-2 text-slate-400">
              <li><a href="#/my-tickets" class="hover:text-amber-400 transition-colors">Find My Digital Ticket</a></li>
              <li><span>Free Cancellation up to 3 Hours Prior</span></li>
              <li><span>JazzCash, Easypaisa & Box Office Accepted</span></li>
              <li><span>Special Student & Family Screenings</span></li>
            </ul>
          </div>

          <!-- Col 4: Quick Links & Admin -->
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Cinema Operations</h4>
            <ul class="text-xs space-y-2 text-slate-400">
              <li><a href="#/admin" class="hover:text-amber-400 transition-colors">Box Office Admin Portal</a></li>
              <li><a href="#/my-tickets" class="hover:text-amber-400 transition-colors">Ticket Verification</a></li>
              <li><span>Contact: boxoffice@cineverse.pk</span></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; ${new Date().getFullYear()} CineVerse Pakistan Ltd. All rights reserved.</p>
          <div class="flex items-center gap-6">
            <span>Payment Security Verified</span>
            <span>Server-side Atomic Locking</span>
            <a href="#/admin" class="text-slate-500 hover:text-slate-300 transition-colors">Admin Login</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
