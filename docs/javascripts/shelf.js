/* 书脊书架：按领域分架 + 按系列筛选，「最新上架」只显示 10 天内加进来的图鉴。
   上架日期写在每本的 data-added 里（docs/index.md），不依赖网络。 */
(function () {
  var NEW_DAYS = 10;

  function init() {
    var groups = Array.prototype.slice.call(document.querySelectorAll(".om-dom-group"));
    if (!groups.length) return;
    var spines = Array.prototype.slice.call(document.querySelectorAll(".om-spine"));
    var chips = Array.prototype.slice.call(document.querySelectorAll(".om-chip"));
    var empty = document.querySelector(".om-spines-empty");
    var now = Date.now();
    var canHover = window.matchMedia("(hover: hover)").matches;

    function addedAt(b) {
      var d = b.dataset.added ? new Date(b.dataset.added + "T00:00:00") : null;
      return d && !isNaN(d) ? d.getTime() : 0;
    }
    function isNew(b) {
      var t = addedAt(b);
      return t > 0 && now - t < NEW_DAYS * 86400000;
    }

    spines.forEach(function (b) {
      if (isNew(b)) b.classList.add("is-new");
      var link = b.querySelector(".om-spine__link");
      if (!link || canHover) return;
      link.addEventListener("click", function (e) {
        if (b.classList.contains("is-open")) return;      // 第二下才进入页面
        e.preventDefault();
        spines.forEach(function (x) { x.classList.remove("is-open"); });
        b.classList.add("is-open");
        b.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    });

    function apply(filter) {
      chips.forEach(function (c) { c.classList.toggle("is-on", c.dataset.filter === filter); });
      var total = 0;
      groups.forEach(function (g) {
        var kids = Array.prototype.slice.call(g.querySelectorAll(".om-spine"));
        var shown = 0;
        kids.forEach(function (b) {
          var ok = filter === "all" ? true
                 : filter === "new" ? isNew(b)
                 : (b.dataset.series === filter || b.dataset.dom === filter);
          b.hidden = !ok;
          b.classList.remove("is-open");
          if (ok) shown++;
        });
        var count = g.querySelector(".om-dom span");
        if (count) count.textContent = shown + " 本";
        g.hidden = shown === 0;
        total += shown;
      });
      if (empty) empty.hidden = !(filter === "new" && total === 0);
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () { apply(c.dataset.filter); });
    });
  }

  if (window.document$) { document$.subscribe(init); }
  else { document.addEventListener("DOMContentLoaded", init); }
})();
