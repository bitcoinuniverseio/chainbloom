/* ChainBloom documentation shell.
   Every page works without this file. Here we add search, saved progress,
   glossary tooltips, copy buttons, and the table of contents highlight, and
   we load the interactive figures only on pages that contain one. */

(function () {
  'use strict';

  var BASE = '/chainbloom';
  var STORE_KEY = 'chainbloom-docs-progress';
  var THEME_KEY = 'chainbloom-theme';

  /* ------------------------------------------------------------- storage */

  function readStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      var value = raw ? JSON.parse(raw) : null;
      if (!value || typeof value !== 'object') throw new Error('empty');
      if (!value.read || typeof value.read !== 'object') value.read = {};
      if (!value.checks || typeof value.checks !== 'object') value.checks = {};
      return value;
    } catch (error) {
      return { read: {}, checks: {}, journey: null, lastPage: null };
    }
  }

  function writeStore(state) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (error) {
      /* Saved progress is a convenience. The page still works without it. */
    }
  }

  var store = readStore();
  var listeners = [];

  function updateStore(change) {
    change(store);
    writeStore(store);
    listeners.forEach(function (listener) {
      listener(store);
    });
  }

  window.chainbloomDocs = {
    base: BASE,
    getState: function () {
      return store;
    },
    update: updateStore,
    subscribe: function (listener) {
      listeners.push(listener);
      listener(store);
    },
    announce: announce,
    reducedMotion: function () {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
  };

  var liveRegion = document.querySelector('[data-live-region]');

  function announce(message) {
    if (!liveRegion) return;
    liveRegion.textContent = '';
    window.setTimeout(function () {
      liveRegion.textContent = message;
    }, 40);
  }

  /* --------------------------------------------------------------- theme */

  var themeButton = document.querySelector('[data-theme-toggle]');
  if (themeButton) {
    var themeLabel = themeButton.querySelector('.theme-label');
    var syncTheme = function () {
      var light = document.documentElement.dataset.theme === 'light';
      themeButton.setAttribute('aria-pressed', String(light));
      if (themeLabel) themeLabel.textContent = light ? 'Dark' : 'Light';
      themeButton.setAttribute(
        'aria-label',
        light ? 'Switch to the dark theme' : 'Switch to the light theme',
      );
    };
    syncTheme();
    themeButton.addEventListener('click', function () {
      var next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (error) {
        /* The chosen theme still applies for this visit. */
      }
      syncTheme();
    });
  }

  /* ---------------------------------------------------------- mobile nav */

  var navToggle = document.querySelector('.nav-toggle');
  var sidebar = document.getElementById('docs-sidebar');
  if (navToggle && sidebar) {
    var setNav = function (open) {
      navToggle.setAttribute('aria-expanded', String(open));
      sidebar.dataset.open = String(open);
      document.body.style.overflow = open && window.innerWidth <= 900 ? 'hidden' : '';
    };
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });
    sidebar.addEventListener('click', function (event) {
      if (event.target.closest('a') && window.innerWidth <= 900) setNav(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        navToggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) document.body.style.overflow = '';
    });
  }

  /* -------------------------------------------------------- copy buttons */

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var block = button.closest('.code-block');
      var code = block && block.querySelector('code');
      if (!code) return;
      var text = code.textContent;
      var done = function () {
        button.textContent = 'Copied';
        button.dataset.copied = 'true';
        announce('Code copied to the clipboard.');
        window.setTimeout(function () {
          button.textContent = 'Copy';
          delete button.dataset.copied;
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          button.textContent = 'Press Ctrl+C';
        });
      } else {
        var range = document.createRange();
        range.selectNodeContents(code);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = 'Press Ctrl+C';
      }
    });
  });

  /* ------------------------------------------------------------ code tabs */

  document.querySelectorAll('[data-code-tabs]').forEach(function (group, groupIndex) {
    var panels = Array.prototype.slice.call(group.querySelectorAll('.code-tab'));
    if (panels.length < 2) return;
    var strip = document.createElement('div');
    strip.className = 'tab-strip';
    strip.setAttribute('role', 'tablist');
    var buttons = panels.map(function (panel, index) {
      var id = 'tab-' + groupIndex + '-' + index;
      panel.id = id + '-panel';
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', id);
      panel.hidden = index !== 0;
      var button = document.createElement('button');
      button.type = 'button';
      button.id = id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', panel.id);
      button.setAttribute('aria-selected', String(index === 0));
      button.tabIndex = index === 0 ? 0 : -1;
      button.textContent = panel.dataset.tabLabel || 'Example ' + (index + 1);
      strip.appendChild(button);
      return button;
    });
    var select = function (index) {
      buttons.forEach(function (button, position) {
        button.setAttribute('aria-selected', String(position === index));
        button.tabIndex = position === index ? 0 : -1;
        panels[position].hidden = position !== index;
      });
      buttons[index].focus();
    };
    buttons.forEach(function (button, index) {
      button.addEventListener('click', function () {
        select(index);
      });
      button.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') select((index + 1) % buttons.length);
        if (event.key === 'ArrowLeft')
          select((index - 1 + buttons.length) % buttons.length);
      });
    });
    group.insertBefore(strip, group.firstChild);
  });

  /* ------------------------------------------------------- table of contents */

  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.docs-toc a'));
  if (tocLinks.length > 0 && 'IntersectionObserver' in window) {
    var headings = tocLinks
      .map(function (link) {
        return document.getElementById(link.getAttribute('href').slice(1));
      })
      .filter(Boolean);
    var visible = new Set();
    var highlight = function () {
      var current = headings.filter(function (heading) {
        return visible.has(heading.id);
      })[0];
      tocLinks.forEach(function (link) {
        var active = current && link.getAttribute('href') === '#' + current.id;
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        highlight();
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );
    headings.forEach(function (heading) {
      observer.observe(heading);
    });
  }

  /* -------------------------------------------------------- read progress */

  var pageId = document.documentElement.dataset.page || '';

  function markRead(id, read) {
    updateStore(function (state) {
      if (read) state.read[id] = new Date().toISOString().slice(0, 10);
      else delete state.read[id];
      state.lastPage = id;
    });
  }

  var readButton = document.querySelector('[data-mark-read]');
  if (readButton) {
    var readText = readButton.querySelector('.toc-complete-text');
    window.chainbloomDocs.subscribe(function (state) {
      var done = Boolean(state.read[readButton.dataset.page]);
      readButton.setAttribute('aria-pressed', String(done));
      if (readText) readText.textContent = done ? 'Marked as read' : 'Mark as read';
    });
    readButton.addEventListener('click', function () {
      var done = readButton.getAttribute('aria-pressed') === 'true';
      markRead(readButton.dataset.page, !done);
      announce(done ? 'Removed from your read pages.' : 'Saved to your read pages.');
    });
  }

  if (pageId) {
    updateStore(function (state) {
      state.lastPage = pageId;
    });
  }

  window.chainbloomDocs.subscribe(function (state) {
    document.querySelectorAll('[data-progress-page]').forEach(function (link) {
      link.dataset.read = String(Boolean(state.read[link.dataset.progressPage]));
    });
  });

  var resetButton = document.querySelector('[data-progress-reset]');
  if (resetButton) {
    resetButton.addEventListener('click', function () {
      updateStore(function (state) {
        state.read = {};
        state.checks = {};
        state.journey = null;
      });
      announce('Saved progress cleared.');
    });
  }

  /* ------------------------------------------------------------ checklists */

  document.querySelectorAll('[data-checklist]').forEach(function (block) {
    var key = block.dataset.checklist;
    var items = Array.prototype.slice.call(block.querySelectorAll('li'));
    if (items.length === 0) return;
    var progress = document.createElement('p');
    progress.className = 'checklist-progress';
    var bar = document.createElement('span');
    bar.className = 'checklist-bar';
    var fill = document.createElement('span');
    bar.appendChild(fill);
    var count = document.createElement('span');
    progress.appendChild(bar);
    progress.appendChild(count);
    block.appendChild(progress);

    var buttons = items.map(function (item, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'check-item';
      button.setAttribute('aria-pressed', 'false');
      var box = document.createElement('span');
      box.className = 'check-box';
      box.setAttribute('aria-hidden', 'true');
      box.textContent = '✓';
      var text = document.createElement('span');
      text.className = 'check-text';
      text.innerHTML = item.innerHTML;
      button.appendChild(box);
      button.appendChild(text);
      item.innerHTML = '';
      item.appendChild(button);
      button.addEventListener('click', function () {
        var done = button.getAttribute('aria-pressed') === 'true';
        updateStore(function (state) {
          if (!state.checks[key]) state.checks[key] = {};
          if (done) delete state.checks[key][index];
          else state.checks[key][index] = true;
        });
      });
      return button;
    });

    window.chainbloomDocs.subscribe(function (state) {
      var saved = state.checks[key] || {};
      var done = 0;
      buttons.forEach(function (button, index) {
        var checked = Boolean(saved[index]);
        button.setAttribute('aria-pressed', String(checked));
        if (checked) done += 1;
      });
      fill.style.width = Math.round((done / buttons.length) * 100) + '%';
      count.textContent = done + ' of ' + buttons.length + ' done';
    });
  });

  /* -------------------------------------------------------------- glossary */

  var tip = document.getElementById('glossary-tip');
  var activeTerm = null;

  function hideTip() {
    if (!tip) return;
    tip.hidden = true;
    activeTerm = null;
  }

  function showTip(button) {
    if (!tip) return;
    var inline = button.querySelector('.glossary-inline');
    if (!inline) return;
    tip.innerHTML = '';
    var label = document.createElement('strong');
    label.textContent = button.textContent.replace(inline.textContent, '').trim();
    var body = document.createElement('span');
    body.textContent = inline.textContent;
    tip.appendChild(label);
    tip.appendChild(body);
    tip.hidden = false;
    var rect = button.getBoundingClientRect();
    var viewport = window.innerWidth || document.documentElement.clientWidth || 0;
    tip.style.maxWidth = viewport > 0 ? Math.min(320, viewport - 24) + 'px' : '';
    var width = tip.offsetWidth;
    var wanted = rect.left + window.scrollX + rect.width / 2 - width / 2;
    var furthest = Math.max(12, viewport - width - 12);
    var left = Math.max(12, Math.min(wanted, furthest));
    var above = rect.top > tip.offsetHeight + 20;
    tip.style.left = left + 'px';
    tip.style.top =
      (above
        ? rect.top + window.scrollY - tip.offsetHeight - 10
        : rect.bottom + window.scrollY + 10) + 'px';
    activeTerm = button;
  }

  document.querySelectorAll('.glossary-term').forEach(function (button) {
    button.addEventListener('mouseenter', function () {
      showTip(button);
    });
    button.addEventListener('focus', function () {
      showTip(button);
    });
    button.addEventListener('mouseleave', hideTip);
    button.addEventListener('blur', hideTip);
    button.addEventListener('click', function (event) {
      event.preventDefault();
      if (activeTerm === button) hideTip();
      else showTip(button);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') hideTip();
  });
  window.addEventListener('scroll', hideTip, { passive: true });

  /* ---------------------------------------------------------------- search */

  var searchLayer = document.querySelector('[data-search-layer]');
  var searchInput = document.querySelector('[data-search-input]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchIndex = null;
  var searchLoading = null;
  var activeIndex = 0;
  var lastFocus = null;

  function loadIndex() {
    if (searchIndex) return Promise.resolve(searchIndex);
    if (!searchLoading) {
      searchLoading = fetch(BASE + '/docs/search-index.json')
        .then(function (response) {
          if (!response.ok) throw new Error('index unavailable');
          return response.json();
        })
        .then(function (data) {
          searchIndex = data.pages || [];
          return searchIndex;
        })
        .catch(function () {
          searchIndex = [];
          return searchIndex;
        });
    }
    return searchLoading;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[character];
    });
  }

  function scorePage(page, terms) {
    var title = page.t.toLowerCase();
    var description = page.d.toLowerCase();
    var keywords = (page.k || '').toLowerCase();
    var section = page.s.toLowerCase();
    var body = page.b.toLowerCase();
    var headings = page.h
      .map(function (item) {
        return item.t;
      })
      .join(' ')
      .toLowerCase();
    var total = 0;
    for (var index = 0; index < terms.length; index += 1) {
      var term = terms[index];
      var hit = 0;
      if (title.indexOf(term) === 0) hit += 14;
      if (title.indexOf(term) > -1) hit += 9;
      if (keywords.indexOf(term) > -1) hit += 6;
      if (headings.indexOf(term) > -1) hit += 4;
      if (description.indexOf(term) > -1) hit += 4;
      if (section.indexOf(term) > -1) hit += 2;
      if (body.indexOf(term) > -1) hit += 1;
      if (hit === 0) return 0;
      total += hit;
    }
    return total;
  }

  function snippetFor(page, terms) {
    var body = page.b;
    var lower = body.toLowerCase();
    var position = -1;
    for (var index = 0; index < terms.length && position === -1; index += 1) {
      position = lower.indexOf(terms[index]);
    }
    var start = position === -1 ? 0 : Math.max(0, position - 60);
    var text = body.slice(start, start + 190);
    if (start > 0) text = '…' + text;
    var html = escapeHtml(text);
    terms.forEach(function (term) {
      if (term.length < 2) return;
      html = html.replace(
        new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'),
        '<mark>$1</mark>',
      );
    });
    return html;
  }

  function renderResults(query) {
    if (!searchResults) return;
    var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) {
      searchResults.innerHTML =
        '<p class="search-empty">Try “fees”, “meeting”, “validation rules”, or “classroom”.</p>';
      return;
    }
    var matches = (searchIndex || [])
      .map(function (page) {
        return { page: page, score: scorePage(page, terms) };
      })
      .filter(function (item) {
        return item.score > 0;
      })
      .sort(function (left, right) {
        return right.score - left.score;
      })
      .slice(0, 12);
    if (matches.length === 0) {
      searchResults.innerHTML =
        '<p class="search-empty">Nothing matched “' +
        escapeHtml(query) +
        '”. The glossary may help.</p>';
      return;
    }
    activeIndex = 0;
    searchResults.innerHTML = matches
      .map(function (item, index) {
        return (
          '<a class="search-result" role="option" href="' +
          item.page.u +
          '" data-active="' +
          (index === 0) +
          '" aria-selected="' +
          (index === 0) +
          '"><span class="search-result-top"><strong>' +
          escapeHtml(item.page.t) +
          '</strong><span class="search-result-section">' +
          escapeHtml(item.page.s) +
          '</span></span><span class="search-snippet">' +
          snippetFor(item.page, terms) +
          '</span></a>'
        );
      })
      .join('');
    announce(matches.length + ' results.');
  }

  function moveActive(delta) {
    var options = Array.prototype.slice.call(
      searchResults.querySelectorAll('.search-result'),
    );
    if (options.length === 0) return;
    activeIndex = (activeIndex + delta + options.length) % options.length;
    options.forEach(function (option, index) {
      option.dataset.active = String(index === activeIndex);
      option.setAttribute('aria-selected', String(index === activeIndex));
    });
    options[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function openSearch() {
    if (!searchLayer || !searchInput) return;
    lastFocus = document.activeElement;
    searchLayer.hidden = false;
    document.body.style.overflow = 'hidden';
    searchInput.value = '';
    renderResults('');
    searchInput.focus();
    loadIndex().then(function () {
      if (!searchLayer.hidden) renderResults(searchInput.value);
    });
  }

  function closeSearch() {
    if (!searchLayer) return;
    searchLayer.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('[data-search-open]').forEach(function (button) {
    button.addEventListener('click', openSearch);
  });
  document.querySelectorAll('[data-search-close]').forEach(function (button) {
    button.addEventListener('click', closeSearch);
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      loadIndex().then(function () {
        renderResults(searchInput.value);
      });
    });
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveActive(1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveActive(-1);
      } else if (event.key === 'Enter') {
        var active = searchResults.querySelector('.search-result[data-active="true"]');
        if (active) {
          event.preventDefault();
          window.location.href = active.getAttribute('href');
        }
      } else if (event.key === 'Escape') {
        closeSearch();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    var typing =
      document.activeElement &&
      /^(input|textarea|select)$/i.test(document.activeElement.tagName);
    if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      openSearch();
      return;
    }
    if (event.key === '/' && !typing && searchLayer && searchLayer.hidden) {
      event.preventDefault();
      openSearch();
    }
  });

  /* --------------------------------------------------- interactive figures */

  if (document.querySelector('[data-demo]')) {
    var script = document.createElement('script');
    script.src = BASE + '/assets/demos.js';
    script.defer = true;
    document.head.appendChild(script);
  }
})();
