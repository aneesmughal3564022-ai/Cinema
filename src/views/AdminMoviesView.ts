import { api } from '../api.js';
import { Movie } from '../types.js';
import { renderAdminLayout } from './AdminLayout.js';
import { showToast } from '../components/Toast.js';
import { renderImage, getMoviePosterUrl } from '../utils/images.js';

let moviesList: Movie[] = [];

export async function renderAdminMoviesView(): Promise<string> {
  const isAuth = await api.checkAdminAuth();
  if (!isAuth) {
    window.location.hash = '#/admin/login';
    return '';
  }

  try {
    moviesList = await api.getAdminMovies();
  } catch (e: any) {
    return renderAdminLayout('Movie Catalog Management', `
      <div class="p-8 text-center text-xs text-rose-400">Failed to load movies: ${e.message}</div>
    `);
  }

  const content = `
    <div class="space-y-6">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-sm">
          <input
            id="admin-movie-search"
            type="text"
            placeholder="Search movie catalog..."
            class="w-full bg-slate-900 border border-slate-700/80 text-xs text-white pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-amber-400"
          />
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-500">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        <button
          id="open-add-movie-modal-btn"
          class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add New Movie
        </button>
      </div>

      <!-- Movies Table -->
      <div class="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] bg-slate-950/40">
                <th class="py-3 px-4">Movie</th>
                <th class="py-3 px-4">Language & Rating</th>
                <th class="py-3 px-4">Duration</th>
                <th class="py-3 px-4">Genres</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-movies-tbody" class="divide-y divide-slate-800/60">
              ${renderMovieRows(moviesList)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Movie Modal (Embedded) -->
      <div id="movie-modal" class="hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-[#0B1120] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 id="modal-title" class="text-base font-bold font-heading text-white">Add New Movie</h3>
            <button id="close-movie-modal-btn" class="text-slate-400 hover:text-white">&times;</button>
          </div>

          <form id="movie-form" class="space-y-3.5 text-xs">
            <input type="hidden" id="form-movie-id" value="" />

            <div>
              <label class="block font-medium text-slate-300 mb-1">Movie Title *</label>
              <input id="form-title" type="text" required class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-medium text-slate-300 mb-1">Duration (Minutes) *</label>
                <input id="form-duration" type="number" min="30" max="360" value="130" required class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label class="block font-medium text-slate-300 mb-1">Content Rating *</label>
                <select id="form-rating" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400">
                  <option value="U">U (Universal / All Ages)</option>
                  <option value="PG-13">PG-13 (Parents Strongly Cautioned)</option>
                  <option value="A">A (Adults / 18+)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-medium text-slate-300 mb-1">Language *</label>
                <input id="form-language" type="text" value="Urdu" required class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label class="block font-medium text-slate-300 mb-1">Release Date</label>
                <input id="form-release" type="date" value="${new Date().toISOString().slice(0, 10)}" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-400" />
              </div>
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Director *</label>
              <input id="form-director" type="text" required class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400" />
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Lead Cast (comma separated)</label>
              <input id="form-cast" type="text" placeholder="Fawad Khan, Mahira Khan" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400" />
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Genres (comma separated)</label>
              <input id="form-genre" type="text" value="Action, Drama" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400" />
            </div>

            <div>
              <label class="block font-medium text-slate-300 mb-1">Synopsis *</label>
              <textarea id="form-synopsis" rows="3" required class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"></textarea>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" id="cancel-movie-btn" class="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white">Cancel</button>
              <button type="submit" id="save-movie-btn" class="px-5 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold uppercase tracking-wider">Save Movie</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `;

  return renderAdminLayout('Movie Catalog Management', content);
}

function renderMovieRows(movies: Movie[]): string {
  if (!movies.length) {
    return `<tr><td colspan="6" class="p-8 text-center text-slate-500">No movies found in catalog.</td></tr>`;
  }

  return movies.map(m => `
    <tr class="hover:bg-slate-800/40 transition-colors">
      <td class="py-3 px-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-14 rounded-lg overflow-hidden glass-panel shrink-0 border border-white/10">
            ${renderImage({
              src: getMoviePosterUrl(m.id, m.posterUrl),
              alt: m.title,
              className: 'w-full h-full object-cover',
              loading: 'lazy'
            })}
          </div>
          <div>
            <span class="font-bold text-white block">${escapeHtml(m.title)}</span>
            <span class="text-[10px] text-slate-400">${escapeHtml(m.director)}</span>
          </div>
        </div>
      </td>
      <td class="py-3 px-4">
        <span class="font-bold text-amber-400 font-mono">${m.contentRating}</span> &middot;
        <span class="text-slate-300">${m.language}</span>
      </td>
      <td class="py-3 px-4 font-mono text-slate-300">${m.durationMinutes} min</td>
      <td class="py-3 px-4 text-slate-400">${m.genre.join(', ')}</td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${
          m.status === 'now-showing' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
          m.status === 'upcoming' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
          'bg-slate-800 text-slate-400'
        }">
          ${m.status.toUpperCase()}
        </span>
      </td>
      <td class="py-3 px-4 text-right space-x-2">
        <button
          data-edit-id="${m.id}"
          class="edit-movie-btn text-amber-400 hover:text-amber-300 transition-colors"
        >
          Edit
        </button>
        ${m.status !== 'archived' ? `
          <button
            data-archive-id="${m.id}"
            class="archive-movie-btn text-rose-400 hover:text-rose-300 transition-colors"
          >
            Archive
          </button>
        ` : ''}
      </td>
    </tr>
  `).join('');
}

export function attachAdminMoviesEvents(): void {
  const modal = document.getElementById('movie-modal');
  const openModalBtn = document.getElementById('open-add-movie-modal-btn');
  const closeModalBtn = document.getElementById('close-movie-modal-btn');
  const cancelBtn = document.getElementById('cancel-movie-btn');
  const form = document.getElementById('movie-form') as HTMLFormElement | null;
  const searchInput = document.getElementById('admin-movie-search') as HTMLInputElement | null;

  openModalBtn?.addEventListener('click', () => {
    if (form) form.reset();
    (document.getElementById('form-movie-id') as HTMLInputElement).value = '';
    (document.getElementById('modal-title') as HTMLElement).textContent = 'Add New Movie';
    modal?.classList.remove('hidden');
  });

  closeModalBtn?.addEventListener('click', () => modal?.classList.add('hidden'));
  cancelBtn?.addEventListener('click', () => modal?.classList.add('hidden'));

  // Search filter
  searchInput?.addEventListener('input', (e) => {
    const q = (e.target as HTMLInputElement).value.toLowerCase();
    const filtered = moviesList.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.director.toLowerCase().includes(q)
    );
    const tbody = document.getElementById('admin-movies-tbody');
    if (tbody) tbody.innerHTML = renderMovieRows(filtered);
    attachRowActions();
  });

  // Form submit
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const movieId = (document.getElementById('form-movie-id') as HTMLInputElement).value;
    const title = (document.getElementById('form-title') as HTMLInputElement).value.trim();
    const duration = parseInt((document.getElementById('form-duration') as HTMLInputElement).value, 10);
    const rating = (document.getElementById('form-rating') as HTMLSelectElement).value as any;
    const language = (document.getElementById('form-language') as HTMLInputElement).value.trim();
    const releaseDate = (document.getElementById('form-release') as HTMLInputElement).value;
    const director = (document.getElementById('form-director') as HTMLInputElement).value.trim();
    const cast = (document.getElementById('form-cast') as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean);
    const genre = (document.getElementById('form-genre') as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean);
    const synopsis = (document.getElementById('form-synopsis') as HTMLTextAreaElement).value.trim();

    try {
      if (movieId) {
        await api.updateMovie(movieId, { title, durationMinutes: duration, contentRating: rating, language, releaseDate, director, cast, genre, synopsis });
        showToast('Movie updated successfully!', 'success');
      } else {
        await api.createMovie({ title, durationMinutes: duration, contentRating: rating, language, releaseDate, director, cast, genre, synopsis, status: 'now-showing' });
        showToast('Movie added to catalog!', 'success');
      }
      modal?.classList.add('hidden');
      window.location.hash = '#/admin/movies';
    } catch (err: any) {
      showToast(err.message || 'Failed to save movie.', 'error');
    }
  });

  attachRowActions();
}

function attachRowActions() {
  document.querySelectorAll('.edit-movie-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-edit-id');
      const movie = moviesList.find(m => m.id === id);
      if (!movie) return;

      (document.getElementById('form-movie-id') as HTMLInputElement).value = movie.id;
      (document.getElementById('form-title') as HTMLInputElement).value = movie.title;
      (document.getElementById('form-duration') as HTMLInputElement).value = movie.durationMinutes.toString();
      (document.getElementById('form-rating') as HTMLSelectElement).value = movie.contentRating;
      (document.getElementById('form-language') as HTMLInputElement).value = movie.language;
      (document.getElementById('form-release') as HTMLInputElement).value = movie.releaseDate;
      (document.getElementById('form-director') as HTMLInputElement).value = movie.director;
      (document.getElementById('form-cast') as HTMLInputElement).value = movie.cast.join(', ');
      (document.getElementById('form-genre') as HTMLInputElement).value = movie.genre.join(', ');
      (document.getElementById('form-synopsis') as HTMLTextAreaElement).value = movie.synopsis;
      (document.getElementById('modal-title') as HTMLElement).textContent = 'Edit Movie';

      document.getElementById('movie-modal')?.classList.remove('hidden');
    });
  });

  document.querySelectorAll('.archive-movie-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-archive-id');
      if (!id) return;
      if (!confirm('Are you sure you want to archive this movie? It will be removed from public showtimes.')) return;

      try {
        const res = await api.archiveMovie(id);
        showToast(res.message, 'success');
        window.location.hash = '#/admin/movies';
      } catch (err: any) {
        showToast(err.message || 'Failed to archive movie.', 'error');
      }
    });
  });
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case '\'': return '&#39;';
      default: return m;
    }
  });
}
