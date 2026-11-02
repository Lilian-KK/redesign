// PROJECTS FILTER — one category at a time; clicking the active one clears it
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project-list li');
const toggle = document.querySelector('.show-more');
const mobile = window.matchMedia('(max-width: 767px)');
const tablet = window.matchMedia('(max-width: 1023px)');
const PREVIEW_ROWS = 2;
let active = null;
let expanded = false;

function render() {
  filters.forEach((filter) => {
    filter.setAttribute('aria-pressed', filter.dataset.filter === active);
  });

  // only the first two rows of matches show until the list is expanded
  // (columns match the grid: five on desktop, three on tablet, two on mobile)
  const columns = mobile.matches ? 2 : tablet.matches ? 3 : 5;
  const preview = PREVIEW_ROWS * columns;
  let matches = 0;
  projects.forEach((project) => {
    const categories = project.dataset.categories.split(' ');
    const matchesFilter = active === null || categories.includes(active);
    if (matchesFilter) matches++;
    project.hidden = !matchesFilter || (!expanded && matches > preview);
  });

  toggle.hidden = matches <= preview;
  toggle.textContent = expanded ? 'show less' : 'show more';
  toggle.setAttribute('aria-expanded', expanded);
}

filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const category = filter.dataset.filter;
    active = category === active ? null : category;
    render();
  });
});

toggle.addEventListener('click', () => {
  expanded = !expanded;
  render();
});

// HOVER THUMBNAILS — only enabled for projects whose image actually loads
document.querySelectorAll('.project-list a[data-thumb]').forEach((link) => {
  const img = new Image();
  img.onload = () => {
    // absolute URL — a relative one would resolve against css/style.css
    link.style.setProperty('--thumb', `url("${img.src}")`);
    link.classList.add('has-thumb');
  };
  img.src = link.dataset.thumb;
});

mobile.addEventListener('change', render);
tablet.addEventListener('change', render);

render();
