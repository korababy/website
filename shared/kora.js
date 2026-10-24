/* Kora Baby — the website drafts' shared engine (LAUNCH 15.29, Prisma, 2026-10-19).
   Three versions (a, b, c) share this one file: the feature list, the 25 themes, the light/dark switch, and the
   scroll engine that drives every animation. Nothing is loaded from another site; no cookie, no storage.

   The engine, in one paragraph: an element with [data-scene] gets --p, how far the page has scrolled through it
   (0 when its top reaches the bottom of the window, 1 when its bottom leaves the top), and --q, the same for a
   sticky stage (0 when it pins, 1 when it lets go). Each version's CSS turns those two numbers into motion with
   calc(). [data-reveal] fades in once when it enters. [data-steps] picks the child step under --q and shows its
   screen. A visitor who asks for less motion gets every scene at rest and every reveal already shown.

   The feature list is the app's own: the 18 free lines and the ten premium ones of Your plan, as the store draft
   writes them (docs/launch/store-listing-plan-words-draft.md §2), plus the four things true of the whole app.
   §2 holds in every line: nothing is diagnosed, nothing is compared, an estimate says it is one. */

(function () {
  const C = { nursing: '#FFD640', bottle: '#FF783C', pump: '#FF78AA', sleep: '#40C8FF', wake: '#FFB028',
    diaper: '#CE74FF', solids: '#FF5454', growth: '#00C4B0', checkup: '#00B464', note: '#A4A4AA', sea: '#0c95b4' };

  // One stroke icon per feature, drawn on a 24-point grid.
  const I = {
    moon: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
    drop: '<path d="M12 3.5s6 6.6 6 10.5a6 6 0 0 1-12 0c0-3.900 6-10.500 6-10.500z"/>',
    bottle: '<path d="M10 2.5h4M10.5 2.500v3l-2 2.500V20a1.500 1.500 0 0 0 1.500 1.500h4A1.500 1.500 0 0 0 15.500 20V8l-2-2.500v-3M8.500 12h7M8.500 16h7"/>',
    pump: '<path d="M6 9a6 6 0 0 1 12 0H6zM10 9v4h4V9M12 13v4M9 21h6l-1-4h-4z"/>',
    diaper: '<path d="M3 7h18v3c0 5-4 8-9 8s-9-3-9-8V7z"/><path d="M8 7v3M16 7v3"/>',
    bowl: '<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M9 7.500c0-1.600 3-1.600 3-3.500M14 7.500c0-1 1.500-1.200 1.500-2.300"/>',
    growth: '<path d="M4 20V10M10 20V5M16 20v-7M21 20H3"/>',
    heart: '<path d="M12 20s-7.500-4.400-7.500-10A4.300 4.300 0 0 1 12 7.300 4.300 4.300 0 0 1 19.500 10c0 5.600-7.500 10-7.500 10z"/>',
    star: '<path d="M12 3.500l2.600 5.300 5.900.9-4.300 4.100 1 5.800L12 16.900l-5.200 2.700 1-5.800-4.300-4.100 5.900-.9z"/>',
    ball: '<circle cx="12" cy="12" r="8.500"/><path d="M3.500 12h17M12 3.500c3 3 3 14 0 17M12 3.500c-3 3-3 14 0 17"/>',
    note: '<path d="M6 3.500h9l3.500 3.500V20.500H6z"/><path d="M9 11h6M9 15h6"/>',
    cart: '<path d="M3 4h2.500l2 11h10l2-8H7"/><circle cx="9.500" cy="19" r="1.300"/><circle cx="16.500" cy="19" r="1.300"/>',
    day: '<rect x="3.500" y="4.500" width="17" height="16" rx="3"/><path d="M3.500 9.500h17M8 2.500v4M16 2.500v4"/>',
    chart: '<path d="M4 19h16"/><path d="M6 15l4-4 3 3 5-6"/>',
    clock: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7.500V12l3 2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.500v2M12 19.500v2M2.500 12h2M19.500 12h2M5.300 5.300l1.400 1.400M17.300 17.300l1.400 1.400M5.300 18.700l1.400-1.400M17.300 6.700l1.400-1.400"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.500 2h-15z"/><path d="M10 20.500a2 2 0 0 0 4 0"/>',
    steth: '<path d="M6 3.500v6a4 4 0 0 0 8 0v-6"/><path d="M10 13.500V16a4 4 0 0 0 8 0v-2"/><circle cx="18" cy="12" r="2"/>',
    family: '<circle cx="8.500" cy="9" r="3"/><circle cx="16" cy="10" r="2.500"/><path d="M3 19c.6-3 2.700-4.500 5.500-4.500S13.400 16 14 19M14.500 15c2.800-.6 5 .8 5.500 3.500"/>',
    out: '<path d="M12 3.500v11M7.500 10l4.500 4.500 4.500-4.500"/><path d="M4.500 15.500v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3"/>',
    spark: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3"/>',
    target: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="4.500"/><circle cx="12" cy="12" r="1"/>',
    book: '<path d="M4 5.500A2 2 0 0 1 6 3.500h13v15H6a2 2 0 0 0-2 2z"/><path d="M4 20.500v-15"/>',
    cake: '<path d="M4.500 20.500v-7h15v7zM4.500 16c2 1.500 3.500-1 5 0s3 1.500 5 0 3.500 1 5 0M12 13.500v-4"/><path d="M12 9.500c-1-1 0-2.500 0-3.500 1 1 1.500 2.500 0 3.500z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.500c0 3 1.500 4.500 3.500 4.500M16 6h3.500c0 3-1.500 4.500-3.500 4.500M12 13v4M8.500 20.500h7l-1-3.500h-5z"/>',
    stack: '<path d="M12 3.500l8.500 4.500L12 12.500 3.500 8z"/><path d="M3.500 12L12 16.500 20.500 12M3.500 16L12 20.500 20.500 16"/>',
    plate: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="4.500"/>',
    blocks: '<rect x="3.500" y="12.500" width="8" height="8" rx="1.500"/><rect x="12.500" y="12.500" width="8" height="8" rx="1.500"/><rect x="8" y="3.500" width="8" height="8" rx="1.500"/>',
    hand: '<path d="M8 12V5.500a1.500 1.500 0 0 1 3 0V11M11 10.500V4a1.500 1.500 0 0 1 3 0v7M14 10.500V5.500a1.500 1.500 0 0 1 3 0V14c0 4-2.500 6.500-6 6.500-2.500 0-4-1.500-5.500-3.500L4 14c-.8-1.200.9-2.500 2-1.500L8 14.500"/>',
    lock: '<rect x="5" y="2.500" width="14" height="19" rx="3"/><path d="M9 16.500h6M8.500 6.500h7"/>',
    palette: '<path d="M12 3.500a8.500 8.500 0 1 0 0 17c1.400 0 2-1 1.500-2.200-.6-1.400.4-2.800 1.900-2.800H17a3.500 3.500 0 0 0 3.500-3.500C20.500 7.200 16.700 3.500 12 3.500z"/><circle cx="8" cy="11" r="1"/><circle cx="11" cy="7.500" r="1"/><circle cx="15.500" cy="8.500" r="1"/>',
    globe: '<circle cx="12" cy="12" r="8.500"/><path d="M3.500 12h17M12 3.500c2.500 2.500 2.500 14.500 0 17M12 3.500c-2.500 2.500-2.500 14.500 0 17"/>',
    wifi: '<path d="M4 9.500a12 12 0 0 1 16 0M7 13a7.500 7.500 0 0 1 10 0M10 16.500a3 3 0 0 1 4 0"/><circle cx="12" cy="19.500" r=".8"/>',
    grid: '<rect x="3.500" y="3.500" width="7" height="7" rx="2"/><rect x="13.500" y="3.500" width="7" height="7" rx="2"/><rect x="3.500" y="13.500" width="7" height="7" rx="2"/><rect x="13.500" y="13.500" width="7" height="7" rx="2"/>'
  };

  // group: log · see · plan · together · whole (the whole app) ; p: premium ; shot: a screen of the test baby Kora.
  const FEATURES = [
    { g: 'log', icon: 'moon', c: C.sleep, t: 'Sleep', l: 'One tap starts the timer. Naps and nights, each in its place.', shot: 'sleep' },
    { g: 'log', icon: 'drop', c: C.nursing, t: 'Nursing', l: 'Left, right, how long — timed with a tap.', shot: 'feed' },
    { g: 'log', icon: 'bottle', c: C.bottle, t: 'Bottle', l: 'Breast milk or formula, in the units you use.' },
    { g: 'log', icon: 'pump', c: C.pump, t: 'Pumping', l: 'Every session, every side, every amount.' },
    { g: 'log', icon: 'diaper', c: C.diaper, t: 'Diapers', l: 'Wet, dirty or both, logged in a second.' },
    { g: 'log', icon: 'bowl', c: C.solids, t: 'Solids, with every recipe', l: 'Foods to discover and recipes for each stage, as your baby starts to eat.', shot: 'solids' },
    { g: 'log', icon: 'growth', c: C.growth, t: 'Growth', l: 'Weight, length and head, drawn over time.' },
    { g: 'log', icon: 'heart', c: C.checkup, t: 'Health notes', l: 'Temperatures, medicines and notes — recorded as you enter them, never interpreted.' },
    { g: 'log', icon: 'star', c: C.wake, t: 'Milestones', l: 'First smile to first steps, saved with the day. Every baby on their own time.' },
    { g: 'log', icon: 'ball', c: C.bottle, t: 'Activities', l: 'Ideas for play, picked for their age.' },
    { g: 'log', icon: 'note', c: C.note, t: 'Notes and photos', l: 'The little things, written down and kept.' },
    { g: 'see', icon: 'day', c: C.sea, t: 'The day at a glance', l: 'Today in one card. Every day back to the birth on one timeline.', shot: 'timeline' },
    { g: 'see', icon: 'chart', c: C.sleep, t: 'Insights', l: 'Sleep, feeds and diapers as calm, clear charts.', shot: 'insights' },
    { g: 'see', icon: 'clock', c: C.sleep, t: 'Sleep guidance for their age', l: 'When the next sleep may come, from age-typical timing. An estimate, not a promise.' },
    { g: 'see', icon: 'sun', c: C.wake, t: 'Weather and a time for a walk', l: 'The weather where you are, and a good hour to head out.', shot: 'weather' },
    { g: 'plan', icon: 'bell', c: C.wake, t: 'Reminders', l: 'Reminders you make, for anything. Every one off until you turn it on.' },
    { g: 'plan', icon: 'steth', c: C.checkup, t: 'Visits and the pediatrician report', l: 'Every visit in one place, and a report to bring along.', shot: 'visits' },
    { g: 'plan', icon: 'cart', c: C.solids, t: 'Shopping list', l: 'Diapers, wipes, the next jar — one list for the household.' },
    { g: 'together', icon: 'family', c: C.wake, t: 'The whole family, one record', l: 'Invite the other parent, a grandparent, the nanny. You choose who joins.' },
    { g: 'together', icon: 'out', c: C.note, t: 'Your data, always yours', l: 'Take everything out, any time.' },
    { g: 'premium', p: 1, icon: 'spark', c: C.sleep, t: 'Sleep suggestions from your baby’s own days', l: 'Drawn from their recent logs. Estimates, not promises.' },
    { g: 'premium', p: 1, icon: 'target', c: C.sleep, t: 'How close they have been', l: 'See how the suggestions matched the days that followed.' },
    { g: 'premium', p: 1, icon: 'book', c: C.pump, t: 'Their Story, month by month', l: 'Each month told back to you, with its moments.', shot: 'story' },
    { g: 'premium', p: 1, icon: 'cake', c: C.wake, t: 'The Year One story', l: 'A whole first year, from the first night to the first birthday.' },
    { g: 'premium', p: 1, icon: 'trophy', c: C.nursing, t: 'Records', l: 'A record night’s sleep, noticed and celebrated.' },
    { g: 'premium', p: 1, icon: 'stack', c: C.growth, t: 'Every stat, back to day one', l: 'Every chart open to the very first day.' },
    { g: 'premium', p: 1, icon: 'plate', c: C.solids, t: 'A weekly meal plan', l: 'The week’s meals, planned, with the shopping beside them.' },
    { g: 'premium', p: 1, icon: 'blocks', c: C.bottle, t: 'A weekly activity plan', l: 'A week of play, ready to go.' },
    { g: 'premium', p: 1, icon: 'hand', c: C.solids, t: 'Hands-free cook mode', l: 'Big steps on the screen, hands in the bowl.' },
    { g: 'premium', p: 1, icon: 'lock', c: C.sleep, t: 'Sleep on the lock screen', l: 'A running sleep on the lock screen and the Dynamic Island.' },
    { g: 'whole', icon: 'palette', c: C.pump, t: '25 themes', l: 'Light, dark and everything between.' },
    { g: 'whole', icon: 'globe', c: C.sea, t: 'Four languages', l: 'English, German, Italian and French.' },
    { g: 'whole', icon: 'wifi', c: C.growth, t: 'Works without a signal', l: 'Keep logging offline. It all arrives when you are back.' },
    { g: 'whole', icon: 'grid', c: C.wake, t: 'Your numbers, your Home', l: 'Choose the numbers Home shows first. Hold to change them.' }
  ];
  const GROUPS = { log: 'Every little thing', see: 'See the days take shape', plan: 'Plan ahead', together: 'Together',
    premium: 'Premium', whole: 'Across the whole app' };

  // The 25 themes: each one's floor and its accent, from the app's own catalogue (KoraDomain/Catalogues/themes.json).
  const THEMES = [['#DBCBB6', '#D07850'], ['#15171C', '#AEB6C4'], ['#16272c', '#9BD6D2'], ['#CFD2EB', '#7A4CA0'],
    ['#EDE8E3', '#A07564'], ['#0C1E1C', '#CBB78A'], ['#100B22', '#E29646'], ['#0d0f0e', '#cfe0d4'], ['#080a09', '#cfe0d4'],
    ['#0e0b08', '#ecd6ae'], ['#0c0e11', '#cdd9e8'], ['#000000', '#0a84ff'], ['#f2f2f7', '#007aff'], ['#0f1014', '#8f74ff'],
    ['#f6f7f9', '#5b45e0'], ['#101010', '#c9a86a'], ['#0c2830', '#ffffff'], ['#0e1113', '#00a19c'], ['#EFEBE3', '#252621'],
    ['#0D0F12', '#D4BA80'], ['#0B0D0E', '#D9C3A2'], ['#080808', '#D7C4AD'], ['#050607', '#D7DDE0'], ['#080807', '#E0CDA9'],
    ['#06112D', '#D3DCEF']];

  const svg = (name) => '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (I[name] || '') + '</svg>';

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;

  // Light and dark: the phone's own setting first; the button flips it for this visit only (nothing is stored).
  function look() { return root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
  function setShots() {
    const l = look();
    document.querySelectorAll('img[data-shot]').forEach((im) => {
      const want = 'shots/' + im.dataset.shot + '-' + l + '.jpg';
      if (!im.src.endsWith(want.slice(2))) {
        im.onerror = () => { im.onerror = null; im.src = '../img/home-' + l + '.jpg'; };
        im.src = want;
      }
    });
  }
  function bindLook() {
    document.querySelectorAll('[data-look-toggle]').forEach((b) => b.addEventListener('click', () => {
      root.dataset.theme = look() === 'dark' ? 'light' : 'dark';
      setShots();
    }));
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setShots);
  }

  // The scroll engine.
  let scenes = [], stepsets = [], ticking = false;
  function measure() {
    const vh = innerHeight;
    scenes.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh)));
      const span = r.height - vh;
      const q = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : p;
      el.style.setProperty('--p', p.toFixed(4));
      el.style.setProperty('--q', q.toFixed(4));
    });
    stepsets.forEach((set) => {
      const q = parseFloat(getComputedStyle(set.el).getPropertyValue('--q')) || 0;
      const n = set.steps.length;
      const i = Math.min(n - 1, Math.floor(q * n));
      if (set.i !== i) {
        set.i = i;
        set.el.dataset.active = i;
        set.steps.forEach((s, k) => s.classList.toggle('on', k === i));
        set.screens.forEach((s, k) => s.classList.toggle('on', k === i));
      }
    });
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(measure); } }

  function bindReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (reduce.matches || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((list) => list.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  function bindCount() {
    document.querySelectorAll('[data-count]').forEach((el) => {
      const to = +el.dataset.count;
      if (reduce.matches) { el.textContent = to; return; }
      const io = new IntersectionObserver((list) => list.forEach((en) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now(), d = 1600;
        const step = (t) => { const k = Math.min(1, (t - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }), { threshold: 0.6 });
      io.observe(el);
    });
  }

  // Word-by-word light-up: [data-words] splits its text so --p can light each word in turn.
  function bindWords() {
    document.querySelectorAll('[data-words]').forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map((w, i) => '<span style="--i:' + (i / words.length).toFixed(4) + '">' + w + '</span>').join(' ');
    });
  }

  // The menu on a phone: one button opens and closes it.
  function bindMenu() {
    document.querySelectorAll('[data-menu-toggle]').forEach((b) => b.addEventListener('click', () => {
      const open = root.classList.toggle('menu-open');
      b.setAttribute('aria-expanded', open);
    }));
    document.querySelectorAll('.menu a').forEach((a) => a.addEventListener('click', () => root.classList.remove('menu-open')));
  }

  function start() {
    if (reduce.matches) root.classList.add('still');
    bindWords();
    scenes = [...document.querySelectorAll('[data-scene]')];
    stepsets = [...document.querySelectorAll('[data-steps]')].map((el) => ({ el, i: -1,
      steps: [...el.querySelectorAll('[data-step]')], screens: [...el.querySelectorAll('[data-screen]')] }));
    setShots(); bindLook(); bindReveal(); bindCount(); bindMenu();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    measure();
  }

  window.Kora = { FEATURES, GROUPS, THEMES, svg, start, C };
})();
