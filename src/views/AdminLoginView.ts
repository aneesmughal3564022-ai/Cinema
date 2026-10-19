import { api } from '../api.js';
import { showToast } from '../components/Toast.js';

export async function renderAdminLoginView(): Promise<string> {
  const isAuth = await api.checkAdminAuth();
  if (isAuth) {
    window.location.hash = '#/admin/dashboard';
    return '';
  }

  return `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md bg-[#0B1120] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
          </div>
          <h1 class="text-2xl font-bold font-heading text-white">Cinema Operations Login</h1>
          <p class="text-xs text-slate-400">
            Authorized administrative access for CineVerse Pakistan.
          </p>
        </div>

        <!-- Form -->
        <form id="admin-login-form" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              value="admin@cineverse.pk"
              readonly
              class="w-full bg-slate-950/60 border border-slate-800 text-slate-400 text-xs px-3.5 py-2.5 rounded-lg cursor-not-allowed font-mono"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-semibold text-slate-300">Password</label>
              <button type="button" id="toggle-pwd-btn" class="text-[11px] text-amber-400 hover:text-amber-300">Show</button>
            </div>
            <input
              id="admin-pwd"
              type="password"
              placeholder="Enter admin password"
              value="CinemaAdmin2026!"
              required
              class="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-amber-400 font-mono transition-colors"
            />
          </div>

          <!-- Quick Fill Demo Helper -->
          <div class="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Demo: <span class="text-amber-300 font-mono">CinemaAdmin2026!</span></span>
            <button
              type="button"
              id="quick-demo-btn"
              class="text-amber-400 font-medium hover:underline text-[11px]"
            >
              Fill Credentials
            </button>
          </div>

          <button
            type="submit"
            id="admin-submit-btn"
            class="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to Dashboard</span>
          </button>
        </form>

        <div class="text-center pt-2">
          <a href="#/" class="text-xs text-slate-500 hover:text-slate-400 transition-colors">
            &larr; Back to Public Website
          </a>
        </div>

      </div>
    </div>
  `;
}

export function attachAdminLoginEvents(): void {
  const form = document.getElementById('admin-login-form');
  const pwdInput = document.getElementById('admin-pwd') as HTMLInputElement | null;
  const toggleBtn = document.getElementById('toggle-pwd-btn');
  const quickDemoBtn = document.getElementById('quick-demo-btn');
  const submitBtn = document.getElementById('admin-submit-btn') as HTMLButtonElement | null;

  toggleBtn?.addEventListener('click', () => {
    if (!pwdInput) return;
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      toggleBtn.textContent = 'Hide';
    } else {
      pwdInput.type = 'password';
      toggleBtn.textContent = 'Show';
    }
  });

  quickDemoBtn?.addEventListener('click', () => {
    if (pwdInput) pwdInput.value = 'CinemaAdmin2026!';
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!pwdInput) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Authenticating...</span>`;
    }

    try {
      await api.adminLogin(pwdInput.value);
      showToast('Welcome back, Administrator!', 'success');
      window.location.hash = '#/admin/dashboard';
    } catch (err: any) {
      showToast(err.message || 'Invalid administrator password.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Sign In to Dashboard</span>`;
      }
    }
  });
}
