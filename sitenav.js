// Shared behaviour: phone menu, data sub-menu highlighting, walkthrough chapter menu.
(function () {
  var sn = document.querySelector('.sn');
  if (sn) {
    var btn = sn.querySelector('.sn-menu');
    btn.addEventListener('click', function () {
      var open = sn.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    sn.querySelectorAll('.sn-links a').forEach(function (a) {
      a.addEventListener('click', function () { sn.classList.remove('open'); });
    });
  }

  // Highlight the data sub-menu entry for the section in view (Compendium).
  var dn = document.querySelectorAll('.dn a[href*="#"]');
  var here = location.pathname.split('/').pop() || 'index.html';
  var spy = [];
  dn.forEach(function (a) {
    var parts = a.getAttribute('href').split('#');
    if (parts[0] === here) {
      var el = document.getElementById(parts[1]);
      if (el) spy.push([el, a]);
    }
  });
  function markData() {
    var cur = null;
    spy.forEach(function (p) { if (p[0].getBoundingClientRect().top < 140) cur = p[1]; });
    spy.forEach(function (p) { p[1].classList.toggle('on', p[1] === cur); });
  }
  if (spy.length) { window.addEventListener('scroll', markData, { passive: true }); markData(); }

  // Walkthrough: phone jump menu + current-chapter highlight in the side list.
  var toc = document.querySelector('.walktoc');
  if (toc) {
    var links = Array.prototype.slice.call(toc.querySelectorAll('a'));
    var sel = document.createElement('select');
    sel.className = 'tocsel';
    sel.setAttribute('aria-label', 'Jump to chapter');
    var first = document.createElement('option');
    first.textContent = 'Jump to chapter…';
    first.value = '';
    sel.appendChild(first);
    links.forEach(function (a) {
      var o = document.createElement('option');
      o.value = a.getAttribute('href');
      o.textContent = a.textContent;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function () { if (sel.value) location.hash = sel.value; });
    toc.parentNode.insertBefore(sel, toc);
    var secs = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    function markToc() {
      var idx = -1;
      secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < 120) idx = i; });
      links.forEach(function (a, i) { a.classList.toggle('cur', i === idx); });
    }
    window.addEventListener('scroll', markToc, { passive: true });
    markToc();
  }
})();
