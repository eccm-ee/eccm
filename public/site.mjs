// site.mjs: the one script every page carries. The phone menu opens and closes on its button, and the scrollbar's width is
// measured so a block that spans the window (the derive page's samples) is the window and not the window plus a scrollbar.
document.addEventListener('click', (e) => { const b = e.target.closest('.menu-btn'); if (!b) return; const hd = b.closest('.site-head'); const open = hd.toggleAttribute('data-open'); b.setAttribute('aria-expanded', String(open)); });
document.documentElement.style.setProperty('--sbw', (innerWidth - document.documentElement.clientWidth) + 'px');
