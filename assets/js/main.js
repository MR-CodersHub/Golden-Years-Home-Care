/**
 * GoldenYears Home Care — Main JavaScript (ES6)
 * Vanilla JS • Fully Accessible • LocalStorage Preferences • Rich Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndRTL();
  initStickyHeader();
  initMobileMenu();
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
      icon.textContent = '☀️';
      icon.setAttribute('title', 'Switch to Warm Light Mode');
    } else {
      icon.textContent = '🌙';
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
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      toggleBtn.innerHTML = '☰';
    }
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
        recommendationDisplay.innerHTML = '<span style="color:var(--color-success)">★ Outstanding! Home has minimal hazards. Schedule an annual safety check to keep it up.</span>';
      } else if (checkedCount <= 2) {
        recommendationDisplay.innerHTML = '<span style="color:var(--color-warning)">⚠️ Moderate Risk: Recommend installing 2-3 ADA grab bars and testing stair handrails immediately.</span>';
      } else {
        recommendationDisplay.innerHTML = '<span style="color:var(--color-danger)">🚨 Urgent Attention Needed: Multiple severe fall hazards detected. Comprehensive 45-point audit strongly recommended.</span>';
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
      showToast('🎉 Safety Visit Scheduled! Our Care Coordinator will call within 15 minutes.');
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

  toast.innerHTML = `<span>🛡️</span> <span>${message}</span>`;
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
