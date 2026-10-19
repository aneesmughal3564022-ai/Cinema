export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md text-sm font-medium transition-all duration-300 transform translate-y-4 opacity-0 max-w-md ${
    type === 'success'
      ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-200'
      : type === 'error'
      ? 'bg-slate-900/95 border-rose-500/40 text-rose-200'
      : 'bg-slate-900/95 border-amber-500/40 text-amber-200'
  }`;

  const iconSvg = type === 'success'
    ? `<svg class="w-5 h-5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`
    : type === 'error'
    ? `<svg class="w-5 h-5 shrink-0 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    : `<svg class="w-5 h-5 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <span class="flex-1">${message}</span>
    <button class="text-slate-400 hover:text-white transition-colors" aria-label="Close">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
  `;

  const closeBtn = toast.querySelector('button');
  closeBtn?.addEventListener('click', () => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 250);
  });

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-4');
  });

  setTimeout(() => {
    if (toast.isConnected) {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 250);
    }
  }, 4500);
}
