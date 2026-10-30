// Retro Mouse Trail & Custom Cursor Effects
// Spawns twinkling 90s/2000s sparkles, stars, and retro icons behind the mouse

const TRAIL_CHARS = ['✦', '★', '✨', '⭐', '💸', '👾', '💎', '•'];
const TRAIL_COLORS = [
  '#ffe600', // Neon Yellow
  '#ff0055', // Hot Pink
  '#00ffcc', // Cyber Teal
  '#00ff66', // Lime Green
  '#ff9900', // Retro Orange
  '#ffffff', // Crisp White
  '#ff00ff', // Magenta
];

let isTrailEnabled = true;
let lastX = 0;
let lastY = 0;
let lastTime = 0;

export function initCustomCursor() {
  // Listen to mousemove for sparkle trail
  window.addEventListener('mousemove', (e) => {
    if (!isTrailEnabled) return;

    const now = performance.now();
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);

    // Throttle: spawn only when moving at least 8px or after 25ms
    if (dist > 8 && now - lastTime > 20) {
      spawnSparkle(e.clientX, e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    }
  }, { passive: true });

  // Burst constellation of retro stars on mouse click
  window.addEventListener('click', (e) => {
    if (!isTrailEnabled) return;
    // Don't burst if clicking directly on inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const count = 7;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const speed = 1.5 + Math.random() * 3;
      spawnSparkle(e.clientX, e.clientY, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 14 + Math.floor(Math.random() * 8),
        duration: 650,
      });
    }
  });
}

function spawnSparkle(x, y, options = {}) {
  const el = document.createElement('span');
  el.className = 'retro-mouse-sparkle';
  
  const char = TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)];
  const color = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
  const size = options.size || (10 + Math.floor(Math.random() * 8));
  const duration = options.duration || 500;

  el.textContent = char;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.color = color;
  el.style.fontSize = `${size}px`;
  el.style.textShadow = `0 0 4px ${color}, 1px 1px 0 #000`;

  document.body.appendChild(el);

  const startTime = performance.now();
  const vx = options.vx !== undefined ? options.vx : (Math.random() * 1.6 - 0.8);
  const vy = options.vy !== undefined ? options.vy : (Math.random() * 1.2 + 0.5);

  let currentX = x;
  let currentY = y;

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    currentX += vx;
    currentY += vy;

    const opacity = 1 - progress;
    const scale = 1.2 - progress * 0.8;

    el.style.transform = `translate3d(${currentX - x}px, ${currentY - y}px, 0) scale(${scale})`;
    el.style.opacity = String(opacity);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      el.remove();
    }
  }

  requestAnimationFrame(animate);
}

export function toggleMouseTrail() {
  isTrailEnabled = !isTrailEnabled;
  return isTrailEnabled;
}
