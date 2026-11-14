// The sheet number in the bottom corner follows the section on screen, A-00 to A-07.
let mm = null;

const SHEETS = [
  ['.hero', 'A-00'],
  ['#method', 'A-01'],
  ['#work', 'A-02'],
  ['#about', 'A-03'],
  ['#capabilities', 'A-04'],
  ['#credentials', 'A-05'],
  ['#global', 'A-06'],
  ['#contact', 'A-07'],
];

export function animate({ gsap, ScrollTrigger }) {
  const label = document.querySelector('.sheet-no__current');
  if (!label) return;

  mm = gsap.matchMedia();
  mm.add('(min-width: 1101px) and (pointer: fine)', () => {
    let current = label.textContent;
    const active = new Set();

    const update = () => {
      // A-05 and A-06 sit side by side, so the first one on screen wins
      const sheet = SHEETS.find(([selector]) => active.has(selector));
      if (!sheet || sheet[1] === current) return;
      current = sheet[1];
      gsap.to(label, { duration: 0.3, overwrite: true, scrambleText: { text: current, chars: '0123456789', speed: 0.8 } });
    };

    SHEETS.forEach(([selector]) => {
      if (!document.querySelector(selector)) return;
      ScrollTrigger.create({
        trigger: selector,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) active.add(selector);
          else active.delete(selector);
          update();
        },
      });
    });
  });
}

export function revert() {
  if (mm) mm.revert();
}
