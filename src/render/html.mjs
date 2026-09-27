// html.mjs: one escaping helper and one tagged template, the whole template
// engine of this site (plans/plan-eccm-cms-step-1.md section 4, "no
// framework"). An interpolated string is escaped, a Raw is written as it is,
// an array is joined, null and false vanish.
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
export const raw = (s) => new Raw(String(s));
export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
const one = (v) => (v instanceof Raw ? v.s : Array.isArray(v) ? v.map(one).join('') : v == null || v === false ? '' : esc(v));
export const html = (strings, ...vals) => new Raw(strings.reduce((out, s, i) => out + s + (i < vals.length ? one(vals[i]) : ''), ''));
