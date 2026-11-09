-- seed-step14-improtest-mark.sql: the Improtest mark, public/ic_large_w900h600q100_improtest.jpg, redrawn on
-- 2026-11-09 (asked: "can you add 20% padding to all improtest images and add liight gray bg?"): the mark's white
-- paper made #f5f5f5 (first #eeeeee, then "even ligher bg"), the scan noise above it dropped, and the mark set in a 900 by 600 picture with a fifth of
-- the height above and below it. The file keeps its name, so every event with it, the four Improtest evenings
-- among them, shows the new one; this row gets its size, its bytes and its scheme, read with tools/scheme.mjs.
-- Also one fix to step 13's Estonian text for Three Free Radicals, below. Runs twice without harm. The share cards follow by themselves, since their version covers the scheme.

UPDATE media SET width = 900, height = 600, bytes = 57781
  WHERE key = 'ic_large_w900h600q100_improtest.jpg';
UPDATE media SET scheme = '{"v":2,"detector":"derive 2026-09-27","mode":"light","ground":"#ffffff","ink":"#1a1a1a","ink2":"#555555","accent":null,"btnFill":"#1a1a1a","onBtn":"#ffffff","notes":["white, the picture’s own ground is white and it has no hue","no accent, the picture is grey"],"readings":{"meanY":0.813,"meanC":0,"cast":{"h":90,"C":0},"top":[{"hex":"#ffffff","share":0.81},{"hex":"#eeeeee","share":0.03},{"hex":"#dddddd","share":0.023}]},"computed_at":"2026-11-09T10:16:33Z"}', scheme_v = 2 WHERE key = 'ic_large_w900h600q100_improtest.jpg';

-- 1206, Three Free Radicals: step 13's second paragraph began "20. novembril", which markdown reads as a numbered
-- list and the page printed "novembril"; the date moves inside the sentence, only while the text is step 13's
UPDATE event_text SET body = replace(body, '20. novembril esitlevad nad IMPROTESTIL oma uut albumit', 'IMPROTESTIL esitlevad nad 20. novembril oma uut albumit')
  WHERE event_id = 1206 AND lang = 'et' AND instr(body, '20. novembril esitlevad nad IMPROTESTIL') > 0;
