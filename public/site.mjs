// site.mjs: the one script every page carries. The phone menu opens and closes on its button, and the scrollbar's width is
// measured so a block that spans the window (the derive page's samples) is the window and not the window plus a scrollbar.
document.addEventListener('click', (e) => { const b = e.target.closest('.menu-btn'); if (!b) return; const hd = b.closest('.site-head'); const open = hd.toggleAttribute('data-open'); b.setAttribute('aria-expanded', String(open)); });
document.documentElement.style.setProperty('--sbw', (innerWidth - document.documentElement.clientWidth) + 'px');
// The Luba teated bar the installed app showed under the header went 2026-11-06 with the notices (archive/notices.md).
// The theme, tunniplaan's way (asked 2026-10-02: "do dark mode in bg. see ../tunniplaan etc"): the footer's word cycles Auto,
// Light, Dark. Auto is the absence of data-theme and of the stored key, never a stored "auto", which would go stale the moment
// the system's setting changed; the head's one line puts a stored choice back before the stylesheet. The theme-color metas are
// media-scoped for a page with no script, and once a theme is forced that is the wrong question, so both take the ground the
// page resolved to, or an installed app shows a dark page under a light status bar.
const THEMES = ['auto', 'light', 'dark'], THEME_KEY = 'eccm:theme';
const themeNow = () => document.documentElement.getAttribute('data-theme') || 'auto';
const themeSync = () => { const bg = getComputedStyle(document.documentElement).backgroundColor; document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', bg)); };
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-theme-cycle]')) return;
  const next = THEMES[(THEMES.indexOf(themeNow()) + 1) % THEMES.length];
  try { if (next === 'auto') localStorage.removeItem(THEME_KEY); else localStorage.setItem(THEME_KEY, next); } catch { /* private window: the choice lasts the page */ }
  if (next === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', next);
  themeSync();
});
// a forced theme survives the system flipping underneath it, Auto follows it
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', themeSync);
themeSync();
// The YouTube player (src/render/md.mjs): a click on the picture puts the youtube-nocookie iframe into the same 16:9 box,
// which is the first request the page makes to YouTube; without this script the picture is a plain link to the video.
// A Vimeo box (data-vimeo, asked 2026-11-07: "Vimeo videos support") gets player.vimeo.com the same way, with dnt=1 so
// the player sets no tracking cookie, the unlisted hash as h= and the start as #t=.
document.addEventListener('click', (e) => {
  const a = e.target.closest('.yt-face'), box = a?.closest('.yt[data-yt], .yt[data-vimeo]');
  if (!box || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  const f = document.createElement('iframe'), d = box.dataset;
  if (d.vimeo) {
    f.src = `https://player.vimeo.com/video/${d.vimeo}?autoplay=1&dnt=1${d.h ? `&h=${d.h}` : ''}${d.start ? `#t=${d.start}s` : ''}`;
    f.title = 'Vimeo';
  } else {
    f.src = `https://www.youtube-nocookie.com/embed/${d.yt}?autoplay=1${d.start ? `&start=${d.start}` : ''}`;
    f.title = 'YouTube';
  }
  f.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
  f.allowFullscreen = true;
  box.replaceChildren(f);
});
// a newsletter's link carries ?from=uudiskiri-{n} for the stats (src/stats.mjs); once the page has loaded it is
// taken out of the address, so a reader who shares the page does not pass it on
try { const u = new URL(location.href); if (u.searchParams.has('from')) { u.searchParams.delete('from'); history.replaceState(null, '', u.pathname + u.search + u.hash); } } catch {}
