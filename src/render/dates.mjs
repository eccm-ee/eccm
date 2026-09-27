// dates.mjs: a date is written with its month's name, the long form where
// there is room and the short one in a narrow column or the compact row
// (asked 2026-09-27: "use jaanuar / veebruar etc on dates when you have
// space and jan / veebr ... when not (narrow cols / mobile)"). The input is
// the schema's local ISO text, '2026-09-30T19:00'.
const MONTHS = {
  et: { long: ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'],
        short: ['jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'aug', 'sept', 'okt', 'nov', 'dets'] },
  en: { long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'] },
};
const parts = (local) => { const [y, m, d] = local.slice(0, 10).split('-').map(Number); return { y, m, d }; };
// '30. september 2026' and '30 September 2026'
export const dateLong = (local, lang) => { const { y, m, d } = parts(local); return lang === 'et' ? `${d}. ${MONTHS.et.long[m - 1]} ${y}` : `${d} ${MONTHS.en.long[m - 1]} ${y}`; };
// '30. sept 2026' and '30 Sept 2026'
export const dateShort = (local, lang) => { const { y, m, d } = parts(local); return lang === 'et' ? `${d}. ${MONTHS.et.short[m - 1]} ${y}` : `${d} ${MONTHS.en.short[m - 1]} ${y}`; };
// '8. okt' and '8 Oct', for a column of dates
export const dayMonth = (local, lang) => { const { m, d } = parts(local); return lang === 'et' ? `${d}. ${MONTHS.et.short[m - 1]}` : `${d} ${MONTHS.en.short[m - 1]}`; };
// '19.00' and '19:00'
export const clock = (local, lang) => { const [h, mi] = local.slice(11, 16).split(':'); return lang === 'et' ? `${h}.${mi}` : `${h}:${mi}`; };
// a place as a link to a map, with the venue and its address as the query
export const mapsUrl = (where) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where)}`;
