> Research, not yet a plan: asked 2026-10-02 as "in bg research ui's of radio programming station tools", written by a background agent the same day while `src/radio.mjs` was built, and copied here on "copy to plans".

# Radio programming interfaces: what established tools do

Research for the eccm.ee web radio admin page. Read on 2026-10-02. Every claim carries the URL it was read from today. Anything marked **unverified** was not read on a page today and comes from memory or a search-result snippet only.

The question for each tool: what the main programming screen is, how a live slot is represented and handed over, how recordings of live shows become replayable archive items, how the library is browsed and tagged, and what stands out.

---

## 1. Hosted and open-source web tools (closest to eccm)

### AzuraCast (open source, self-hosted, multi-station)

- **Main programming screen.** There is no single schedule editor. Programming is spread across **Playlists** and **Streamers/DJs**, each with a **Schedule** tab, and a read-only **Schedule View** shows the combined week, navigable week to week, with a Day view. Source for the Schedule View: search-result snippet of the changelog (the changelog page itself returned 503), so **unverified on a page**. Playlists are typed by frequency: General Rotation, Once per X Songs, Once per X Minutes, Once per Hour, each optionally scheduled to "one or more specific time blocks, or ... between a certain date range", resolved by a fixed numeric priority, "the higher priority playlist will always be selected" (https://www.azuracast.com/docs/user-guide/playlists/).
- **Live slot.** A live show is not an event on a calendar. It is a **streamer account** (username, password, display name) with zero or more "Scheduled Time #n" rows (start time, end time, optional start and end date, days of week, "If the end time is before the start time, the schedule entry will continue overnight"), and a toggle **"Enforce Schedule Times"**: "If enabled, this streamer will only be able to connect during their scheduled broadcast times." Read from the source: `frontend/components/Stations/Streamers/Form/BasicInfo.vue` and `ScheduleRow.vue` in github.com/AzuraCast/AzuraCast (fetched with `gh api` today). Handover is connection-driven: "streamers (or DJs) will be able to connect directly to your stream and broadcast live music that interrupts the AutoDJ stream" (`frontend/components/Admin/Stations/Form/StreamersForm.vue`). Connection details live on the Streamers/DJ Accounts page (https://www.azuracast.com/docs/user-guide/streaming-software/).
- **Recording to archive.** Station-wide switch **"Record Live Broadcasts"**: "AzuraCast will automatically record any live broadcasts made to this station to per-broadcast recordings", with format and bitrate settings (`StreamersForm.vue`). Recordings are reached from a **Broadcasts** modal per streamer, a table of Start Time, End Time (or "Live"), Size, Download, Delete (`frontend/components/Stations/Streamers/BroadcastsModal.vue`; also https://www.azuracast.com/docs/user-guide/streamers-and-djs/). They are **not** media: getting a recording back on air needs a workaround that repoints the recordings storage location into the media folder, ties that folder to a scheduled playlist, and a cron job to clear it daily (https://github.com/AzuraCast/AzuraCast/discussions/7219). A feature request titled "Combine Recordings with Schedule" exists (https://features.azuracast.com/suggestions/486594/combine-recordings-with-schedule, page returned 403, title from search only).
- **Podcasts.** A podcast's source can be **"Synchronize with Playlist"**: "Playlist-based podcasts will automatically sync with the contents of a playlist, creating new podcast episodes for any media added to the playlist", with "Automatically Publish New Episodes ... or held for review as unpublished" (`frontend/components/Stations/Podcasts/PodcastForm/Source.vue`).
- **Library.** A folder tree. Upload by drag into the top of the Media Manager. A folder can be assigned to playlists, and "any files added to the folder will automatically be added to those same playlists" (https://www.azuracast.com/docs/user-guide/media-management/). Folders are the tagging system.
- **Good.** Multi-station is first class. Recording is a single switch. Folder-to-playlist binding is a cheap, legible rule. Playlist-to-podcast sync.
- **Bad.** Recordings sit in a per-streamer modal, keyed to the DJ account and not to the show or the slot, so there is no "this episode" object. The schedule is assembled from two places and only viewed, not edited, as a calendar. Priority numbers are invisible magic to a non-technical editor.

### LibreTime (and Airtime before it)

- **Main programming screen.** A **show calendar** with day, week and month views, month by default, "triangle buttons" and a "today" button, and a row-resolution dropdown "from one minute per row to sixty minutes per row" for day and week. Shows are dragged to move and their lower edge dragged to resize; "LibreTime won't allow you to drag a future show into the past, or drag and drop instances of a repeated show" (https://libretime.org/docs/user-manual/calendar/).
- **Fill state on the calendar.** "Shows that don't yet contain any scheduled content are marked with a red exclamation mark icon", partially filled ones a yellow one, a green play icon while on air, and the show's contents window has "an orange bar which indicates how much media has been added to the show" (https://libretime.org/docs/user-manual/calendar/). The Dashboard's running order marks underbooking with pink rows and overbooking with brown and red rows for items that "will fade or won't play" (https://libretime.org/docs/user-manual/dashboard/).
- **Show form.** Sections What (name, URL, genre, description), When (24h start and end, repeat weekly up to monthly), Autoloading Playlist ("shows autofill exactly one hour before air", plus intro and outro playlists), Who (assign DJs), Style ("the color of the background and text of entries on the calendar", logo) (https://libretime.org/docs/user-manual/scheduling-shows/). Each instance of a repeating show has its own **Instance Description** via "Edit this instance" (https://libretime.org/docs/user-manual/calendar/).
- **Filling a show.** "Schedule Tracks" opens a two-pane view "similarly to iTunes or Windows Media Player: media browser on the left, playlist on the right", drag and drop (https://libretime.org/docs/user-manual/scheduling-shows/). The Dashboard is the same split: library left, "Scheduled Shows" right "which defaults to showing the 3 hours ahead", current item "with a bright green background" (https://libretime.org/docs/user-manual/dashboard/).
- **Live slot and handover.** Two inputs, **Master Source** and **Show Source**, each with an on-air switch in the header; for a show "click the Show Source switch ... it will toggle your show on", the indicator turns from grey to orange, and whether it auto-connects "is a station specific setting" (https://libretime.org/docs/user-manual/live-broadcast/). The show's assigned DJs are who may broadcast into it.
- **Recording to archive.** Airtime 1.7 introduced **Record & Rebroadcast** on the show form. The form fields survive in LibreTime's source: "Record from Line In?", "Rebroadcast?", relative or absolute rebroadcast dates, and the validation "Must wait at least 1 hour to rebroadcast" (`legacy/application/forms/AddShowRR.php`, `AddShowRebroadcastDates.php` in github.com/libretime/libretime, read today). Airtime recorded only from the sound card's line in, never from the stream (https://github.com/LibreTime/libretime/issues/291, open since 2017). LibreTime did not port the recorder; a forum thread reports a PR in June 2026 that "records using the master source stream" with Liquidsoap into `/app/recordings` and can import the recording as a track and reschedule it (https://discourse.libretime.org/t/recording-functions-re-enabled-mostly-there-but-need-some-help/1653). The rebroadcast instances appear on the calendar as their own show instances linked to the recorded one (from Airtime memory, **unverified**).
- **Library.** Five tabs: Tracks, Playlists, Smart Blocks, Webstreams, Podcasts, a show/hide-columns picker (Creator, Album, cue and fade times, MIME) and Filter by Show (https://libretime.org/docs/user-manual/dashboard/). Tags are the files' ID3 tags, edited elsewhere (https://libretime.org/docs/user-manual/preparing-media/). **Smart blocks** are saved queries: criteria with modifiers like "contains" and "is in the range", a "Limit to" in hours, minutes or items, "Allow last track to exceed time limit", static (generated now) or dynamic (generated "at the time the block is added to a show") (https://libretime.org/docs/user-manual/playlists/). Podcast subscriptions download into the library "with the Podcast Name as the Album" (https://libretime.org/docs/user-manual/podcasts/). Playout history has Log Sheet, File Summary, Show Summary and custom templates (https://libretime.org/docs/user-manual/playout-history/).
- **Good.** The calendar carries state, not just times: empty, partly filled, on air, over and under booked. Show versus instance is explicit. Rebroadcast as a field on the show that recorded it is the right model.
- **Bad.** Live input switching is a separate global toggle from the calendar. Recording was tied to hardware and then lost for years. Library metadata must be fixed outside the tool.

### Radio.co (hosted)

- **Main programming screen.** A week calendar "in 15-minute segments", switchable between 1 hour and 5 minute segments, back and next for weeks, a Month button. Events are made by dragging down from start to end or with Create Event to the minute. Three event types: **Playlist** ("Plays your selected playlist for the duration of the event"), **Live DJ** ("Permits a live connection from the selected DJ for the duration of the event"), **Live Relay**. Repeat "every week, 2 weeks or 4 weeks" with an end date. An **Overrun** option lets the last track finish past the end (https://help.radio.co/en/articles/1044910-scheduling-events). Gaps fall to a Default Playlist (https://help.radio.co/en/articles/899715-playlists).
- **Live slot and handover.** A Live DJ event names one DJ and a **backup playlist** that "will air in the event the DJ is unable to connect, or does not show up for their slot". The DJ sees a "Live DJ bar within 1 hour of their slot beginning" with their connection settings, and "can only go live when the Live event starts" (https://help.radio.co/en/articles/899730-schedule-a-live-event).
- **Recording to archive.** A **Record Broadcast** toggle on Live DJ events only. "all output from Radio.co during the live event period will be recorded", including the backup playlist if the DJ never connects. "Once the recorded event has finished the system will automatically archive it within your Media library", named like "19:00-22.08.2017" with "The artist ... set as the DJ from the live event", edited in a Recording Editor (title, artist, album, artwork), with fade and cue points, then added to playlists or downloaded (https://www.radio.co/blog/schedule-radio-shows-record-live).
- **Library.** Flat media list with batch **tags**: tick tracks, type a tag, Add (search snippet of https://help.radio.co/en/articles/1523144-using-tags-to-organise-your-media, **unverified on page**). In a playlist a tag is a placeholder: "Playlist broadcasts random track with 'Pop' tag" (https://www.radio.co/blog/upload-dj-mixes-automatically). With tags in it "we cannot show an accurate runtime" (https://help.radio.co/en/articles/899715-playlists).
- **Clockwheels.** None found in Radio.co's own help. The clockwheel material the search returned was Live365's and Spacial's (see section 3).
- **Good.** The most direct live model: the slot itself owns the DJ, the fallback and the record switch, and the recording lands in the same library the playlists draw from.
- **Bad.** The recording is named by time, not by the show, so every archive item needs hand renaming. Repeat options stop at four weeks.

### Radiocult (hosted, built for NTS-style community stations)

- **Main programming screen.** Week calendar by default with Back and Next; click a slot or Create, which "will create an hour long event starting on the upcoming hour"; 15 minute steps with typed exact times (https://help.radiocult.fm/article/84-scheduling-your-stations-events). Feature page: "Drag-and-drop schedule editor with day, week, and month views", repeat rules like "every 3rd Thursday" and "every 6 weeks on Monday and Tuesday", filtering "by name, status, error state, tags, and artists", and issue detection for "missing media or incomplete setup before broadcast" (https://www.radiocult.fm/features/scheduling).
- **Event form.** Universal: Title, date and time, Repeats, **Record Event**, Description, **Artists**, Colour. Then by media type: Live (fallback playlist), Relay (relay stream and fallback), Pre-Record (audio file, intro, media end behaviour, overrun), Playlist (playlist, intro, media end behaviour, overrun) (https://help.radiocult.fm/article/84-scheduling-your-stations-events).
- **Live slot and handover.** Access is through the **artist on the event**: "DJ users can only go live if their linked artist is attached" and "can only go live during an event assigned to them", and "They will be automatically disconnected at the end of the event"; managers can go live any time, adjustable in settings (https://help.radiocult.fm/article/88-going-live). Global fallback plus per-event fallback, and "Control over whether live streams can override scheduled events" (https://www.radiocult.fm/features/broadcasting).
- **Recording to archive.** Any event type can be recorded, toggled before it starts, saved as MP3 at the stream bitrate, and listed on a **Recordings** page in the side navigation with actions Download, add to media library "for scheduled playback", Upload to Mixcloud or Soundcloud, edit details, remove (https://help.radiocult.fm/article/7-recording-an-event).
- **Library.** "Playlists and tags during upload" and "Dynamic playlist building" (https://www.radiocult.fm/features/broadcasting). Detail of the media screens not read.
- **Good.** The event is the unit for everything: who, what plays, fallback, recording. Artists are first-class records, which is what a public archive needs. Schedule-level error states.
- **Bad.** Recordings are a separate page from the media library, so a replay needs an explicit "add to library" step. One station per account as far as read (multi-channel not seen, **unverified**).

---

## 2. Desktop playout and automation (the broadcast tradition)

### RadioBOSS (Windows)

- **Main programming screen.** The playlist itself, plus a **Scheduler** panel that is a list, not a grid: columns "Run in", Date, Time, Imm (launch immediately), A ("Play above the air"), Mute level, Filename, Name (https://manual.djsoft.net/radioboss/en/schedule.htm). Events "can play single files or playlists, start Internet streams, linear input, and perform various actions" including generating a playlist (https://manual.djsoft.net/radioboss/en/scheduling_playback.htm).
- **Rotation.** Playlist Generator Pro: categories (name, duration, source, no-repeat rules) arranged into a **rotation** sequence with "Est. duration" for one cycle, repeated to a target length (https://manual.djsoft.net/radioboss/en/using_playlist_generator_pro.htm), generated on a schedule by a scheduler event (https://manual.djsoft.net/radioboss/en/automatic_playlist_generation.htm).
- **Live slot.** A scheduler event that switches to line input or an internet stream. No notion of a presenter.
- **Recording to archive.** **Stream Archive** in Tools records the output; a `streamarchive` command in the scheduler or in the playlist starts and stops it (https://manual.djsoft.net/radioboss/en/stream_archive.htm). Staff advise placing the command in the playlist so recording starts "before the first song and after the last song", a "Record without DSP" option avoids double processing on replay, and users report file-locking problems (https://www.djsoft.net/community/threads/record-broadcast-for-repeat-playback.11665/). The file goes to a folder; making it replayable is manual.
- **Library.** Folder-scanned music library with artist, title, album, year, genre (https://manual.djsoft.net/radioboss/en/radioboss__quick_start.htm).
- **Takeaway.** The "Run in" countdown column is a good small idea. Everything else is commands in a list, the opposite of what an arts editor needs.

### mAirList (Windows)

- **Main programming screen.** Playout is a playlist with "Live Assist and Automation mode" and continuously calculated anticipated start times "for perfect backtiming" (https://www.mairlist.com/en/products/radio-automation/). Planning happens in mAirListDB with **hour templates** (the clock: fixed slots for news, IDs, ads) and **music templates** (up to 16 music blocks with selection rules), kept separate so they combine freely, and a **24x7 assignment grid** where you select time ranges and assign a pair of templates (https://wiki.mairlist.com/tutorials:mairlistdb:music-scheduling).
- **Live slot.** Represented by switching the playout to Live Assist and loading playlists by hand from the Database Playlist Browser (https://wiki.mairlist.com/tutorials:mairlistdb:music-scheduling). No external-presenter concept.
- **Recording to archive.** "Aircheck Recorder" and a "File Recorder" for "timed recordings and rebroadcasts of live shows" (https://www.mairlist.com/en/products/radio-automation/). Where the result lands was not read.
- **Library.** mAirListDB stores metadata and cue markers and organises items in a virtual folder structure (https://www.mairlist.com/en/products/radio-automation/).
- **Takeaway.** The split between *the shape of an hour* and *the music that fills it* is clean and worth copying conceptually.

### Rivendell (Linux, open source)

- **Main programming screen.** RDLogManager: **events** (rules for inserting carts, hard or cued start, autofill to length, import from music or traffic systems, artist separation, colour), **clocks** (one hour of events, with "a tabular list of events in chronological order" beside "a graphical depiction of the clock in the traditional 'broadcast clock' format", a three-letter code and colour), and a **grid** per service, "slots for every hour of every day of the broadcast week, 168 slots in all", where each hour gets a clock (https://opsguide.rivendellaudio.org/html/sect.rdlogmanager.events.html, https://opsguide.rivendellaudio.org/html/sect.rdlogmanager.clocks.html, https://opsguide.rivendellaudio.org/html/sect.rdlogmanager.grids.html). The grid generates a dated **log**, which RDAirPlay plays.
- **Multi-channel.** Each **service** has its own grid (https://opsguide.rivendellaudio.org/html/chapter.rdlogmanager.html). This is the cleanest multi-channel model of all the tools read.
- **Live slot.** A log event or marker; switching sources is done with macro carts and switchers (from memory, **unverified**).
- **Recording to archive.** **RDCatch** is a separate event list where each action ("a recording, a play out, an upload or download, a macro execution or an operation on an audio switcher device") runs on its time; a recording has a source, start and end (time or GPI), active days, one-shot, and a **destination cart**, so the recording is immediately a library item that a later log can schedule (https://opsguide.rivendellaudio.org/html/chapter.rdcatch.html).
- **Library.** Carts numbered 1 to 999,999, each holding up to 999 cuts that rotate, with per-cut dayparting, and **groups** that own cart-number ranges (https://opsguide.rivendellaudio.org/html/chapter.rdlibrary.html).
- **Takeaway.** "Record into a named slot that a schedule already points to" (record to cart X, the replay log plays cart X) is the most robust replay mechanism read today: the replay can be scheduled before the live show happens.

### SAM Broadcaster (Spacial, Windows)

- **Main programming screen.** Desktop panes; music goes into **categories** by drag from Explorer or the queue. "Playlist rotation rules" set how often an album, artist, title or track may repeat, and a "Playlist logic module": Clockwheel (Category Rotation), Weighted, or Web scripting. The clockwheel is a list of "+ Category" rules with a selection logic each, for example "80s Hits [Least Recently Played Artist]", "Station ID [Random, NoRules]"; "Use the Event Scheduler to create a new clockwheel for different parts of the day or week" (SAM Broadcaster User Guide PDF, http://supportdocs.spacial.com/SAM+Broadcaster/SAM+Broadcaster+User+Guide.pdf, downloaded and read today). The guide warns that with few items in a category separation rules must be off or nothing will be selected.
- **Live slot, recording.** Not covered in the guide read. SAM has a live mic and an aux input in the desktop app and a "Live-DJ" edition for streaming into SAM VIBE (same PDF); scheduled live handover and recording to library are **unverified**.
- **Spacial clockwheel help pages** (https://support.spacial.com/hc/en-us/articles/229535467-Introduction-to-Clockwheel-Rotation) returned 403 today.
- **Live365 ClockWheels** (the hosted descendant of the idea): a ClockWheel is a list of line items, each a Type and Category plus an algorithm (Random, Oldest or Most Recent Album, Artist or Track) under separation rules; it is placed by creating an Event and choosing "Clockwheel" as the source, in Flexible or Strict timing; around 30 entries at most (https://help.live365.com/en/support/solutions/articles/43000533102-clockwheels).
- **Takeaway.** Clockwheels solve pop-format rotation. For a contemporary-music centre with a small library of long works they mostly cause the "nothing eligible" failure the guide warns about.

### PlayoutONE and Aiir Scheduler

- Aiir's browser-based Scheduler: "drag-and-drop to create your clocks", "Assign clocks throughout the day with reusable templates", rules for separation, maximum consecutive matches, daypart rotation, artist blocking (https://aiir.com/scheduler/). Aiir's homepage lists recent additions "Recycle your audio from peak to off-peak hours" and automatic scheduling and exporting of logs, and remote presenting through WebVT (https://www.playoutone.com/, which redirects to Aiir). Streaming plans mention "show recording" (same page). Detail of live handover and recording into the library: **unverified**.

### RCS Zetta

- Read one page: Zetta's **Background Recorder** has **Recorder Clocks** ("a repeating 24/7 grid, broken down by the hour") and **Recorder Logs** (a dated day), and the advice is to remove a one-off from the dated log rather than the clock, so the template stays intact. Recordings can overwrite a chosen internal asset, and "Play Incoming File" plays a recording that is still being written (https://www.rcsworks.com/rcs-live-zettas-background-recorder/, fetched with curl). Other Zetta claims from search snippets (On-Air, Library, Voice Tracker modules; Auto, Live Assist and Manual modes) are **unverified**.

---

## 3. Listener side: public schedule and archive pages

### NTS (nts.live)

- **Schedule.** Two channels, "1" and "2", each with "Live now" and "Next on" (https://www.nts.live/schedule). The public API behind it lists for each channel `now` and `next` to `next17`, about 24 hours ahead (https://www.nts.live/api/v2/live, read today). Overnight slots are repeats marked in the title with "(R)", for example "KHARTOUM ARRIVALS W/ BASMA (R)" at 03:00. Upcoming slots already carry an **episode record** in status `pending`, with a dated episode alias (`breakfast-finn-2nd-october-2026`), the show alias, genres, location (`LDN`, `BER`).
- **Archive.** The episode that was `pending` becomes `published` at the same address with genres, moods, broadcast time, audio source and a Mixcloud link (https://www.nts.live/api/v2/shows/breakfast/episodes?limit=3). Shows index is A to Z cards with frequency ("MONTHLY"), "ARCHIVE SHOW" for ended ones, and city (https://www.nts.live/shows). Explore browses by genre families and **moods** ("SEDATIVE", "MUSIC TO DANCE TO"), with filters behind a supporter subscription (https://www.nts.live/explore).
- **Lesson.** The schedule slot and the archive episode are one object with one address from before air to forever. Repeats are marked, and are references to existing episodes.

### Dublab (dublab.com)

- **Schedule.** Seven days from "Today (10.02.26)", each slot a time range ("8:00 AM to 10:00 AM"), DJ name and show name, "● On Air" on the current slot. The automated filler is a named block: "dublab presents the Sounds of Now" covering long daytime stretches such as "10:00 AM to 8:00 PM". Reruns are prefixed "RERUN:" (https://www.dublab.com/schedule, rendered in a browser today).
- **Archive.** A featured row with "PLAY BROADCAST", then **Artist**, **Genre** and **Year** dropdown filters over a paginated grid (1141 pages) of cards: artists, show title, date, genre tags (https://www.dublab.com/archive).
- **Lesson.** Naming the loop on the schedule is honest and costs nothing. Artist, genre and year are the three filters that matter.

### Cashmere Radio (cashmereradio.com)

- **Schedule.** "WEEKLY SCHEDULE (CET)", day headers, start time and title only. The loop is a named block, "Cashmere Radio Archive", for example 00:00 to 06:00 and 13:00 to 16:00. Many daytime slots are **replays of specific past episodes** listed by their episode title (for example "Deep Fried DJ #25 Vanity and Capitalism", first aired 11 Apr 2026) with no rerun marker, and live days carry "LIVE FROM WEDDING" (https://cashmereradio.com/listen/).
- **Archive.** "Listen back" page: a sentence picker, "I want to listen to a show with a ___ vibe. or surprise me", then Recent Episodes as date, genre tags separated by slashes, title, play button; episodes at `/episode/{slug}/` (https://cashmereradio.com/listen/ and https://cashmereradio.com/).
- **Lesson.** The archive *is* the filler: the loop is built from past episodes, scheduled by name. That is exactly the eccm situation.

### Kiosk Radio (kioskradio.com)

- **Schedule.** "Playing this week", "ALL TIMES BRUSSELS (CET/CEST)", an hour ruler 09:00 to 23:00, two weeks of days, each slot "09:00 -11:00" and an upper-case title. Gaps are not shown at all. Externally produced shows are prefixed "OUTSIDERS:", live remote ones suffixed "(LIVE)" (https://www.kioskradio.com/schedule).
- **Archive.** Homepage sections Featured Today, Staff Picks, Latest Episodes; each card "EPISODE", date "01.10.2026", title, genre tags (https://www.kioskradio.com/).
- **Lesson.** Curation rows (featured, staff picks) on top of a plain dated feed.

### Radio 80000 (radio80k.de)

- **Schedule.** Weekly list from Monday, including the days already past, start time and show title only (https://www.radio80k.de/schedule/). The header player shows now and next with times ("08:00 Commitment Issues / 09:00 Edition Klassik") and a red live dot.
- **Archive.** Homepage tiles labelled "Listen Back"; the Shows page has tabs Latest Shows, Residents, Studio Sessions, From By (https://www.radio80k.de/ and https://www.radio80k.de/shows/, screenshots today; tile contents did not render as text).
- **Lesson.** "Listen Back" is a good plain label. Past days kept on the schedule page become the way into the archive.

---

## 4. Patterns that recur

1. **Week calendar of typed events** (LibreTime, Radio.co, Radiocult; AzuraCast as a view). The event's type decides its form: playlist, live, relay, pre-record. Best: **Radiocult**, for its type-dependent form, artist field, colour and error-state filter; **LibreTime** for showing fill state on the calendar.
2. **Template versus dated instance** (Rivendell clock and grid versus log, Zetta Recorder Clocks versus Recorder Logs, LibreTime "Edit this instance", mAirList templates and grid). Best: **Rivendell**, with a separate grid per service, which is the only clean multi-channel model read.
3. **Live slot owns presenter, fallback and record switch** (Radio.co, Radiocult; AzuraCast puts the schedule on the presenter instead). Best: **Radiocult**: presenter access only during their event, auto disconnect at the end, per-event fallback over a global one.
4. **Recording becomes a library item that can be scheduled** (Radio.co automatic into Media; Radiocult into Recordings then "add to library"; Rivendell RDCatch into a destination cart; AzuraCast only by workaround). Best: **Rivendell** in mechanism (the replay can be scheduled before the recording exists), **Radio.co** in convenience, with its weakness that recordings are named by time.
5. **Listener side**: the slot and the episode are one object with one address (NTS `pending` to `published`), reruns marked ("(R)", "RERUN:"), the loop named on the schedule ("Sounds of Now", "Cashmere Radio Archive"), and archive filters of artist, genre and year (Dublab).

## 5. What eccm should take

- One **channel** list, and per channel a **week of slots**. A slot is either the channel's looping running order (shown as one named block, as Dublab and Cashmere do) or a **live slot**.
- A live slot carries title, artists, description, the broadcaster's key valid only inside the slot (Radiocult), a fallback (the loop by default), and **Record** on by default.
- Create the **episode** when the slot is created, with its permanent address, status "upcoming" (NTS). When the slot ends the recording attaches to that episode automatically and it flips to "listen back". No separate Recordings page to reconcile, and no time-stamp names to fix (the Radio.co weakness).
- A **replay** is a slot that points at an episode, which may be scheduled before the live show happens (Rivendell's record-to-cart idea); it shows as "(R)" or "Kordus" publicly.
- Show fill and health on the grid itself: live slot without a broadcaster, replay whose recording is missing, loop empty (LibreTime's red and yellow marks, Radiocult's error filter).
- A recurring show is a template with dated instances, and editing one date never edits the template (Zetta, LibreTime).
- Skip clockwheels, rotation rules and priorities. With a small library of long works, an ordered running order per channel plus episodes as items is enough.
