// System Properties & Tech Stack Controller
// Handles classic 3-tab Windows XP/98 dialog: General, Device Manager, and Tech Stack
// Includes Yahoo Messenger "BUZZ!" easter egg and device status dialogs

import { playClickSound, playDingSound, playBuzzSound, playPopSound } from './audio.js';

export function initSystemProperties() {
  const modal = document.getElementById('system-props-modal');
  if (!modal) return;

  // 1. Open Triggers (Navbar link, desktop icon, etc.)
  document.querySelectorAll('[data-open-system]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSystemProperties();
    });
  });

  // 2. Close Buttons
  modal.querySelectorAll('[data-system-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      playClickSound();
      modal.hidden = true;
    });
  });

  // 3. Tab Navigation
  const tabButtons = modal.querySelectorAll('.sys-tab-btn');
  const tabPanes = modal.querySelectorAll('.sys-tab-pane');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playClickSound();
      const targetTab = btn.dataset.tab;

      tabButtons.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = modal.querySelector(`#sys-tab-${targetTab}`);
      if (pane) pane.classList.add('active');
    });
  });

  // 4. Yahoo! Messenger BUZZ! Easter Egg (Waxedge27)
  const yahooBadge = modal.querySelector('#yahoo-buzz-trigger');
  if (yahooBadge) {
    yahooBadge.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerYahooBuzz(modal);
    });
  }

  // 5. Device Manager Tree Interactions
  initDeviceManager(modal);

  // 6. Make dialog draggable by titlebar
  initDraggable(modal.querySelector('.win-window'), modal.querySelector('.win-titlebar'));
}

export function openSystemProperties(targetTab = 'general') {
  const modal = document.getElementById('system-props-modal');
  if (!modal) return;

  playDingSound();
  modal.hidden = false;

  // Activate requested tab
  const btn = modal.querySelector(`.sys-tab-btn[data-tab="${targetTab}"]`);
  if (btn) btn.click();
}

// Trigger Yahoo! Messenger BUZZ!
function triggerYahooBuzz(modal) {
  playBuzzSound();

  const win = modal.querySelector('.win-window');
  if (win) {
    win.classList.remove('shake-buzz');
    void win.offsetWidth; // Reflow
    win.classList.add('shake-buzz');
    setTimeout(() => win.classList.remove('shake-buzz'), 600);
  }

  // Copy Yahoo ID to clipboard
  try {
    navigator.clipboard.writeText('Waxedge27');
  } catch (err) {
    console.warn('Clipboard write error:', err);
  }

  // Show status popup
  const toast = document.createElement('div');
  toast.className = 'float-toast-msg';
  toast.innerHTML = '💥 <b>BUZZ!!!</b><br/>Yahoo ID: <code>Waxedge27</code> copied to clipboard!';
  toast.style.left = '50%';
  toast.style.top = '40%';
  toast.style.transform = 'translate(-50%, -50%)';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 2200);
}

// Device Manager Tree Logic
function initDeviceManager(modal) {
  const items = modal.querySelectorAll('.dev-tree-item');
  const statusBox = modal.querySelector('#dev-status-text');

  items.forEach((item) => {
    item.addEventListener('click', () => {
      playClickSound();
      items.forEach((i) => i.classList.remove('selected'));
      item.classList.add('selected');

      const name = item.dataset.devName || item.textContent.trim();
      const status = item.dataset.devStatus || 'This device is working properly (surprisingly).';

      if (statusBox) {
        statusBox.innerHTML = `<b>${name}</b><br/><span style="color: green;">✔ ${status}</span>`;
      }
    });

    // Expand / collapse subtrees
    const toggle = item.querySelector('.dev-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        playClickSound();
        const sub = item.nextElementSibling;
        if (sub && sub.classList.contains('dev-subtree')) {
          sub.hidden = !sub.hidden;
          toggle.textContent = sub.hidden ? '[+]' : '[-]';
        }
      });
    }
  });
}

// Draggable window helper
function initDraggable(dialog, handle) {
  if (!dialog || !handle) return;

  let isDragging = false;
  let startX, startY, initX, initY;

  handle.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const rect = dialog.getBoundingClientRect();
    initX = rect.left;
    initY = rect.top;

    dialog.style.position = 'fixed';
    dialog.style.left = `${initX}px`;
    dialog.style.top = `${initY}px`;
    dialog.style.transform = 'none';

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    dialog.style.left = `${Math.max(10, Math.min(window.innerWidth - 300, initX + dx))}px`;
    dialog.style.top = `${Math.max(10, Math.min(window.innerHeight - 200, initY + dy))}px`;
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}
