// site.mjs: the one script every page carries. The phone menu opens and closes on its button, and the scrollbar's width is
// measured so a block that spans the window (the derive page's samples) is the window and not the window plus a scrollbar.
document.addEventListener('click', (e) => { const b = e.target.closest('.menu-btn'); if (!b) return; const hd = b.closest('.site-head'); const open = hd.toggleAttribute('data-open'); b.setAttribute('aria-expanded', String(open)); });
document.documentElement.style.setProperty('--sbw', (innerWidth - document.documentElement.clientWidth) + 'px');
// In the installed app, while this device is not told, a bar under the header turns notifications on (asked 2026-10-01: "just put
// button somewhere up"); iOS offers them only there, and the press is the only thing that can raise the prompt (public/push.mjs).
if (navigator.standalone === true || matchMedia('(display-mode: standalone)').matches) import('/push.mjs').then(async ({ offered, told, enable }) => {
  if (!offered || Notification.permission === 'denied' || await told()) return;
  const en = document.documentElement.lang === 'en';
  const bar = document.createElement('div');
  bar.className = 'notice push-ask';
  bar.innerHTML = `<div class="frame"><p>${en ? 'Notifications of new events' : 'Teated uutest sündmustest'}</p><button class="btn btn-pri" type="button">${en ? 'Turn on' : 'Luba teated'}</button></div>`;
  const btn = bar.querySelector('button'), say = bar.querySelector('p');
  btn.addEventListener('click', () => { btn.disabled = true; enable().then((r) => { if (r === 'on' || r === 'refused') bar.remove(); else { say.textContent = (en ? 'It did not work: ' : 'Ei õnnestunud: ') + r; btn.disabled = false; } }); });
  document.querySelector('.site-head')?.after(bar);
});
