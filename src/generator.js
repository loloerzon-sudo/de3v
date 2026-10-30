// AI Portfolio Generator Logic, Loading State Machine, and CAPTCHA
import { playDingSound, playClickSound, playErrorSound } from './audio.js';
import { openContactModal } from './contact.js';

const loadingSteps = [
  'Warming up the AI engine...',
  'Stealing CSS from CodePen...',
  'Asking ChatGPT nicely to center the <div>...',
  'Downloading 842MB of node_modules...',
  'Applying !important to every single CSS line...',
  'Adding fake Forbes 30 Under 30 badge...',
  'Checking if Internet Explorer 6 crashes (it did)...',
  'Polishing Comic Sans typography...',
  'Almost done (Nerzon is brewing coffee)...'
];

let credits = 3;
let isGenerating = false;
let captchaSolved = false;

export function initGenerator() {
  const form = document.getElementById('gen-form');
  const genOutput = document.getElementById('gen-output');
  const loadingEl = document.getElementById('loading');
  const resultEl = document.getElementById('result');
  const progressBar = document.getElementById('bar-fill');
  const loadingText = document.getElementById('loading-text');
  const crtFrame = document.getElementById('crt-screen');
  const resultCaption = document.getElementById('result-caption');
  const creditsEl = document.getElementById('credits-count');
  const downloadBtn = document.getElementById('btn-download');
  const tryAgainBtn = document.getElementById('btn-again');
  const hireBtn = document.getElementById('btn-hire-nerzon');
  const captchaModal = document.getElementById('captcha-modal');
  const captchaVerifyBtn = document.getElementById('captcha-verify');
  const captchaCloseBtn = document.getElementById('captcha-close');
  const captchaMsg = document.getElementById('captcha-msg');

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isGenerating) return;

    if (credits <= 0) {
      showToast('❌ Out of free AI credits!! Hire Nerzon or wait 24 hours.');
      playErrorSound();
      return;
    }

    playClickSound();

    // Trigger CAPTCHA first if not yet passed
    if (!captchaSolved) {
      captchaModal.hidden = false;
      return;
    }

    startGeneration();
  });

  // CAPTCHA Grid item selection
  const captchaGrid = document.querySelectorAll('.captcha-item');
  captchaGrid.forEach((item) => {
    item.addEventListener('click', () => {
      playClickSound();
      item.classList.toggle('selected');
    });
  });

  // Verify CAPTCHA
  captchaVerifyBtn.addEventListener('click', () => {
    playClickSound();
    // 50% chance of funny troll rejection first time
    if (Math.random() > 0.4 && !captchaModal.dataset.attempted) {
      captchaModal.dataset.attempted = 'true';
      captchaMsg.innerHTML = '❌ WRONG!! The <code>&lt;div&gt;</code> had <code>margin: 0 auto</code> without a fixed width. Try again!';
      playErrorSound();
      captchaGrid.forEach(i => i.classList.remove('selected'));
    } else {
      captchaMsg.innerHTML = '✅ OK FINE!! You know CSS better than 90% of agencies.';
      playDingSound();
      captchaSolved = true;
      setTimeout(() => {
        captchaModal.hidden = true;
        startGeneration();
      }, 700);
    }
  });

  captchaCloseBtn.addEventListener('click', () => {
    captchaModal.hidden = true;
  });

  // Start Generation Animation
  function startGeneration() {
    isGenerating = true;
    credits = Math.max(0, credits - 1);
    if (creditsEl) creditsEl.textContent = credits;

    genOutput.hidden = false;
    loadingEl.hidden = false;
    resultEl.hidden = true;
    progressBar.style.width = '0%';

    let stepIndex = 0;
    const totalDuration = 5500; // 5.5 seconds of hilarious loading
    const intervalTime = totalDuration / loadingSteps.length;

    const interval = setInterval(() => {
      stepIndex++;
      const pct = Math.min(96, Math.floor((stepIndex / loadingSteps.length) * 100));
      progressBar.style.width = `${pct}%`;
      loadingText.textContent = loadingSteps[Math.min(stepIndex, loadingSteps.length - 1)];

      if (stepIndex >= loadingSteps.length) {
        clearInterval(interval);
        finishGeneration();
      }
    }, intervalTime);
  }

  // Finish Generation & Build Mockup HTML
  function finishGeneration() {
    progressBar.style.width = '100%';
    playDingSound();

    setTimeout(() => {
      loadingEl.hidden = true;
      resultEl.hidden = false;
      isGenerating = false;

      const titleInput = document.getElementById('gen-title').value.trim() || 'Senior 10x Full-Stack AI Engineer';
      const nameInput = document.getElementById('gen-name').value.trim() || 'Alex Superstar';
      const theme = document.getElementById('gen-theme').value;
      const isCentered = document.getElementById('opt-center').checked;
      const hasSkull = document.getElementById('opt-skull').checked;
      const hasForbes = document.getElementById('opt-forbes').checked;
      const hasSafari = document.getElementById('opt-safari').checked;

      // Render Dynamic Custom Portfolio inside the CRT frame
      renderPortfolioMockup(crtFrame, {
        name: nameInput,
        title: titleInput,
        theme,
        isCentered,
        hasSkull,
        hasForbes,
        hasSafari
      });

      resultCaption.innerHTML = `🎉 <b>SUCCESS!</b> Portfolio built with <b>${Math.floor(Math.random() * 40) + 60}% AI confidence</b> and 0 line(s) of responsive CSS.`;
      
      // Auto scroll smoothly to result
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 400);
  }

  // Download button troll toast
  downloadBtn.addEventListener('click', () => {
    playErrorSound();
    showToast('⬇ Download failed! Upgrade to HD Source Code for $0.50 (or hire Nerzon).');
  });

  // Try again
  tryAgainBtn.addEventListener('click', () => {
    playClickSound();
    if (credits <= 0) {
      showToast('❌ No credits left! Hire Nerzon to do this without limits.');
      return;
    }
    startGeneration();
  });

  // Hire Nerzon button
  hireBtn.addEventListener('click', () => {
    playClickSound();
    openContactModal('Generated AI Portfolio Customization Request');
  });
}

// Generate the chaotic HTML inside the preview CRT iframe/screen
function renderPortfolioMockup(container, opts) {
  const { name, title, theme, isCentered, hasSkull, hasForbes, hasSafari } = opts;

  let themeStyles = `
    background: #008080;
    color: #ffffff;
    font-family: 'Comic Sans MS', cursive, sans-serif;
  `;

  if (theme === 'hacker') {
    themeStyles = `
      background: #050505;
      color: #00ff66;
      font-family: 'Courier New', monospace;
      text-shadow: 0 0 5px #00ff66;
    `;
  } else if (theme === 'geocities') {
    themeStyles = `
      background: #ffff00;
      color: #ff0000;
      font-family: Impact, fantasy;
    `;
  } else if (theme === 'windows') {
    themeStyles = `
      background: #3a6ea5;
      color: #000000;
      font-family: Tahoma, sans-serif;
    `;
  }

  const skullHtml = hasSkull
    ? `<div style="font-size: 2.2rem; animation: spin 2s linear infinite; display: inline-block;">💀🔥</div>`
    : '';

  const forbesHtml = hasForbes
    ? `<div style="background: gold; color: black; font-weight: bold; padding: 4px 8px; border: 2px dashed red; margin: 8px auto; display: inline-block; transform: rotate(-3deg); font-size: 0.8rem;">🏆 FORBES 30 UNDER 30 (Self-Nominated)</div>`
    : '';

  const safariHtml = hasSafari
    ? `<div style="font-size: 0.75rem; background: #222; color: #fff; padding: 3px; margin-top: 6px;">🍏 Safari Compatibility: 99.9% untested</div>`
    : '';

  const alignmentStyle = isCentered
    ? `text-align: center; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100%;`
    : `text-align: left; margin: 10px 0 0 10px; display: block;`;

  const html = `
    <div style="${themeStyles} height: 100%; width: 100%; box-sizing: border-box; padding: 15px; overflow-y: auto;">
      <div style="${alignmentStyle}">
        ${skullHtml}
        <h2 style="margin: 5px 0; font-size: 1.4rem;">${name}</h2>
        <p style="font-size: 0.95rem; margin: 4px 0; background: rgba(0,0,0,0.2); padding: 3px 8px; border-radius: 4px;">🚀 ${title}</p>
        ${forbesHtml}
        <div style="margin: 12px 0; border: 2px outset #fff; padding: 10px; background: rgba(255,255,255,0.15); max-width: 90%;">
          <p style="margin: 0 0 6px 0; font-size: 0.85rem;"><b>About Me:</b> I turn coffee into code and bill agencies $150/hr.</p>
          <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
            <span style="background: red; color: white; padding: 2px 6px; font-size: 0.75rem; border: 1px solid black;">HTML5</span>
            <span style="background: blue; color: white; padding: 2px 6px; font-size: 0.75rem; border: 1px solid black;">CSS (!important)</span>
            <span style="background: green; color: white; padding: 2px 6px; font-size: 0.75rem; border: 1px solid black;">ChatGPT Pro</span>
          </div>
        </div>
        <button style="background: linear-gradient(to bottom, #ffff00, #ff8800); border: 2px outset #fff; font-weight: bold; cursor: pointer; padding: 6px 14px; font-size: 0.85rem;" onclick="alert('Inquiry sent to /dev/null! Better hire Nerzon.')">
          ⚡ HIRE ME FOR $10,000 ⚡
        </button>
        ${safariHtml}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// Global Toast notification utility
export function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'global-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
