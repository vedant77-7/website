// Case study pages: the photo comes out of its drawing on load, and the results count up.
let mm = null;

export function animate({ gsap }) {
  const media = document.querySelector('.case-media');
  if (!media) return;

  const drawing = media.querySelector('.case-media__blueprint');
  const head = document.querySelectorAll('.case-head__title, .facts__item');
  const results = Array.from(document.querySelectorAll('.stats--results .stats__item'));

  mm = gsap.matchMedia();
  mm.add('(min-width: 0px)', () => {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from(head, { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.05 })
      .fromTo(drawing, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 55%)', duration: 1.2, ease: 'power3.inOut' }, 0.2);

    if (!results.length) return;

    const counts = results.map((item) => {
      const dd = item.querySelector('dd');
      return { dd, end: Number(dd.dataset.count), before: dd.dataset.before || '', after: dd.dataset.after || '', text: dd.textContent };
    });
    counts.forEach((c) => { c.dd.textContent = `${c.before}0${c.after}`; });

    gsap.timeline({ scrollTrigger: { trigger: results[0], start: 'top 85%', toggleActions: 'play none none none' } })
      .add(counts.map((c, i) => {
        const state = { value: 0 };
        return gsap.to(state, {
          value: c.end,
          duration: 1.6,
          delay: i * 0.1,
          ease: 'power3.out',
          onUpdate: () => { c.dd.textContent = `${c.before}${Math.round(state.value)}${c.after}`; },
        });
      }));

    return () => counts.forEach((c) => { c.dd.textContent = c.text; });
  });
}

export function revert() {
  if (mm) mm.revert();
}
