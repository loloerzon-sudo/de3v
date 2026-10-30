// "Contact Nerzon.exe" Windows XP Modal & Real Lead Generation
import { playClickSound, playDingSound } from './audio.js';
import { showToast } from './generator.js';

export function initContact() {
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('contact-close');
  const cancelBtn = document.getElementById('contact-cancel');
  const form = document.getElementById('contact-form');
  const subjectInput = document.getElementById('contact-subject');

  if (!modal) return;

  // Global trigger for any [data-open-contact] buttons
  document.querySelectorAll('[data-open-contact]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const context = btn.getAttribute('data-context') || 'Portfolio Web Design Inquiry';
      openContactModal(context);
    });
  });

  closeBtn.addEventListener('click', () => {
    playClickSound();
    modal.hidden = true;
  });

  cancelBtn.addEventListener('click', () => {
    playClickSound();
    modal.hidden = true;
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    playDingSound();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const budget = document.getElementById('contact-budget').value;
    const details = document.getElementById('contact-details').value.trim();
    const subject = subjectInput.value || 'Custom Web Portfolio Inquiry for Nerzon';

    const fullMessage = `Hi Nerzon,\n\nI'm interested in having you build my portfolio website.\n\nName: ${name}\nEmail: ${email}\nBudget Tier: ${budget}\nDetails: ${details}\n\nSent via NerzonWeb.exe`;

    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullMessage).catch(() => {});
    }

    // Launch mailto
    const mailtoUrl = `mailto:erzon22@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullMessage)}`;
    window.location.href = mailtoUrl;

    showToast('🚀 Inquiry copied to clipboard & email client opened! Nerzon will reply fast.');

    setTimeout(() => {
      modal.hidden = true;
    }, 1200);
  });
}

export function openContactModal(context = 'Custom Web Portfolio Service') {
  const modal = document.getElementById('contact-modal');
  const subjectInput = document.getElementById('contact-subject');
  if (!modal) return;

  playClickSound();
  if (subjectInput) {
    subjectInput.value = context;
  }
  modal.hidden = false;
  modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
