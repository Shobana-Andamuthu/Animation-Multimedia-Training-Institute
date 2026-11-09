/**
 * ANILearn - Animation & Multimedia Training Institute
 * Main JavaScript Controller
 */

(function () {
  'use strict';

  // 1. Initialize Theme (Light / Dark)
  function initTheme() {
    const savedTheme = localStorage.getItem('anilearn_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcons(savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('anilearn_theme', newTheme);
    updateThemeToggleIcons(newTheme);
  }

  function updateThemeToggleIcons(theme) {
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'inline-block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'inline-block';
        }
      }
    });
  }

  // 2. Initialize Text Direction (LTR / RTL)
  function initDirection() {
    const savedDir = localStorage.getItem('anilearn_dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateDirectionButtons(savedDir);
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem('anilearn_dir', newDir);
    updateDirectionButtons(newDir);
  }

  function updateDirectionButtons(dir) {
    const dirButtons = document.querySelectorAll('.direction-toggle-btn');
    dirButtons.forEach(btn => {
      const label = btn.querySelector('.dir-label');
      if (label) {
        label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  }

  // 3. Hamburger Menu & Mobile Drawer
  function initMobileMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.mobile-drawer-overlay');
    const closeBtn = document.querySelector('.mobile-drawer-close');

    if (!hamburgerBtn || !mobileDrawer) return;

    function openMenu() {
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function resetSubmenu() {
      const sub = mobileDrawer.querySelector('.mobile-submenu');
      const tg = mobileDrawer.querySelector('.mobile-dropdown-toggle');
      if (sub) sub.classList.remove('open');
      if (tg) {
        tg.setAttribute('aria-expanded', 'false');
        const arrow = tg.querySelector('.arrow-icon');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    }

    function closeMenu() {
      resetSubmenu();
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (mobileDrawer.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Close when clicking mobile nav links
    const mobileLinks = mobileDrawer.querySelectorAll('a:not(.has-dropdown)');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close with Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // 4. Home Dropdown Menu Management
  function initHomeDropdown() {
    const dropdown = document.querySelector('.nav-item.dropdown');
    if (!dropdown) return;

    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        menu.classList.remove('show');
      }
    });

    // Mobile submenu toggle
    const mobileSubmenuToggle = document.querySelector('.mobile-dropdown-toggle');
    const mobileSubmenu = document.querySelector('.mobile-submenu');
    if (mobileSubmenuToggle && mobileSubmenu) {
      mobileSubmenuToggle.addEventListener('click', function (e) {
        e.preventDefault();
        const isOpen = mobileSubmenu.classList.toggle('open');
        mobileSubmenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const arrow = mobileSubmenuToggle.querySelector('.arrow-icon');
        if (arrow) {
          arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    }
  }

  // 5. Back to Top Button
  function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. Video Modal Popup
  function initVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (!modal) return;

    const modalClose = modal.querySelector('.video-modal-close');
    const modalContent = modal.querySelector('.video-wrapper');
    const triggerButtons = document.querySelectorAll('[data-video-trigger]');

    function openModal(videoSrc) {
      if (modalContent) {
        modalContent.innerHTML = `<iframe src="${videoSrc}?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (modalContent) {
        modalContent.innerHTML = '';
      }
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    triggerButtons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const videoSrc = this.getAttribute('data-video-src') || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
        openModal(videoSrc);
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // 7. Active Nav Link Highlighting
  function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item, .mobile-nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
        // If inside Home dropdown, also highlight parent Home link
        const parentDropdown = link.closest('.dropdown');
        if (parentDropdown) {
          const parentToggle = parentDropdown.querySelector('.dropdown-toggle');
          if (parentToggle) parentToggle.classList.add('active');
        }
      }
    });
  }

  // 8. Event Listeners Binding
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initDirection();
    initMobileMenu();
    initHomeDropdown();
    initBackToTop();
    initVideoModal();
    initActiveNav();

    // 8. FAQ Accordion Toggles
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', function () {
          const isActive = item.classList.contains('active');
          // Close other open faqs
          faqItems.forEach(other => other.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });

    // 9. Gallery Category Filters
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        galleryCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // 9b. Dashboard sidebar drawer (tablet and mobile)
    (function () {
      var sb = document.getElementById('dash-sidebar'), btn = document.getElementById('dash-menu-btn'), ov = document.getElementById('dash-sidebar-overlay');
      if (!sb || !btn || !ov) return;
      function set(open) { sb.classList.toggle('open', open); ov.classList.toggle('open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); document.body.style.overflow = open ? 'hidden' : ''; }
      btn.addEventListener('click', function () { set(!sb.classList.contains('open')); });
      ov.addEventListener('click', function () { set(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
      sb.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
      window.addEventListener('resize', function () { if (window.innerWidth > 1366) set(false); });
    })();

    // 10. Dashboard Tab Switching
    function initDashboardTabs() {
      const sidebarLinks = document.querySelectorAll('.dashboard-sidebar .sidebar-menu a[data-tab]');
      const tabViews = document.querySelectorAll('.dashboard-tab-view');
      if (!sidebarLinks.length || !tabViews.length) return;

      function switchTab(tabId) {
        sidebarLinks.forEach(link => {
          if (link.getAttribute('data-tab') === tabId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        tabViews.forEach(view => {
          if (view.id === `tab-view-${tabId}`) {
            view.classList.add('active');
          } else {
            view.classList.remove('active');
          }
        });

        try {
          history.replaceState(null, null, `#${tabId}`);
        } catch (e) {}

        const mainArea = document.querySelector('.dashboard-main');
        if (mainArea) mainArea.scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const tabId = this.getAttribute('data-tab');
          if (tabId) switchTab(tabId);
        });
      });

      // Support intra-dashboard links with data-switch-tab
      document.querySelectorAll('[data-switch-tab]').forEach(el => {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          const targetTab = this.getAttribute('data-switch-tab');
          if (targetTab) switchTab(targetTab);
        });
      });

      // On load check hash
      const initialHash = window.location.hash.replace('#', '');
      if (initialHash && document.getElementById(`tab-view-${initialHash}`)) {
        switchTab(initialHash);
      }
    }
    initDashboardTabs();

    // Theme toggle buttons click
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    // Direction toggle buttons click
    document.querySelectorAll('.direction-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleDirection);
    });
  });
})();

