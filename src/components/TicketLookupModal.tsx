import React, { useState } from 'react';
import { BookingTicket } from '../types/cinema';
import { X, Search, QrCode, CheckCircle } from 'lucide-react';

interface TicketLookupModalProps {
  onClose: () => void;
  recentTickets: BookingTicket[];
}

export const TicketLookupModal: React.FC<TicketLookupModalProps> = ({
  onClose,
  recentTickets
}) => {
  const [query, setQuery] = useState('');
  const [foundTicket, setFoundTicket] = useState<BookingTicket | null>(recentTickets[0] || null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = query.trim().toUpperCase();
    if (!q) {
      setFoundTicket(recentTickets[0] || null);
      return;
    }
    const match = recentTickets.find(
      t => t.reference.toUpperCase().includes(q) || t.customerPhone.includes(q)
    );
    setFoundTicket(match || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0c121d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#080d16]">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold font-heading text-white">Find My Digital Ticket</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Booking Ref (e.g., CVP-KAR-4821) or Phone"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#080d16] border border-white/10 text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute inset-y-0 left-3 my-auto pointer-events-none" />
            </div>
            <button
              type="submit"
              className="btn-gold-luxury px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

          {foundTicket ? (
            <div className="bg-gradient-to-br from-[#121826] to-[#0a0f18] p-5 rounded-2xl border border-amber-500/30 text-left space-y-4 shadow-xl">
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle className="w-3 h-3" /> VERIFIED DIGITAL PASS
                  </span>
                  <h4 className="text-base font-bold font-heading text-white mt-1">{foundTicket.movieTitle}</h4>
                  <p className="text-xs text-slate-400">{foundTicket.theater} &middot; {foundTicket.city}</p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
                  <QrCode className="w-full h-full text-slate-950" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">TIME</span>
                  <span className="text-white font-bold">{foundTicket.time}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">SEATS</span>
                  <span className="text-amber-400 font-bold">{foundTicket.seats.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">REF NO</span>
                  <span className="text-slate-300 font-bold">{foundTicket.reference}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-white/10 flex justify-between items-center text-xs">
                <span className="text-slate-400">Guest: <strong className="text-white">{foundTicket.customerName}</strong></span>
                <span className="text-amber-400 font-mono font-bold">Rs. {foundTicket.totalPrice.toLocaleString()} PKR</span>
              </div>
            </div>
          ) : searched ? (
            <div className="p-8 text-center glass-panel rounded-2xl text-slate-400 text-xs">
              No active booking found matching "{query}". Try checking your confirmation reference.
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs font-mono">
              Demo sample reference: <strong className="text-amber-400">CVP-KAR-7842</strong>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
