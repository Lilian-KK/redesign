// STUDIO STORY — first paragraph shows; the rest opens with "show more"
const toggle = document.querySelector('.story .show-more');
const more = document.getElementById('story-more');

toggle.addEventListener('click', () => {
  const expanded = more.hidden;
  more.hidden = !expanded;
  toggle.textContent = expanded ? 'show less' : 'show more';
  toggle.setAttribute('aria-expanded', expanded);
});
