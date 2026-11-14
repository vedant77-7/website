// A-02: the featured building comes out of its own drawing; the other cards show the drawing under the cursor.
let mm = null;

export function setup({ finePointer }) {
  if (!finePointer) return;

  document.querySelectorAll('.work-card:not(.work-card--featured) .work-card__media').forEach((media) => {
    const drawing = media.querySelector('.work-card__blueprint');
    media.addEventListener('pointermove', (e) => {
      const box = media.getBoundingClientRect();
      drawing.style.setProperty('--x', `${e.clientX - box.left}px`);
      drawing.style.setProperty('--y', `${e.clientY - box.top}px`);
    });
  });
}

export function animate({ gsap }) {
  const featured = document.querySelector('.work-card--featured');
  if (!featured) return;

  const drawing = featured.querySelector('.work-card__blueprint');
  const body = featured.querySelector('.work-card__body');
  const cards = document.querySelectorAll('.work-card:not(.work-card--featured)');

  mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 761px)', mobile: '(max-width: 760px)' }, ({ conditions }) => {
    gsap.timeline({
      scrollTrigger: { trigger: featured, start: 'top 85%', end: 'top 35%', scrub: 0.6 },
    })
      .fromTo(drawing, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 55%)', ease: 'none', duration: 1 })
      .from(body, { y: 24, autoAlpha: 0, ease: 'power2.out', duration: 0.4 }, 0.5);

    gsap.from(cards, {
      y: conditions.desktop ? 40 : 16,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: cards[0], start: 'top 80%', toggleActions: 'play none none none' },
    });
  });
}

export function revert() {
  if (mm) mm.revert();
}
