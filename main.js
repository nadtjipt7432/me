(function () {
  "use strict";

  var words = Array.prototype.slice.call(document.querySelectorAll(".w"));
  var descs = Array.prototype.slice.call(document.querySelectorAll(".tw-desc"));
  var count = document.getElementById("tw-count");
  var term = document.getElementById("tw-term");
  var total = words.length;
  var current = 0;
  var canHover = window.matchMedia("(hover: hover)").matches;

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function select(i, focus) {
    i = (i + total) % total;
    if (i === current) { if (focus) words[i].focus(); return; }
    words[current].setAttribute("aria-selected", "false");
    words[current].tabIndex = -1;
    descs[current].classList.remove("on");
    current = i;
    words[i].setAttribute("aria-selected", "true");
    words[i].tabIndex = 0;
    descs[i].classList.add("on");
    count.textContent = pad(i + 1) + " / " + pad(total);
    term.textContent = descs[i].getAttribute("data-term");
    if (focus) words[i].focus();
  }

  words.forEach(function (w, i) {
    w.addEventListener("click", function () { select(i); });
    if (canHover) w.addEventListener("mouseenter", function () { select(i); });
    w.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select(current + 1, true); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select(current - 1, true); }
      if (e.key === "Home") { e.preventDefault(); select(0, true); }
      if (e.key === "End") { e.preventDefault(); select(total - 1, true); }
    });
  });

  var prev = document.getElementById("tw-prev");
  var next = document.getElementById("tw-next");
  if (prev) prev.addEventListener("click", function () { select(current - 1); });
  if (next) next.addEventListener("click", function () { select(current + 1); });

  // Underline the nav item for the section in view
  var links = Array.prototype.slice.call(document.querySelectorAll(".top nav a"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          a.setAttribute("aria-current", a.getAttribute("href") === "#" + en.target.id ? "true" : "false");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["ten-words", "about", "gallery"].forEach(function (id) {
      var el = document.getElementById(id); if (el) io.observe(el);
    });
  }
})();
