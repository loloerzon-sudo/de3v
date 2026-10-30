// Windows Media Player 9 Retro Video Commercial Controller
// Handles playback, audio ducking, scrubber timeline, and interactive hot buttons

import { playClickSound, playPopSound } from './audio.js';

export function initVideoPlayer() {
  const video = document.getElementById('hero-commercial-video');
  if (!video) return;

  const playBtn = document.getElementById('v-play-btn');
  const soundBtn = document.getElementById('v-sound-btn');
  const trackFill = document.getElementById('v-track-fill');
  const timeDisplay = document.getElementById('v-time-display');
  const scrubber = document.getElementById('v-scrubber');

  // 1. Play / Pause Toggle
  const togglePlay = () => {
    playClickSound();
    if (video.paused) {
      video.play().catch(console.warn);
      if (playBtn) playBtn.innerHTML = '⏸ Pause';
    } else {
      video.pause();
      if (playBtn) playBtn.innerHTML = '▶ Play';
    }
  };

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  // 2. Mute / Unmute with audio ducking
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      playClickSound();
      video.muted = !video.muted;
      if (!video.muted) {
        soundBtn.innerHTML = '🔊 Sound: ON';
        soundBtn.classList.add('btn-active-sound');
        document.dispatchEvent(new CustomEvent('video:unmute'));
      } else {
        soundBtn.innerHTML = '🔈 Sound: OFF (Muted)';
        soundBtn.classList.remove('btn-active-sound');
        document.dispatchEvent(new CustomEvent('video:mute'));
      }
    });
  }

  // 3. Time update & scrubber sync
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (trackFill) trackFill.style.width = `${pct}%`;

    if (timeDisplay) {
      const cur = formatTime(video.currentTime);
      const dur = formatTime(video.duration);
      timeDisplay.textContent = `${cur} / ${dur} • 56k Dialup`;
    }
  });

  // 4. Scrubber Seek
  if (scrubber) {
    scrubber.addEventListener('click', (e) => {
      const rect = scrubber.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      if (video.duration) {
        video.currentTime = pct * video.duration;
      }
    });
  }

  // 5. Ensure autoplay loop
  video.play().catch(() => {
    // If browser policy blocks autoplay with audio, ensure muted
    video.muted = true;
    video.play().catch(console.warn);
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
