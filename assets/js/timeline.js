// A-03: the about headline rises line by line, the spine draws down and each role slides in from its side.
let mm = null;

export function animate({ gsap, SplitText }) {
  const about = document.querySelector('.about');
  const list = document.querySelector('.timeline');
  if (!about || !list) return;

  const headline = about.querySelector('.about__headline');
  const body = about.querySelector('.about__body');
  const items = Array.from(list.querySelectorAll('.timeline__item'));

  mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 761px)', mobile: '(max-width: 760px)' }, ({ conditions }) => {
    const split = SplitText.create(headline, { type: 'lines', mask: 'lines' });

    gsap.timeline({
      scrollTrigger: { trigger: about, start: 'top 80%', toggleActions: 'play none none none' },
      onComplete: () => split.revert(),
    })
      .from(split.lines, { yPercent: 110, duration: 1, stagger: 0.08, ease: 'expo.out' })
      .from(body, { y: 24, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, 0.3);

    gsap.fromTo(list, { '--spine': 0 }, {
      '--spine': 1,
      ease: 'none',
      scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
    });

    items.forEach((item, i) => {
      const card = item.querySelector('.timeline__card');
      const fromLeft = conditions.desktop && i % 2 === 0;

      gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' } })
        .from(card, { x: (conditions.desktop ? 40 : 16) * (fromLeft ? -1 : 1), autoAlpha: 0, duration: 0.9, ease: 'power3.out' })
        .fromTo(item, { '--wire': 0 }, { '--wire': 1, duration: 0.5, ease: 'power2.out' }, 0.3)
        .fromTo(item, { '--node': 0 }, { '--node': 1, duration: 0.3, ease: 'power2.out' }, 0.7);
    });

    return () => split.revert();
  });
}

export function revert() {
  if (mm) mm.revert();
}
