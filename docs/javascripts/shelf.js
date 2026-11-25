/* 书脊书架：按系列筛选，「最新上架」只显示 10 天内加进来的图鉴。
   上架日期写在每本的 data-added 里（docs/index.md），不依赖网络。 */
(function () {
  var NEW_DAYS = 10;

  function init() {
    var shelf = document.querySelector(".om-spines");
    if (!shelf) return;
    var spines = Array.prototype.slice.call(shelf.querySelectorAll(".om-spine"));
    var original = spines.slice();
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
        b.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });
    });

    function apply(filter) {
      chips.forEach(function (c) { c.classList.toggle("is-on", c.dataset.filter === filter); });
      var order = original.slice();
      if (filter === "new") order.sort(function (a, b) { return addedAt(b) - addedAt(a); });
      var shown = 0;
      order.forEach(function (b) {
        var ok = filter === "all" ? true
               : filter === "new" ? isNew(b)
               : b.dataset.series === filter;
        b.hidden = !ok;
        b.classList.remove("is-open");
        if (ok) shown++;
        shelf.appendChild(b);
      });
      if (empty) empty.hidden = !(filter === "new" && shown === 0);
      shelf.hidden = shown === 0;
      shelf.scrollLeft = 0;
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () { apply(c.dataset.filter); });
    });
  }

  if (window.document$) { document$.subscribe(init); }
  else { document.addEventListener("DOMContentLoaded", init); }
})();
