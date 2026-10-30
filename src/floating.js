// Floating Elements Controller for Nerzon Parody Portfolio
// Replaces the old "Nerzon 2003" box with 3 flying retro icons:
// 1. LimeWire (spinning green lime slice)
// 2. Nero Burning ROM (burning flame CD-ROM)
// 3. Floppy Disk (classic 3.5" disk)
// Plus the lost uncentered <div>, hot deal starburst, and ambient particles.

import { playPopSound, playBoingSound, playClickSound } from './audio.js';
import { openContactModal } from './contact.js';

export function initFloatingElements() {
  const container = document.createElement('div');
  container.className = 'floating-ambient-layer';
  container.id = 'floating-layer';
  document.body.appendChild(container);

  // 1. Initialize Flying Retro Elements (LimeWire, Nero, Floppy Disk)
  initFlyingIcons(container);

  // 2. The Lost Floating <div style="???">
  initLostDiv(container);

  // 3. Floating Hot Deal Starburst
  initHotDeal(container);

  // 4. Ambient Falling Money / Sparkles
  initAmbientFloaters(container);
}

// 1. Flying Retro Elements (Replacing old Nerzon 2003 box)
function initFlyingIcons(container) {
  const items = [
    {
      id: 'limewire',
      src: './img/flying-limewire.png',
      alt: 'LimeWire Lime Slice',
      className: 'flying-retro-item flying-limewire',
      w: 68,
      h: 68,
      x: 80,
      y: 120,
      vx: 2.1,
      vy: 1.6,
      rot: 0,
      vRot: 1.2, // Continuous spin like a citrus wheel
      onClick: (e) => {
        playPopSound();
        showFloatToast(e.clientX, e.clientY, '📥 LimeWire: Linkin_Park_In_The_End.mp3.exe (Trojan: 100%!)');
      }
    },
    {
      id: 'nero',
      src: './img/flying-nero.png',
      alt: 'Nero Burning ROM',
      className: 'flying-retro-item flying-nero',
      w: 72,
      h: 72,
      x: Math.max(window.innerWidth - 180, 150),
      y: 160,
      vx: -1.9,
      vy: 2.0,
      rot: 0,
      vRot: -0.6,
      onClick: (e) => {
        playBoingSound();
        showFloatToast(e.clientX, e.clientY, '🔥 Nero Burning ROM: BUFFER UNDERRUN ERROR! 💿 Coaster Created!');
      }
    },
    {
      id: 'floppy',
      src: './img/flying-floppy.png',
      alt: '3.5 Floppy Disk',
      className: 'flying-retro-item flying-floppy',
      w: 64,
      h: 64,
      x: Math.floor(window.innerWidth / 2) - 32,
      y: 75,
      vx: 1.7,
      vy: -1.8,
      rot: -5,
      vRot: 0.4,
      onClick: (e) => {
        playClickSound();
        showFloatToast(e.clientX, e.clientY, '💾 Floppy (A:): Please insert Disk 14 of 42 to install Windows XP!');
      }
    }
  ];

  items.forEach((item) => {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.className = item.className;
    img.id = `flying-${item.id}`;
    container.appendChild(img);
    item.el = img;

    img.addEventListener('click', (e) => {
      e.stopPropagation();
      // Speed boost on click
      item.vx *= 1.35;
      item.vy *= 1.35;
      if (Math.abs(item.vx) > 5) {
        item.vx = 2.0 * Math.sign(item.vx);
        item.vy = 1.8 * Math.sign(item.vy);
      }
      item.onClick(e);
    });
  });

  function update() {
    const maxX = window.innerWidth;
    const maxY = window.innerHeight;

    items.forEach((item) => {
      item.x += item.vx;
      item.y += item.vy;
      item.rot = (item.rot + item.vRot) % 360;

      // Bounce horizontally
      if (item.x <= 0) {
        item.x = 0;
        item.vx = Math.abs(item.vx);
      } else if (item.x + item.w >= maxX) {
        item.x = maxX - item.w;
        item.vx = -Math.abs(item.vx);
      }

      // Bounce vertically (keep below sticky top banner ~42px)
      if (item.y <= 42) {
        item.y = 42;
        item.vy = Math.abs(item.vy);
      } else if (item.y + item.h >= maxY) {
        item.y = maxY - item.h;
        item.vy = -Math.abs(item.vy);
      }

      item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.rot}deg)`;
    });

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// 2. The Lost <div style="???">
function initLostDiv(container) {
  const lost = document.createElement('div');
  lost.className = 'floating-item float-lost-div';
  lost.innerHTML = `
    <code>&lt;div style="???"&gt;</code><br/>
    <span>HELP! CANNOT BE CENTERED!</span><br/>
    <code>&lt;/div&gt;</code>
  `;
  container.appendChild(lost);

  lost.addEventListener('click', (e) => {
    e.stopPropagation();
    playBoingSound();
    showFloatToast(e.clientX, e.clientY, '😱 404: margin: 0 auto not found!');
  });
}

// 3. Floating Hot Deal Starburst
function initHotDeal(container) {
  const hot = document.createElement('div');
  hot.className = 'floating-item float-hot-deal';
  hot.innerHTML = `
    <div class="starburst-inner">
      <span>🔥 HOT! 🔥</span>
      <b>99.4% OFF</b>
      <small>AGENCY PRICE</small>
    </div>
  `;
  container.appendChild(hot);

  hot.addEventListener('click', (e) => {
    e.stopPropagation();
    playClickSound();
    openContactModal('Floating Hot Deal Badge');
  });
}

// 4. Ambient Falling Money / Sparkles
function initAmbientFloaters(container) {
  const icons = ['💸', '⭐', '✨', '☕', '🔥'];

  setInterval(() => {
    if (document.hidden) return;
    const floater = document.createElement('div');
    floater.className = 'ambient-drift-particle';
    floater.textContent = icons[Math.floor(Math.random() * icons.length)];

    const startX = Math.random() * window.innerWidth;
    const duration = 8000 + Math.random() * 6000;
    const size = 18 + Math.floor(Math.random() * 16);

    floater.style.left = `${startX}px`;
    floater.style.top = '-40px';
    floater.style.fontSize = `${size}px`;
    floater.style.animationDuration = `${duration}ms`;

    container.appendChild(floater);

    setTimeout(() => {
      floater.remove();
    }, duration);
  }, 2600);
}

// Floating Toast Notification
function showFloatToast(x, y, text) {
  const toast = document.createElement('div');
  toast.className = 'float-toast-msg';
  toast.textContent = text;
  toast.style.left = `${Math.min(x, window.innerWidth - 240)}px`;
  toast.style.top = `${Math.max(y - 30, 20)}px`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 1800);
}
