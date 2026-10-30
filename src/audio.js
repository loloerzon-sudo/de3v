// Audio controller and Web Audio API synthesizer for retro sound effects

let audioCtx = null;
let bgMusic = null;
let musicGain = null;
let isMusicPlaying = false;
let isHotlineCalling = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Retro Error "Bong" / Windows Critical Stop sound
export function playErrorSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
}

// Retro Success / Ding sound
export function playDingSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.warn('Audio ding error:', e);
  }
}

// Retro Click / Beep sound
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.warn('Click audio error:', e);
  }
}

// Retro Pop sound for floating bubbles & stickers
export function playPopSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.warn('Pop sound error:', e);
  }
}

// Retro Boing / Spring sound for bouncing elements
export function playBoingSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    console.warn('Boing sound error:', e);
  }
}

// Yahoo! Messenger BUZZ! sound
export function playBuzzSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, ctx.currentTime);

    // Fast modulation for aggressive vibration
    mod.type = 'square';
    mod.frequency.setValueAtTime(30, ctx.currentTime);

    modGain.gain.setValueAtTime(45, ctx.currentTime);
    mod.connect(osc.frequency);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.setValueAtTime(0.35, ctx.currentTime + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    mod.start(ctx.currentTime);
    osc.start(ctx.currentTime);
    mod.stop(ctx.currentTime + 0.45);
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn('Buzz sound error:', e);
  }
}

// Dialup / Telephone Dual-Tone Multi-Frequency (DTMF) ring
export function playPhoneRing() {
  try {
    const ctx = getAudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(440, ctx.currentTime);
    osc2.frequency.setValueAtTime(480, ctx.currentTime);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.setValueAtTime(0.18, ctx.currentTime + 1.2);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 1.3);
    osc2.stop(ctx.currentTime + 1.3);
  } catch (e) {
    console.warn('Phone ring error:', e);
  }
}

// Background Music Control
export function initBackgroundMusic(buttonEl) {
  if (!buttonEl) return;

  const audio = new Audio('./audio/shop-music.mp3');
  audio.loop = true;
  audio.volume = 0.25;
  bgMusic = audio;

  const updateBtnText = () => {
    if (isMusicPlaying) {
      buttonEl.innerHTML = '🔊 STOP MUSIC (doesnt work)';
    } else {
      buttonEl.innerHTML = '🔈 PLAY MUSIC';
    }
  };

  const startMusic = async () => {
    try {
      getAudioContext();
      await bgMusic.play();
      isMusicPlaying = true;
      updateBtnText();
    } catch (err) {
      console.warn('Autoplay prevented:', err);
    }
  };

  // Start on first user interaction anywhere
  const firstClick = () => {
    startMusic();
    document.removeEventListener('click', firstClick);
    document.removeEventListener('keydown', firstClick);
  };
  document.addEventListener('click', firstClick, { once: true });
  document.addEventListener('keydown', firstClick, { once: true });

  // Uncooperative mute button logic
  buttonEl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isMusicPlaying) {
      startMusic();
    } else {
      buttonEl.innerText = 'stopping in 5 seconds...';
      setTimeout(() => {
        bgMusic.pause();
        isMusicPlaying = false;
        buttonEl.innerHTML = '🔈 PLAY MUSIC';
      }, 5000);
    }
  });

  // Duck audio when hotline calls
  document.addEventListener('hotline:start', () => {
    if (bgMusic) bgMusic.volume = 0.05;
  });
  document.addEventListener('hotline:end', () => {
    if (bgMusic) bgMusic.volume = 0.25;
  });

  // Duck audio when video commercial is unmuted
  document.addEventListener('video:unmute', () => {
    if (bgMusic) bgMusic.volume = 0.03;
  });
  document.addEventListener('video:mute', () => {
    if (bgMusic) bgMusic.volume = 0.25;
  });
}
