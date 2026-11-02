// HOMEPAGE CAROUSEL — auto-advances; clicking a dot jumps to that slide
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const DELAY = 5000;
let current = 0;
let timer;

function showSlide(index) {
  slides[current].classList.remove('is-active');
  dots[current].classList.remove('is-active');
  dots[current].removeAttribute('aria-current');

  current = index;

  slides[current].classList.add('is-active');
  dots[current].classList.add('is-active');
  dots[current].setAttribute('aria-current', 'true');
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => showSlide((current + 1) % slides.length), DELAY);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    showSlide(i);
    startTimer(); // restart so the chosen slide gets a full turn
  });
});

startTimer();
