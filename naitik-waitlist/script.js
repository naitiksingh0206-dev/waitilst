/**
 * NAITIK WAITLIST — CONTROLLER
 * ============================================================
 * 
 * Features:
 * - Real dynamic waitlist count (True numbers, zero fake stats)
 * - Roster side drawer showing member NAMES ONLY (Emails hidden for privacy)
 * - 1,000 Member Cap logic & mobile-optimized slide drawer
 * - Form validation & friendly duplicate prevention message
 * - Confetti celebration on successful signup
 * - Direct X handle: https://x.com/Naitik526870
 */

(function () {
  'use strict';

  // Optional Google Apps Script URL if configured
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

  const STORAGE_KEY = 'naitik_waitlist_subscribers';
  const CURRENT_USER_KEY = 'naitik_current_subscriber';
  const MEMBER_CAP = 1000;

  // State
  let subscribers = [];

  // DOM Elements
  let form, nameInput, emailInput, submitBtn, formFeedback, formWrapper, successContainer;
  let sideDrawer, sideDrawerBackdrop, memberRosterList, rosterSearchInput, rosterCountLabel;
  let capNotice, showMembersBtn, liveCountBadge;

  document.addEventListener('DOMContentLoaded', () => {
    loadSubscribers();
    initElements();
    initParticles();
    initSpotlight();
    initScrollReveal();
    initForm();
    initSideDrawer();
    updateWaitlistCounter();
    checkCapStatus();
    checkCurrentUserStatus();
  });

  /* ==========================================================================
     DATA REPOSITORY
     ========================================================================== */
  function loadSubscribers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        subscribers = JSON.parse(stored);
      } else {
        subscribers = [];
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
      subscribers = [];
    }
  }

  function saveSubscribers() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  function initElements() {
    form = document.getElementById('waitlist-form');
    nameInput = document.getElementById('waitlist-name');
    emailInput = document.getElementById('waitlist-email');
    submitBtn = document.getElementById('waitlist-submit-btn');
    formFeedback = document.getElementById('form-feedback');
    formWrapper = document.getElementById('form-wrapper');
    successContainer = document.getElementById('success-container');

    sideDrawer = document.getElementById('members-side-drawer');
    sideDrawerBackdrop = document.getElementById('members-drawer-backdrop');
    memberRosterList = document.getElementById('member-roster-list');
    rosterSearchInput = document.getElementById('roster-search-input');
    rosterCountLabel = document.getElementById('roster-count-label');

    capNotice = document.getElementById('cap-notice');
    showMembersBtn = document.getElementById('show-members-btn');
    liveCountBadge = document.getElementById('live-count-badge');
  }

  /* ==========================================================================
     DYNAMIC TRUE WAITLIST COUNTER
     ========================================================================== */
  function updateWaitlistCounter() {
    const total = subscribers.length;

    if (liveCountBadge) {
      if (total === 0) {
        liveCountBadge.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
          <span>⚡ Be the 1st to join the waitlist!</span>
        `;
      } else if (total === 1) {
        liveCountBadge.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>⚡ 1 member on the waitlist</span>
        `;
      } else {
        liveCountBadge.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>⚡ ${total.toLocaleString()} members on the waitlist</span>
        `;
      }
    }
  }

  /* ==========================================================================
     "YOU'RE ON THE LIST" AUTO-RECOGNITION
     ========================================================================== */
  function checkCurrentUserStatus() {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    const badge = document.getElementById('user-status-pill');

    if (savedUser && badge) {
      try {
        const user = JSON.parse(savedUser);
        badge.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>You're in (#${String(user.orderNumber || 1).padStart(3, '0')})</span>
        `;
        badge.classList.remove('hidden');
        badge.style.display = 'inline-flex';
      } catch (e) {}
    }
  }

  /* ==========================================================================
     CAP LOGIC: 1,000 MEMBERS
     ========================================================================== */
  function checkCapStatus() {
    const totalCount = subscribers.length;
    const isCapped = totalCount >= MEMBER_CAP;

    if (showMembersBtn) {
      if (totalCount > 0) {
        showMembersBtn.style.display = 'inline-flex';
        showMembersBtn.innerHTML = `
          <svg class="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span>Members List (${totalCount >= MEMBER_CAP ? '1,000+' : totalCount})</span>
        `;
      } else {
        showMembersBtn.style.display = 'none';
      }
    }

    if (capNotice && formWrapper) {
      if (isCapped) {
        formWrapper.style.display = 'none';
        capNotice.style.display = 'block';
      } else {
        capNotice.style.display = 'none';
        if (successContainer.style.display !== 'block') {
          formWrapper.style.display = 'block';
        }
      }
    }
  }

  /* ==========================================================================
     SIDE DRAWER FOR MEMBERS LIST (NAMES ONLY - NO EMAILS SHOWN)
     ========================================================================== */
  function initSideDrawer() {
    const triggerButtons = document.querySelectorAll('.open-members-drawer-btn');
    const closeBtn = document.getElementById('close-members-drawer-btn');
    const clearBtn = document.getElementById('clear-subscribers-btn');

    triggerButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openMembersDrawer();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMembersDrawer);
    if (sideDrawerBackdrop) sideDrawerBackdrop.addEventListener('click', closeMembersDrawer);

    if (rosterSearchInput) {
      rosterSearchInput.addEventListener('input', (e) => {
        renderMemberList(e.target.value.trim().toLowerCase());
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Reset waitlist data for testing?')) {
          subscribers = [];
          localStorage.removeItem(CURRENT_USER_KEY);
          saveSubscribers();
          updateWaitlistCounter();
          checkCapStatus();
          renderMemberList();
          location.reload();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sideDrawer.classList.contains('is-active')) {
        closeMembersDrawer();
      }
    });
  }

  function openMembersDrawer() {
    renderMemberList();
    sideDrawer.classList.add('is-active');
    sideDrawerBackdrop.classList.add('is-active');
  }

  function closeMembersDrawer() {
    sideDrawer.classList.remove('is-active');
    sideDrawerBackdrop.classList.remove('is-active');
  }

  function renderMemberList(filterQuery = '') {
    if (!memberRosterList) return;

    if (rosterCountLabel) {
      rosterCountLabel.textContent = `${subscribers.length} Confirmed Members`;
    }

    const filtered = filterQuery
      ? subscribers.filter(s => s.name.toLowerCase().includes(filterQuery))
      : subscribers;

    if (filtered.length === 0) {
      memberRosterList.innerHTML = `
        <div class="py-16 text-center text-slate-500 text-sm">
          <svg class="w-8 h-8 mx-auto mb-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          ${filterQuery ? 'No matching members found.' : 'No members registered yet.'}
        </div>
      `;
      return;
    }

    let html = '';
    // Show members — NAMES ONLY (No emails disclosed)
    filtered.slice(0, 300).forEach(sub => {
      html += `
        <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs hover:border-purple-500/30 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold flex items-center justify-center font-mono text-[11px]">
              #${String(sub.orderNumber).padStart(3, '0')}
            </div>
            <div>
              <div class="font-semibold text-slate-100 text-sm">${escapeHtml(sub.name)}</div>
              <div class="text-[10px] text-slate-400 font-mono">Early Supporter</div>
            </div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            VIP Access
          </span>
        </div>
      `;
    });

    if (filtered.length > 300) {
      html += `
        <div class="py-3 text-center text-xs text-slate-500 font-mono">
          + and ${filtered.length - 300} more members...
        </div>
      `;
    }

    memberRosterList.innerHTML = html;
  }

  /* ==========================================================================
     WAITLIST FORM — VALIDATION & DUPLICATE PROTECTION
     ========================================================================== */
  function initForm() {
    if (!form) return;

    [nameInput, emailInput].forEach(inp => {
      inp.addEventListener('input', () => {
        inp.classList.remove('is-invalid');
        clearFeedback();
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFeedback();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      if (!name) {
        showError(nameInput, 'Please enter your name.');
        return;
      }

      if (!email) {
        showError(emailInput, 'Please enter your email.');
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        showError(emailInput, 'Please enter a valid email address.');
        return;
      }

      // Enhanced Duplicate Check
      const existing = subscribers.find(
        sub => sub.email.toLowerCase() === email.toLowerCase()
      );

      if (existing) {
        showError(
          emailInput,
          `You have already waitlisted! We'll notify you as soon as we drop.`
        );
        triggerShake(formWrapper);
        return;
      }

      setLoading(true);

      const newSubscriber = {
        id: 'sub_' + Date.now().toString(36),
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        orderNumber: subscribers.length + 1
      };

      // Send to Google Apps Script if URL provided
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email })
          });
        } catch (err) {}
      }

      // Send to local server API if running
      try {
        await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSubscriber)
        });
      } catch (e) {}

      // Save to localStorage
      subscribers.push(newSubscriber);
      saveSubscribers();

      // Store current user
      try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newSubscriber));
      } catch (e) {}

      await new Promise(r => setTimeout(r, 600));

      setLoading(false);
      renderSuccess(newSubscriber);
      triggerConfetti();
      updateWaitlistCounter();
      checkCapStatus();
      checkCurrentUserStatus();
    });
  }

  function setLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      nameInput.disabled = true;
      emailInput.disabled = true;
      submitBtn.innerHTML = `
        <span class="loading-spinner"></span>
        <span>Securing your spot...</span>
      `;
    } else {
      submitBtn.disabled = false;
      nameInput.disabled = false;
      emailInput.disabled = false;
      submitBtn.innerHTML = `
        <span>Get Early Access</span>
        <svg class="arrow-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      `;
    }
  }

  function showError(inputElement, message) {
    if (inputElement) {
      inputElement.classList.add('is-invalid');
      inputElement.focus();
    }
    formFeedback.innerHTML = `
      <div class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
        <svg class="w-4 h-4 flex-shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke-width="2"></circle>
          <line x1="12" y1="8" x2="12" y2="12" stroke-width="2"></line>
          <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2"></line>
        </svg>
        <span>${escapeHtml(message)}</span>
      </div>
    `;
    formFeedback.style.display = 'block';
  }

  function clearFeedback() {
    formFeedback.innerHTML = '';
    formFeedback.style.display = 'none';
  }

  function triggerShake(element) {
    element.classList.remove('animate-shake');
    void element.offsetWidth;
    element.classList.add('animate-shake');
    setTimeout(() => element.classList.remove('animate-shake'), 400);
  }

  function renderSuccess(subscriber) {
    formWrapper.style.display = 'none';
    successContainer.style.display = 'block';

    const orderPill = document.getElementById('success-order-num');
    const subscriberName = document.getElementById('success-user-name');
    const subscriberEmail = document.getElementById('success-user-email');

    if (orderPill) orderPill.textContent = `#${String(subscriber.orderNumber).padStart(3, '0')}`;
    if (subscriberName) subscriberName.textContent = subscriber.name;
    if (subscriberEmail) subscriberEmail.textContent = subscriber.email;

    const resetBtn = document.getElementById('reset-waitlist-btn');
    if (resetBtn) {
      resetBtn.onclick = () => {
        form.reset();
        formWrapper.style.display = 'block';
        successContainer.style.display = 'none';
        nameInput.focus();
      };
    }

    const shareBtn = document.getElementById('share-x-btn');
    if (shareBtn) {
      shareBtn.onclick = () => {
        const text = encodeURIComponent(
          "I just joined the early waitlist for what @Naitik526870 is quietly building. 🤫 Excited to see what drops!"
        );
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      };
    }
  }

  /* ==========================================================================
     CONFETTI
     ========================================================================== */
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    const pieces = [];
    const colors = ['#8b5cf6', '#6366f1', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#ffffff'];

    for (let i = 0; i < 80; i++) {
      pieces.push({
        x: w / 2 + (Math.random() - 0.5) * 140,
        y: h / 2 - 30,
        vx: (Math.random() - 0.5) * 12,
        vy: -(Math.random() * 10 + 5),
        gravity: 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1
      });
    }

    let animationFrame;
    function renderConfetti() {
      ctx.clearRect(0, 0, w, h);
      let active = false;

      pieces.forEach(p => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.01;

        if (p.opacity > 0 && p.y < h + 20) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(p.opacity, 0);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (active) {
        animationFrame = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, w, h);
        cancelAnimationFrame(animationFrame);
      }
    }

    renderConfetti();
  }

  /* ==========================================================================
     BACKGROUND PARTICLES
     ========================================================================== */
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const count = Math.min(Math.floor(width / 28), 40);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.6 + 0.5;
        this.baseAlpha = Math.random() * 0.4 + 0.1;
        this.alpha = this.baseAlpha;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.color = Math.random() > 0.5 ? '139, 92, 246' : '6, 182, 212';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) particles.push(new Particle());

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  function initSpotlight() {
    const cards = document.querySelectorAll('.spotlight-card');
    cards.forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });
  }

  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('is-revealed'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
