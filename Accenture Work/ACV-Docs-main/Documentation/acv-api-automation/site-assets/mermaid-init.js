/* Mermaid initialization + diagram tools
   - Renders diagrams at natural size; .mermaid-wrap allows horizontal scroll.
   - Adds a toolbar above each diagram:
       • Open in new tab  — opens the rendered SVG in a standalone viewer
                            (zoom / pan / download).
       • Copy source      — copies the original mermaid source to clipboard.
*/
(function () {
  function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default';
  }

  function buildViewerHtml(svgMarkup, title) {
    // Standalone HTML page that renders the SVG with pan/zoom and a download
    // link. Uses svg-pan-zoom from a CDN; falls back gracefully if blocked.
    var safeTitle = (title || 'Diagram').replace(/[<>&"]/g, function (c) {
      return ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;' })[c];
    });
    return '<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'<meta charset="UTF-8" />\n' +
'<title>' + safeTitle + '</title>\n' +
'<style>\n' +
'  *{box-sizing:border-box;margin:0;padding:0}\n' +
'  html,body{height:100%}\n' +
'  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#fafbfc;color:#1f2328;display:flex;flex-direction:column}\n' +
'  header{display:flex;align-items:center;gap:.75rem;padding:.55rem 1rem;background:#fff;border-bottom:1px solid #d0d7de;flex-shrink:0}\n' +
'  header h1{font-size:.95rem;font-weight:600;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n' +
'  header button,header a{font:inherit;font-size:.82rem;padding:.35rem .7rem;border:1px solid #d0d7de;border-radius:4px;background:#fff;color:#1f2328;cursor:pointer;text-decoration:none}\n' +
'  header button:hover,header a:hover{border-color:#0a4b8c;color:#0a4b8c}\n' +
'  #stage{flex:1;overflow:auto;background:#fff;display:flex;align-items:center;justify-content:center;position:relative}\n' +
'  #stage svg{display:block;max-width:none}\n' +
'  .hint{position:fixed;bottom:.6rem;right:.8rem;font-size:.72rem;color:#6e7781;background:rgba(255,255,255,.85);padding:.25rem .5rem;border:1px solid #e4e7eb;border-radius:3px}\n' +
'</style>\n' +
'</head>\n' +
'<body>\n' +
'<header>\n' +
'  <h1>' + safeTitle + '</h1>\n' +
'  <button id="zoomIn" title="Zoom in">+</button>\n' +
'  <button id="zoomOut" title="Zoom out">\u2212</button>\n' +
'  <button id="zoomReset" title="Reset">Reset</button>\n' +
'  <a id="download" download="diagram.svg">Download SVG</a>\n' +
'</header>\n' +
'<div id="stage">' + svgMarkup + '</div>\n' +
'<div class="hint">Scroll to zoom \u00b7 drag to pan</div>\n' +
'<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"><\/script>\n' +
'<script>\n' +
'(function(){\n' +
'  var svg = document.querySelector("#stage svg");\n' +
'  if(!svg) return;\n' +
'  svg.removeAttribute("style");\n' +
'  svg.setAttribute("width","100%");\n' +
'  svg.setAttribute("height","100%");\n' +
'  // Download link\n' +
'  try{\n' +
'    var clone = svg.cloneNode(true);\n' +
'    var ser = new XMLSerializer().serializeToString(clone);\n' +
'    var blob = new Blob([\'<?xml version="1.0" encoding="UTF-8"?>\\n\' + ser], {type:"image/svg+xml"});\n' +
'    document.getElementById("download").href = URL.createObjectURL(blob);\n' +
'  }catch(e){}\n' +
'  // Pan/zoom\n' +
'  var pz = null;\n' +
'  if(window.svgPanZoom){\n' +
'    pz = svgPanZoom(svg,{controlIconsEnabled:false,fit:true,center:true,minZoom:0.2,maxZoom:20,zoomScaleSensitivity:0.4});\n' +
'    document.getElementById("zoomIn").onclick    = function(){pz.zoomIn();};\n' +
'    document.getElementById("zoomOut").onclick   = function(){pz.zoomOut();};\n' +
'    document.getElementById("zoomReset").onclick = function(){pz.resetZoom();pz.center();pz.fit();};\n' +
'    window.addEventListener("resize",function(){pz.resize();pz.fit();pz.center();});\n' +
'  }\n' +
'})();\n' +
'<\/script>\n' +
'</body>\n' +
'</html>';
  }

  function openSvgInNewTab(svgEl, title) {
    var clone = svgEl.cloneNode(true);
    clone.removeAttribute('style');
    var serialized = new XMLSerializer().serializeToString(clone);
    var html = buildViewerHtml(serialized, title);
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var win = window.open(url, '_blank', 'noopener');
    if (!win) {
      // Pop-up blocked — fall back to navigation in same tab via download anchor
      var a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  function nearestHeading(el) {
    var node = el.previousElementSibling;
    while (node) {
      if (/^H[1-6]$/.test(node.tagName)) return node.textContent.trim();
      node = node.previousElementSibling;
    }
    var parent = el.parentElement;
    while (parent && parent.tagName !== 'BODY') {
      var h = parent.querySelector('h1,h2,h3,h4');
      if (h) return h.textContent.trim();
      parent = parent.parentElement;
    }
    return document.title || 'Diagram';
  }

  function buildToolbar(wrap, preEl, originalSource) {
    var bar = document.createElement('div');
    bar.className = 'mermaid-toolbar';

    var openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'mermaid-tool-btn';
    openBtn.title = 'Open diagram in new tab';
    openBtn.innerHTML = '<span aria-hidden="true">\u29C9</span> Open in new tab';
    openBtn.addEventListener('click', function () {
      var svg = preEl.querySelector('svg');
      if (!svg) return;
      openSvgInNewTab(svg, nearestHeading(wrap));
    });

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'mermaid-tool-btn';
    copyBtn.title = 'Copy mermaid source';
    copyBtn.innerHTML = '<span aria-hidden="true">\u2398</span> Copy source';
    copyBtn.addEventListener('click', function () {
      var src = originalSource || preEl.getAttribute('data-mermaid-src') || '';
      if (!src) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(src).then(function () {
          copyBtn.classList.add('is-success');
          var orig = copyBtn.innerHTML;
          copyBtn.innerHTML = '<span aria-hidden="true">\u2713</span> Copied';
          setTimeout(function () { copyBtn.innerHTML = orig; copyBtn.classList.remove('is-success'); }, 1400);
        });
      }
    });

    bar.appendChild(openBtn);
    bar.appendChild(copyBtn);
    wrap.insertBefore(bar, wrap.firstChild);
  }

  function initMermaid() {
    if (typeof mermaid === 'undefined') return;
    mermaid.initialize({
      startOnLoad: false,
      theme: getTheme(),
      securityLevel: 'loose',
      flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'basis' },
      sequence:  { useMaxWidth: false, mirrorActors: false },
      gantt:     { useMaxWidth: false },
      journey:   { useMaxWidth: false },
      class:     { useMaxWidth: false },
      state:     { useMaxWidth: false },
      er:        { useMaxWidth: false },
      pie:       { useMaxWidth: false },
    });

    // Wrap each <pre class="mermaid"> and remember the original source
    // before mermaid replaces the text node with an SVG.
    document.querySelectorAll('pre.mermaid').forEach(function (el) {
      el.setAttribute('data-mermaid-src', el.textContent.trim());
      if (el.parentElement && el.parentElement.classList.contains('mermaid-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'mermaid-wrap';
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
    });

    var wraps = Array.from(document.querySelectorAll('.mermaid-wrap'));

    mermaid.run({ querySelector: 'pre.mermaid' })
      .then(function () { wraps.forEach(function (w) {
        var pre = w.querySelector('pre.mermaid');
        if (pre) buildToolbar(w, pre, pre.getAttribute('data-mermaid-src'));
      }); })
      .catch(function (e) {
        console.error('Mermaid render error', e);
        // Still add the toolbar where rendering succeeded.
        wraps.forEach(function (w) {
          var pre = w.querySelector('pre.mermaid');
          if (pre && pre.querySelector('svg')) buildToolbar(w, pre, pre.getAttribute('data-mermaid-src'));
        });
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMermaid);
  } else {
    initMermaid();
  }
})();
