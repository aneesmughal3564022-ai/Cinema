import React, { useState } from 'react';
import { Movie, CityName, BookingTicket } from '../types/cinema';
import { CINEMA_LOCATIONS } from '../data/moviesData';
import { X, Check, Clock, Calendar, QrCode } from 'lucide-react';

interface BookingModalProps {
  movie: Movie;
  selectedCity: CityName;
  onClose: () => void;
  onTicketGenerated: (ticket: BookingTicket) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  movie,
  selectedCity,
  onClose,
  onTicketGenerated
}) => {
  const [step, setStep] = useState<'time' | 'seats' | 'checkout' | 'success'>('time');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState(movie.showtimes?.[0] || '18:00');
  const [selectedFormat, setSelectedFormat] = useState(movie.formats?.[0] || 'IMAX Dual Laser 3D');
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['D-5', 'D-6']);
  const [customerName, setCustomerName] = useState('Hamza Tariq');
  const [customerPhone, setCustomerPhone] = useState('03001234567');
  const [paymentMethod, setPaymentMethod] = useState<'jazzcash' | 'easypaisa' | 'card'>('jazzcash');
  const [generatedTicket, setGeneratedTicket] = useState<BookingTicket | null>(null);

  const cinema = CINEMA_LOCATIONS[selectedCity];
  const seatPrice = (movie.startingPrice || 1200);
  const convenienceFee = 50 * selectedSeats.length;
  const totalPrice = (seatPrice * selectedSeats.length) + convenienceFee;

  const dates = [
    { label: 'Today', day: '19', month: 'OCT' },
    { label: 'Tomorrow', day: '20', month: 'OCT' },
    { label: 'Wed', day: '21', month: 'OCT' },
    { label: 'Thu', day: '22', month: 'OCT' }
  ];

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 6) return;
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmBooking = () => {
    const ref = `CVP-${selectedCity.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticket: BookingTicket = {
      reference: ref,
      movieTitle: movie.title,
      movieId: movie.id,
      city: selectedCity,
      theater: cinema.name,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats,
      totalPrice,
      customerName,
      customerPhone,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setGeneratedTicket(ticket);
    onTicketGenerated(ticket);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c121d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#080d16]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <h2 className="text-base font-bold font-heading text-white">{movie.title}</h2>
              <p className="text-[11px] font-mono text-amber-400">
                {cinema.name} &middot; {selectedCity}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="grid grid-cols-3 border-b border-white/5 text-center text-xs font-mono font-semibold py-2.5 bg-[#090e18]">
          <span className={step === 'time' ? 'text-amber-400 font-bold' : 'text-slate-500'}>
            1. Showtime
          </span>
          <span className={step === 'seats' ? 'text-amber-400 font-bold' : 'text-slate-500'}>
            2. Seats ({selectedSeats.length})
          </span>
          <span className={step === 'checkout' || step === 'success' ? 'text-amber-400 font-bold' : 'text-slate-500'}>
            3. E-Ticket
          </span>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {step === 'time' && (
            <div className="space-y-6">
              {/* Select Date */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Select Screening Date
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {dates.map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setSelectedDate(d.label)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedDate === d.label
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-400/20'
                          : 'bg-[#090d16] border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <span className="block text-[10px] uppercase">{d.label}</span>
                      <span className="block text-lg font-black font-heading mt-0.5">{d.day}</span>
                      <span className="block text-[9px] font-mono">{d.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Format */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Auditorium Experience
                </label>
                <div className="flex flex-wrap gap-2">
                  {(movie.formats || ['IMAX Dual Laser 3D', 'VIP Gold Lounge']).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedFormat === fmt
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                          : 'bg-[#090d16] border border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Showtimes */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Available Showtimes
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(movie.showtimes || ['15:00', '18:15', '21:30']).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedTime === time
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 font-bold shadow-md'
                          : 'bg-[#090d16] border-white/10 text-slate-200 hover:border-amber-400/40'
                      }`}
                    >
                      <span className="block text-base font-black font-mono">{time}</span>
                      <span className="block text-[10px] font-mono text-amber-400/90 mt-0.5">
                        Rs. {seatPrice.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'seats' && (
            <div className="space-y-6">
              {/* Curved Screen Indicator */}
              <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-md h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-t-full shadow-lg shadow-amber-400/30" />
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-1">
                  IMAX LASER SCREEN
                </span>
              </div>

              {/* Seat Grid */}
              <div className="space-y-2 max-w-md mx-auto py-2">
                {['A', 'B', 'C', 'D', 'E', 'F'].map((row) => (
                  <div key={row} className="flex items-center justify-center gap-1.5">
                    <span className="w-5 text-[11px] font-mono text-slate-500 text-center font-bold">{row}</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                        const seatId = `${row}-${num}`;
                        const isSelected = selectedSeats.includes(seatId);
                        const isBooked = (row === 'B' && num === 4) || (row === 'C' && num === 5);
                        return (
                          <button
                            key={seatId}
                            disabled={isBooked}
                            onClick={() => toggleSeat(seatId)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                              isBooked
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-40'
                                : isSelected
                                ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/30 scale-105'
                                : 'bg-[#141b29] hover:bg-slate-700 text-slate-300 border border-white/5'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center items-center gap-6 text-[11px] font-mono pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-[#141b29] border border-white/10" />
                  <span className="text-slate-400">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-amber-400" />
                  <span className="text-amber-300 font-semibold">Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-slate-800 opacity-40" />
                  <span className="text-slate-500">Booked</span>
                </div>
              </div>
            </div>
          )}

          {step === 'checkout' && (
            <div className="space-y-5">
              <div className="bg-[#080d16] p-4 rounded-2xl border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Screening:</span>
                  <span className="text-white font-semibold">{movie.title} &middot; {selectedTime}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Selected Seats ({selectedSeats.length}):</span>
                  <span className="text-amber-400 font-mono font-bold">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Cinema Hall:</span>
                  <span className="text-slate-300">{cinema.name} ({selectedCity})</span>
                </div>
                <div className="border-t border-white/5 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-white">Total Payable (PKR):</span>
                  <span className="text-amber-400 font-mono text-base">Rs. {totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#080d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Mobile (JazzCash/Easypaisa)</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#080d16] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">Instant Pakistani Payment Gateway</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('jazzcash')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'jazzcash'
                        ? 'border-amber-400 bg-amber-400/15 text-amber-300 font-bold'
                        : 'border-white/5 bg-[#080d16] text-slate-400'
                    }`}
                  >
                    <span className="block text-xs font-black">JazzCash</span>
                    <span className="text-[10px] text-slate-500">Mobile Wallet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('easypaisa')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'easypaisa'
                        ? 'border-amber-400 bg-amber-400/15 text-amber-300 font-bold'
                        : 'border-white/5 bg-[#080d16] text-slate-400'
                    }`}
                  >
                    <span className="block text-xs font-black">Easypaisa</span>
                    <span className="text-[10px] text-slate-500">Direct PIN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-amber-400 bg-amber-400/15 text-amber-300 font-bold'
                        : 'border-white/5 bg-[#080d16] text-slate-400'
                    }`}
                  >
                    <span className="block text-xs font-black">Debit/Credit</span>
                    <span className="text-[10px] text-slate-500">Visa / Master</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && generatedTicket && (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <Check className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-white">Booking Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your digital ticket has been issued with atomic seat reservation.
                </p>
              </div>

              {/* Ticket Boarding Pass Card */}
              <div className="bg-gradient-to-br from-[#121826] to-[#0a0f18] p-6 rounded-2xl border border-amber-500/30 text-left space-y-4 max-w-md mx-auto shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">CINEVERSE PAKISTAN E-TICKET</span>
                    <h4 className="text-lg font-black font-heading text-white mt-0.5">{generatedTicket.movieTitle}</h4>
                    <p className="text-xs text-slate-400">{generatedTicket.theater} &middot; {generatedTicket.city}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
                    <QrCode className="w-full h-full text-slate-950" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">TIME</span>
                    <span className="text-white font-bold">{generatedTicket.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">SEATS</span>
                    <span className="text-amber-400 font-bold">{generatedTicket.seats.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">REFERENCE</span>
                    <span className="text-slate-300 font-bold">{generatedTicket.reference}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-dashed border-white/10 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Booked for: <strong className="text-white">{generatedTicket.customerName}</strong></span>
                  <span className="text-amber-400 font-mono font-bold">Rs. {generatedTicket.totalPrice.toLocaleString()} PKR</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#080d16]">
          {step === 'time' && (
            <>
              <div className="text-xs font-mono text-slate-400">
                Format: <span className="text-amber-400 font-bold">{selectedFormat}</span>
              </div>
              <button
                onClick={() => setStep('seats')}
                className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Continue to Seats &rarr;
              </button>
            </>
          )}

          {step === 'seats' && (
            <>
              <button
                onClick={() => setStep('time')}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                &larr; Back
              </button>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-amber-400">
                  {selectedSeats.length} Seats &middot; Rs. {totalPrice.toLocaleString()}
                </span>
                <button
                  disabled={selectedSeats.length === 0}
                  onClick={() => setStep('checkout')}
                  className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  Checkout &rarr;
                </button>
              </div>
            </>
          )}

          {step === 'checkout' && (
            <>
              <button
                onClick={() => setStep('seats')}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                &larr; Back
              </button>
              <button
                onClick={handleConfirmBooking}
                className="btn-gold-luxury px-7 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-amber-400/20"
              >
                Pay & Issue QR Ticket
              </button>
            </>
          )}

          {step === 'success' && (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="btn-gold-luxury px-8 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
