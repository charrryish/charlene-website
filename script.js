/* Charlene Joy — one-page site v6 */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Intro gate: animations wait until the loader finishes (v7) ---------- */
const readyQueue = []; let isReady = false;
function onReady(fn) { isReady ? fn() : readyQueue.push(fn); }
function setReady() { if (isReady) return; isReady = true; document.body.classList.add('ready'); readyQueue.splice(0).forEach(f => f()); }
setTimeout(setReady, 6500); /* safety net if the loader script is ever missing */

/* ---------- Theme (remembered) ---------- */
function setTheme(t) {
  const dark = t === 'dark';
  document.body.classList.toggle('dark', dark);
  $('#themeIcon').textContent = dark ? '☀' : '☾';
  $('#themeToggle').setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  try { localStorage.setItem('cj-theme', t); } catch (e) {}
}
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('cj-theme') || 'light'; } catch (e) {}
setTheme(savedTheme);
$('#themeToggle').addEventListener('click', () => setTheme(document.body.classList.contains('dark') ? 'light' : 'dark'));

/* ---------- Toast + confetti ---------- */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2800);
}
function celebrate() {
  if (reduceMotion) return;
  const colors = ['#FF7A59', '#CDEB6E', '#8EDCF0', '#BBA4FF', '#FFD86B', '#FF9EBB'];
  for (let i = 0; i < 48; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
    piece.style.animationDelay = `${Math.random() * .35}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2500);
  }
}

/* ---------- Explorer: five little things to find ---------- */
const found = new Set();
const EXPLORE_TOTAL = 6;
function award(key) {
  if (found.has(key)) return;
  found.add(key);
  const li = $(`#explorerList li[data-key="${key}"]`);
  if (li) { li.classList.add('done'); $('i', li).textContent = '✓'; }
  $('#explorerCount').textContent = found.size;
  if (found.size === EXPLORE_TOTAL) {
    $('#explorer').classList.add('done');
    celebrate();
    toast('You found everything! Thanks for exploring my world ✨');
  } else {
    toast(`✦ ${found.size} of ${EXPLORE_TOTAL} found`);
  }
}
const explorerBtn = $('#explorerBtn'), explorerPanel = $('#explorerPanel');
function closeExplorer() { explorerPanel.hidden = true; explorerBtn.setAttribute('aria-expanded', 'false'); }
explorerBtn.addEventListener('click', e => {
  e.stopPropagation();
  const open = explorerPanel.hidden;
  explorerPanel.hidden = !open;
  explorerBtn.setAttribute('aria-expanded', String(open));
});

/* ---------- Navigation: mobile menu, dropdowns, deep links ---------- */
const topNav = $('#topNav'), scrim = $('#scrim'), menuBtn = $('#menuToggle');
function toggleMenu(open) {
  topNav.classList.toggle('open', open);
  scrim.classList.toggle('show', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuBtn.textContent = open ? '✕' : '☰';
}
menuBtn.addEventListener('click', e => { e.stopPropagation(); toggleMenu(!topNav.classList.contains('open')); });
scrim.addEventListener('click', () => toggleMenu(false));
$$('.nav-drop-btn').forEach(btn => btn.addEventListener('click', e => {
  e.stopPropagation();
  const group = btn.parentElement;
  const open = !group.classList.contains('open');
  $$('.nav-group.open').forEach(g => { g.classList.remove('open'); $('.nav-drop-btn', g).setAttribute('aria-expanded', 'false'); });
  group.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', String(open));
}));
document.addEventListener('click', e => {
  $$('.nav-group.open').forEach(g => { g.classList.remove('open'); $('.nav-drop-btn', g).setAttribute('aria-expanded', 'false'); });
  if (!e.target.closest('#explorer')) closeExplorer();
});
$$('.top-nav a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

function openTab(hubId, tab, scroll) {
  const hub = document.getElementById(hubId);
  if (!hub) return;
  $$('.tab', hub).forEach(b => {
    const on = b.dataset.tab === tab;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
  });
  $$('.panel', hub).forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
  if (scroll) hub.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}
function goTo(target) {
  if (target.includes(':')) { const [hub, tab] = target.split(':'); openTab(hub, tab, true); }
  else { const el = document.querySelector(target); if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-goto]');
  if (!a) return;
  e.preventDefault();
  goTo(a.dataset.goto);
  toggleMenu(false);
  closeExplorer();
});
$$('.hub').forEach(hub => {
  const tabs = $$('.tab', hub);
  tabs.forEach((btn, i) => {
    btn.addEventListener('click', () => openTab(hub.id, btn.dataset.tab, false));
    btn.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      openTab(hub.id, next.dataset.tab, false);
      next.focus();
    });
  });
});

/* ---------- Photos: placeholders + optional covers ---------- */
function markPlaceholder(img) {
  const p = img.parentElement;
  p.classList.add('is-ph');
  if (!p.querySelector('.ph-hint')) {
    const s = document.createElement('span');
    s.className = 'ph-hint';
    s.innerHTML = `${img.dataset.ph || 'ADD PHOTO'}<small>${img.getAttribute('src')}</small>`;
    p.appendChild(s);
  }
}
$$('img[data-ph]').forEach(img => {
  img.addEventListener('error', () => markPlaceholder(img));
  if (img.complete && img.naturalWidth === 0) markPlaceholder(img);
});
/* Covers for achievements, projects and K-dramas: a missing photo just keeps the colorful fallback */
$$('img[data-optional]').forEach(img => {
  const host = img.parentElement;
  const ok = () => host.classList.add('has-img');
  const bad = () => img.remove();
  img.addEventListener('load', ok);
  img.addEventListener('error', bad);
  if (img.complete) { if (img.naturalWidth) ok(); else bad(); }
});

/* ---------- Typed roles (starts after the intro loader) ---------- */
const roles = ['an IT student.', 'a sports writer.', 'a coffee-powered debugger.', 'one dance break away from a solution.', 'a “just one more episode” survivor.', 'a club governor.', 'a sunset chaser.'];
const typed = $('#typed');
if (reduceMotion) { typed.textContent = roles[0]; }
else onReady(() => {
  let r = 0, c = 0, del = false;
  (function tick() {
    const word = roles[r];
    typed.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
    if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 28 : 65);
  })();
});

/* ---------- Count-up stats (run when the intro finishes) ---------- */
function countUp(el) {
  const end = +el.dataset.count, suf = el.dataset.suffix || '';
  let n = 0;
  const step = Math.max(1, Math.ceil(end / 30));
  const t = setInterval(() => { n = Math.min(end, n + step); el.textContent = n + suf; if (n >= end) clearInterval(t); }, 45);
}
if (!reduceMotion) {
  $$('[data-count]').forEach(el => { el.textContent = '0' + (el.dataset.suffix || ''); });
  onReady(() => $$('[data-count]').forEach(countUp));
}

/* ---------- Age ---------- */
(function () {
  const b = new Date(2006, 2, 20), now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  if (now < new Date(now.getFullYear(), 2, 20)) a--;
  $('#age').textContent = a + ' years old';
})();

/* ---------- Reveal + progress + active nav ---------- */
const reveals = $$('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .06 });
  reveals.forEach(r => io.observe(r));
} else reveals.forEach(r => r.classList.add('in'));

const sections = $$('main section[id]');
const contactLink = $('.nav-link[data-nav="contact"]');
function onScroll() {
  const h = document.documentElement;
  $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  let cur = sections[0].id;
  sections.forEach(s => { if (s.getBoundingClientRect().top < window.innerHeight * .45) cur = s.id; });
  $$('.nav-group').forEach(g => $('.nav-drop-btn', g).classList.toggle('active', g.dataset.hub === cur));
  contactLink.classList.toggle('active', cur === 'contact');
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Pick a Mood, Find My World (also tints the whole page) ---------- */
const moodContent = {
  peace: { icon: '🌿', tag: 'MY RESET BUTTON', title: 'A little peace', text: 'Mountains, the sea, and sunsets help me slow down and notice the little things. Sometimes a quiet view is all the reset I need.', go: 'world:nature', linkText: 'Explore my nature corner ↗' },
  comfort: { icon: '☕', tag: 'COMFORT CORNER', title: 'Coffee + a comfort story', text: 'A Spanish latte and a good K-drama make an ordinary day feel softer. My current watch is Doctor X.', go: 'world:coffee', linkText: 'Visit my coffee corner ↗' },
  energy: { icon: '🎧', tag: 'TURN THE ENERGY UP', title: 'Music that moves me', text: 'K-pop and dance bring out my energetic side. Music can be a fun escape and a reason to get up and move.', go: 'world:kpop', linkText: 'Explore my K-pop corner ↗' },
  escape: { icon: '📺', tag: 'MY COMFORT WATCH', title: 'A little K-drama escape', text: 'Sometimes I find inspiration in stories about people growing, healing, and finding their way. A good K-drama gives me a moment to unwind and see life from another perspective.', go: 'world:drama', linkText: 'Take me to my K-drama corner ↗' }
};
$$('.mood-choice').forEach(btn => btn.addEventListener('click', () => {
  $$('.mood-choice').forEach(b => { const on = b === btn; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', String(on)); });
  const item = moodContent[btn.dataset.mood];
  document.body.dataset.mood = btn.dataset.mood;
  $('#moodResultIcon').textContent = item.icon; $('#moodResultTag').textContent = item.tag;
  $('#moodResultTitle').textContent = item.title; $('#moodResultText').textContent = item.text;
  const link = $('#moodResultLink');
  link.dataset.goto = item.go; link.textContent = item.linkText;
  $('#moodResult').hidden = false;
  award('mood');
}));

/* ---------- K-drama rail ---------- */
const rail = $('#dramaGrid');
$$('#dramaFilters .chip-btn').forEach(btn => btn.addEventListener('click', () => {
  $$('#dramaFilters .chip-btn').forEach(b => b.classList.toggle('active', b === btn));
  $$('#dramaGrid .poster').forEach(d => d.classList.toggle('hide', btn.dataset.f !== 'all' && d.dataset.m !== btn.dataset.f));
  rail.scrollTo({ left: 0 });
}));
$('#railPrev').addEventListener('click', () => rail.scrollBy({ left: -rail.clientWidth * .8, behavior: 'smooth' }));
$('#railNext').addEventListener('click', () => rail.scrollBy({ left: rail.clientWidth * .8, behavior: 'smooth' }));

/* ---------- Spanish latte easter egg ---------- */
const latteEgg = $('#latteEgg');
latteEgg.addEventListener('click', () => {
  const message = $('#latteMessage');
  message.hidden = !message.hidden;
  latteEgg.setAttribute('aria-expanded', String(!message.hidden));
  if (!message.hidden) award('latte');
});

/* ---------- Quiz ---------- */
const quiz = [
  { q: "What's my go-to coffee order?", o: ['Iced americano', 'Spanish latte', 'Caramel macchiato'], a: 1 },
  { q: 'Which K-pop Facebook page did I manage?', o: ['Stayology', 'K-Pop Daily', 'Hallyu Hub'], a: 0 },
  { q: 'Which country is first on my travel wishlist?', o: ['Italy', 'Thailand', 'South Korea'], a: 2 }
];
let qi = 0, score = 0;
const box = $('#quiz-box');
function renderQ() {
  if (qi >= quiz.length) {
    const perfect = score === quiz.length;
    const msg = perfect ? 'Perfect! You really know me. 🎉' : score === quiz.length - 1 ? 'So close! Nice job. ✨' : 'Now you know me a little better! ♡';
    box.innerHTML = `<div class="q-result"><div class="score">${score}/${quiz.length}</div><h3>${msg}</h3><button class="btn btn-primary" id="qAgain" type="button">Play again</button></div>`;
    if (perfect) celebrate();
    award('quiz');
    $('#qAgain').onclick = () => { qi = 0; score = 0; renderQ(); };
    return;
  }
  const item = quiz[qi];
  box.innerHTML = `<div class="q-top"><span>QUESTION ${qi + 1} OF ${quiz.length}</span><span>SCORE ${score}</span></div>
    <div class="q-bar"><i style="width:${qi / quiz.length * 100}%"></i></div>
    <h3>${item.q}</h3><div class="opts">${item.o.map((t, i) => `<button class="opt" type="button" data-i="${i}">${t}</button>`).join('')}</div><div class="q-fb" aria-live="polite"></div>`;
  $$('.opt', box).forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.i;
    $$('.opt', box).forEach(x => x.disabled = true);
    $$('.opt', box)[item.a].classList.add('right');
    if (i === item.a) { score++; $('.q-fb', box).textContent = 'Correct! ✓'; }
    else { b.classList.add('wrong'); $('.q-fb', box).textContent = 'Not quite, but good try!'; }
    setTimeout(() => { qi++; renderQ(); }, 1100);
  }));
}
renderQ();

/* ---------- Simulated charlene.exe ---------- */
const commandContent = {
  about: 'about → Quick snapshot: an IT student from Alegria, Cebu, with a soft spot for stories, music, and quiet views.',
  projects: 'projects → This website, Grab N Kaon, an accounting ledger, and beginner coding exercises. Each one teaches me something different.',
  dreams: 'dreams → I want to go deeper into Python, build useful projects, and keep exploring places beyond my comfort zone.',
  funfact: 'funfact → Give me a Spanish latte, a sunset view, or a K-pop performance and I’m probably happy.'
};
$$('.command-btn').forEach(btn => btn.addEventListener('click', () => {
  $$('.command-btn').forEach(b => { const on = b === btn; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
  $('#commandOutput').textContent = commandContent[btn.dataset.command] || 'Command not found.';
  award('exe');
}));

/* ---------- Behind the Build ---------- */
$$('.detail-toggle').forEach(btn => btn.addEventListener('click', () => {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  const opening = panel.hidden;
  panel.hidden = !opening;
  btn.setAttribute('aria-expanded', String(opening));
  btn.textContent = opening ? 'Close details −' : 'Behind the build +';
}));

/* ---------- Tap a Memory ---------- */
const memoryStories = {
  people: { title: 'My people, my heart', what: 'A moment with the people who make life feel grounded.', why: 'This was the first family portrait we took in a studio. It holds a special place in my heart because the people in this photo are an important part of my story, even when life gets busy.', meaning: 'Success feels better when I can share the journey with people who matter to me.' },
  little: { title: 'The little moments', what: 'A small moment worth saving instead of letting it pass unnoticed.', why: 'A family trip to Cebu Safari with the Divinagracia family. It reminds me that not every meaningful memory has to come from a big event.', meaning: 'Ordinary days can hold the details I will be happy to remember.' },
  grateful: { title: 'Always grateful', what: 'A reminder to pause and appreciate where I am and the people around me.', why: 'This photo captures a moment with my college friends. Having them as part of my college journey gives me more reasons to appreciate the experiences and memories we share.', meaning: 'Growth and gratitude can exist together.' },
  coffee: { title: 'K-drama & coffee nights', what: 'A cozy combination: a show to follow and a Spanish latte to enjoy.', why: 'It gives me a small way to unwind and enjoy my own company.', meaning: 'Rest can be simple; sometimes a familiar comfort is enough.' },
  fanmeet: { title: 'AHOF fanmeet day', what: 'A memory connected to music and the excitement of being a fan.', why: 'This was my first time attending a fan meet and seeing my K-pop idols in person. It was a special experience that made my love for music and K-pop even more memorable.', meaning: 'The things we love can connect us to memorable experiences.' },
  nature: { title: 'Embracing nature', what: 'A moment to enjoy being outdoors and take in the view.', why: 'Mountains, the sea, and sunsets help me slow down and feel present.', meaning: 'Sometimes the best reset is stepping back and noticing the world around me.' }
};
const memoryModal = $('#memoryModal');
let lastMemoryCard = null;
function openMemory(card) {
  const item = memoryStories[card.dataset.memory];
  if (!item) return;
  lastMemoryCard = card;
  $('#memoryTitle').textContent = item.title; $('#memoryWhat').textContent = item.what;
  $('#memoryWhy').textContent = item.why; $('#memoryMeaning').textContent = item.meaning;
  memoryModal.hidden = false;
  $('#memoryClose').focus();
  award('memory');
}
function closeMemory() { memoryModal.hidden = true; if (lastMemoryCard) lastMemoryCard.focus(); }
$$('.memory-card').forEach(card => {
  card.addEventListener('click', () => openMemory(card));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMemory(card); } });
});
$('#memoryClose').addEventListener('click', closeMemory);
$('#memoryDone').addEventListener('click', closeMemory);
memoryModal.addEventListener('click', e => { if (e.target === memoryModal) closeMemory(); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!memoryModal.hidden) closeMemory();
  closeExplorer();
  toggleMenu(false);
});

/* ---------- Leave a Little Note (temporary, on screen only) ---------- */
$$('.note-choice').forEach(btn => btn.addEventListener('click', () => {
  $$('.note-choice').forEach(b => { const on = b === btn; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', String(on)); });
  const response = $('#noteResponse');
  response.textContent = btn.dataset.note; response.hidden = false;
}));

$('#year').textContent = new Date().getFullYear();
