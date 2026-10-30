// "Call Nerzon Live" Enterprise Hotline Phone Simulation
import { playPhoneRing, playClickSound, playDingSound } from './audio.js';
import { openContactModal } from './contact.js';

let callTimer = null;
let keyInterval = null;
let callDuration = 0;

export function initHotline() {
  const modal = document.getElementById('hotline-modal');
  const closeBtn = document.getElementById('hotline-close');
  const hangupBtn = document.getElementById('hotline-hangup');
  const hireBtn = document.getElementById('hotline-hire');
  const statusEl = document.getElementById('hotline-status');
  const timerEl = document.getElementById('hotline-timer');
  const transcriptEl = document.getElementById('hotline-transcript');
  const avatarImg = document.getElementById('hotline-avatar');

  // Any button with [data-call-nerzon] triggers the call
  document.querySelectorAll('[data-call-nerzon]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      startCall();
    });
  });

  closeBtn.addEventListener('click', endCall);
  hangupBtn.addEventListener('click', endCall);

  hireBtn.addEventListener('click', () => {
    endCall();
    openContactModal('Hotline Phone Call Inquiry');
  });

  function startCall() {
    modal.hidden = false;
    document.dispatchEvent(new Event('hotline:start'));
    playClickSound();

    statusEl.textContent = '📞 Ringing Nerzon’s desk phone...';
    timerEl.textContent = '00:00';
    transcriptEl.innerHTML = '<p class="ringing-text">Calling +1-800-NERZON-CSS ... [Ringing]</p>';
    avatarImg.src = './img/chibi-nerzon-neutral-stand.png';
    callDuration = 0;

    // Play ringing tone
    playPhoneRing();
    const ringLoop = setInterval(() => {
      playPhoneRing();
    }, 2800);

    // Connect call after 3 seconds
    callTimer = setTimeout(() => {
      clearInterval(ringLoop);
      connectCall();
    }, 3200);

    modal.dataset.ringInterval = ringLoop;
  }

  function connectCall() {
    playDingSound();
    statusEl.innerHTML = '🟢 <b>CONNECTED</b> (High Quality 8kHz GSM Audio)';
    avatarImg.src = './img/chibi-nerzon-belly-laugh.png';

    // Start timer counter
    const durationInterval = setInterval(() => {
      callDuration++;
      const mins = String(Math.floor(callDuration / 60)).padStart(2, '0');
      const secs = String(callDuration % 60).padStart(2, '0');
      timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
    modal.dataset.durationInterval = durationInterval;

    // Simulate mechanical keyboard typing sound effects
    keyInterval = setInterval(() => {
      const click = new Audio(Math.random() > 0.5 ? './audio/key-1.wav' : './audio/key-2.wav');
      click.volume = 0.4;
      click.play().catch(() => {});
    }, 280);

    // Conversation script sequence
    transcriptEl.innerHTML = '';
    const lines = [
      { speaker: 'Nerzon', text: 'Yo! Nerzon Web Support. Have you tried hard-refreshing your cache with Ctrl + F5?', delay: 500 },
      { speaker: 'You', text: 'Can you make my portfolio look like a $10,000 Silicon Valley startup?', delay: 2400 },
      { speaker: 'Nerzon', text: 'Easy. We drop the bloat, add high-converting typography, and make it load in 0.2s.', delay: 4500 },
      { speaker: 'Nerzon', text: 'Hit the button below or email me at erzon22@gmail.com and let’s build it!', delay: 7200 }
    ];

    lines.forEach((item) => {
      setTimeout(() => {
        if (modal.hidden) return;
        const msg = document.createElement('div');
        msg.className = `call-bubble ${item.speaker === 'Nerzon' ? 'bubble-nerzon' : 'bubble-user'}`;
        msg.innerHTML = `<b>${item.speaker}:</b> ${item.text}`;
        transcriptEl.appendChild(msg);
        transcriptEl.scrollTop = transcriptEl.scrollHeight;

        if (item.speaker === 'Nerzon' && 'speechSynthesis' in window) {
          speakNerzon(item.text);
        }
      }, item.delay);
    });
  }

  function endCall() {
    clearInterval(Number(modal.dataset.ringInterval));
    clearInterval(Number(modal.dataset.durationInterval));
    clearInterval(keyInterval);
    clearTimeout(callTimer);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    modal.hidden = true;
    document.dispatchEvent(new Event('hotline:end'));
  }

  function speakNerzon(text) {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.05;
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Speech synthesis fallback
    }
  }
}
