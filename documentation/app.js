// ============================================================
// app.js — Λογική της εφαρμογής
// Διαβάζει το SECTIONS + RECOMMENDER_SECTION + DEEPDIVES
// από data.js και docs.js, και φτιάχνει το DOM.
// Διαχειρίζεται search, filter, navigation, deep-dives.
// ============================================================

(function () {
  'use strict';

  // ============================================
  // STATE
  // ============================================
  const state = {
    query: '',
    typeFilter: 'all',
    openFiles: new Set(),
  };

  // ============================================
  // DOM REFERENCES
  // ============================================
  const els = {
    sidebarNav: document.getElementById('sidebarNav'),
    sectionsContainer: document.getElementById('sectionsContainer'),
    searchInput: document.getElementById('searchInput'),
    typeFilters: document.getElementById('typeFilters'),
    headerStats: document.getElementById('headerStats'),
    noResults: document.getElementById('noResults'),
    backToTop: document.getElementById('backToTop'),
  };

  // ============================================
  // UTILS
  // ============================================
  const fileKey = (sectionId, fileName) => `${sectionId}::${fileName}`;

  const escapeHtml = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const matchesQuery = (file, query) => {
    if (!query) return true;
    const q = query.toLowerCase();
    const haystack = [
      file.name,
      file.folder,
      file.summary,
      file.what,
      file.why,
      ...(file.keyPoints || []),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  };

  const matchesType = (file, typeFilter) => {
    if (typeFilter === 'all') return true;
    return file.type === typeFilter;
  };

  const getFilteredSections = () => {
    return SECTIONS
      .map((section) => ({
        ...section,
        files: section.files.filter(
          (f) => matchesQuery(f, state.query) && matchesType(f, state.typeFilter)
        ),
      }))
      .filter((section) => section.files.length > 0);
  };

  // ============================================
  // RENDER — HEADER STATS
  // ============================================
  const renderStats = () => {
    const allFiles = SECTIONS.flatMap((s) => s.files);
    const backend = allFiles.filter((f) => f.type === 'backend').length;
    const frontend = allFiles.filter((f) => f.type === 'frontend').length;
    const scripts = allFiles.filter((f) => f.type === 'script').length;

    els.headerStats.innerHTML = `
      <span class="stat-badge">Σύνολο: <strong>${allFiles.length}</strong></span>
      <span class="stat-badge">🖥️ <strong>${backend}</strong></span>
      <span class="stat-badge">⚛️ <strong>${frontend}</strong></span>
      <span class="stat-badge">📜 <strong>${scripts}</strong></span>
    `;
  };

  // ============================================
  // RENDER — SIDEBAR
  // ============================================
  const renderSidebar = (sections) => {
    const groups = {
      backend: { label: 'Backend', icon: '🖥️', sections: [] },
      frontend: { label: 'Frontend', icon: '⚛️', sections: [] },
      script: { label: 'Scripts & Data', icon: '📜', sections: [] },
    };

    sections.forEach((s) => {
      const firstType = s.files[0]?.type || 'backend';
      if (groups[firstType]) groups[firstType].sections.push(s);
    });

    let html = '';

    // ---- 1. Recommender link (πάντα πρώτο αν δεν φιλτραριστεί έξω) ----
    const recMatchesQ = !state.query ||
      JSON.stringify(RECOMMENDER_SECTION).toLowerCase().includes(state.query.toLowerCase());
    const recMatchesT = state.typeFilter === 'all' || state.typeFilter === 'backend';
    if (recMatchesQ && recMatchesT) {
      html += `<div class="sidebar-group">`;
      html += `<div class="sidebar-group-title">🎯 Recommender</div>`;
      html += `
        <a class="sidebar-link" href="#recommender" data-section="recommender">
          <span>🎯</span>
          <span>Deep Dive</span>
          <span class="count">4</span>
        </a>
      `;
      html += `</div>`;
    }

    // ---- 2. Deep-dives links ----
    const visibleDeepDives = DEEPDIVES.filter((dd) => {
      const matchesQ = !state.query ||
        JSON.stringify(dd).toLowerCase().includes(state.query.toLowerCase());
      const matchesT = state.typeFilter === 'all' || state.typeFilter === dd.type;
      return matchesQ && matchesT;
    });

    if (visibleDeepDives.length > 0) {
      html += `<div class="sidebar-group">`;
      html += `<div class="sidebar-group-title">📚 Deep Dives</div>`;
      visibleDeepDives.forEach((dd) => {
        // Σύντομο label — αφαιρεί το "— Deep Dive" suffix
        const shortLabel = dd.title.replace(/\s*—\s*Deep Dive\s*$/i, '').replace(/\s*—\s*.*$/, '');
        html += `
          <a class="sidebar-link" href="#${dd.id}" data-section="${dd.id}">
            <span>${dd.icon}</span>
            <span>${escapeHtml(shortLabel)}</span>
          </a>
        `;
      });
      html += `</div>`;
    }

    // ---- 3. Τα κανονικά sections (backend / frontend / script) ----
    Object.entries(groups).forEach(([, group]) => {
      if (group.sections.length === 0) return;
      html += `<div class="sidebar-group">`;
      html += `<div class="sidebar-group-title">${group.icon} ${group.label}</div>`;
      group.sections.forEach((s) => {
        html += `
          <a class="sidebar-link" href="#${s.id}" data-section="${s.id}">
            <span>${s.icon}</span>
            <span>${escapeHtml(s.title)}</span>
            <span class="count">${s.files.length}</span>
          </a>
        `;
      });
      html += `</div>`;
    });

    els.sidebarNav.innerHTML = html;

    // Smooth scroll για όλα τα links
    els.sidebarNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(a.dataset.section);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  // ============================================
  // RENDER — FILE CARD
  // ============================================
  const renderFileCard = (sectionId, file) => {
    const key = fileKey(sectionId, file.name);
    const isOpen = state.openFiles.has(key);

    const keyPointsHtml = (file.keyPoints || [])
      .map((kp) => `<li>${escapeHtml(kp)}</li>`)
      .join('');

    const typeLabel = {
      backend: 'Backend',
      frontend: 'Frontend',
      script: 'Script',
    }[file.type] || file.type;

    return `
      <div class="file-card ${isOpen ? 'open' : ''}" data-key="${escapeHtml(key)}">
        <div class="file-header" data-toggle="${escapeHtml(key)}">
          <span class="file-badge ${file.type}">${typeLabel}</span>
          <div class="file-main">
            <div class="file-name">${escapeHtml(file.name)}</div>
            <div class="file-folder">📁 ${escapeHtml(file.folder)}</div>
            <div class="file-summary">${escapeHtml(file.summary)}</div>
          </div>
          <span class="file-toggle">▾</span>
        </div>
        <div class="file-body">
          <div class="file-body-inner">
            <div class="file-block">
              <div class="block-title">📄 Τι περιέχει</div>
              <div class="block-text">${escapeHtml(file.what)}</div>
            </div>
            <div class="file-block">
              <div class="block-title">🎯 Γιατί υπάρχει</div>
              <div class="block-text">${escapeHtml(file.why)}</div>
            </div>
            ${keyPointsHtml ? `
              <div class="file-block key-points">
                <div class="block-title">⭐ Βασικά σημεία για την εξέταση</div>
                <ul class="block-list">${keyPointsHtml}</ul>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  };

  // ============================================
  // RENDER — RECOMMENDER SECTION
  // ============================================
  const renderRecommenderSection = () => {
    const r = RECOMMENDER_SECTION;

    const haystack = JSON.stringify(r).toLowerCase();
    const matchesQ = !state.query || haystack.includes(state.query.toLowerCase());
    const matchesT = state.typeFilter === 'all' || state.typeFilter === 'backend';
    if (!matchesQ || !matchesT) return '';

    // --- Formula ---
    const formulaHtml = `
      <div class="rec-formula">
        <div class="rec-formula-main">${escapeHtml(r.formula.main)}</div>
        <p class="rec-formula-sub">${escapeHtml(r.formula.subtitle)}</p>
        <div class="rec-terms">
          ${r.formula.terms.map(t => `
            <div class="rec-term" style="--term-color: ${t.color}">
              <div class="rec-term-symbol">${escapeHtml(t.symbol)}</div>
              <div class="rec-term-info">
                <div class="rec-term-name">${escapeHtml(t.name)}</div>
                <div class="rec-term-desc">${escapeHtml(t.desc)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const phaseA = r.phaseA;
    const phaseB = r.phaseB;
    const phaseC = r.phaseC;
    const phaseD = r.phaseD;

    const renderSteps = (steps) => `
      <div class="rec-steps">
        ${steps.map(s => `
          <div class="rec-step">
            <div class="rec-step-num">${s.n}</div>
            <div class="rec-step-body">
              <div class="rec-step-title">${escapeHtml(s.title)}</div>
              <div class="rec-step-text">${escapeHtml(s.body)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    const phaseAHtml = `
      <div class="rec-phase" data-phase="A">
        <div class="rec-phase-header">
          <span class="rec-phase-letter">A</span>
          <h3>${escapeHtml(phaseA.title)}</h3>
        </div>
        ${renderSteps(phaseA.steps)}

        <div class="rec-tables-row">
          <div class="rec-table-block">
            <div class="rec-table-title">📁 ${escapeHtml(phaseA.datasetRatings.title)}</div>
            <table class="rec-table">
              <thead><tr><th>Row</th><th>Rating</th></tr></thead>
              <tbody>
                ${phaseA.datasetRatings.rows.map(row => `
                  <tr>
                    <td>${escapeHtml(row.row)}</td>
                    <td><span class="rec-rating-pill" style="background:${row.color}22;color:${row.color}">${escapeHtml(row.rating)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="rec-table-block">
            <div class="rec-table-title">⚡ ${escapeHtml(phaseA.liveRatings.title)}</div>
            <table class="rec-table">
              <thead><tr><th>Signal</th><th>Rating</th></tr></thead>
              <tbody>
                ${phaseA.liveRatings.rows.map(row => `
                  <tr>
                    <td>${escapeHtml(row.signal)}</td>
                    <td><code>${escapeHtml(row.rating)}</code> <span class="rec-example">${escapeHtml(row.example)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="rec-rules">
          <div class="rec-rules-title">⚠️ Κανόνες</div>
          <ul>
            ${phaseA.rules.map(rule => `<li>${escapeHtml(rule)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    const phaseBHtml = `
      <div class="rec-phase" data-phase="B">
        <div class="rec-phase-header">
          <span class="rec-phase-letter">B</span>
          <h3>${escapeHtml(phaseB.title)}</h3>
        </div>
        ${renderSteps(phaseB.steps)}

        <div class="rec-sgd">
          <div class="rec-sgd-title">${escapeHtml(phaseB.sgd.title)}</div>
          <div class="rec-sgd-lines">
            ${phaseB.sgd.lines.map(l => `
              <div class="rec-sgd-line">
                <code>${escapeHtml(l.code)}</code>
                <span class="rec-sgd-comment">${escapeHtml(l.comment)}</span>
              </div>
            `).join('')}
          </div>
          <div class="rec-sgd-warning">
            <span>⚠️</span>
            <span>${escapeHtml(phaseB.sgd.warning)}</span>
          </div>
        </div>
      </div>
    `;

    const phaseCHtml = `
      <div class="rec-phase" data-phase="C">
        <div class="rec-phase-header">
          <span class="rec-phase-letter">C</span>
          <h3>${escapeHtml(phaseC.title)}</h3>
        </div>
        ${renderSteps(phaseC.steps)}

        <div class="rec-metrics">
          ${phaseC.metrics.map(m => `
            <div class="rec-metric-card">
              <div class="rec-metric-name">${escapeHtml(m.name)}</div>
              <code class="rec-metric-formula">${escapeHtml(m.formula)}</code>
              <div class="rec-metric-meaning">${escapeHtml(m.meaning)}</div>
            </div>
          `).join('')}
        </div>

        <div class="rec-results">
          <div class="rec-results-title">📈 ${escapeHtml(phaseC.results.title)}</div>
          <table class="rec-table rec-table-results">
            <thead><tr><th>Μετρική</th><th>Τιμή</th><th>Baseline</th></tr></thead>
            <tbody>
              ${phaseC.results.rows.map(row => `
                <tr class="${row.highlight ? 'rec-row-highlight' : ''}">
                  <td>${escapeHtml(row.metric)}</td>
                  <td class="rec-value">${escapeHtml(row.value)}</td>
                  <td class="rec-baseline">${escapeHtml(row.baseline)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <ul class="rec-notes">
            ${phaseC.results.notes.map(n => `<li>${escapeHtml(n)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    const phaseDHtml = `
      <div class="rec-phase" data-phase="D">
        <div class="rec-phase-header">
          <span class="rec-phase-letter">D</span>
          <h3>${escapeHtml(phaseD.title)}</h3>
        </div>
        ${renderSteps(phaseD.steps)}
      </div>
    `;

    const we = r.workedExample;
    const weHtml = `
      <div class="rec-worked">
        <div class="rec-worked-title">🧮 ${escapeHtml(we.title)}</div>
        <p class="rec-worked-intro">${escapeHtml(we.intro)}</p>
        <div class="rec-worked-rows">
          ${we.rows.map(row => `
            <div class="rec-worked-row rec-wg-${row.group}">
              <div class="rec-worked-term">${escapeHtml(row.term)}</div>
              <div class="rec-worked-value">${escapeHtml(row.value)}</div>
              <div class="rec-worked-meaning">${escapeHtml(row.meaning)}</div>
            </div>
          `).join('')}
        </div>
        <div class="rec-worked-message">💡 ${escapeHtml(we.message)}</div>
      </div>
    `;

    const edgeHtml = `
      <div class="rec-edge-grid">
        ${r.edgeCases.map(e => `
          <div class="rec-edge-card">
            <div class="rec-edge-icon">${e.icon}</div>
            <div class="rec-edge-title">${escapeHtml(e.title)}</div>
            ${e.quote ? `<blockquote class="rec-edge-quote">${escapeHtml(e.quote)}</blockquote>` : ''}
            <div class="rec-edge-text">${escapeHtml(e.explanation)}</div>
          </div>
        `).join('')}
      </div>
    `;

    const hp = r.hyperparams;
    const hpHtml = `
      <div class="rec-hyper">
        <div class="rec-hyper-title">⚙️ ${escapeHtml(hp.title)}</div>
        <div class="rec-hyper-grid">
          ${hp.rows.map(row => `
            <div class="rec-hyper-item">
              <div class="rec-hyper-name">${escapeHtml(row.name)}</div>
              <div class="rec-hyper-value">${escapeHtml(row.value)}</div>
              <div class="rec-hyper-note">${escapeHtml(row.note)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const fi = r.filesInvolved;
    const fiHtml = `
      <div class="rec-files">
        <div class="rec-files-title">📁 ${escapeHtml(fi.title)}</div>
        <div class="rec-files-list">
          ${fi.files.map(f => `
            <div class="rec-file-item">
              <div class="rec-file-name">${escapeHtml(f.name)}</div>
              <div class="rec-file-folder">${escapeHtml(f.folder)}</div>
              <div class="rec-file-what">${escapeHtml(f.what)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    return `
      <section class="doc-section rec-section" id="${r.id}">
        <div class="section-header">
          <span class="section-icon">${r.icon}</span>
          <h2 class="section-title">${escapeHtml(r.title)}</h2>
          <span class="section-count">4 phases</span>
        </div>
        <p class="rec-intro">${escapeHtml(r.intro)}</p>
        ${formulaHtml}
        ${phaseAHtml}
        ${phaseBHtml}
        ${phaseCHtml}
        ${phaseDHtml}
        ${weHtml}
        ${edgeHtml}
        ${hpHtml}
        ${fiHtml}
      </section>
    `;
  };

  // ============================================
  // RENDER — DEEP DIVE BLOCK
  // ============================================
  const renderDeepDiveBlock = (block) => {
    switch (block.type) {
      case 'text':
        return `
          <div class="dd-block">
            ${block.title ? `<div class="dd-block-title">${escapeHtml(block.title)}</div>` : ''}
            <p class="dd-text">${escapeHtml(block.body)}</p>
          </div>
        `;

      case 'list':
        return `
          <div class="dd-block">
            ${block.title ? `<div class="dd-block-title">${escapeHtml(block.title)}</div>` : ''}
            <ul class="dd-list">
              ${block.items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
            </ul>
          </div>
        `;

      case 'table':
        return `
          <div class="dd-block">
            ${block.title ? `<div class="dd-block-title">${escapeHtml(block.title)}</div>` : ''}
            <div class="dd-table-wrapper">
              <table class="dd-table">
                <thead>
                  <tr>${block.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
                </thead>
                <tbody>
                  ${block.rows.map(row => `
                    <tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;

      case 'code':
        return `
          <div class="dd-block">
            ${block.title ? `<div class="dd-block-title">${escapeHtml(block.title)}</div>` : ''}
            <pre class="dd-code"><code>${escapeHtml(block.code)}</code></pre>
          </div>
        `;

      case 'flow':
        return `
          <div class="dd-block">
            ${block.title ? `<div class="dd-block-title">${escapeHtml(block.title)}</div>` : ''}
            <ol class="dd-flow">
              ${block.steps.map(s => `
                <li class="dd-flow-step">
                  <span class="dd-flow-num">${s.n}</span>
                  <span class="dd-flow-text">${escapeHtml(s.text)}</span>
                </li>
              `).join('')}
            </ol>
          </div>
        `;

      case 'endpoint':
        return `
          <div class="dd-endpoint">
            <div class="dd-endpoint-head">
              <span class="dd-method dd-method-${block.method.split(' ')[0].toLowerCase()}">${escapeHtml(block.method)}</span>
              <code class="dd-endpoint-url">${escapeHtml(block.url)}</code>
            </div>
            <div class="dd-endpoint-body">
              ${block.auth ? `<div class="dd-row"><span class="dd-label">🔐 Auth:</span><span class="dd-value">${escapeHtml(block.auth)}</span></div>` : ''}
              ${block.params ? `<div class="dd-row"><span class="dd-label">📋 Params:</span><code class="dd-value">${escapeHtml(block.params)}</code></div>` : ''}
              ${block.request ? `<div class="dd-row"><span class="dd-label">📤 Request:</span><code class="dd-value">${escapeHtml(block.request)}</code></div>` : ''}
              ${block.response ? `<div class="dd-row"><span class="dd-label">📥 Response:</span><code class="dd-value">${escapeHtml(block.response)}</code></div>` : ''}
              ${block.errors ? `<div class="dd-row"><span class="dd-label">⚠️ Errors:</span><span class="dd-value dd-error">${escapeHtml(block.errors)}</span></div>` : ''}
              ${block.why ? `<div class="dd-row dd-why"><span class="dd-label">💡 Γιατί:</span><span class="dd-value">${escapeHtml(block.why)}</span></div>` : ''}
            </div>
          </div>
        `;

      case 'qa':
        return `
          <div class="dd-qa">
            <div class="dd-qa-q">
              <span class="dd-qa-icon">Q</span>
              <span>${escapeHtml(block.q)}</span>
            </div>
            <div class="dd-qa-a">
              <span class="dd-qa-icon">A</span>
              <span>${escapeHtml(block.a || block.body || '')}</span>
            </div>
          </div>
        `;

      case 'glossary':
        return `
          <div class="dd-glossary">
            ${block.terms.map(t => `
              <div class="dd-glossary-item">
                <div class="dd-glossary-term">${escapeHtml(t.term)}</div>
                <div class="dd-glossary-def">${escapeHtml(t.def)}</div>
              </div>
            `).join('')}
          </div>
        `;

      default:
        return '';
    }
  };

  // ============================================
  // RENDER — DEEP DIVE SECTION
  // ============================================
  const renderDeepDive = (dd) => {
    const matchesQ = !state.query ||
      JSON.stringify(dd).toLowerCase().includes(state.query.toLowerCase());
    const matchesT = state.typeFilter === 'all' || state.typeFilter === dd.type;
    if (!matchesQ || !matchesT) return '';

    const blocksHtml = dd.blocks.map(renderDeepDiveBlock).join('');

    return `
      <section class="doc-section dd-section" id="${dd.id}">
        <div class="section-header">
          <span class="section-icon">${dd.icon}</span>
          <h2 class="section-title">${escapeHtml(dd.title)}</h2>
          <span class="section-count">deep dive</span>
        </div>
        <p class="dd-intro">
          <strong>${escapeHtml(dd.subtitle)}</strong><br>
          ${escapeHtml(dd.intro)}
        </p>
        <div class="dd-blocks">${blocksHtml}</div>
      </section>
    `;
  };

  // ============================================
  // RENDER — ALL SECTIONS (recommender + deep-dives + files)
  // ============================================
  const renderSections = (sections) => {
    const recHtml = renderRecommenderSection();
    const ddHtml = DEEPDIVES.map(renderDeepDive).join('');

    if (sections.length === 0 && !recHtml && !ddHtml) {
      els.sectionsContainer.innerHTML = '';
      els.noResults.classList.add('visible');
      return;
    }

    els.noResults.classList.remove('visible');

    const filesSectionsHtml = sections
      .map((s) => {
        const filesHtml = s.files
          .map((f) => renderFileCard(s.id, f))
          .join('');

        return `
          <section class="doc-section" id="${escapeHtml(s.id)}">
            <div class="section-header">
              <span class="section-icon">${s.icon}</span>
              <h2 class="section-title">${escapeHtml(s.title)}</h2>
              <span class="section-count">${s.files.length} αρχεία</span>
            </div>
            ${filesHtml}
          </section>
        `;
      })
      .join('');

    els.sectionsContainer.innerHTML = recHtml + ddHtml + filesSectionsHtml;

    // Event listeners για τα file cards (accordion)
    els.sectionsContainer.querySelectorAll('[data-toggle]').forEach((el) => {
      el.addEventListener('click', () => {
        const key = el.dataset.toggle;
        if (state.openFiles.has(key)) {
          state.openFiles.delete(key);
        } else {
          state.openFiles.add(key);
        }
        const card = el.closest('.file-card');
        if (card) card.classList.toggle('open');
      });
    });
  };

  // ============================================
  // RENDER — MASTER
  // ============================================
  const render = () => {
    const filtered = getFilteredSections();
    renderSidebar(filtered);
    renderSections(filtered);
    renderStats();
  };

  // ============================================
  // EVENTS
  // ============================================
  let searchTimer = null;
  els.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const value = e.target.value.trim();
    searchTimer = setTimeout(() => {
      state.query = value;
      render();
    }, 150);
  });

  els.typeFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.type-btn');
    if (!btn) return;
    els.typeFilters.querySelectorAll('.type-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.typeFilter = btn.dataset.type;
    render();
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      els.backToTop.classList.add('visible');
    } else {
      els.backToTop.classList.remove('visible');
    }
  });

  els.backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================
  // INIT
  // ============================================
  render();
})();