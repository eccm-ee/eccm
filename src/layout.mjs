// layout.mjs: Admin > Layout at /edit/layout, asked 2026-11-07: "perhaps a
// Admin > Layout where you can pick what pages to link and what logos go to
// footer?", then "i do not care about menu order atm" and "footer logos use
// same logo picker as posts". The menu is every page with in_menu, under the
// words menu_title_et and menu_title_en or else its own title, after Events;
// the footer's logos are the partner rows with in_footer, picked with the
// event editor's grid (src/render/partners.mjs partnerPicker). No ordering: a
// page or a logo ticked later goes last (migrations/0015_layout.sql).
//
//   GET  /edit/layout   the form
//   POST /edit/layout   a save, then back to the form
import { useNav } from './render/chrome.mjs';
import { layoutPage } from './render/layout.mjs';
import { loadFooter, resetFooter } from './partners.mjs';

const HEAD = { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' };

// the menu's pages, read once a minute per isolate like the footer's logos, and at once after a save here;
// a database without the columns (migration 0015 not applied) keeps the menu typed into mark.mjs
let menu = { at: 0, rows: null };
// the header's pages and, since 2026-11-08 ("header menu / footer menu"), the footer's, in one read
const MENU_SQL = `SELECT p.id, p.key, p.in_menu, p.in_footer_menu, p.menu_title_et, p.menu_title_en, et.slug AS slug_et, et.title AS title_et, en.slug AS slug_en, en.title AS title_en
  FROM page p LEFT JOIN page_text et ON et.page_id = p.id AND et.lang = 'et' LEFT JOIN page_text en ON en.page_id = p.id AND en.lang = 'en'
  WHERE (p.in_menu = 1 OR p.in_footer_menu = 1) AND p.status = 'published' ORDER BY p.menu_order, p.id`;
export async function loadLayout(env) {
  if (Date.now() - menu.at > 60000) {
    try { menu = { at: Date.now(), rows: (await env.DB.prepare(MENU_SQL).all()).results }; }
    catch { menu = { at: Date.now(), rows: null }; }
  }
  useNav(menu.rows && { head: menu.rows.filter((r) => r.in_menu), foot: menu.rows.filter((r) => r.in_footer_menu) });
  await loadFooter(env);
}

export async function layout(request, env, url) {
  if (url.pathname !== '/edit/layout') return null;
  const db = env.DB;
  let saved = false;
  if (request.method === 'POST') {
    const fd = await request.formData();
    const pages = new Set(fd.getAll('menu').map(Number));
    const footPages = new Set(fd.getAll('footmenu').map(Number));
    const logos = new Set(fd.getAll('footer').map(Number));
    const all = (await db.prepare('SELECT id, in_menu, in_footer_menu, menu_order FROM page').all()).results;
    const parts = (await db.prepare('SELECT id, in_footer, footer_order FROM partner').all()).results;
    let lastPage = Math.max(0, ...all.filter((p) => p.in_menu || p.in_footer_menu).map((p) => p.menu_order));
    let lastLogo = Math.max(0, ...parts.filter((p) => p.in_footer).map((p) => p.footer_order));
    const title = (k, id) => String(fd.get(`${k}_${id}`) ?? '').trim().slice(0, 40);
    const stmts = [];
    for (const p of all) {
      const on = pages.has(p.id), foot = footPages.has(p.id);
      // a page newly ticked in either list goes after the last one
      const order = (on && !p.in_menu) || (foot && !p.in_footer_menu) ? (lastPage += 10) : p.menu_order;
      stmts.push(db.prepare("UPDATE page SET in_menu = ?, in_footer_menu = ?, menu_order = ?, menu_title_et = ?, menu_title_en = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ','now') WHERE id = ?")
        .bind(on ? 1 : 0, foot ? 1 : 0, order, title('et', p.id), title('en', p.id), p.id));
    }
    for (const p of parts) {
      const on = logos.has(p.id);
      const order = on && !p.in_footer ? (lastLogo += 1) : p.footer_order;
      if (on !== !!p.in_footer || order !== p.footer_order) stmts.push(db.prepare('UPDATE partner SET in_footer = ?, footer_order = ? WHERE id = ?').bind(on ? 1 : 0, order, p.id));
    }
    await db.batch(stmts);
    menu = { at: 0, rows: null };
    resetFooter();
    await loadLayout(env);
    return new Response(null, { status: 303, headers: { ...HEAD, location: '/edit/layout?saved=1' } });
  }
  saved = url.searchParams.get('saved') === '1';
  const pages = (await db.prepare(`SELECT p.id, p.in_menu, p.in_footer_menu, p.status, p.menu_title_et, p.menu_title_en, et.title AS title_et, en.title AS title_en
    FROM page p LEFT JOIN page_text et ON et.page_id = p.id AND et.lang = 'et' LEFT JOIN page_text en ON en.page_id = p.id AND en.lang = 'en'
    ORDER BY p.in_menu DESC, p.menu_order, p.id`).all()).results;
  const partners = (await db.prepare('SELECT * FROM partner ORDER BY name COLLATE NOCASE, id').all()).results;
  return new Response(String(layoutPage({ pages, partners, footer: partners.filter((p) => p.in_footer).map((p) => p.id), saved })), { headers: HEAD });
}
