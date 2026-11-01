/* CourtDesk AI appearance: accent theme and light/dark/system mode.
   Load it in <head>, before the stylesheets, as a normal external script (no defer, no
   async) so the right theme is set before the first paint. No cookies, no network.

   Precedence: if the server already set data-appearance-source="account" on <html> (the
   signed-in person's saved preference), that wins and browser storage is ignored.
   Otherwise (the public landing page) the choice is kept in this browser's localStorage
   only. Documents and exports never follow the theme. */
(function () {
  "use strict";
  var KEY = "cd-appearance";
  var ACCENTS = ["navy", "slate", "steel", "midnight", "dusk"];
  var MODES = ["light", "dark", "system"];
  var DEFAULTS = { accent: "navy", mode: "light" };
  var root = document.documentElement;
  var fromAccount = root.getAttribute("data-appearance-source") === "account";

  function valid(list, v, fallback) {
    return list.indexOf(v) === -1 ? fallback : v;
  }
  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var o = raw ? JSON.parse(raw) : {};
      return {
        accent: valid(ACCENTS, o && o.accent, DEFAULTS.accent),
        mode: valid(MODES, o && o.mode, DEFAULTS.mode),
      };
    } catch (e) {
      return { accent: DEFAULTS.accent, mode: DEFAULTS.mode };
    }
  }
  function apply(a) {
    root.setAttribute("data-accent", a.accent);
    root.setAttribute("data-mode", a.mode);
  }
  function current() {
    return {
      accent: valid(ACCENTS, root.getAttribute("data-accent"), DEFAULTS.accent),
      mode: valid(MODES, root.getAttribute("data-mode"), DEFAULTS.mode),
    };
  }

  if (fromAccount) {
    apply(current());
  } else {
    apply(read());
  }

  window.CDAppearance = {
    accents: ACCENTS.slice(),
    modes: MODES.slice(),
    defaults: { accent: DEFAULTS.accent, mode: DEFAULTS.mode },
    fromAccount: fromAccount,
    get: current,
    /* Show a theme without saving it (hover or focus preview). */
    preview: function (p) {
      var c = current();
      apply({
        accent: valid(ACCENTS, p && p.accent, c.accent),
        mode: valid(MODES, p && p.mode, c.mode),
      });
    },
    /* Save a choice. In the portal the page also sends it to the account (engine request
       UI-1); here only the browser copy is kept, and only on pages not run by the account. */
    set: function (p) {
      var c = current();
      var next = {
        accent: valid(ACCENTS, p && p.accent, c.accent),
        mode: valid(MODES, p && p.mode, c.mode),
      };
      apply(next);
      saved = next;
      if (!fromAccount) {
        try {
          window.localStorage.setItem(KEY, JSON.stringify(next));
        } catch (e) {
          /* private window or storage blocked: the choice lasts for this page only */
        }
      }
      root.dispatchEvent(new CustomEvent("cd-appearance", { detail: next }));
      return next;
    },
    /* Undo an unsaved preview. */
    restore: function () {
      apply(saved);
    },
    reset: function () {
      if (!fromAccount) {
        try {
          window.localStorage.removeItem(KEY);
        } catch (e) {}
      }
      return this.set(DEFAULTS);
    },
  };
  var saved = current();
})();
