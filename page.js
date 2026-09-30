// ============================================================
// page.js — Rendering περιεχομένου ανά σελίδα (FIXED + PROFESSOR Q)
// ============================================================

(function () {
  'use strict';

  const getSections = () => (typeof SECTIONS !== 'undefined' ? SECTIONS : []);
  const getRecommender = () => (typeof RECOMMENDER_SECTION !== 'undefined' ? RECOMMENDER_SECTION : null);
  const getDeepDives = () => (typeof DEEPDIVES !== 'undefined' ? DEEPDIVES : []);
  const esc = (typeof escapeHtml !== 'undefined') ? escapeHtml : (s) => String(s);

  // ============================================
  // BLOCK RENDERERS
  // ============================================
  const renderBlock = (block) => {
    switch (block.type) {
      case 'text':
        return `
          <div class="dd-block">
            ${block.title ? `<div class="dd-block-title">${esc(block.title)}</div>` : ''}
            <p class="dd-text">${esc(block.body)}</p>
          </div>`;

      case 'list':
        return `
          <div class="dd-block">
            ${block.title ? `<div class="dd-block-title">${esc(block.title)}</div>` : ''}
            <ul class="dd-list">
              ${block.items.map(i => `<li>${esc(i)}</li>`).join('')}
            </ul>
          </div>`;

      case 'table':
        return `
          <div class="dd-block">
            ${block.title ? `<div class="dd-block-title">${esc(block.title)}</div>` : ''}
            <div class="dd-table-wrapper">
              <table class="dd-table">
                <thead><tr>${block.headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
                <tbody>
                  ${block.rows.map(row => `<tr>${row.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>`;

      case 'code':
        return `
          <div class="dd-block">
            ${block.title ? `<div class="dd-block-title">${esc(block.title)}</div>` : ''}
            <pre class="dd-code"><code>${esc(block.code)}</code></pre>
          </div>`;

      case 'flow':
        return `
          <div class="dd-block">
            ${block.title ? `<div class="dd-block-title">${esc(block.title)}</div>` : ''}
            <ol class="dd-flow">
              ${block.steps.map(s => `
                <li class="dd-flow-step">
                  <span class="dd-flow-num">${s.n}</span>
                  <span class="dd-flow-text">${esc(s.text)}</span>
                </li>`).join('')}
            </ol>
          </div>`;

      case 'endpoint':
        return `
          <div class="dd-endpoint">
            <div class="dd-endpoint-head">
              <span class="dd-method dd-method-${block.method.split(' ')[0].toLowerCase()}">${esc(block.method)}</span>
              <code class="dd-endpoint-url">${esc(block.url)}</code>
            </div>
            <div class="dd-endpoint-body">
              ${block.auth ? `<div class="dd-row"><span class="dd-label">🔐 Auth:</span><span class="dd-value">${esc(block.auth)}</span></div>` : ''}
              ${block.params ? `<div class="dd-row"><span class="dd-label">📋 Params:</span><code class="dd-value">${esc(block.params)}</code></div>` : ''}
              ${block.request ? `<div class="dd-row"><span class="dd-label">📤 Request:</span><code class="dd-value">${esc(block.request)}</code></div>` : ''}
              ${block.response ? `<div class="dd-row"><span class="dd-label">📥 Response:</span><code class="dd-value">${esc(block.response)}</code></div>` : ''}
              ${block.errors ? `<div class="dd-row"><span class="dd-label">⚠️ Errors:</span><span class="dd-value dd-error">${esc(block.errors)}</span></div>` : ''}
              ${block.why ? `<div class="dd-row dd-why"><span class="dd-label">💡 Γιατί:</span><span class="dd-value">${esc(block.why)}</span></div>` : ''}
            </div>
          </div>`;

      case 'qa':
        return `
          <div class="dd-qa">
            <div class="dd-qa-q"><span class="dd-qa-icon">Q</span><span>${esc(block.q)}</span></div>
            <div class="dd-qa-a"><span class="dd-qa-icon">A</span><span>${esc(block.a || block.body || '')}</span></div>
          </div>`;

      case 'glossary':
        return `
          <div class="dd-glossary">
            ${block.terms.map(t => `
              <div class="dd-glossary-item">
                <div class="dd-glossary-term">${esc(t.term)}</div>
                <div class="dd-glossary-def">${esc(t.def)}</div>
              </div>`).join('')}
          </div>`;

      default:
        return '';
    }
  };

  const renderDeepDiveSection = (dd) => `
    <section class="dd-section" id="${dd.id}">
      <div class="dd-section-head">
        <span class="dd-section-icon">${dd.icon}</span>
        <h2>${esc(dd.title)}</h2>
      </div>
      <p class="dd-intro"><strong>${esc(dd.subtitle)}</strong><br>${esc(dd.intro)}</p>
      <div class="dd-blocks">${dd.blocks.map(renderBlock).join('')}</div>
    </section>
  `;

  // ============================================
  // FILE CARD
  // ============================================
  const renderFileCard = (sectionId, file) => {
    const keyPointsHtml = (file.keyPoints || []).map(kp => `<li>${esc(kp)}</li>`).join('');
    const typeLabel = { backend: 'Backend', frontend: 'Frontend', script: 'Script' }[file.type] || file.type;

    return `
      <div class="file-card" data-key="${esc(sectionId + '::' + file.name)}">
        <div class="file-header">
          <span class="file-badge ${file.type}">${typeLabel}</span>
          <div class="file-main">
            <div class="file-name">${esc(file.name)}</div>
            <div class="file-folder">📁 ${esc(file.folder)}</div>
            <div class="file-summary">${esc(file.summary)}</div>
          </div>
          <span class="file-toggle">▾</span>
        </div>
        <div class="file-body">
          <div class="file-body-inner">
            <div class="file-block">
              <div class="block-title">📄 Τι περιέχει</div>
              <div class="block-text">${esc(file.what)}</div>
            </div>
            <div class="file-block">
              <div class="block-title">🎯 Γιατί υπάρχει</div>
              <div class="block-text">${esc(file.why)}</div>
            </div>
            ${keyPointsHtml ? `
              <div class="file-block key-points">
                <div class="block-title">⭐ Βασικά σημεία για την εξέταση</div>
                <ul class="block-list">${keyPointsHtml}</ul>
              </div>` : ''}
          </div>
        </div>
      </div>`;
  };

  const bindAccordion = () => {
    document.querySelectorAll('.file-header').forEach(h => {
      h.addEventListener('click', () => {
        const card = h.closest('.file-card');
        card.classList.toggle('open');
      });
    });
  };

  // ============================================
  // HELPERS
  // ============================================
  function renderFilesPage(type) {
    const allSections = getSections();
    const sections = allSections.filter(s =>
      s.files.some(f => f.type === type)
    );

    if (sections.length === 0) {
      return `<p class="empty-msg">Δεν βρέθηκαν αρχεία τύπου "${type}". Έλεγξε ότι το data.js φορτώνεται σωστά.</p>`;
    }

    return `
      <div class="files-search-bar">
        <input type="text" id="fileSearch" placeholder="🔍  Αναζήτηση αρχείου, φακέλου ή λέξης-κλειδιού..." autocomplete="off" />
        <span class="files-count" id="filesCount"></span>
      </div>
      <div id="filesContainer">
        ${sections.map(s => `
          <section class="doc-section" id="${s.id}">
            <div class="section-header">
              <span class="section-icon">${s.icon}</span>
              <h2 class="section-title">${esc(s.title)}</h2>
              <span class="section-count">${s.files.length} αρχεία</span>
            </div>
            ${s.files.map(f => renderFileCard(s.id, f)).join('')}
          </section>
        `).join('')}
      </div>
    `;
  }

  function renderDeepDiveById(id) {
    const dd = getDeepDives().find(d => d.id === id);
    if (!dd) {
      return `<p class="empty-msg">Δεν βρέθηκε η ενότητα "${id}". Έλεγξε ότι το docs.js φορτώνεται σωστά.</p>`;
    }
    return renderDeepDiveSection(dd);
  }

  function renderRecommenderPage() {
    const r = getRecommender();
    if (!r) return '<p class="empty-msg">Δεν βρέθηκε το RECOMMENDER_SECTION. Έλεγξε το data.js.</p>';

    const termsHtml = r.formula.terms.map(t => `
      <div class="rec-term" style="--term-color: ${t.color}">
        <div class="rec-term-symbol">${esc(t.symbol)}</div>
        <div class="rec-term-info">
          <div class="rec-term-name">${esc(t.name)}</div>
          <div class="rec-term-desc">${esc(t.desc)}</div>
        </div>
      </div>`).join('');

    const renderSteps = (steps) => `
      <div class="rec-steps">
        ${steps.map(s => `
          <div class="rec-step">
            <div class="rec-step-num">${s.n}</div>
            <div class="rec-step-body">
              <div class="rec-step-title">${esc(s.title)}</div>
              <div class="rec-step-text">${esc(s.body)}</div>
            </div>
          </div>`).join('')}
      </div>`;

    const phaseA = r.phaseA;
    const phaseB = r.phaseB;
    const phaseC = r.phaseC;
    const phaseD = r.phaseD;

    return `
      <p class="rec-intro">${esc(r.intro)}</p>

      <div class="rec-formula">
        <div class="rec-formula-main">${esc(r.formula.main)}</div>
        <p class="rec-formula-sub">${esc(r.formula.subtitle)}</p>
        <div class="rec-terms">${termsHtml}</div>
      </div>

      <div class="rec-phase" data-phase="A">
        <div class="rec-phase-header"><span class="rec-phase-letter">A</span><h3>${esc(phaseA.title)}</h3></div>
        ${renderSteps(phaseA.steps)}
        <div class="rec-tables-row">
          <div class="rec-table-block">
            <div class="rec-table-title">📁 ${esc(phaseA.datasetRatings.title)}</div>
            <table class="rec-table">
              <thead><tr><th>Row</th><th>Rating</th></tr></thead>
              <tbody>${phaseA.datasetRatings.rows.map(row => `
                <tr><td>${esc(row.row)}</td>
                <td><span class="rec-rating-pill" style="background:${row.color}22;color:${row.color}">${esc(row.rating)}</span></td></tr>`).join('')}
              </tbody>
            </table>
          </div>
          <div class="rec-table-block">
            <div class="rec-table-title">⚡ ${esc(phaseA.liveRatings.title)}</div>
            <table class="rec-table">
              <thead><tr><th>Signal</th><th>Rating</th></tr></thead>
              <tbody>${phaseA.liveRatings.rows.map(row => `
                <tr><td>${esc(row.signal)}</td><td><code>${esc(row.rating)}</code> <span class="rec-example">${esc(row.example)}</span></td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
        <div class="rec-rules">
          <div class="rec-rules-title">⚠️ Κανόνες</div>
          <ul>${phaseA.rules.map(rule => `<li>${esc(rule)}</li>`).join('')}</ul>
        </div>
      </div>

      <div class="rec-phase" data-phase="B">
        <div class="rec-phase-header"><span class="rec-phase-letter">B</span><h3>${esc(phaseB.title)}</h3></div>
        ${renderSteps(phaseB.steps)}
        <div class="rec-sgd">
          <div class="rec-sgd-title">${esc(phaseB.sgd.title)}</div>
          <div class="rec-sgd-lines">
            ${phaseB.sgd.lines.map(l => `
              <div class="rec-sgd-line"><code>${esc(l.code)}</code><span class="rec-sgd-comment">${esc(l.comment)}</span></div>`).join('')}
          </div>
          <div class="rec-sgd-warning"><span>⚠️</span><span>${esc(phaseB.sgd.warning)}</span></div>
        </div>
      </div>

      <div class="rec-phase" data-phase="C">
        <div class="rec-phase-header"><span class="rec-phase-letter">C</span><h3>${esc(phaseC.title)}</h3></div>
        ${renderSteps(phaseC.steps)}
        <div class="rec-metrics">
          ${phaseC.metrics.map(m => `
            <div class="rec-metric-card">
              <div class="rec-metric-name">${esc(m.name)}</div>
              <code class="rec-metric-formula">${esc(m.formula)}</code>
              <div class="rec-metric-meaning">${esc(m.meaning)}</div>
            </div>`).join('')}
        </div>
        <div class="rec-results">
          <div class="rec-results-title">📈 ${esc(phaseC.results.title)}</div>
          <table class="rec-table rec-table-results">
            <thead><tr><th>Μετρική</th><th>Τιμή</th><th>Baseline</th></tr></thead>
            <tbody>${phaseC.results.rows.map(row => `
              <tr class="${row.highlight ? 'rec-row-highlight' : ''}">
                <td>${esc(row.metric)}</td>
                <td class="rec-value">${esc(row.value)}</td>
                <td class="rec-baseline">${esc(row.baseline)}</td>
              </tr>`).join('')}</tbody>
          </table>
          <ul class="rec-notes">${phaseC.results.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>
        </div>
      </div>

      <div class="rec-phase" data-phase="D">
        <div class="rec-phase-header"><span class="rec-phase-letter">D</span><h3>${esc(phaseD.title)}</h3></div>
        ${renderSteps(phaseD.steps)}
      </div>

      <div class="rec-worked">
        <div class="rec-worked-title">🧮 ${esc(r.workedExample.title)}</div>
        <p class="rec-worked-intro">${esc(r.workedExample.intro)}</p>
        <div class="rec-worked-rows">
          ${r.workedExample.rows.map(row => `
            <div class="rec-worked-row rec-wg-${row.group}">
              <div class="rec-worked-term">${esc(row.term)}</div>
              <div class="rec-worked-value">${esc(row.value)}</div>
              <div class="rec-worked-meaning">${esc(row.meaning)}</div>
            </div>`).join('')}
        </div>
        <div class="rec-worked-message">💡 ${esc(r.workedExample.message)}</div>
      </div>

      <div class="rec-edge-grid">
        ${r.edgeCases.map(e => `
          <div class="rec-edge-card">
            <div class="rec-edge-icon">${e.icon}</div>
            <div class="rec-edge-title">${esc(e.title)}</div>
            ${e.quote ? `<blockquote class="rec-edge-quote">${esc(e.quote)}</blockquote>` : ''}
            <div class="rec-edge-text">${esc(e.explanation)}</div>
          </div>`).join('')}
      </div>

      <div class="rec-hyper">
        <div class="rec-hyper-title">⚙️ ${esc(r.hyperparams.title)}</div>
        <div class="rec-hyper-grid">
          ${r.hyperparams.rows.map(row => `
            <div class="rec-hyper-item">
              <div class="rec-hyper-name">${esc(row.name)}</div>
              <div class="rec-hyper-value">${esc(row.value)}</div>
              <div class="rec-hyper-note">${esc(row.note)}</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="rec-files">
        <div class="rec-files-title">📁 ${esc(r.filesInvolved.title)}</div>
        <div class="rec-files-list">
          ${r.filesInvolved.files.map(f => `
            <div class="rec-file-item">
              <div class="rec-file-name">${esc(f.name)}</div>
              <div class="rec-file-folder">${esc(f.folder)}</div>
              <div class="rec-file-what">${esc(f.what)}</div>
            </div>`).join('')}
        </div>
      </div>
    `;
  }

  function renderHomePage() {
    const cards = [
      { id: 'recommender', icon: '🎯', title: 'Recommender System',
        sub: 'Biased Matrix Factorization — 4 phases (A, B, C, D)',
        desc: 'Ο αλγόριθμος σύστασης εξηγημένος βήμα-βήμα: formula, SGD updates, cross-validation, worked example, edge cases.' },
      { id: 'backend', icon: '🖥️', title: 'Backend Files',
        sub: 'Django + DRF + PostgreSQL',
        desc: 'Όλα τα αρχεία του backend: models, serializers, views, services, permissions, migrations.' },
      { id: 'frontend', icon: '⚛️', title: 'Frontend Files',
        sub: 'React + Vite + MUI',
        desc: 'Components, pages, services, context. Όλη η αρχιτεκτονική του React UI.' },
      { id: 'database', icon: '🗄️', title: 'Database Schema',
        sub: '9 πίνακες με πλήρη αιτιολόγηση',
        desc: 'Πίνακες, στήλες, constraints, indexes — γιατί κάθε απόφαση πάρθηκε.' },
      { id: 'api', icon: '🌐', title: 'REST API',
        sub: '30+ endpoints',
        desc: 'Κάθε endpoint με request/response, permissions, errors, και το «γιατί».' },
      { id: 'auth', icon: '🔐', title: 'Authentication Flow',
        sub: 'JWT, interceptors, single-flight refresh',
        desc: 'Το πλήρες ταξίδι ενός token — από το login μέχρι το auto-refresh.' },
      { id: 'race', icon: '⚡', title: 'Race Conditions',
        sub: 'select_for_update + transactions',
        desc: 'Πώς αποφεύγεται η υπερπώληση εισιτηρίων όταν πολλοί χρήστες κάνουν κράτηση ταυτόχρονα.' },
      { id: 'security', icon: '🔒', title: 'Security',
        sub: 'TLS, CORS, CSRF, secure cookies',
        desc: 'Τα 6 layers ασφαλείας και γιατί κάθε ένα χρειάζεται.' },
      { id: 'exam', icon: '🎓', title: 'Exam Prep',
        sub: '🎤 Ερωτήσεις Καθηγητή + 30+ Q&A + Glossary',
        desc: 'Οι 10 ερωτήσεις που ρώτησε ο καθηγητής + όλες οι πιθανές ερωτήσεις, λεξικό όρων, και end-to-end flows.' },
      { id: 'scripts', icon: '📜', title: 'Scripts & Data',
        sub: 'TLS certs + dataset',
        desc: 'make_certs.sh, install_requirements.sh, event_interest.csv.' },
    ];

    return `
      <div class="home-hero">
        <h1>👋 Καλώς ήρθες στον οδηγό!</h1>
        <p>Διάλεξε μια ενότητα για να ξεκινήσεις. Κάθε σελίδα είναι αυτόνομη, με δικό της search και πλοήγηση.</p>
      </div>
      <div class="home-grid">
        ${cards.map(c => `
          <a href="${c.id}.html" class="home-card">
            <div class="home-card-icon">${c.icon}</div>
            <h3 class="home-card-title">${esc(c.title)}</h3>
            <div class="home-card-sub">${esc(c.sub)}</div>
            <p class="home-card-desc">${esc(c.desc)}</p>
            <span class="home-card-arrow">→</span>
          </a>
        `).join('')}
      </div>
    `;
  }

  function initSearch() {
    const input = document.getElementById('fileSearch');
    if (!input) return;

    const filesContainer = document.getElementById('filesContainer');
    const countEl = document.getElementById('filesCount');
    if (!filesContainer) return;

    const allCards = Array.from(filesContainer.querySelectorAll('.file-card'));
    const allSections = Array.from(filesContainer.querySelectorAll('.doc-section'));

    const updateCount = (visible) => {
      countEl.textContent = `${visible} / ${allCards.length} αρχεία`;
    };
    updateCount(allCards.length);

    let timer = null;
    input.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const q = e.target.value.trim().toLowerCase();
        let visible = 0;

        allCards.forEach(card => {
          const text = card.textContent.toLowerCase();
          const match = !q || text.includes(q);
          card.style.display = match ? '' : 'none';
          if (match) visible++;
        });

        allSections.forEach(sec => {
          const visibleCards = sec.querySelectorAll('.file-card:not([style*="display: none"])');
          sec.style.display = visibleCards.length > 0 ? '' : 'none';
        });

        updateCount(visible);
      }, 120);
    });
  }

  // ============================================
  // PAGE RENDERERS
  // ============================================
  const pageRenderers = {
    index:       renderHomePage,
    recommender: renderRecommenderPage,
    backend:     () => renderFilesPage('backend'),
    frontend:    () => renderFilesPage('frontend'),
    scripts:     () => renderFilesPage('script'),
    database:    () => renderDeepDiveById('db-deepdive'),
    api:         () => renderDeepDiveById('api-deepdive'),
    auth:        () => renderDeepDiveById('auth-deepdive'),
    race:        () => renderDeepDiveById('race-deepdive'),
    security:    () => renderDeepDiveById('security-deepdive'),
    exam: () => {
      const sections = ['professor-questions', 'exam-qa', 'glossary', 'data-flows']
        .map(id => getDeepDives().find(d => d.id === id))
        .filter(Boolean);
      return sections.length > 0
        ? sections.map(renderDeepDiveSection).join('')
        : '<p class="empty-msg">Δεν βρέθηκαν τα deep dives. Έλεγξε το docs.js.</p>';
    },
  };

  // ============================================
  // INIT
  // ============================================
  function init() {
    const key = document.body.dataset.page || 'index';
    const titles = (typeof PAGE_TITLES !== 'undefined') ? PAGE_TITLES : {};
    const titleInfo = titles[key] || ['EventHub Docs', ''];
    const title = titleInfo[0];
    const subtitle = titleInfo[1];

    document.title = title.replace(/^[^ ]+ /, '') + ' · EventHub Docs';

    if (typeof mountShell === 'function') {
      mountShell(key, title, subtitle);
    } else if (typeof window.mountShell === 'function') {
      window.mountShell(key, title, subtitle);
    } else {
      console.error('[page.js] mountShell is not defined — check that nav.js loaded before page.js');
      return;
    }

    const container = document.getElementById('pageContent');
    if (!container) {
      console.error('[page.js] #pageContent not found — mountShell failed');
      return;
    }

    const renderer = pageRenderers[key];
    if (renderer) {
      try {
        container.innerHTML = renderer();
        bindAccordion();
        initSearch();
      } catch (err) {
        console.error('[page.js] Error rendering page:', err);
        container.innerHTML = `<div class="empty-msg">Σφάλμα rendering: ${esc(err.message)}</div>`;
      }
    } else {
      container.innerHTML = `<p class="empty-msg">Άγνωστη σελίδα: "${key}"</p>`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();