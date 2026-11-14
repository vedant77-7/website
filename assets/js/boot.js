// Runs before first paint. Marks that JS is on, and if the animation
// code never takes over (blocked, offline, error), shows the page as is.
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  setTimeout(function () {
    if (!root.classList.contains('is-ready')) root.classList.add('no-anim');
  }, 4000);
})();
