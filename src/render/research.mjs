// research.mjs: /admin/research and its pages (asked 2026-10-02: "in admin
// page to reseach card link and it atakes to separate page with typography
// card and radio tools card ... that take to subpages. keep only the links and
// have section of common structure / views / tools over all providers"). The
// radio tools page replaced the sketch at /radio/kava the same day, which now
// answers with the way here. What it says is plans/plan-eccm-radio-research.md
// cut down to what every provider shares, then the providers' own pages.
import { html } from './html.mjs';
import { page } from './chrome.mjs';
import { table } from './table.mjs';

const cards = (list) => html`<div class="cards">
    ${list.map(([href, title, desc]) => html`<a class="card" href="${href}"><span class="card-title">${title}</span><span class="card-desc">${desc}</span></a>`)}
  </div>`;

export const renderResearch = () => page({
  wide: true, lang: 'en', title: 'Research.',
  body: html`  <h1>Research</h1>
  ${cards([
    ['/type', 'Typography', 'The faces compared at the page’s own sizes.'],
    ['/admin/research/radio', 'Radio tools', 'How radio programming tools lay out channels, schedules, live shows and the archive.'],
  ])}`,
});

// what every provider has, under whichever name it gives it
const STRUCTURE = [
  ['Channel', 'One stream with its own schedule.', 'Station (AzuraCast, Radio.co), Service (Rivendell), Channel (NTS)'],
  ['Show', 'A recurring programme, the template its dates are made from.', 'Show (LibreTime, NTS), Clock and grid (Rivendell, mAirList), Recorder clock (Zetta)'],
  ['Slot', 'One dated occurrence of a show, which can be edited without touching the template.', 'Instance (LibreTime), Event (Radiocult, Radio.co), Log line (Rivendell)'],
  ['Episode', 'What a slot leaves behind: one address, upcoming, then listen back.', 'Episode (NTS, Radiocult), Podcast item (LibreTime), Broadcast (AzuraCast)'],
  ['Library item', 'A file that can be played, with its tags.', 'Track (AzuraCast, Radio.co), Cart (Rivendell), Media (LibreTime)'],
  ['Running order', 'The files a slot plays when nobody is live.', 'Playlist (AzuraCast, Radio.co), Smart block (LibreTime), Log (Rivendell)'],
  ['Live source', 'Who may broadcast into a slot, and when.', 'Streamer or DJ (AzuraCast), Presenter (Radiocult), Live user (Radio.co)'],
  ['Fallback', 'What plays when the live source is missing or drops.', 'AutoDJ (AzuraCast, Radio.co), Default playlist (Radiocult), Fallback (LibreTime)'],
];

// the screens they all have, who draws each best and why, each name a link to the page that shows it
// (asked 2026-10-02: "best at it: links to relevant pages + comment col why"); every reason is from
// plans/plan-eccm-radio-research.md, read on the providers' own pages that day
const VIEWS = [
  ['Week calendar', 'Every slot of a channel by day and hour, typed as live, file, replay or loop, with its fill state.',
    [['Radiocult', 'https://help.radiocult.fm/article/84-scheduling-your-stations-events'], ['LibreTime', 'https://libretime.org/docs/user-manual/calendar/']],
    'Radiocult\u2019s event form follows the event\u2019s type and the schedule can be filtered to events with errors. LibreTime marks each show on the grid as empty, part filled or on air.'],
  ['Template grid', 'The repeating week a schedule is generated from, one per channel.',
    [['Rivendell', 'https://opsguide.rivendellaudio.org/html/sect.rdlogmanager.grids.html']],
    'A 7 by 24 grid of hour clocks for each service, the only clean model for several channels found.'],
  ['Slot form', 'One slot opened: title, artists, times, live source, fallback, recording.',
    [['Radiocult', 'https://help.radiocult.fm/article/84-scheduling-your-stations-events']],
    'Title, repeats, record, artists and colour on every event, then the fields of its type: live with its fallback, relay, pre-record.'],
  ['Library', 'Files with search, tags and where each is used.',
    [['LibreTime', 'https://libretime.org/docs/user-manual/dashboard/'], ['AzuraCast', 'https://www.azuracast.com/docs/user-guide/media-management/']],
    'LibreTime has tabs for tracks, playlists, smart blocks, webstreams and podcasts, chosen columns and a filter by show. In AzuraCast a folder given to a playlist feeds it every file added.'],
  ['On air', 'What plays now, who is connected, what comes next.',
    [['LibreTime', 'https://libretime.org/docs/user-manual/dashboard/'], ['NTS', 'https://www.nts.live/schedule']],
    'LibreTime\u2019s dashboard is the playing show with its contents. NTS gives each channel Live now and Next on, about a day ahead.'],
  ['Playout history', 'What actually played, for reports and royalties.',
    [['LibreTime', 'https://libretime.org/docs/user-manual/playout-history/']],
    'The only tool read with its own page for what went out, item by item.'],
  ['Archive', 'The public side: episodes by show, artist and date, reruns marked.',
    [['NTS', 'https://www.nts.live/shows'], ['Dublab', 'https://www.dublab.com/archive'], ['Cashmere Radio', 'https://cashmereradio.com/listen/']],
    'NTS keeps one address for an episode from pending to published. Dublab filters by artist, genre and year. Cashmere builds its loop from past episodes, scheduled by name.'],
];

// the machinery behind the screens
const TOOLS = [
  ['Broadcaster key', 'A connection that works only inside its own slot and is cut at the end.',
    [['Radiocult', 'https://help.radiocult.fm/article/88-going-live'], ['AzuraCast', 'https://www.azuracast.com/docs/user-guide/streamers-and-djs/']],
    'A Radiocult DJ goes live only during an event their artist is on, and is disconnected at its end. AzuraCast can hold a streamer to their scheduled times.'],
  ['Recorder', 'Records every live slot and files the result where a schedule can use it.',
    [['Radio.co', 'https://www.radio.co/blog/schedule-radio-shows-record-live'], ['Radiocult', 'https://help.radiocult.fm/article/7-recording-an-event']],
    'Radio.co files the recording in the same library its playlists draw from, though named by time. Radiocult records any event type, then adds it to the library for scheduled playback.'],
  ['Replay', 'A slot that points at an episode, schedulable before the recording exists.',
    [['Rivendell', 'https://opsguide.rivendellaudio.org/html/chapter.rdcatch.html']],
    'RDCatch records into a cart the log already names, so the replay is on the schedule before the live show happens.'],
  ['Health checks', 'Marks a slot with no broadcaster, a replay with no file, an empty loop.',
    [['LibreTime', 'https://libretime.org/docs/user-manual/calendar/'], ['Radiocult', 'https://help.radiocult.fm/article/84-scheduling-your-stations-events']],
    'LibreTime marks an empty show red and a part-filled one yellow on the calendar. Radiocult filters the schedule to the events that have errors.'],
  ['Publishing', 'Turns an episode into listen back, a podcast item or an archive page.',
    [['LibreTime', 'https://libretime.org/docs/user-manual/podcasts/'], ['NTS', 'https://www.nts.live/shows']],
    'LibreTime publishes podcasts from its library. An NTS episode turns from pending to published at the address it always had.'],
  ['Rotation rules', 'Clockwheels and play-every-n rules for large music libraries.',
    [['Live365', 'https://help.live365.com/en/support/solutions/articles/43000533102-clockwheels'], ['mAirList', 'https://wiki.mairlist.com/tutorials:mairlistdb:music-scheduling'], ['SAM Broadcaster', 'https://support.spacial.com/hc/en-us/articles/229535467-Introduction-to-Clockwheel-Rotation']],
    'Built for pop rotation with separation rules. With a small library of long works they mostly end in nothing eligible to play, so eccm skips them.'],
];

// the providers, each at the pages that show its programming screens
const PROVIDERS = [
  ['Radiocult', [['Scheduling', 'https://help.radiocult.fm/article/84-scheduling-your-stations-events'], ['Going live', 'https://help.radiocult.fm/article/88-going-live'], ['Recording', 'https://help.radiocult.fm/article/7-recording-an-event'], ['Features', 'https://www.radiocult.fm/features/scheduling']]],
  ['LibreTime', [['Calendar', 'https://libretime.org/docs/user-manual/calendar/'], ['Scheduling shows', 'https://libretime.org/docs/user-manual/scheduling-shows/'], ['Live broadcast', 'https://libretime.org/docs/user-manual/live-broadcast/'], ['Playout history', 'https://libretime.org/docs/user-manual/playout-history/'], ['Podcasts', 'https://libretime.org/docs/user-manual/podcasts/']]],
  ['AzuraCast', [['Streamers and DJs', 'https://www.azuracast.com/docs/user-guide/streamers-and-djs/'], ['Playlists', 'https://www.azuracast.com/docs/user-guide/playlists/'], ['Media', 'https://www.azuracast.com/docs/user-guide/media-management/'], ['Recordings back on air', 'https://github.com/AzuraCast/AzuraCast/discussions/7219']]],
  ['Radio.co', [['Scheduling events', 'https://help.radio.co/en/articles/1044910-scheduling-events'], ['Live events', 'https://help.radio.co/en/articles/899730-schedule-a-live-event'], ['Playlists', 'https://help.radio.co/en/articles/899715-playlists'], ['Recording', 'https://www.radio.co/blog/schedule-radio-shows-record-live']]],
  ['Rivendell', [['Grids', 'https://opsguide.rivendellaudio.org/html/sect.rdlogmanager.grids.html'], ['Log manager', 'https://opsguide.rivendellaudio.org/html/chapter.rdlogmanager.html'], ['Library', 'https://opsguide.rivendellaudio.org/html/chapter.rdlibrary.html'], ['Recorder', 'https://opsguide.rivendellaudio.org/html/chapter.rdcatch.html']]],
  ['RadioBOSS', [['Scheduler', 'https://manual.djsoft.net/radioboss/en/schedule.htm'], ['Stream archive', 'https://manual.djsoft.net/radioboss/en/stream_archive.htm'], ['Playlist generator', 'https://manual.djsoft.net/radioboss/en/automatic_playlist_generation.htm']]],
  ['mAirList', [['Music scheduling', 'https://wiki.mairlist.com/tutorials:mairlistdb:music-scheduling'], ['Radio automation', 'https://www.mairlist.com/en/products/radio-automation/']]],
  ['SAM Broadcaster', [['Clockwheel rotation', 'https://support.spacial.com/hc/en-us/articles/229535467-Introduction-to-Clockwheel-Rotation']]],
  ['Live365', [['Clockwheels', 'https://help.live365.com/en/support/solutions/articles/43000533102-clockwheels']]],
  ['Aiir', [['Scheduler', 'https://aiir.com/scheduler/']]],
  ['NTS', [['Schedule', 'https://www.nts.live/schedule'], ['Shows', 'https://www.nts.live/shows'], ['Explore', 'https://www.nts.live/explore']]],
  ['Dublab', [['Schedule', 'https://www.dublab.com/schedule'], ['Archive', 'https://www.dublab.com/archive']]],
  ['Cashmere Radio', [['Listen', 'https://cashmereradio.com/listen/']]],
  ['Kiosk Radio', [['Schedule', 'https://www.kioskradio.com/schedule']]],
  ['Radio 80000', [['Schedule', 'https://www.radio80k.de/schedule/']]],
];

const part = (title, body) => html`<section class="rk-part">
    <h2>${title}</h2>
    ${body}
  </section>`;
const three = (label, first, last, rows) => table({ label, cols: [{ label: first }, { label: 'What it is', cls: 'main' }, { label: last }], rows });
// the views and tools: who is best, each a link, and why, in a column that wraps beside the main one
const best = (label, first, rows) => table({
  label,
  cols: [{ label: first }, { label: 'What it is', cls: 'main' }, { label: 'Best at it' }, { label: 'Why', cls: 'wrap' }],
  rows: rows.map(([name, what, who, why]) => [name, what, html`${who.map(([n, href], i) => html`${i ? ', ' : ''}<a href="${href}" rel="noopener">${n}</a>`)}`, why]),
});

export const renderRadioResearch = () => page({
  wide: true, lang: 'en', title: 'Radio tools.',
  body: html`  <p class="crumb"><a href="/admin/research">Research</a></p>
  <h1>Radio tools</h1>
  <p class="note">What radio programming tools share, read from their own documentation on 2 October 2026 (plans/plan-eccm-radio-research.md).</p>
  ${part('Common structure', three('Common structure', 'Object', 'Called', STRUCTURE))}
  ${part('Views', best('Views', 'View', VIEWS))}
  ${part('Tools', best('Tools', 'Tool', TOOLS))}
  ${part('Providers', html`<dl class="rk-refs">
    ${PROVIDERS.map(([name, links]) => html`<div>
      <dt>${name}</dt>
      <dd><span class="rk-ref-links">${links.map(([label, href]) => html`<a href="${href}" rel="noopener">${label}</a>`)}</span></dd>
    </div>`)}
  </dl>`)}`,
});
