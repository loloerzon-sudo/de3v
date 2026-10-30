// Main entry point for Nerzon Parody Portfolio
import './style.css';
import { initBackgroundMusic, playClickSound, playErrorSound, playDingSound } from './audio.js';
import { initGenerator } from './generator.js';
import { initHotline } from './hotline.js';
import { initAssistant } from './assistant.js';
import { initErrors } from './errors.js';
import { initContact, openContactModal } from './contact.js';
import { initCustomCursor } from './cursor.js';
import { initFloatingElements } from './floating.js';
import { initVideoPlayer } from './video-player.js';
import { initSystemProperties } from './system-props.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio and background music
  const musicToggleBtn = document.getElementById('music-toggle');
  initBackgroundMusic(musicToggleBtn);

  // 2. Custom Retro Cursor & Floating Elements
  initCustomCursor();
  initFloatingElements();

  // 3. Initialize Core Modules, Video Player & System Properties
  initVideoPlayer();
  initSystemProperties();
  initGenerator();
  initHotline();
  initAssistant();
  initErrors();
  initContact();

  // 3. Simulated Hit Counter
  initHitCounter();

  // 4. Welcome Message Modal
  initWelcomeModal();

  // 5. Exit-Intent "Wait!!" Modal
  initExitIntent();

  // 6. Pricing Cards Action Binding
  initPricingActions();

  // 7. Click sounds on all buttons and nav links
  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('click', () => {
      playClickSound();
    });
  });
});

function initHitCounter() {
  const counterEl = document.getElementById('visitor-count');
  if (!counterEl) return;

  let count = Number(localStorage.getItem('nerzon_visits') || '1048291');
  count += Math.floor(Math.random() * 3) + 1;
  localStorage.setItem('nerzon_visits', String(count));

  // Format as 12-digit retro counter
  counterEl.textContent = String(count).padStart(12, '0');
}

function initWelcomeModal() {
  const modal = document.getElementById('welcome-modal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('[data-welcome-close]');
  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      playDingSound();
      modal.hidden = true;
    });
  });
}

function initExitIntent() {
  const modal = document.getElementById('exit-modal');
  if (!modal) return;

  let triggered = false;
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !triggered && !modal.dataset.dismissed) {
      triggered = true;
      playErrorSound();
      modal.hidden = false;
    }
  });

  const closeBtns = modal.querySelectorAll('[data-exit-close]');
  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.hidden = true;
      modal.dataset.dismissed = 'true';
    });
  });

  const dealBtn = document.getElementById('exit-deal-btn');
  if (dealBtn) {
    dealBtn.addEventListener('click', () => {
      modal.hidden = true;
      openContactModal('Exit-Intent 0.5% Discount Deal');
    });
  }
}

function initPricingActions() {
  document.querySelectorAll('.btn-buy-plan').forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan') || 'Custom';
      if (plan === 'Enterprise') {
        // Triggers Call Nerzon hotline
        return;
      }
      openContactModal(`Pricing Plan Selected: ${plan}`);
    });
  });
}
