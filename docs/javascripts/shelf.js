/* 首页书架：按系列筛选、按上架时间排序、10 天内的新书标 NEW
   上架日期写在每本书的 data-added 里（docs/index.md），不依赖网络，
   所以不会因为缓存或读不到 GitHub 而失效。 */
(function () {
  var NEW_DAYS = 10;

  function init() {
    var shelf = document.querySelector(".om-shelf");
    if (!shelf) return;
    var books = Array.prototype.slice.call(shelf.querySelectorAll(".om-book"));
    var original = books.slice();
    var chips = Array.prototype.slice.call(document.querySelectorAll(".om-chip"));
    var now = Date.now();

    books.forEach(function (b) {
      var d = b.dataset.added ? new Date(b.dataset.added + "T00:00:00") : null;
      if (!d || isNaN(d)) return;
      if (now - d < NEW_DAYS * 86400000) {
        var cover = b.querySelector(".om-book__cover");
        if (cover && !cover.querySelector(".om-book__new")) {
          var tag = document.createElement("span");
          tag.className = "om-book__new";
          tag.textContent = "NEW";
          cover.appendChild(tag);
        }
      }
    });

    function apply(filter) {
      chips.forEach(function (c) { c.classList.toggle("is-on", c.dataset.filter === filter); });
      var order = original.slice();
      if (filter === "new") {
        order.sort(function (a, b) {
          return (b.dataset.added || "").localeCompare(a.dataset.added || "");
        });
      }
      order.forEach(function (b) {
        b.hidden = !(filter === "all" || filter === "new" || b.dataset.series === filter);
        shelf.appendChild(b);
      });
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () { apply(c.dataset.filter); });
    });
  }

  if (window.document$) { document$.subscribe(init); }
  else { document.addEventListener("DOMContentLoaded", init); }
})();
