// social.mjs: the event's social previews for a logged-in editor, under the
// event page since 2026-11-07 (asked: "move social preview under the post
// preview / public view when admin. og and ig. For ig add fourth slide with
// 2-3 fields header / body / footer"). Two routes, both under /edit and so
// behind the login (src/auth.mjs):
//   GET  /edit/og/t4/{id}-{lang}.png?header=&body=&footer=  the fourth card
//        drawn from the words being typed, never stored (src/og/route.mjs)
//   POST /edit/social/{id}/{lang}  the words kept in event_social, or the row
//        deleted with action=reset so the defaults come back; then back to the
//        event page, whose fourth card has a new versioned address
import { slidePreview } from './og/route.mjs';
import { SLIDE_MAX } from './og/card.mjs';

// the stored words of one event in one language, or null for the defaults
export const socialRow = (db, id, lang) => db.prepare('SELECT header, body, footer FROM event_social WHERE event_id = ? AND lang = ?').bind(id, lang).first();

// the page to go back to, only an event page of this site
const back = (v) => (/^\/(et\/sundmused|en\/events)\/[a-z0-9-]+$/.test(v || '') ? v : '/');

export async function social(request, env, url) {
  const p = url.pathname;
  const pv = /^\/edit\/og\/t4\/(\d+)-(et|en)\.png$/.exec(p);
  if (pv && request.method === 'GET') return slidePreview(env, url, Number(pv[1]), pv[2]);
  const sv = /^\/edit\/social\/(\d+)\/(et|en)$/.exec(p);
  if (sv && request.method === 'POST') {
    const [, id, lang] = sv;
    const f = await request.formData();
    if (f.get('action') === 'reset') {
      await env.DB.prepare('DELETE FROM event_social WHERE event_id = ? AND lang = ?').bind(Number(id), lang).run();
    } else {
      const v = Object.fromEntries(Object.keys(SLIDE_MAX).map((k) => [k, String(f.get(k) ?? '').replace(/\r\n/g, '\n').slice(0, SLIDE_MAX[k])]));
      await env.DB.prepare(`INSERT INTO event_social (event_id, lang, header, body, footer) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT (event_id, lang) DO UPDATE SET header = excluded.header, body = excluded.body, footer = excluded.footer, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')`)
        .bind(Number(id), lang, v.header, v.body, v.footer).run();
    }
    return new Response(null, { status: 303, headers: { location: `${back(f.get('back'))}#social`, 'cache-control': 'no-store' } });
  }
  return null;
}
