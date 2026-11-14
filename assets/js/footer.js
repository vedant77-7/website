// Footer: the title block fills in once, like a sheet being signed off.
let mm = null;

export function setup() {}

export function animate({ gsap }) {
  const block = document.querySelector('.sheet__block');
  if (!block) return;

  const cells = block.querySelectorAll('.sheet__cell');
  const values = Array.from(block.querySelectorAll('.sheet__value'));

  mm = gsap.matchMedia();
  mm.add('(min-width: 0px)', () => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: block, start: 'top 92%', toggleActions: 'play none none none' } });
    tl.from(cells, { autoAlpha: 0, duration: 0.6, ease: 'power2.out' });
    values.forEach((value) => {
      tl.to(value, {
        duration: 0.8,
        scrambleText: { text: value.textContent, chars: 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789', speed: 0.6 },
      }, 0.1);
    });
  });
}

export function revert() {
  if (mm) mm.revert();
}
