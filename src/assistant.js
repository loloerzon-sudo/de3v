// Chibi Nerzon Desktop Assistant (Clippy / BonziBuddy style)
import { playClickSound, playDingSound } from './audio.js';
import { openContactModal } from './contact.js';

const tips = [
  {
    text: "It looks like you're trying to center a &lt;div&gt;! Would you like me to add <code>!important</code> 47 times?",
    sprite: './img/chibi-nerzon-shocked-scared.png'
  },
  {
    text: "Did you know? If your website is too slow, just delete all the CSS. Pure 1996 HTML is blazingly fast.",
    sprite: './img/chibi-nerzon-thumbs-up.png'
  },
  {
    text: "Web Agency Secret: Agencies charge $5,000 for a dark mode toggle that took 4 minutes to copy from CodePen.",
    sprite: './img/chibi-nerzon-belly-laugh.png'
  },
  {
    text: "Tip: Adding a spinning 3D skull and flame text increases client trust by approximately 400%.",
    sprite: './img/chibi-nerzon-action-kick.png'
  },
  {
    text: "Recruiters love buzzwords! Consider putting 'Quantum Full-Stack Blockchain Prompt Strategist' on your resume.",
    sprite: './img/chibi-nerzon-clapping-joy.png'
  },
  {
    text: "Want a fast, clean, high-converting portfolio website built by the real Nerzon? Click below!",
    sprite: './img/chibi-nerzon-neutral-stand.png'
  }
];

let tipIndex = 0;

export function initAssistant() {
  const assistantEl = document.getElementById('chibi-assistant');
  const spriteEl = document.getElementById('chibi-sprite');
  const bubbleEl = document.getElementById('chibi-bubble');
  const textEl = document.getElementById('chibi-text');
  const nextBtn = document.getElementById('chibi-next');
  const hireBtn = document.getElementById('chibi-hire');
  const closeBtn = document.getElementById('chibi-close');

  if (!assistantEl) return;

  function showTip(idx) {
    const tip = tips[idx % tips.length];
    textEl.innerHTML = tip.text;
    spriteEl.src = tip.sprite;
    bubbleEl.classList.add('active');
  }

  // Clicking the avatar cycles tips
  spriteEl.addEventListener('click', () => {
    playClickSound();
    tipIndex++;
    showTip(tipIndex);
  });

  // Next tip button
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playClickSound();
    tipIndex++;
    showTip(tipIndex);
  });

  // Hire button
  hireBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playDingSound();
    openContactModal('Chibi Assistant Referral');
  });

  // Close bubble
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    bubbleEl.classList.remove('active');
  });

  // Pop up first tip after 4 seconds
  setTimeout(() => {
    showTip(0);
  }, 4000);

  // Periodically change tips every 25 seconds
  setInterval(() => {
    tipIndex++;
    showTip(tipIndex);
  }, 25000);
}
