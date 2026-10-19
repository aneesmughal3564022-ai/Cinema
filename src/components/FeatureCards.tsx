import React from 'react';
import { FEATURE_CARDS_IMAGES } from '../utils/images';

interface FeatureCardsProps {
  onOpenExperience: () => void;
  onOpenPolicy: () => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({
  onOpenExperience,
  onOpenPolicy
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-6 relative z-20 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4 p-2 sm:p-2.5 rounded-2xl bg-gradient-to-b from-[#161c28]/95 to-[#070a10]/95 border border-amber-500/35 backdrop-blur-2xl shadow-2xl">
        
        {/* Card 1: Our Theaters with VIP Recliner matching Screenshot */}
        <div 
          onClick={onOpenExperience}
          className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#0a0e18]/80 p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 hover:border-amber-400/50 hover:bg-[#0f1524] transition-all duration-300 cursor-pointer"
        >
          <div className="space-y-1 sm:space-y-1.5 max-w-[65%]">
            <h3 className="text-xs sm:text-sm font-black font-heading text-white tracking-wider leading-tight group-hover:text-amber-400 transition-colors">
              OUR<br />THEATERS
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug line-clamp-2">
              Showcasing world-class luxury recliners, Dolby Atmos sound & 4K laser.
            </p>
          </div>
          <div className="w-20 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg bg-black">
            <img 
              src={FEATURE_CARDS_IMAGES.theaters} 
              alt="VIP Recliner" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        </div>

        {/* Card 2: Ticket & Booking Policy with Gold Ticket matching Screenshot */}
        <div 
          onClick={onOpenPolicy}
          className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#0a0e18]/80 p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 hover:border-amber-400/50 hover:bg-[#0f1524] transition-all duration-300 cursor-pointer"
        >
          <div className="space-y-1 sm:space-y-1.5 max-w-[65%]">
            <h3 className="text-xs sm:text-sm font-black font-heading text-white tracking-wider leading-tight group-hover:text-amber-400 transition-colors">
              TICKET &<br />BOOKING POLICY
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug line-clamp-2">
              Instant digital QR tickets, easy free cancellations up to 3 hours prior.
            </p>
          </div>
          <div className="w-20 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg bg-black">
            <img 
              src={FEATURE_CARDS_IMAGES.policy} 
              alt="Gold Ticket" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        </div>

        {/* Card 3: Cinema Operations with IMAX Screen matching Screenshot */}
        <div 
          onClick={onOpenExperience}
          className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#0a0e18]/80 p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 hover:border-amber-400/50 hover:bg-[#0f1524] transition-all duration-300 cursor-pointer"
        >
          <div className="space-y-1 sm:space-y-1.5 max-w-[65%]">
            <h3 className="text-xs sm:text-sm font-black font-heading text-white tracking-wider leading-tight group-hover:text-amber-400 transition-colors">
              CINEMA<br />OPERATIONS
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-snug line-clamp-2">
              Multi-screen scheduling, live seat holds & box office management.
            </p>
          </div>
          <div className="w-20 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg bg-black">
            <img 
              src={FEATURE_CARDS_IMAGES.operations} 
              alt="IMAX Screen" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        </div>

      </div>
    </section>
  );
};
