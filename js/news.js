// NEWS LIST — first two rows show; the rest open with "show more"
const articles = document.querySelectorAll('.news-list li');
const toggle = document.querySelector('.show-more');
const mobile = window.matchMedia('(max-width: 767px)');
const tablet = window.matchMedia('(max-width: 1023px)');
const PREVIEW_ROWS = 2;
let expanded = false;

function render() {
  // columns match the grid: five on desktop, three on tablet, two on mobile
  const columns = mobile.matches ? 2 : tablet.matches ? 3 : 5;
  const preview = PREVIEW_ROWS * columns;

  articles.forEach((article, index) => {
    article.hidden = !expanded && index >= preview;
  });

  toggle.hidden = articles.length <= preview;
  toggle.textContent = expanded ? 'show less' : 'show more';
  toggle.setAttribute('aria-expanded', expanded);
}

toggle.addEventListener('click', () => {
  expanded = !expanded;
  render();
});

mobile.addEventListener('change', render);
tablet.addEventListener('change', render);

render();
