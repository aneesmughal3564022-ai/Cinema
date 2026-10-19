import './index.css';
import { navigate } from './router.js';

// Initialize routing
window.addEventListener('DOMContentLoaded', () => {
  navigate();
});

window.addEventListener('hashchange', () => {
  navigate();
});

window.addEventListener('city-changed', () => {
  navigate();
});
