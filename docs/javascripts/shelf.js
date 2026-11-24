/* 首页书架：按系列筛选，「最新上架」只显示 10 天内加进来的图鉴。
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

    function addedAt(b) {
      var d = b.dataset.added ? new Date(b.dataset.added + "T00:00:00") : null;
      return d && !isNaN(d) ? d.getTime() : 0;
    }
    function isNew(b) {
      var t = addedAt(b);
      return t > 0 && now - t < NEW_DAYS * 86400000;
    }

    books.forEach(function (b) {
      if (!isNew(b)) return;
      var cover = b.querySelector(".om-book__cover");
      if (cover && !cover.querySelector(".om-book__new")) {
        var tag = document.createElement("span");
        tag.className = "om-book__new";
        tag.textContent = "NEW";
        cover.appendChild(tag);
      }
    });

    // 「最新上架」没有结果时的提示
    var empty = document.createElement("p");
    empty.className = "om-empty om-shelf-empty";
    empty.hidden = true;
    empty.textContent = "最近 " + NEW_DAYS + " 天没有新上架的图鉴。";
    shelf.parentNode.insertBefore(empty, shelf.nextSibling);

    function apply(filter) {
      chips.forEach(function (c) { c.classList.toggle("is-on", c.dataset.filter === filter); });
      var order = original.slice();
      if (filter === "new") {
        order.sort(function (a, b) { return addedAt(b) - addedAt(a); });
      }
      var shown = 0;
      order.forEach(function (b) {
        var ok = filter === "all" ? true
               : filter === "new" ? isNew(b)
               : b.dataset.series === filter;
        b.hidden = !ok;
        if (ok) shown++;
        shelf.appendChild(b);
      });
      empty.hidden = !(filter === "new" && shown === 0);
      shelf.hidden = shown === 0;
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () { apply(c.dataset.filter); });
    });
  }

  if (window.document$) { document$.subscribe(init); }
  else { document.addEventListener("DOMContentLoaded", init); }
})();
