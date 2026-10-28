/* Charlene Joy — v7 add-ons: loader, mood switcher, cursor, scrapbook hero, secrets, night sky.
   Loads after script.js and reuses its helpers ($, $$, toast, award, celebrate, onReady, setReady). */
(function () {
  'use strict';

  /* ---------- 4. Intro loader ---------- */
  const loader = $('#loader');
  if (!loader) setReady();
  else {
    const pct = $('#loaderPct'), cup = $('#loaderCup'), lines = $$('#loaderLines p');
    const marks = [0, 28, 60, 90];
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      loader.classList.add('hide');
      setReady();
      setTimeout(() => loader.remove(), 800);
    };
    loader.addEventListener('click', finish);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish(); });
    if (reduceMotion) {
      lines.forEach(l => l.classList.add('show'));
      pct.textContent = '100';
      setTimeout(finish, 250);
    } else {
      const t0 = performance.now(), dur = 2300;
      const frame = now => {
        if (done) return;
        const t = Math.min(1, (now - t0) / dur);
        const p = Math.round((1 - Math.pow(1 - t, 2)) * 100);
        pct.textContent = p;
        cup.style.setProperty('--p', p + '%');
        lines.forEach((l, i) => { if (p >= marks[i]) l.classList.add('show'); });
        if (t < 1) requestAnimationFrame(frame); else setTimeout(finish, 450);
      };
      requestAnimationFrame(frame);
    }
  }

  /* ---------- 1. Mood switcher (whole-page vibes) ---------- */
  const track = $('.ticker-track');
  const DEFAULT_TICKER = track ? $$('span', track).slice(0, 6).map(s => s.textContent) : [];
  const setTicker = items => {
    if (!track || !items || !items.length) return;
    const html = items.map(t => `<span>${t}</span>`).join('');
    track.innerHTML = html + html;
  };
  const VIBES = {
    default: { label: 'Classic', emoji: '🌿', cursor: '☕', status: 'caffeinated ☕', title: 'Charlene Joy | A Little World of Mine', theme: '#FBF7EE', toast: 'Back to my classic look 🌿', ticker: null },
    cafe: { label: 'Café mode', emoji: '☕', cursor: '☕', status: 'running on espresso ☕', title: 'Charlene Joy | Café Mode ☕', theme: '#F4E7D3', toast: 'Café mode on. Pour yourself something warm ☕',
      ticker: ['☕ 3 CUPS BEFORE NOON', '☕ SPANISH LATTE LOVER', '✎ DEADLINES BREW TOO', '⌘ DEBUGGING IN PROGRESS', '♡ K-DRAMA + COFFEE NIGHTS', '✧ ONE MORE SIP, ONE MORE LINE'] },
    sunset: { label: 'Sunset mode', emoji: '🌅', cursor: '🌅', status: 'chasing golden hour 🌅', title: 'Charlene Joy | Sunset Mode 🌅', theme: '#FF9A76', toast: 'Sunset mode on. Let the sky do its thing 🌅',
      ticker: ['🌅 GOLDEN HOUR LOADING…', '✦ SUNSETS MAKE ME PAUSE', '🌿 BUFFERING… PLEASE WAIT', '♫ SOFT PLAYLIST ON', '✧ THE SKY IS THE BEST WALLPAPER', '☕ ONE MORE LOOK AT THE SKY'] },
    stan: { label: 'Stan mode', emoji: '🎤', cursor: '💜', status: 'lightstick: ON 💜', title: 'Charlene Joy | Stan Mode 💜', theme: '#12061F', toast: 'Stan mode on. Lightsticks up! 💜',
      ticker: ['💜 LIGHTSTICK: ON', '♫ SEVENTEEN · STRAY KIDS · AHOF', '✧ DANCE BREAK IN 3… 2… 1…', '🎤 STREAMING RESPONSIBLY', '★ BIAS WRECKED, BUT MAKE IT TECH', '♡ STAYOLOGY PAGE MANAGER'] },
    press: { label: 'Press mode', emoji: '📰', cursor: '✒️', status: 'on deadline 📰', title: 'The Charlene Times | Extra Edition', theme: '#F2EDDE', toast: 'Press mode on. Stop the presses! 📰',
      ticker: ['BREAKING: IT STUDENT DISCOVERS NEW BUG', 'EXTRA! EXTRA! CHARLENE.EXE STILL RUNNING', 'LOCAL STUDENT COVERS 4 SPORTS, MISSES ZERO DEADLINES', 'SOURCES: THE BUG WAS A MISSING SEMICOLON', 'WEATHER: SUNSET EXPECTED THIS EVENING', 'COFFEE SUPPLY: STABLE (3 CUPS BEFORE NOON)'] }
  };
  let currentVibe = 'default', switching = false;
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  function applyVibe(v) {
    currentVibe = v;
    if (v === 'default') delete document.body.dataset.vibe; else document.body.dataset.vibe = v;
    $$('.vibe-btn').forEach(b => { const on = b.dataset.v === v; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    setTicker(VIBES[v].ticker || DEFAULT_TICKER);
    const st = $('#clStatus'); if (st) st.textContent = VIBES[v].status;
    if (window.cjSetCursor) window.cjSetCursor(VIBES[v].cursor);
    document.title = VIBES[v].title;
    if (metaTheme) metaTheme.setAttribute('content', VIBES[v].theme);
    skyUpdate();
  }
  function setVibe(v, origin) {
    if (switching) return;
    if (v === currentVibe) { toast(`${VIBES[v].label} is already on ✦`); return; }
    award('vibe');
    if (reduceMotion || !origin) { applyVibe(v); toast(VIBES[v].toast); return; }
    switching = true;
    const c = document.createElement('div');
    c.className = 'vibe-curtain';
    c.dataset.for = v;
    c.style.setProperty('--x', origin.x + 'px');
    c.style.setProperty('--y', origin.y + 'px');
    c.innerHTML = `<span>${VIBES[v].emoji} ${VIBES[v].label}</span>`;
    document.body.appendChild(c);
    setTimeout(() => applyVibe(v), 430);
    setTimeout(() => { c.remove(); switching = false; toast(VIBES[v].toast); }, 1150);
  }
  const pickBtn = $('#pickMood'), vibePop = $('#vibePop');
  const closePop = () => { if (!vibePop) return; vibePop.hidden = true; pickBtn.setAttribute('aria-expanded', 'false'); };
  if (pickBtn && vibePop) {
    pickBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = vibePop.hidden;
      vibePop.hidden = !open;
      pickBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => { if (!e.target.closest('#vibePop') && !e.target.closest('#pickMood')) closePop(); });
    vibePop.addEventListener('click', e => { if (e.target.closest('a')) closePop(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });
  }
  $$('.vibe-btn').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const r = b.getBoundingClientRect();
    setVibe(b.dataset.v, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    if (b.closest('#vibePop')) closePop();
  }));

  /* ---------- 6. Cursor with a story ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cur = document.createElement('div');
    cur.className = 'cj-cursor';
    cur.setAttribute('aria-hidden', 'true');
    cur.innerHTML = '<span class="em">☕</span><span class="label"></span>';
    document.body.appendChild(cur);
    const em = $('.em', cur), label = $('.label', cur);
    window.cjSetCursor = ch => { em.textContent = ch; };
    const sparks = ['✦', '✧', '✨', '·'], colors = ['#FF7A59', '#FFD86B', '#BBA4FF', '#8EDCF0', '#FF9EBB'];
    let last = 0;
    const spark = (x, y) => {
      const s = document.createElement('span');
      s.className = 'trail';
      s.textContent = sparks[(Math.random() * sparks.length) | 0];
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.color = colors[(Math.random() * colors.length) | 0];
      s.style.setProperty('--tx', (Math.random() * 30 - 15) + 'px');
      s.style.setProperty('--ty', (Math.random() * 30 + 8) + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 800);
    };
    document.addEventListener('mousemove', e => {
      document.body.classList.add('has-cursor');
      cur.style.opacity = '';
      cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
      const t = e.target instanceof Element ? e.target : null;
      const tip = t && t.closest('[data-cursor-text]');
      label.textContent = tip ? tip.dataset.cursorText : '';
      cur.classList.toggle('has-label', !!tip);
      cur.classList.toggle('hot', !!(t && t.closest('a,button,[role=button],[data-cursor-text],.memory-card,.poster')));
      const now = performance.now();
      if (!reduceMotion && now - last > 40) { last = now; spark(e.clientX, e.clientY); }
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => { cur.style.opacity = '0'; });
  }

  /* ---------- 5. Scrapbook hero: drag, captions, sticker facts ---------- */
  const art = $('.hero-art');
  if (art) {
    $$('.photo figcaption[data-captions]', art).forEach(cap => {
      const list = cap.dataset.captions.split('|');
      let i = 0;
      cap.parentElement.addEventListener('pointerenter', () => { i = (i + 1) % list.length; cap.textContent = list[i]; });
    });

    let zTop = 10, told = false;
    $$('.photo', art).forEach(p => {
      let sx = 0, sy = 0, ox = 0, oy = 0, drag = false;
      p.addEventListener('pointerdown', e => {
        if (e.button) return;
        drag = true;
        try { p.setPointerCapture(e.pointerId); } catch (err) {}
        ox = p.offsetLeft; oy = p.offsetTop; sx = e.clientX; sy = e.clientY;
        p.style.left = ox + 'px'; p.style.top = oy + 'px';
        p.style.right = 'auto'; p.style.bottom = 'auto';
        p.style.animation = 'none';
        p.style.zIndex = ++zTop;
        p.classList.add('dragging');
      });
      p.addEventListener('pointermove', e => {
        if (!drag) return;
        const nx = Math.min(Math.max(ox + e.clientX - sx, -30), art.clientWidth - p.offsetWidth + 30);
        const ny = Math.min(Math.max(oy + e.clientY - sy, -30), art.clientHeight - p.offsetHeight + 30);
        p.style.left = nx + 'px'; p.style.top = ny + 'px';
      });
      const end = () => {
        if (!drag) return;
        drag = false;
        p.classList.remove('dragging');
        if (!told) { told = true; toast('Scrapbook mode ✂ Double-click a photo to snap it back.'); }
      };
      p.addEventListener('pointerup', end);
      p.addEventListener('pointercancel', end);
      p.addEventListener('dblclick', () => { p.removeAttribute('style'); });
    });

    const sticker = $('#sticker'), bubble = $('#factBubble');
    const facts = [
      'I can write a match report and a Python loop in the same hour.',
      'My code runs on Spanish latte.',
      'I covered 4 sports and still can’t pick a favorite.',
      'Sunsets are my favorite loading screen.',
      'I debug better after a dance break.',
      'I help lead 85+ people, yet one missing semicolon still beats me.',
      '“Just one more episode,” said me, every night.'
    ];
    let fi = -1, hideT;
    const hideFact = () => { bubble.hidden = true; sticker.classList.remove('flipped'); };
    const showFact = () => {
      let n;
      do { n = (Math.random() * facts.length) | 0; } while (n === fi);
      fi = n;
      bubble.textContent = facts[n];
      bubble.hidden = false;
      sticker.classList.add('flipped');
      if (!reduceMotion) { sticker.classList.remove('spin'); void sticker.offsetWidth; sticker.classList.add('spin'); }
      clearTimeout(hideT);
      hideT = setTimeout(hideFact, 4800);
    };
    if (sticker && bubble) {
      sticker.addEventListener('pointerenter', showFact);
      sticker.addEventListener('click', showFact);
      sticker.addEventListener('pointerleave', () => { clearTimeout(hideT); hideT = setTimeout(hideFact, 1800); });
    }
  }

  /* ---------- 7. Secrets ---------- */
  const eggs = new Set(), eggCount = $('#eggCount');
  function egg(key, msg) {
    const first = !eggs.has(key);
    if (first) { eggs.add(key); if (eggCount) eggCount.textContent = eggs.size; }
    toast(first ? `🥚 Secret ${eggs.size} of 3 · ${msg}` : msg);
    if (first && eggs.size === 3) setTimeout(() => { celebrate(); toast('🥚 All 3 secrets found! You have a keen eye. ✨'); }, 2000);
  }
  function lightstick() {
    const wrap = document.createElement('div');
    wrap.className = 'ls-burst';
    const cols = ['#FF4FD8', '#8F5BFF', '#5FE3FF', '#FFE45F', '#FF8DEB'];
    for (let i = 0; i < 11; i++) {
      const s = document.createElement('i');
      s.style.setProperty('--c', cols[i % cols.length]);
      s.style.setProperty('--d', (i * 0.09) + 's');
      s.style.left = (4 + i * 9) + '%';
      wrap.appendChild(s);
    }
    document.body.appendChild(wrap);
    celebrate();
    setTimeout(() => wrap.remove(), 3800);
  }
  let danceTimer;
  function toggleDance(force) {
    const was = document.body.classList.contains('dance');
    const on = typeof force === 'boolean' ? force : !was;
    document.body.classList.toggle('dance', on);
    clearTimeout(danceTimer);
    if (on) { egg('dance', 'Dance mode ON 💃 (press D again to stop)'); danceTimer = setTimeout(() => toggleDance(false), 14000); }
    else if (was) toast('Dance break over. Back to debugging 🖥');
  }
  let buf = '';
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
    const k = e.key.toLowerCase();
    buf = (buf + k).slice(-4);
    if (buf === 'kpop') { buf = ''; lightstick(); egg('kpop', 'Lightsticks up! Saranghaeyo 💜'); }
    if (k === 'd' && !e.repeat) toggleDance();
  });
  const nameWrap = $('#nameWrap');
  if (nameWrap) {
    let n = 0, t;
    nameWrap.addEventListener('click', () => {
      n++;
      clearTimeout(t);
      t = setTimeout(() => { n = 0; }, 900);
      if (n >= 3) {
        n = 0;
        nameWrap.classList.remove('wiggle'); void nameWrap.offsetWidth; nameWrap.classList.add('wiggle');
        egg('name', 'Yes, that’s really me 😄');
      }
    });
  }

  /* ---------- 9. Scroll surprise: golden hour -> dusk -> night ---------- */
  const skyEl = $('#stars');
  if (skyEl) {
    for (let i = 0; i < 70; i++) {
      const s = document.createElement('i');
      s.style.left = (Math.random() * 100) + '%';
      s.style.top = (Math.random() * 100) + '%';
      s.style.setProperty('--s', (1 + Math.random() * 2) + 'px');
      s.style.setProperty('--d', (Math.random() * 3) + 's');
      skyEl.appendChild(s);
    }
  }
  const orb = $('#skyOrb');
  const STOPS = [
    { p: 0,   top: [255, 217, 160], bot: [251, 247, 238], op: .55, orb: [255, 200, 87] },
    { p: .45, top: [245, 143, 160], bot: [183, 156, 232], op: .6,  orb: [255, 122, 89] },
    { p: .7,  top: [90, 63, 122],   bot: [43, 38, 86],    op: .85, orb: [250, 190, 130] },
    { p: 1,   top: [11, 16, 48],    bot: [26, 31, 77],    op: 1,   orb: [244, 241, 222] }
  ];
  const mix = (a, b, t) => a + (b - a) * t;
  const mixC = (A, B, t) => A.map((v, i) => Math.round(mix(v, B[i], t)));
  const rgb = a => `rgb(${a[0]},${a[1]},${a[2]})`;
  function skyUpdate() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
    let i = 0;
    while (i < STOPS.length - 2 && p > STOPS[i + 1].p) i++;
    const a = STOPS[i], b = STOPS[i + 1];
    const t = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p)));
    const top = mixC(a.top, b.top, t), bot = mixC(a.bot, b.bot, t), oc = mixC(a.orb, b.orb, t);
    h.style.setProperty('--sky-top', rgb(top));
    h.style.setProperty('--sky-bot', rgb(bot));
    h.style.setProperty('--sky-op', mix(a.op, b.op, t).toFixed(3));
    h.style.setProperty('--stars', Math.min(1, Math.max(0, (p - .6) / .3)).toFixed(3));
    if (orb) {
      orb.style.transform = `translate3d(0,${Math.round(p * Math.max(0, window.innerHeight - 220))}px,0)`;
      orb.style.background = rgb(oc);
      orb.style.boxShadow = `0 0 24px 8px rgba(${oc[0]},${oc[1]},${oc[2]},.55)`;
    }
    const night = currentVibe === 'default' && !document.body.classList.contains('dark') && p > .58;
    document.body.classList.toggle('nightfall', night);
  }
  let skyTick = false;
  window.addEventListener('scroll', () => {
    if (skyTick) return;
    skyTick = true;
    requestAnimationFrame(() => { skyTick = false; skyUpdate(); });
  }, { passive: true });
  window.addEventListener('resize', skyUpdate);
  skyUpdate();
})();
