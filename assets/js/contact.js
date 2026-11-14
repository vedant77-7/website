// A-07: the brief form, the email links, and the headline and arrow coming in.
let mm = null;
let stampIn = null;

const MESSAGES = {
  name: 'Add your name so I know who to reply to.',
  email: 'That email doesn’t look right. Check it and try again.',
  brief: 'A line or two about the project is enough.',
  failed: 'The brief didn’t send. Try again, or email me at vedant@vedantvkdesai.com.',
};
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

// Email links are put together here so the address isn't sitting in the page source.
function emailLinks() {
  document.querySelectorAll('.js-email').forEach((link) => {
    const address = `${link.dataset.user}@${link.dataset.domain}`;
    link.href = `mailto:${address}`;
    if (!link.dataset.label) link.textContent = address;
  });
}

function check(form) {
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const brief = form.elements.brief.value.trim();
  const problems = [];
  if (!name) problems.push(['name', form.elements.name]);
  if (!EMAIL.test(email)) problems.push(['email', form.elements.email]);
  if (brief.length < 10) problems.push(['brief', form.elements.brief]);
  return problems;
}

function show(form, problems) {
  const failing = new Set(problems.map(([key]) => key));
  ['name', 'email', 'brief'].forEach((key) => {
    const input = form.elements[key];
    const error = document.getElementById(input.getAttribute('aria-describedby'));
    const bad = failing.has(key);
    input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    error.textContent = bad ? MESSAGES[key] : '';
  });
}

function briefForm() {
  const form = document.querySelector('.brief');
  if (!form) return;

  const send = form.querySelector('.brief__send');
  const status = form.querySelector('.brief__status');
  const done = form.querySelector('.brief__done');
  const thanks = form.querySelector('.brief__thanks');
  let tried = false;

  form.noValidate = true;
  form.elements.started.value = String(Date.now());

  form.addEventListener('input', () => {
    if (tried) show(form, check(form));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    tried = true;
    status.textContent = '';

    const problems = check(form);
    show(form, problems);
    if (problems.length) {
      problems[0][1].focus();
      return;
    }

    send.disabled = true;
    send.textContent = 'Sending';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`brief ${res.status}`);

      const email = form.elements.email.value.trim();
      Array.from(form.children).forEach((child) => {
        if (child !== done) child.hidden = true;
      });
      thanks.textContent = `Thanks, I’ll reply to ${email} soon.`;
      done.hidden = false;
      thanks.focus();
      if (stampIn) stampIn(done.querySelector('.stamp'));
    } catch (err) {
      console.error(err);
      status.textContent = MESSAGES.failed;
      send.disabled = false;
      send.textContent = 'Send Brief';
    }
  });
}

export function setup({ gsap }) {
  emailLinks();
  briefForm();

  if (gsap) {
    stampIn = (stamp) => gsap.from(stamp, { scale: 1.6, rotation: 12, autoAlpha: 0, duration: 0.35, ease: 'power4.in' });
  }
}

export function animate({ gsap, SplitText }) {
  const intro = document.querySelector('.contact__intro');
  if (!intro) return;

  const title = intro.querySelector('.contact__title');
  const arrow = intro.querySelector('.contact__arrow');

  mm = gsap.matchMedia();
  mm.add('(min-width: 0px)', () => {
    const split = SplitText.create(title, { type: 'chars,lines', mask: 'lines' });

    gsap.timeline({
      scrollTrigger: { trigger: intro, start: 'top 80%', toggleActions: 'play none none none' },
      onComplete: () => split.revert(),
    })
      .from(split.chars, { yPercent: 110, duration: 0.9, stagger: 0.025, ease: 'expo.out' })
      .fromTo(arrow, { '--dash': 1, '--draw': 1 }, { '--draw': 0, duration: 0.7, ease: 'power2.inOut' }, 0.4);

    return () => split.revert();
  });
}

export function revert() {
  if (mm) mm.revert();
}
