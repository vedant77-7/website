import * as hero from './hero.js';
import * as method from './method.js';
import * as work from './work.js';
import * as timeline from './timeline.js';
import * as capabilities from './capabilities.js';
import * as credentials from './credentials.js';
import * as globe from './globe.js';
import * as contact from './contact.js';
import * as footer from './footer.js';
import * as sheetCounter from './sheet-counter.js';
import * as caseStudy from './case.js';
import * as nav from './nav.js';

const root = document.documentElement;
const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin, Lenis } = window;
const hasGsap = Boolean(gsap && ScrollTrigger && SplitText && DrawSVGPlugin && ScrambleTextPlugin);
const motion = motionOK && hasGsap;

// Sections that animate on scroll. The hero runs its own intro after the loader.
const sections = [method, work, timeline, capabilities, credentials, contact, footer, sheetCounter, caseStudy];

let lenis = null;

// Things that work with or without motion: the menu, the form, email links, the globe, hover effects.
for (const part of [nav, work, globe, contact, footer]) {
  try {
    part.setup({ gsap: motion ? gsap : null, motion: part === globe ? motionOK : motion, finePointer });
  } catch (err) {
    console.error(err);
  }
}

if (!motion) {
  root.classList.add('is-ready', 'no-anim');
} else {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin);
  root.classList.add('is-ready');

  if (Lenis) {
    lenis = new Lenis({ lerp: 0.12, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const ctx = { gsap, ScrollTrigger, SplitText, lenis, finePointer };

  let failed = false;
  try {
    sections.forEach((section) => section.animate(ctx));
  } catch (err) {
    failed = true;
    bail(err);
  }

  if (!failed && document.querySelector('.hero')) {
    if (lenis) lenis.stop();
    hero.init(ctx).catch(bail);
  }
}

// If anything throws, drop the motion and show the finished page.
function bail(err) {
  console.error(err);
  // show the page first, so nothing below can leave the loader up
  root.classList.add('no-anim');
  gsap.globalTimeline.getChildren().forEach((child) => child.kill());
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  if (document.querySelector('.hero')) {
    try { hero.revert(); } catch (e) { console.error(e); }
  }
  sections.forEach((section) => {
    try { section.revert(); } catch (e) { console.error(e); }
  });
  if (lenis) lenis.start();
}
