/**
 * GoldenYears Home Care — Main JavaScript (ES6)
 * Vanilla JS • Fully Accessible • LocalStorage Preferences • Rich Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndRTL();
  initStickyHeader();
  initMobileMenu();
  initProfileDropdown();
  initDashboardSidebar();
  initHeroSlider();
  initRoomTabs();
  initQuizChecklist();
  initCostCalculator();
  initFaqAccordions();
  initBookingModal();
  initBackToTop();
  initFormValidation();
  initBeforeAfterSlider();
});

/* --------------------------------------------------------------------------
   1. Theme (Light/Dark) & RTL/LTR Management (LocalStorage)
   -------------------------------------------------------------------------- */
function initThemeAndRTL() {
  const currentTheme = localStorage.getItem('gy_theme') || 'light';
  const currentDir = localStorage.getItem('gy_dir') || 'ltr';

  document.documentElement.setAttribute('data-theme', currentTheme);
  document.documentElement.setAttribute('dir', currentDir);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');

  updateThemeIcons(currentTheme);
  updateRtlButtons(currentDir);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('gy_theme', newTheme);
      updateThemeIcons(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Warm Light'} Mode`);
    });
  });

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeDir = document.documentElement.getAttribute('dir');
      const newDir = activeDir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('gy_dir', newDir);
      updateRtlButtons(newDir);
      showToast(`Switched layout to ${newDir.toUpperCase()}`);
    });
  });
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-toggle-btn i, .theme-toggle-btn span');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.innerHTML = '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></span>';
      icon.setAttribute('title', 'Switch to Warm Light Mode');
    } else {
      icon.innerHTML = '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg></span>';
      icon.setAttribute('title', 'Switch to Peaceful Dark Mode');
    }
  });
}

function updateRtlButtons(dir) {
  const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
  rtlBtns.forEach(btn => {
    btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    btn.setAttribute('title', dir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
  });
}

/* --------------------------------------------------------------------------
   2. Sticky Header with Scroll Detection
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. Mobile Menu Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></span>' : '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg></span>';
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      toggleBtn.innerHTML = '<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg></span>';
    }
  });
}

/* --------------------------------------------------------------------------
   3b. User Profile Dropdown Menu (Account)
   -------------------------------------------------------------------------- */
function initProfileDropdown() {
  const menus = document.querySelectorAll('.profile-menu');
  if (!menus.length) return;

  function closeAll() {
    document.querySelectorAll('.profile-menu.active').forEach(m => {
      m.classList.remove('active');
      const btn = m.querySelector('.profile-toggle-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  menus.forEach(menu => {
    const btn = menu.querySelector('.profile-toggle-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = menu.classList.contains('active');
      closeAll();
      if (!wasOpen) {
        menu.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-menu')) closeAll();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });

  // Close the menu when a dropdown link is clicked (navigating away snapshots
  // the DOM; without this the menu is still open on Back-button return).
  menus.forEach(menu => {
    menu.querySelectorAll('.profile-dropdown a').forEach(link => {
      link.addEventListener('click', closeAll);
    });
  });

  // bfcache (Back/Forward) restores the DOM as-is without re-running scripts,
  // so always reset the menu when the page is shown.
  window.addEventListener('pageshow', closeAll);
}

/* --------------------------------------------------------------------------
   3c. Dashboard Sidebar (Collapse on Desktop, Off-Canvas on Mobile)
   -------------------------------------------------------------------------- */
function initDashboardSidebar() {
  const layout = document.querySelector('.dashboard-layout');
  if (!layout) return;
  const sidebar = layout.querySelector('.dashboard-sidebar');
  if (!sidebar) return;

  // Shared overlay (created once)
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  const isMobile = () => window.matchMedia('(max-width: 1024px)').matches;

  function openMobile() {
    layout.classList.add('sidebar-open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    layout.classList.remove('sidebar-open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Restore persisted desktop rail state
  try {
    if (!isMobile() && localStorage.getItem('gy_sidebar_collapsed') === '1') {
      layout.classList.add('sidebar-collapsed');
    }
  } catch (err) {}

  layout.querySelectorAll('.sidebar-collapse-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const collapsed = layout.classList.toggle('sidebar-collapsed');
      try {
        localStorage.setItem('gy_sidebar_collapsed', collapsed ? '1' : '0');
      } catch (err) {}
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  });

  layout.querySelectorAll('.sidebar-open-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobile();
    });
  });

  overlay.addEventListener('click', closeMobile);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobile();
  });

  // After choosing a destination on mobile, slide the panel away
  sidebar.querySelectorAll('.dashboard-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (isMobile()) closeMobile();
    });
  });

  window.addEventListener('resize', () => {
    if (!isMobile()) closeMobile();
  });
}

/* --------------------------------------------------------------------------
   4. Hero Slider (Home 1)
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.querySelector('.slider-dots');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  if (!slides.length) return;

  let currentIndex = 0;
  let slideInterval = null;

  // Render dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    const dots = document.querySelectorAll('.slider-dot');
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 6500);
  }

  function resetAutoplay() {
    clearInterval(slideInterval);
    startAutoplay();
  }

  startAutoplay();
}

/* --------------------------------------------------------------------------
   5. Interactive Room Tabs
   -------------------------------------------------------------------------- */
function initRoomTabs() {
  const tabBtns = document.querySelectorAll('.room-tab-btn');
  const tabPanes = document.querySelectorAll('.room-tab-pane');

  if (!tabBtns.length || !tabPanes.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

/* --------------------------------------------------------------------------
   6. Interactive Safety Checklist Quiz
   -------------------------------------------------------------------------- */
function initQuizChecklist() {
  const quizForm = document.getElementById('safetyQuizForm');
  if (!quizForm) return;

  const checkboxes = quizForm.querySelectorAll('input[type="checkbox"]');
  const scoreDisplay = document.getElementById('safetyScoreDisplay');
  const recommendationDisplay = document.getElementById('safetyRecommendation');

  function updateScore() {
    let checkedCount = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) checkedCount++;
    });

    const total = checkboxes.length;
    // Lower checked hazards = Higher safety score
    const safetyPercent = Math.max(20, Math.round(((total - checkedCount) / total) * 100));

    if (scoreDisplay) scoreDisplay.textContent = `${safetyPercent}%`;

    if (recommendationDisplay) {
      if (checkedCount === 0) {
        recommendationDisplay.innerHTML = '<span style="color:var(--color-success)"><span class="icon icon-inline" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span> Outstanding! Home has minimal hazards. Schedule an annual safety check to keep it up.</span>';
      } else if (checkedCount <= 2) {
        recommendationDisplay.innerHTML = '<span style="color:var(--color-warning)"><span class="icon icon-inline" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></span> Moderate Risk: Recommend installing 2-3 ADA grab bars and testing stair handrails immediately.</span>';
      } else {
        recommendationDisplay.innerHTML = '<span style="color:var(--color-danger)"><span class="icon icon-inline" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></span> Urgent Attention Needed: Multiple severe fall hazards detected. Comprehensive 45-point audit strongly recommended.</span>';
      }
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateScore);
  });
}

/* --------------------------------------------------------------------------
   7. Interactive Cost Estimator Calculator
   -------------------------------------------------------------------------- */
function initCostCalculator() {
  const calcForm = document.getElementById('costEstimatorForm');
  if (!calcForm) return;

  const checkInputs = calcForm.querySelectorAll('input[type="checkbox"], input[type="radio"]');
  const priceDisplay = document.getElementById('estimatedPrice');
  const timeDisplay = document.getElementById('estimatedTurnaround');

  function calculate() {
    let basePrice = 120; // base inspection fee
    let hours = 2;

    const selectedServices = calcForm.querySelectorAll('input[name="services"]:checked');
    selectedServices.forEach(item => {
      basePrice += parseInt(item.getAttribute('data-cost') || '0', 10);
      hours += parseFloat(item.getAttribute('data-hours') || '1');
    });

    const urgency = calcForm.querySelector('input[name="urgency"]:checked');
    if (urgency && urgency.value === 'same-day') {
      basePrice += 75;
    }

    if (priceDisplay) {
      priceDisplay.textContent = `$${basePrice} - $${basePrice + 120}`;
    }
    if (timeDisplay) {
      timeDisplay.textContent = `${Math.ceil(hours)} - ${Math.ceil(hours + 1.5)} Hours`;
    }
  }

  checkInputs.forEach(input => {
    input.addEventListener('change', calculate);
  });

  // Calculate initially
  calculate();
}

/* --------------------------------------------------------------------------
   8. FAQ Accordions
   -------------------------------------------------------------------------- */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. Interactive Booking Modal Flow
   -------------------------------------------------------------------------- */
function initBookingModal() {
  const openBtns = document.querySelectorAll('.open-booking-modal');
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const bookingForm = document.getElementById('bookingModalForm');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('<span class="icon icon-inline" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></span> Safety Visit Scheduled! Our Care Coordinator will call within 15 minutes.');
      bookingForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   10. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const bttBtn = document.querySelector('.back-to-top');
  if (!bttBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      bttBtn.classList.add('active');
    } else {
      bttBtn.classList.remove('active');
    }
  }, { passive: true });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   11. Universal Form Validation & Submissions
   -------------------------------------------------------------------------- */
function initFormValidation() {
  const forms = document.querySelectorAll('form:not(#bookingModalForm):not(#safetyQuizForm):not(#costEstimatorForm)');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const requiredInputs = form.querySelectorAll('[required]');
      let valid = true;

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = 'var(--color-danger)';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!valid) {
        showToast('Please fill out all required fields marked with *', 'error');
        return;
      }

      showToast('Thank you! Your inquiry has been safely received.', 'success');
      form.reset();
    });
  });
}

/* --------------------------------------------------------------------------
   12. Before & After Slider (Home 2)
   -------------------------------------------------------------------------- */
function initBeforeAfterSlider() {
  const sliderContainers = document.querySelectorAll('.before-after-wrapper');
  sliderContainers.forEach(container => {
    const rangeInput = container.querySelector('.ba-range-slider');
    const overlayImg = container.querySelector('.ba-image-overlay');

    if (!rangeInput || !overlayImg) return;

    rangeInput.addEventListener('input', (e) => {
      const val = e.target.value;
      overlayImg.style.width = `${val}%`;
    });
  });
}

/* --------------------------------------------------------------------------
   Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') {
    toast.style.backgroundColor = 'var(--color-danger)';
  } else if (type === 'success') {
    toast.style.backgroundColor = 'var(--color-forest)';
  }

  toast.innerHTML = `<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg></span> <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('active');
  });

  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
}

// Global expose for dashboard and other scripts
window.showToast = showToast;
