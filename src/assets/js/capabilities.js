// A-04: tiles rise, then the orange corner brackets close in on each one like a viewfinder finding focus.
let mm = null;

const OUT = 24;
const corners = [
  ['tl', -1, -1],
  ['tr', 1, -1],
  ['bl', -1, 1],
  ['br', 1, 1],
];

export function animate({ gsap }) {
  const grid = document.querySelector('.caps');
  if (!grid) return;

  const tiles = Array.from(grid.querySelectorAll('.cap'));

  mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 761px)', mobile: '(max-width: 760px)' }, ({ conditions }) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: grid, start: 'top 80%', toggleActions: 'play none none none' } });

    tl.from(tiles, { y: conditions.desktop ? 40 : 16, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' });

    tiles.forEach((tile, i) => {
      corners.forEach(([name, dx, dy]) => {
        const corner = tile.querySelector(`.cap__corner--${name}`);
        tl.from(corner, {
          x: dx * OUT,
          y: dy * OUT,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'power3.out',
          // hand the corner back to CSS so the hover state works
          onComplete: () => gsap.set(corner, { clearProps: 'transform,opacity,visibility' }),
        }, 0.45 + i * 0.08);
      });
    });
  });
}

export function revert() {
  if (mm) mm.revert();
}
