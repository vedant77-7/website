const { SplitText } = window;

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

const splits = [];
let gsap, ScrollTrigger, lenis, finePointer;
let loader, hero, stage, portrait, role, status, roleText, statusText;

// Returns a promise that settles once the intro has been started.
export function init(ctx) {
  ({ gsap, ScrollTrigger, lenis, finePointer } = ctx);

  loader = $('.loader');
  hero = $('.hero');
  stage = $('.hero__stage');
  portrait = $('.hero__portrait img');
  role = $('.hero__role');
  status = $('.hero__status-text');
  roleText = role.textContent;
  statusText = status.textContent;

  const loading = runLoader();

  return Promise.all([assetsReady(), loading.then()]).then(() => intro().play());
}

// Puts the hero and stats back to their finished, static state.
export function revert() {
  if (!gsap) return; // the intro never started, so there's nothing to undo
  splits.forEach((split) => split.revert());
  gsap.set('.loader, .nav__inner > *, .hero *, .stats__item', { clearProps: 'all' });
  $$('.stats dd').forEach((dd) => {
    dd.textContent = `${dd.dataset.before || ''}${dd.dataset.count}${dd.dataset.after || ''}`;
  });
  role.textContent = roleText;
  status.textContent = statusText;
}

function runLoader() {
  const count = $('.loader__count');
  const state = { value: 0 };

  return gsap.timeline()
    .to(state, {
      value: 100,
      duration: 0.95,
      ease: 'power2.inOut',
      onUpdate: () => { count.textContent = String(Math.round(state.value)).padStart(3, '0'); },
    })
    .to('.loader__bar', { scaleX: 1, duration: 0.95, ease: 'power2.inOut' }, 0);
}

function assetsReady() {
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const image = portrait.decode ? portrait.decode().catch(() => {}) : Promise.resolve();
  const limit = new Promise((resolve) => setTimeout(resolve, 3000));
  return Promise.race([Promise.all([fonts, image]), limit]);
}

function intro() {
  const nameSplit = SplitText.create('.hero__line', {
    type: 'chars,lines',
    mask: 'lines',
    linesClass: 'name-line',
    aria: 'hidden',
  });
  splits.push(nameSplit);

  role.textContent = '';
  status.textContent = '';

  const counts = prepareStats();

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      parallax();
      pointer();
      magnetic();
      ScrollTrigger.refresh();
    },
  });

  tl.to(loader, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' })
    .set(loader, { display: 'none' })
    .addLabel('go', '-=0.4')
    .from('.hero__grid', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.4, ease: 'power2.inOut' }, 'go')
    .from('.nav__inner > *', { y: -12, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 'go+=0.1')
    .add(tower(), 'go+=0.15')
    .from(nameSplit.chars, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.04 }, 'go+=0.25')
    .from(portrait, { yPercent: 102, duration: 1.3, ease: 'power3.out' }, 'go+=1')
    .to(role, { duration: 1, scrambleText: { text: roleText, chars: 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789', speed: 0.6 } }, 'go+=1.7')
    .from('.hero__dot', { scale: 0, duration: 0.4 }, 'go+=1.95')
    .to(status, { duration: 0.9, scrambleText: { text: statusText, chars: 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789', speed: 0.6 } }, 'go+=2')
    .from('.hero__tagline > *', { y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, 'go+=1.8')
    .from('.hero__actions .btn', { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 'go+=2')
    .call(() => lenis && lenis.start(), null, 'go+=1')
    .call(() => stats(counts), null, 'go+=1.2');

  return tl;
}

// The elevation builds the way a site does: set out, frame, floors, envelope, lights.
function tower() {
  const svg = $('.tower');
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  const ground = Number($('.t-ground', svg).getAttribute('y1'));
  const cols = $$('.t-col', svg);
  const top = Math.min(...cols.map((col) => Number(col.getAttribute('y2'))));
  const span = ground - top;
  const climb = 1.7;
  const at = (y) => ((ground - y) / span) * climb;

  tl.from('.t-ground', { drawSVG: '50% 50%', duration: 0.7, ease: 'power2.inOut' })
    .from($$('.t-pile', svg), { scaleY: 0, transformOrigin: '50% 0%', duration: 0.3, stagger: 0.03 }, '-=0.25')
    .from($$('.t-axis', svg), { autoAlpha: 0, y: 6, duration: 0.4, stagger: 0.06 }, '<')
    .addLabel('climb', '-=0.1');

  cols.forEach((col) => {
    const y1 = Number(col.getAttribute('y1'));
    const y2 = Number(col.getAttribute('y2'));
    tl.from(col, { drawSVG: 0, duration: at(y2) - at(y1), ease: 'none' }, `climb+=${at(y1)}`);
  });

  $$('.t-floor', svg).forEach((floor) => {
    const slab = $('.t-slab', floor);
    const t = at(Number(slab.getAttribute('y1')));
    tl.from(slab, { drawSVG: '50% 50%', duration: 0.35 }, `climb+=${Math.max(0, t - 0.12)}`)
      .from($$('.t-win', floor), { autoAlpha: 0, duration: 0.3, stagger: 0.012 }, `climb+=${t}`);
  });

  const height = $('.t-height', svg);
  const finalHeight = parseFloat(height.textContent.replace('+', ''));
  const reading = { value: 0 };

  tl.from('.t-dim-line', { drawSVG: 0, duration: climb + 0.5, ease: 'none' }, 'climb')
    .from($$('.t-dim-ext, .t-dim-tick', svg), { autoAlpha: 0, duration: 0.3, stagger: 0.15 }, 'climb')
    .to(reading, {
      value: finalHeight,
      duration: climb + 0.5,
      ease: 'none',
      onUpdate: () => { height.textContent = `+${reading.value.toFixed(2)}`; },
    }, 'climb')
    .from($$('.t-crown', svg), { drawSVG: 0, duration: 0.5, stagger: 0.12, ease: 'power1.inOut' }, `climb+=${climb - 0.1}`)
    .to($$('.t-win[data-lit]', svg), {
      fillOpacity: (i, el) => Number(el.dataset.lit),
      duration: 0.5,
      stagger: { each: 0.035, from: 'random' },
    }, `climb+=${climb * 0.55}`);

  return tl;
}

function prepareStats() {
  const items = $$('.stats__item');
  const counts = items.map((item) => {
    const el = $('dd', item);
    return {
      el,
      end: Number(el.dataset.count),
      before: el.dataset.before || '',
      after: el.dataset.after || '',
    };
  });

  counts.forEach((c) => { c.el.textContent = `${c.before}0${c.after}`; });
  gsap.set(items, { '--rule-scale': 0 });
  return counts;
}

function stats(counts) {
  ScrollTrigger.create({
    trigger: '.stats',
    start: 'top bottom',
    once: true,
    onEnter: () => {
      gsap.to('.stats__item', { '--rule-scale': 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' });
      counts.forEach((c, i) => {
        const state = { value: 0 };
        gsap.to(state, {
          value: c.end,
          duration: 1.6,
          delay: i * 0.1,
          ease: 'power3.out',
          onUpdate: () => { c.el.textContent = `${c.before}${Math.round(state.value)}${c.after}`; },
        });
      });
    },
  });
}

// Background moves slowest: grid, then the tower, then the name. Vedant stays put.
function parallax() {
  const scrub = () => ({ trigger: hero, start: 'top top', end: 'bottom top', scrub: true });
  gsap.to('.hero__grid', { y: 110, ease: 'none', scrollTrigger: scrub() });
  gsap.to('.hero__tower', { y: 70, ease: 'none', scrollTrigger: scrub() });
  gsap.to('.hero__name', { y: 20, ease: 'none', scrollTrigger: scrub() });
}

// Cursor position readout, like the coordinate box in CAD.
function pointer() {
  if (!finePointer) return;
  const label = $('.hero__coords');
  const pad = (n) => String(Math.max(0, Math.round(n))).padStart(4, '0');

  stage.addEventListener('pointermove', (e) => {
    const box = stage.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    label.textContent = `X ${pad(x)}  Y ${pad(y)}`;
    label.style.transform = `translate(${x + 14}px, ${y + 16}px)`;
    stage.classList.add('is-pointing');
  });
  stage.addEventListener('pointerleave', () => stage.classList.remove('is-pointing'));
}

function magnetic() {
  if (!finePointer) return;
  $$('[data-magnetic]').forEach((el) => {
    const toX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const toY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    el.addEventListener('pointermove', (e) => {
      const box = el.getBoundingClientRect();
      toX((e.clientX - (box.left + box.width / 2)) * 0.2);
      toY((e.clientY - (box.top + box.height / 2)) * 0.3);
    });
    el.addEventListener('pointerleave', () => { toX(0); toY(0); });
  });
}
