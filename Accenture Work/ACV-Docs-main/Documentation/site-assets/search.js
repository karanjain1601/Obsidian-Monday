/* Client-side full-text search across doc pages */
(function () {
  var searchBox = document.getElementById('search-box');
  var themeToggle = document.getElementById('theme-toggle');
  var sidebarToggle = document.getElementById('sidebar-toggle');
  var sidebar = document.getElementById('sidebar');

  /* ---------- Theme toggle ---------- */
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var html = document.documentElement;
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
      try { localStorage.setItem('docs-theme', next); } catch (_) {}
      // Re-init mermaid with matching theme
      if (typeof mermaid !== 'undefined') {
        mermaid.initialize({ theme: next === 'dark' ? 'dark' : 'default', securityLevel: 'strict' });
      }
    });
    // Restore saved theme
    try {
      var saved = localStorage.getItem('docs-theme');
      if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
      }
    } catch (_) {}
  }

  /* ---------- Mobile sidebar toggle ---------- */
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });
  }

  /* ---------- Simple in-page search (highlights text) ---------- */
  if (searchBox) {
    searchBox.addEventListener('input', function () {
      var query = searchBox.value.trim().toLowerCase();
      var article = document.querySelector('article');
      if (!article) return;

      // Remove existing highlights
      article.querySelectorAll('mark.search-hl').forEach(function (m) {
        var parent = m.parentNode;
        parent.replaceChild(document.createTextNode(m.textContent), m);
        parent.normalize();
      });

      if (query.length < 2) return;

      // Walk text nodes and wrap matches
      var walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, null, false);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach(function (node) {
        var text = node.textContent;
        var lower = text.toLowerCase();
        var idx = lower.indexOf(query);
        if (idx === -1 || node.parentElement.tagName === 'SCRIPT' || node.parentElement.tagName === 'STYLE') return;

        var frag = document.createDocumentFragment();
        var lastIdx = 0;
        while (idx !== -1) {
          frag.appendChild(document.createTextNode(text.slice(lastIdx, idx)));
          var mark = document.createElement('mark');
          mark.className = 'search-hl';
          mark.style.background = '#ffe066';
          mark.textContent = text.slice(idx, idx + query.length);
          frag.appendChild(mark);
          lastIdx = idx + query.length;
          idx = lower.indexOf(query, lastIdx);
        }
        frag.appendChild(document.createTextNode(text.slice(lastIdx)));
        node.parentNode.replaceChild(frag, node);
      });

      // Scroll to first highlight
      var first = article.querySelector('mark.search-hl');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
})();
