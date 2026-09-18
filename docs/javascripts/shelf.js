/* 首页书架：按系列筛选 + 「最新上架」
   最新上架会读取 GitHub Release（pdf-library）里每本 PDF 的更新时间，
   10 天内更新的封面会显示 NEW。读取失败时书架照常显示，只是没有 NEW。 */
(function () {
  var API = "https://api.github.com/repos/littlesharkw/private-encyclopedias/releases/tags/pdf-library";
  var NEW_DAYS = 10;
  var CACHE_KEY = "shelf-release-v1";
  var CACHE_MIN = 30;

  function getRelease() {
    try {
      var c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      if (c && Date.now() - c.t < CACHE_MIN * 60000) return Promise.resolve(c.map);
    } catch (e) {}
    return fetch(API, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var map = {};
        (data.assets || []).forEach(function (a) { map[a.name] = a.updated_at; });
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), map: map })); } catch (e) {}
        return map;
      });
  }

  function init() {
    var shelf = document.querySelector(".om-shelf");
    if (!shelf) return;
    var books = Array.prototype.slice.call(shelf.querySelectorAll(".om-book"));
    var original = books.slice();
    var chips = Array.prototype.slice.call(document.querySelectorAll(".om-chip"));
    var newChip = document.querySelector('.om-chip[data-filter="new"]');
    var updated = null;
    if (newChip) newChip.hidden = true;           // 读到 Release 数据后才显示

    function apply(filter) {
      chips.forEach(function (c) { c.classList.toggle("is-on", c.dataset.filter === filter); });
      var order = original.slice();
      if (filter === "new" && updated) {
        order.sort(function (a, b) {
          return new Date(updated[b.dataset.file] || 0) - new Date(updated[a.dataset.file] || 0);
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

    getRelease().then(function (map) {
      updated = map;
      var now = Date.now(), anyNew = false;
      books.forEach(function (b) {
        var t = map[b.dataset.file];
        if (t && now - new Date(t) < NEW_DAYS * 86400000) {
          anyNew = true;
          var cover = b.querySelector(".om-book__cover");
          if (cover && !cover.querySelector(".om-book__new")) {
            var tag = document.createElement("span");
            tag.className = "om-book__new"; tag.textContent = "NEW";
            cover.appendChild(tag);
          }
        }
      });
      if (newChip && Object.keys(map).length) newChip.hidden = false;
    }).catch(function () { /* 读不到就不显示 NEW */ });
  }

  if (window.document$) { document$.subscribe(init); }
  else { document.addEventListener("DOMContentLoaded", init); }
})();
