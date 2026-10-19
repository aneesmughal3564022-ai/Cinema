import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

interface CinemaFooterProps {
  onOpenPolicy: () => void;
  onOpenTicketLookup: () => void;
}

export const CinemaFooter: React.FC<CinemaFooterProps> = ({ onOpenPolicy, onOpenTicketLookup }) => {
  return (
    <footer className="border-t border-white/10 bg-[#04060a] text-slate-400 mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mb-8 sm:mb-12">
          
          {/* Col 1: Brand & Contact */}
          <div className="space-y-3">
            <div className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
              <span className="gold-gradient-text">CINE</span>VERSE
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                PK
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pakistan's premier luxury cinema destination. Featuring Royal IMAX with Laser, Dolby Atmos 7.1, and VIP Gold Class Lounges across Karachi, Lahore, and Islamabad.
            </p>
            <div className="text-xs text-slate-300 font-mono pt-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Helpline: <strong className="text-amber-400">+92 (21) 111-246-382</strong></span>
            </div>
          </div>

          {/* Col 2: Locations */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-2.5 sm:mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Our Cinema Theaters
            </h4>
            <ul className="text-xs space-y-1.5 sm:space-y-2 text-slate-400">
              <li>Karachi &middot; Clifton Beachfront Royal IMAX</li>
              <li>Lahore &middot; Gulberg Heights Gold Class Lounge</li>
              <li>Islamabad &middot; Centaurus Mall Mega Multiplex</li>
              <li>Rawalpindi &middot; Bahria Town Arena (Opening Soon)</li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-2.5 sm:mb-3">
              Ticket & Booking Policy
            </h4>
            <ul className="text-xs space-y-1.5 sm:space-y-2 text-slate-400">
              <li>
                <button onClick={onOpenTicketLookup} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Find My Digital Ticket
                </button>
              </li>
              <li>
                <button onClick={onOpenPolicy} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Free Cancellation Policy
                </button>
              </li>
              <li><span>JazzCash, Easypaisa & Direct Debit</span></li>
              <li><span>Special Family & VIP Screenings</span></li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-2.5 sm:mb-3 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Cinema Operations
            </h4>
            <ul className="text-xs space-y-1.5 sm:space-y-2 text-slate-400">
              <li><a href="#/admin" className="hover:text-amber-400 transition-colors">Box Office Admin Portal</a></li>
              <li><span>Turnstile QR Validation</span></li>
              <li><span>Inquiries: boxoffice@cineverse.pk</span></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} CineVerse Pakistan Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-3 sm:gap-6">
            <span>Atomic Seat Locking</span>
            <span>256-bit SSL</span>
            <a href="#/admin" className="text-slate-500 hover:text-slate-300 transition-colors">Admin Login</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
