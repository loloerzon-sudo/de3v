// Windows XP Error Dialogs, Nerzon Antivirus 2003, and Live Activity Ticker
import { playErrorSound, playClickSound, playDingSound } from './audio.js';
import { showToast } from './generator.js';

const errorMessages = [
  'Error 404: <div> could not be centered.',
  'Task failed successfully.',
  'Warning: Too much good taste detected. Downgrading to Comic Sans...',
  'Safari.exe has encountered an unexpected flexbox bug.',
  'Warning: Portfolio is suspiciously fast. Add 40 tracking pixels?',
  'Keyboard not detected. Press F1 to continue.',
  'Fatal: User tried to edit CSS without !important.',
  'Notice: Your website looks better in Netscape Navigator.'
];

let activeErrors = 0;
const MAX_ERRORS = 4;

export function initErrors() {
  // Spawn first error after 12 seconds
  setTimeout(() => {
    spawnErrorDialog();
  }, 12000);

  // Periodically spawn errors
  setInterval(() => {
    if (Math.random() > 0.45 && activeErrors < MAX_ERRORS) {
      spawnErrorDialog();
    }
  }, 22000);

  // Init Antivirus Modal
  initAntivirus();

  // Init Live Activity Social Proof Ticker
  initActivityTicker();
}

function spawnErrorDialog() {
  if (activeErrors >= MAX_ERRORS) return;
  activeErrors++;

  playErrorSound();

  const msg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
  const dialog = document.createElement('div');
  dialog.className = 'win-dialog';

  // Random positioning within viewport
  const top = Math.max(80, Math.floor(Math.random() * (window.innerHeight - 250)));
  const left = Math.max(20, Math.floor(Math.random() * (window.innerWidth - 340)));
  dialog.style.top = `${top}px`;
  dialog.style.left = `${left}px`;

  dialog.innerHTML = `
    <div class="win-titlebar">
      <span>⚠️ NerzonWeb System Alert</span>
      <button class="win-close-btn" data-close>×</button>
    </div>
    <div class="win-body">
      <div class="win-icon">❌</div>
      <div class="win-msg">${msg}</div>
    </div>
    <div class="win-footer">
      <button class="win-btn" data-close>OK</button>
      <button class="win-btn" data-close>Cancel</button>
    </div>
  `;

  document.body.appendChild(dialog);

  // Close handler
  dialog.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClickSound();
      dialog.remove();
      activeErrors = Math.max(0, activeErrors - 1);
    });
  });

  // Simple drag support
  makeDraggable(dialog);
}

function makeDraggable(el) {
  const titlebar = el.querySelector('.win-titlebar');
  if (!titlebar) return;

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titlebar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.zIndex = '999999';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    el.style.left = `${e.clientX - offsetX}px`;
    el.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function initAntivirus() {
  const modal = document.getElementById('antivirus-modal');
  const openBtns = document.querySelectorAll('[data-open-antivirus]');
  const closeBtn = document.getElementById('antivirus-close');
  const removeBtn = document.getElementById('antivirus-remove');
  const virusList = document.getElementById('virus-list');
  const virusCount = document.getElementById('virus-count');
  const virusFill = document.getElementById('virus-fill');

  if (!modal) return;

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playClickSound();
      modal.hidden = false;
      startScan();
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.hidden = true;
  });

  removeBtn.addEventListener('click', () => {
    playDingSound();
    modal.hidden = true;
    showToast('🛡️ All bloated CSS and agency invoices cleaned! Website is 100% healthy.');
  });

  const viruses = [
    'NodeModules.Heavy.Worm (1.4 GB)',
    'Agency_10k_Invoice.trojan',
    'Flexbox.Broken.dll',
    'Tailwind_Overdose.vbs',
    'Wordpress_Spaghetti.scr',
    'Comic.Sans.Infection'
  ];

  function startScan() {
    virusList.innerHTML = '';
    virusCount.textContent = '0';
    virusFill.style.width = '0%';

    let count = 0;
    const interval = setInterval(() => {
      count++;
      virusFill.style.width = `${Math.min(100, count * 18)}%`;
      virusCount.textContent = String(count);

      const li = document.createElement('li');
      li.innerHTML = `🦠 <b>${viruses[(count - 1) % viruses.length]}</b> detected!`;
      virusList.appendChild(li);

      if (count >= viruses.length) {
        clearInterval(interval);
        playErrorSound();
      }
    }, 450);
  }
}

function initActivityTicker() {
  const ticker = document.createElement('div');
  ticker.className = 'activity-ticker';
  ticker.id = 'activity-ticker';
  ticker.title = 'Click to dismiss';
  document.body.appendChild(ticker);

  // Click anywhere to dismiss immediately
  ticker.addEventListener('click', () => {
    ticker.classList.remove('show');
  });

  const activities = [
    'Someone in Ohio just bought 10x Dev tier 14s ago',
    'Someone in London just paid an agency $10,000 for a broken template 45s ago',
    'Someone in California just added 50 !important statements to CSS',
    'Someone in Singapore just booked Nerzon for portfolio redesign 2m ago',
    'Someone in Sydney centered a <div> on the first try (unconfirmed rumor)',
    'Someone in Toronto just called Nerzon’s hotline to ask for bigger logos'
  ];

  let actIdx = 0;
  let hideTimer = null;

  setInterval(() => {
    ticker.innerHTML = `<span>🔔 ${activities[actIdx % activities.length]}</span> <button class="ticker-close-btn" style="background:none;border:none;cursor:pointer;font-weight:bold;margin-left:8px;font-size:12px;">✕</button>`;
    
    const closeBtn = ticker.querySelector('.ticker-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        ticker.classList.remove('show');
      });
    }

    ticker.classList.remove('show');
    void ticker.offsetWidth; // Trigger reflow
    ticker.classList.add('show');
    actIdx++;

    // Automatically hide after 4 seconds so it never gets stuck
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      ticker.classList.remove('show');
    }, 4000);
  }, 12000);
}
