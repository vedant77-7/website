// A-01: the orange line runs through the five steps as you scroll; each step lights up as it's reached.
let mm = null;

export function animate({ gsap }) {
  const list = document.querySelector('.method');
  if (!list) return;

  const steps = Array.from(list.querySelectorAll('.method__step'));
  const last = steps.length - 1;
  const tokens = getComputedStyle(document.documentElement);
  const muted = tokens.getPropertyValue('--muted').trim();
  const orange = tokens.getPropertyValue('--orange').trim();

  mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 761px)', mobile: '(max-width: 760px)' }, ({ conditions }) => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: list,
        start: 'top 80%',
        end: conditions.desktop ? 'center 55%' : 'bottom 75%',
        scrub: 0.6,
      },
    });

    if (conditions.desktop) {
      // Step k's icon sits at time k. The end steps only have half a column of line.
      steps.forEach((step, k) => {
        const start = k === 0 ? 0 : k - 0.5;
        const length = k === 0 || k === last ? 0.5 : 1;
        tl.fromTo(step, { '--seg': 0 }, { '--seg': 1, duration: length }, start);
      });
    } else {
      tl.fromTo(list, { '--track': 0 }, { '--track': 1, duration: last + 0.6 }, 0);
    }

    steps.forEach((step, k) => {
      const no = step.querySelector('.method__no');
      const icon = step.querySelector('.method__svg');
      const words = step.querySelectorAll('.method__name, .method__line');

      tl.fromTo(no, { color: muted }, { color: orange, duration: 0.25 }, k)
        .fromTo(icon, { '--dash': 1, '--draw': 1 }, { '--draw': 0, duration: 0.6, ease: 'power1.inOut' }, k)
        .from(words, { y: 16, autoAlpha: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }, k + 0.1);
    });
  });
}

export function revert() {
  if (mm) mm.revert();
}
