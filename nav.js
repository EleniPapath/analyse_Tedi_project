// ============================================================
// nav.js — Κοινό navigation & shell για όλες τις σελίδες
// ============================================================

const PAGES = [
  { id: 'index',       title: 'Αρχική',            icon: '🏠', file: 'index.html',        group: 'home' },
  { id: 'recommender', title: 'Recommender',       icon: '🎯', file: 'recommender.html',  group: 'core' },
  { id: 'backend',     title: 'Backend Files',     icon: '🖥️', file: 'backend.html',      group: 'files' },
  { id: 'frontend',    title: 'Frontend Files',    icon: '⚛️', file: 'frontend.html',     group: 'files' },
  { id: 'scripts',     title: 'Scripts & Data',    icon: '📜', file: 'scripts.html',      group: 'files' },
  { id: 'database',    title: 'Database Schema',   icon: '🗄️', file: 'database.html',     group: 'deep' },
  { id: 'api',         title: 'REST API',          icon: '🌐', file: 'api.html',          group: 'deep' },
  { id: 'auth',        title: 'Authentication',    icon: '🔐', file: 'auth.html',         group: 'deep' },
  { id: 'race',        title: 'Race Conditions',   icon: '⚡', file: 'race.html',         group: 'deep' },
  { id: 'security',    title: 'Security',          icon: '🔒', file: 'security.html',     group: 'deep' },
  { id: 'exam',        title: 'Exam Prep',         icon: '🎓', file: 'exam.html',         group: 'prep' },
];

const GROUPS = {
  home:  { label: '',                          icon: '' },
  core:  { label: 'Core',                      icon: '🎯' },
  files: { label: 'Αρχεία Project',            icon: '📁' },
  deep:  { label: 'Deep Dives',                icon: '📚' },
  prep:  { label: 'Προετοιμασία Εξέτασης',     icon: '🎓' },
};

const PAGE_TITLES = {
  index:       ['🏠 EventHub — Οδηγός Κώδικα', 'Επιλογή ενότητας για μελέτη'],
  recommender: ['🎯 Recommender System',       'Biased Matrix Factorization — 4 phases'],
  backend:     ['🖥️ Backend Files',            'Django + DRF + PostgreSQL'],
  frontend:    ['⚛️ Frontend Files',           'React + Vite + MUI'],
  scripts:     ['📜 Scripts & Data',           'TLS certificates + dataset'],
  database:    ['🗄️ Database Schema',          'Πίνακες, constraints, indexes'],
  api:         ['🌐 REST API',                 '30+ endpoints με πλήρη ανάλυση'],
  auth:        ['🔐 Authentication Flow',      'JWT, interceptors, single-flight refresh'],
  race:        ['⚡ Race Conditions',          'select_for_update + transactions'],
  security:    ['🔒 Security',                 'TLS, CORS, CSRF, secure cookies'],
  exam:        ['🎓 Exam Prep',                'Ερωτήσεις καθηγητή + Q&A + Glossary + Flows'],
};

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function renderShell(currentPageId, pageTitle, pageSubtitle) {
  const currentIndex = PAGES.findIndex((p) => p.id === currentPageId);
  const prev = currentIndex > 0 ? PAGES[currentIndex - 1] : null;
  const next = currentIndex < PAGES.length - 1 ? PAGES[currentIndex + 1] : null;

  const topbar = `
    <header class="app-header">
      <div class="header-inner">
        <a href="index.html" class="brand">
          <span class="brand-icon">📘</span>
          <div>
            <h1>EventHub — Οδηγός Κώδικα</h1>
            <p class="brand-sub">Πλήρης ανάλυση του project</p>
          </div>
        </a>

        <nav class="top-nav">
          ${PAGES.filter(p => p.id !== 'index').map(p => `
            <a href="${p.file}" class="top-nav-link ${p.id === currentPageId ? 'active' : ''}">
              <span>${p.icon}</span>
              <span class="top-nav-label">${escapeHtml(p.title)}</span>
            </a>
          `).join('')}
        </nav>

        <button class="hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  `;

  const mobileMenu = `
    <div class="mobile-menu-overlay" id="mobileMenu">
      <aside class="mobile-menu">
        <div class="mobile-menu-head">
          <span>Πλοήγηση</span>
          <button class="close-btn" id="closeMobileMenu">✕</button>
        </div>
        ${Object.entries(GROUPS).map(([gid, g]) => {
          const items = PAGES.filter(p => p.group === gid);
          if (items.length === 0) return '';
          return `
            <div class="mobile-group">
              ${g.label ? `<div class="mobile-group-title">${g.icon} ${g.label}</div>` : ''}
              ${items.map(p => `
                <a href="${p.file}" class="mobile-link ${p.id === currentPageId ? 'active' : ''}">
                  <span>${p.icon}</span>
                  <span>${escapeHtml(p.title)}</span>
                </a>
              `).join('')}
            </div>
          `;
        }).join('')}
      </aside>
    </div>
  `;

  const pageHeaderHtml = pageTitle ? `
    <div class="page-header">
      <h1 class="page-title">${escapeHtml(pageTitle)}</h1>
      ${pageSubtitle ? `<p class="page-subtitle">${escapeHtml(pageSubtitle)}</p>` : ''}
    </div>
  ` : '';

  const prevNextHtml = (prev || next) ? `
    <div class="page-nav">
      ${prev ? `
        <a href="${prev.file}" class="page-nav-btn prev">
          <span class="page-nav-dir">← Προηγούμενη</span>
          <span class="page-nav-title">${prev.icon} ${escapeHtml(prev.title)}</span>
        </a>
      ` : '<div></div>'}
      ${next ? `
        <a href="${next.file}" class="page-nav-btn next">
          <span class="page-nav-dir">Επόμενη →</span>
          <span class="page-nav-title">${next.icon} ${escapeHtml(next.title)}</span>
        </a>
      ` : '<div></div>'}
    </div>
  ` : '';

  return { topbar, mobileMenu, pageHeaderHtml, prevNextHtml };
}

function mountShell(currentPageId, pageTitle, pageSubtitle) {
  const { topbar, mobileMenu, pageHeaderHtml, prevNextHtml } = renderShell(
    currentPageId, pageTitle, pageSubtitle
  );

  const shell = document.getElementById('app-shell');
  shell.innerHTML = `
    ${topbar}
    ${mobileMenu}
    <div class="app-body-single">
      <div class="content-wide">
        ${pageHeaderHtml}
        <div id="pageContent"></div>
        ${prevNextHtml}
      </div>
    </div>
    <button class="back-to-top" id="backToTop" title="Πάνω">↑</button>
  `;

  const hamburger = document.getElementById('hamburger');
  const mobileMenuEl = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('closeMobileMenu');

  if (hamburger) hamburger.addEventListener('click', () => mobileMenuEl.classList.add('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => mobileMenuEl.classList.remove('open'));
  if (mobileMenuEl) mobileMenuEl.addEventListener('click', (e) => {
    if (e.target === mobileMenuEl) mobileMenuEl.classList.remove('open');
  });

  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

window.PAGES = PAGES;
window.GROUPS = GROUPS;
window.PAGE_TITLES = PAGE_TITLES;
window.escapeHtml = escapeHtml;
window.mountShell = mountShell;