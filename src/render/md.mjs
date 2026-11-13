// md.mjs: the markdown subset the bodies use, ported from trip's
// astro-prod/src/lib/md.ts (68 lines, read 2026-09-27) and nothing more:
// paragraphs on blank lines, ## and ### headings (a # is an h2 too, the h1
// is the title), - and 1. lists, links to http(s) only, **bold**, _italic_.
// Every transform runs on ALREADY ESCAPED text, so a quote inside a URL is
// already &quot; and cannot leave the attribute, and a javascript: link never
// matches the https-only pattern and stays visibly literal.
import { esc } from './html.mjs';

export const mdInline = (e) => {
  // a link to another site, a mail address, or a page of this site by its path (/en/co-creation-programme)
  let s = e.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s<>)]+|mailto:[^\s<>)]+|\/(?!\/)[^\s<>)]*)\)/g, (_, t, u) => (u.startsWith('http') ? `<a href="${u}" rel="noopener">${t}</a>` : `<a href="${u}">${t}</a>`));
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>');
  s = s.replace(/(^|\s)_([^_\n]+)_(?=[\s.,;:!?)]|$)/gm, '$1<i>$2</i>');
  return s;
};
const inline = (s) => mdInline(esc(s));
const li = (l) => /^\s*[-*]\s+(.+)$/.exec(l);
const oli = (l) => /^\s*\d+[.)]\s+(.+)$/.exec(l);
const isHead = (l) => /^#{1,3}\s+/.test(l.trim());

// A YouTube video, trip's rule (astro-prod/src/lib/docBlocks.ts, youtubeId and
// bodyToDoc, read 2026-10-07): a paragraph that is ONE http(s) URL and nothing
// else, on youtube.com/watch?v=, /embed/, /shorts/, /v/ or youtu.be/, with
// t= or start= kept as seconds. A URL inside a sentence is never lifted. One
// step past trip: a paragraph that is only a [text](url) link to a video is
// lifted too, its text the player's name, because the bodies carried over
// from eccm.ee write their videos that way (data/seed-step3.sql).
export const youtubeId = (s) => {
  const m = /(?:youtube\.com\/(?:watch\?(?:[^\s]*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/.exec(s);
  if (!m) return null;
  const t = /[?&](?:t|start)=(\d+)/.exec(s);
  return t ? { id: m[1], start: +t[1] } : { id: m[1] };
};

// The player is a facade, trip's: the picture is this site's own copy
// (/media/yt/{id}.jpg, fetched by the Worker, src/media.mjs) and the link goes
// to YouTube, so a page loads nothing from YouTube or Google and works without
// a script; public/site.mjs turns a click into the youtube-nocookie iframe in
// the same 16:9 box. The id is [A-Za-z0-9_-] and start digits, safe unescaped.
const ICONS = '/vendor/icons/feather/icons.svg';
export const video = ({ id, start, name }) => `<div class="yt" data-yt="${id}"${start ? ` data-start="${start}"` : ''}>`
  + `<a class="yt-face" href="https://www.youtube.com/watch?v=${id}${start ? `&amp;t=${start}` : ''}" rel="noopener">`
  + `<img src="/media/yt/${id}.jpg" alt="" width="480" height="270" loading="lazy" decoding="async">`
  + `<span class="btn btn-pri btn-ico"><svg class="ico" aria-hidden="true"><use href="${ICONS}#play"/></svg><span class="vh">${name ? esc(name) : 'YouTube'}</span></span>`
  + `</a></div>`;

// A Vimeo video (asked 2026-11-07: "Vimeo videos support"), lifted the same
// way as YouTube's: a lone URL on vimeo.com/{id}, /channels/x/{id},
// /groups/x/videos/{id}, /showcase/n/video/{id} or player.vimeo.com/video/{id}.
// An unlisted video carries its hash as vimeo.com/{id}/{hash} or ?h={hash},
// and it is kept, since the player refuses the video without it; #t= is the
// start, as 90, 90s or 1m30s, kept as seconds.
export const vimeoId = (s) => {
  const m = /vimeo\.com\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/|(?:showcase|album)\/\d+\/video\/)?(\d{5,12})(?:\/([0-9a-f]{6,20}))?(?=[/?#]|$)/.exec(s);
  if (!m) return null;
  const out = { id: m[1] };
  const h = m[2] ?? /[?&]h=([0-9a-f]{6,20})(?![0-9a-z])/i.exec(s)?.[1];
  if (h) out.hash = h.toLowerCase();
  const t = /#t=(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(s);
  const start = t ? (+(t[1] ?? 0)) * 3600 + (+(t[2] ?? 0)) * 60 + (+(t[3] ?? 0)) : 0;
  if (start) out.start = start;
  return out;
};

// The Vimeo player is the same facade in the same box: the picture is this
// site's own copy again (/media/vimeo/{id}.jpg, or {id}-{hash}.jpg for an
// unlisted one, which the Worker finds through Vimeo's oEmbed, src/media.mjs),
// the link goes to vimeo.com, and public/site.mjs puts player.vimeo.com in on
// a click with dnt=1, so until then the page has asked Vimeo for nothing. The
// id is digits and the hash lowercase hex, safe unescaped.
export const vimeo = ({ id, hash, start, name }) => `<div class="yt" data-vimeo="${id}"${hash ? ` data-h="${hash}"` : ''}${start ? ` data-start="${start}"` : ''}>`
  + `<a class="yt-face" href="https://vimeo.com/${id}${hash ? `/${hash}` : ''}${start ? `#t=${start}s` : ''}" rel="noopener">`
  + `<img src="/media/vimeo/${id}${hash ? `-${hash}` : ''}.jpg" alt="" width="480" height="270" loading="lazy" decoding="async">`
  + `<span class="btn btn-pri btn-ico"><svg class="ico" aria-hidden="true"><use href="${ICONS}#play"/></svg><span class="vh">${name ? esc(name) : 'Vimeo'}</span></span>`
  + `</a></div>`;

// opts.video: lift a lone YouTube or Vimeo URL into the player, asked for
// event and page bodies; the newsletter's email keeps the plain text
export const md = (text, opts = {}) => {
  const out = [];
  for (const block of String(text ?? '').split(/\r?\n\s*\r?\n/)) {
    if (!block.trim()) continue;
    const lone = opts.video ? /^(?:https?:\/\/\S+|\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\))$/.exec(block.trim()) : null;
    const yt = lone ? youtubeId(lone[2] ?? lone[0]) : null;
    if (yt) { out.push(video({ ...yt, name: lone[1] })); continue; }
    const vm = lone && !yt ? vimeoId(lone[2] ?? lone[0]) : null;
    if (vm) { out.push(vimeo({ ...vm, name: lone[1] })); continue; }
    const lines = block.split(/\r?\n/);
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const h = /^(#{1,3})\s+(.+)$/.exec(line.trim());
      if (h) { const tag = h[1].length === 3 ? 'h3' : 'h2'; out.push(`<${tag}>${inline(h[2])}</${tag}>`); i++; continue; }
      if (li(line)) { const items = []; while (i < lines.length && li(lines[i])) { items.push(li(lines[i])[1]); i++; } out.push(`<ul>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>`); continue; }
      if (oli(line)) { const items = []; while (i < lines.length && oli(lines[i])) { items.push(oli(lines[i])[1]); i++; } out.push(`<ol>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ol>`); continue; }
      const run = [];
      while (i < lines.length && !li(lines[i]) && !oli(lines[i]) && !isHead(lines[i])) { run.push(lines[i]); i++; }
      const para = run.join('\n').trim();
      if (para) out.push(`<p>${inline(para).replace(/\r?\n/g, '<br>')}</p>`);
    }
  }
  return out.join('\n');
};
