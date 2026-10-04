/**
 * GoldenYears Home Care — Family Dashboard Logic
 * Interactive 10-Tab Portal for Families & Caregivers
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initScheduleForm();
  initNotificationControls();
  initPaymentSimulator();
  initProfileForm();
  initSettingsForm();
});

/* --------------------------------------------------------------------------
   1. Dashboard Navigation Tabs
   -------------------------------------------------------------------------- */
function initDashboardTabs() {
  const navItems = document.querySelectorAll('.dashboard-nav-item');
  const sections = document.querySelectorAll('.dashboard-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-section');

      navItems.forEach(n => n.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      item.classList.add('active');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });

  // Handle direct hash navigation e.g. #schedule
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const matchingTab = document.querySelector(`.dashboard-nav-item[data-section="${hash}"]`);
    if (matchingTab) matchingTab.click();
  }
}

/* --------------------------------------------------------------------------
   2. Schedule Safety Visit Submission & Live Update
   -------------------------------------------------------------------------- */
function initScheduleForm() {
  const scheduleForm = document.getElementById('scheduleVisitForm');
  const upcomingList = document.getElementById('upcomingVisitsList');

  if (!scheduleForm) return;

  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const serviceType = document.getElementById('schedServiceType')?.value || 'Grab Bar Safety Installation';
    const visitDate = document.getElementById('schedDate')?.value || 'Tomorrow';
    const visitTime = document.getElementById('schedTime')?.value || 'Morning (9:00 AM - 12:00 PM)';
    const techName = document.getElementById('schedTech')?.value || 'Marcus Vance (CAPS Lead)';
    const notes = document.getElementById('schedNotes')?.value || 'Safety assessment & installation.';

    // Create new upcoming visit card
    if (upcomingList) {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.marginBottom = '1.25rem';
      card.style.borderLeft = '4px solid var(--color-forest)';
      card.innerHTML = `
        <div class="card-body">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <div>
              <span class="badge badge-success">Confirmed Booking</span>
              <h3 style="font-size:1.25rem; margin-top:0.4rem;">${serviceType}</h3>
            </div>
            <span style="font-weight:700; color:var(--color-terracotta);">${visitDate}</span>
          </div>
          <p style="margin-bottom:0.5rem;"><strong>Time Window:</strong> ${visitTime}</p>
          <p style="margin-bottom:0.5rem;"><strong>Assigned Technician:</strong> ${techName}</p>
          <p style="color:var(--text-muted); font-size:0.92rem;"><strong>Notes:</strong> ${notes}</p>
          <div style="display:flex; gap:0.75rem; margin-top:1rem;">
            <button class="btn btn-sm btn-secondary" onclick="window.showToast('Reschedule request sent to Care Coordinator.')">Reschedule</button>
            <button class="btn btn-sm btn-terracotta" onclick="this.closest('.card').remove(); window.showToast('Visit cancelled safely.')">Cancel</button>
          </div>
        </div>
      `;
      upcomingList.prepend(card);
    }

    if (window.showToast) {
      window.showToast('<span class="icon icon-inline" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></span> Safety visit scheduled! Confirmed in your Upcoming Visits tab.', 'success');
    }

    scheduleForm.reset();

    // Switch to upcoming tab
    const upcomingTab = document.querySelector('.dashboard-nav-item[data-section="sec-upcoming"]');
    if (upcomingTab) upcomingTab.click();
  });
}

/* --------------------------------------------------------------------------
   3. Notification Actions
   -------------------------------------------------------------------------- */
function initNotificationControls() {
  const markAllReadBtn = document.getElementById('btnMarkAllRead');
  const notifItems = document.querySelectorAll('.notification-item');
  const notifBadge = document.querySelector('.notif-count-badge');

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
      notifItems.forEach(item => {
        item.style.opacity = '0.6';
        const unreadDot = item.querySelector('.unread-dot');
        if (unreadDot) unreadDot.remove();
      });
      if (notifBadge) notifBadge.textContent = '0';
      if (window.showToast) window.showToast('All notifications marked as read.');
    });
  }
}

/* --------------------------------------------------------------------------
   4. Payment Management Simulator
   -------------------------------------------------------------------------- */
function initPaymentSimulator() {
  const payButtons = document.querySelectorAll('.btn-pay-invoice');
  payButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const invoiceId = btn.getAttribute('data-invoice');
      const invoiceRow = btn.closest('tr');

      btn.disabled = true;
      btn.textContent = 'Processing...';

      setTimeout(() => {
        if (invoiceRow) {
          const statusCell = invoiceRow.querySelector('.invoice-status');
          if (statusCell) {
            statusCell.innerHTML = '<span class="badge badge-success">Paid in Full</span>';
          }
        }
        btn.outerHTML = '<span style="font-weight:600; color:var(--color-success); font-size:0.9rem;"><span class="icon icon-inline" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span> Settled</span>';
        if (window.showToast) {
          window.showToast(`Invoice #${invoiceId} settled successfully! Receipt emailed to family.`, 'success');
        }
      }, 1000);
    });
  });
}

/* --------------------------------------------------------------------------
   5. Family Profile Update
   -------------------------------------------------------------------------- */
function initProfileForm() {
  const form = document.getElementById('familyProfileForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (window.showToast) {
      window.showToast('Family profile & medical mobility notes updated successfully!', 'success');
    }
  });
}

/* --------------------------------------------------------------------------
   6. Settings Update
   -------------------------------------------------------------------------- */
function initSettingsForm() {
  const form = document.getElementById('portalSettingsForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (window.showToast) {
      window.showToast('Notification preferences & emergency alerts saved.', 'success');
    }
  });
}
