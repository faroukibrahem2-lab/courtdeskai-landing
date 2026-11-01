/* The Appearance control: theme and mode, with preview on hover or focus.
   Uses window.CDAppearance from appearance.js. Works without the motion libraries. */
(function () {
  "use strict";
  var A = window.CDAppearance;
  var btn = document.getElementById("appearBtn");
  var panel = document.getElementById("appearPanel");
  if (!A || !btn || !panel) return;
  var groups = [
    { key: "accent", items: [].slice.call(panel.querySelectorAll("[data-accent]")) },
    { key: "mode", items: [].slice.call(panel.querySelectorAll("[data-mode]")) },
  ];

  function sync() {
    var c = A.get();
    groups.forEach(function (g) {
      g.items.forEach(function (b) {
        var on = b.getAttribute("data-" + g.key) === c[g.key];
        b.setAttribute("aria-checked", String(on));
        b.tabIndex = on ? 0 : -1;
      });
    });
  }
  function open() {
    panel.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    sync();
    var first = panel.querySelector('[aria-checked="true"]');
    if (first) first.focus();
  }
  function close(focusBack) {
    if (panel.hidden) return;
    A.restore();
    panel.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    if (focusBack) btn.focus();
  }
  function value(b) {
    var o = {};
    groups.forEach(function (g) {
      var v = b.getAttribute("data-" + g.key);
      if (v) o[g.key] = v;
    });
    return o;
  }

  btn.addEventListener("click", function () {
    if (panel.hidden) open();
    else close(true);
  });
  groups.forEach(function (g) {
    g.items.forEach(function (b, i) {
      b.addEventListener("pointerenter", function () { A.preview(value(b)); });
      b.addEventListener("focus", function () { A.preview(value(b)); });
      b.addEventListener("click", function () { A.set(value(b)); sync(); });
      b.addEventListener("keydown", function (e) {
        var rtl = document.getElementById("doc").dir === "rtl";
        var step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
        if (step) {
          e.preventDefault();
          var n = g.items[(i + step + g.items.length) % g.items.length];
          n.focus();
        } else if (e.key === "Home" || e.key === "End") {
          e.preventDefault();
          g.items[e.key === "Home" ? 0 : g.items.length - 1].focus();
        }
      });
    });
    g.items[0].parentNode.addEventListener("pointerleave", function () { A.restore(); });
  });
  document.getElementById("apReset").addEventListener("click", function () { A.reset(); sync(); });
  panel.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { e.preventDefault(); close(true); }
  });
  document.addEventListener("pointerdown", function (e) {
    if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) close(false);
  });
  panel.addEventListener("focusout", function (e) {
    if (e.relatedTarget && !panel.contains(e.relatedTarget) && e.relatedTarget !== btn) close(false);
  });
  sync();
})();
