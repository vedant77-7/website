// A-05: each stamp comes down hard, one after another, and the sheet jolts as it lands.
let mm = null;

export function animate({ gsap }) {
  const cluster = document.querySelector('.stamps');
  if (!cluster) return;

  const stamps = Array.from(cluster.querySelectorAll('.stamp'));
  const sheet = cluster.closest('.section__inner');
  const rows = document.querySelectorAll('.creds__row');

  mm = gsap.matchMedia();
  mm.add('(min-width: 0px)', () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: cluster, start: 'top 80%', toggleActions: 'play none none none' } });

    stamps.forEach((stamp, i) => {
      const at = i * 0.25;
      tl.from(stamp, { scale: 1.6, rotation: 12, autoAlpha: 0, duration: 0.35, ease: 'power4.in' }, at)
        .to(sheet, { keyframes: { x: [3, -2, 1, 0] }, duration: 0.18, ease: 'none' }, at + 0.35);
    });

    tl.from(rows, { y: 12, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, '>-0.05');
  });
}

export function revert() {
  if (mm) mm.revert();
}
