// Marks the menu link for the section on screen. Credentials and Global share a row, so both mark Credentials.
const SECTIONS = {
  work: 'work',
  about: 'about',
  capabilities: 'capabilities',
  credentials: 'credentials',
  global: 'credentials',
  contact: 'contact',
};

export function setup() {
  const links = new Map();
  document.querySelectorAll('.nav__links a').forEach((link) => links.set(link.hash.slice(1), link));

  const sections = Object.keys(SECTIONS).map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const onScreen = new Set();
  let current = null;

  const mark = () => {
    const section = sections.find((el) => onScreen.has(el));
    const link = section ? links.get(SECTIONS[section.id]) : null;
    if (link === current) return;
    if (current) current.removeAttribute('aria-current');
    if (link) link.setAttribute('aria-current', 'true');
    current = link;
  };

  // a section counts while it crosses the middle of the screen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) onScreen.add(entry.target);
      else onScreen.delete(entry.target);
    });
    mark();
  }, { rootMargin: '-50% 0px -49% 0px' });

  sections.forEach((el) => observer.observe(el));
}
