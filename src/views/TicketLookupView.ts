import { api } from '../api.js';
import { showToast } from '../components/Toast.js';

export async function renderTicketLookupView(): Promise<string> {
  return `
    <div class="max-w-xl mx-auto px-4 sm:px-6 py-16 w-full flex-1">
      
      <div class="text-center space-y-2 mb-8">
        <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
        </div>
        <h1 class="text-2xl font-extrabold font-heading text-white">Retrieve Your Digital Ticket</h1>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">
          Enter your unique booking reference and verification phone or email to access your ticket.
        </p>
      </div>

      <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Booking Reference <span class="text-rose-400">*</span>
          </label>
          <input
            id="lookup-ref"
            type="text"
            placeholder="e.g. CVP-PK-7842"
            class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-amber-400 transition-colors"
          />
          <span class="text-[11px] text-slate-500 mt-1 block">Sent via SMS/Email at time of booking</span>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">
            Registered Phone or Email <span class="text-rose-400">*</span>
          </label>
          <input
            id="lookup-contact"
            type="text"
            placeholder="03001234567 or email@domain.com"
            class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          <span class="text-[11px] text-slate-500 mt-1 block">Security verification to protect your personal booking</span>
        </div>

        <button
          id="lookup-submit-btn"
          class="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span>Find Ticket</span>
        </button>

        <div class="border-t border-slate-800 pt-4 text-center">
          <p class="text-[11px] text-slate-400">
            Need urgent assistance? Call CineVerse Box Office Support at <span class="text-amber-400 font-mono">+92 (21) 111-246-382</span>.
          </p>
        </div>
      </div>

    </div>
  `;
}

export function attachTicketLookupEvents(): void {
  const submitBtn = document.getElementById('lookup-submit-btn') as HTMLButtonElement | null;
  submitBtn?.addEventListener('click', async () => {
    const refInput = document.getElementById('lookup-ref') as HTMLInputElement;
    const contactInput = document.getElementById('lookup-contact') as HTMLInputElement;

    const ref = refInput.value.trim();
    const contact = contactInput.value.trim();

    if (!ref || !contact) {
      showToast('Please enter both your booking reference and registered phone or email.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Verifying...</span>`;

    try {
      await api.lookupBooking(ref, contact);
      window.location.hash = `#/confirmation/${ref}?contact=${encodeURIComponent(contact)}`;
    } catch (err: any) {
      showToast(err.message || 'No booking found matching these credentials.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Find Ticket</span>`;
    }
  });
}
