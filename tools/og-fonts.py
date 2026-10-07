# og-fonts.py: the TrueType faces the share images are drawn in, and their
# advance widths, made from the vendored woff2 subsets under public/vendor/.
# resvg reads TrueType or OpenType and no woff2, and draws a variable font at
# its default instance only, so each face is instanced at the weight and
# optical size the image sets it in, its latin and latin-ext subsets merged
# so Estonian keeps its letters, and renamed so the SVG names it by family.
# The face is OFL with no Reserved Font Name (its LICENSE file beside
# them), so a modified copy may keep the names.
#
#   uvx --from 'fonttools[woff]' python tools/og-fonts.py
#
# writes src/og/fonts/*.ttf and src/og/metrics.mjs; run again only when a
# face or an instance changes, then bump TEMPLATE_V in src/og/card.mjs.
import io, json, os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.merge import Merger

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VENDOR = os.path.join(ROOT, 'public', 'vendor')
OUT = os.path.join(ROOT, 'src', 'og', 'fonts')

# family name in the SVG, vendor stem, the instance's axis values
FACES = [
    # the sans since 2026-10-01 ("schibsted to instrments sans everywhere, incl social"), at its normal width
    ('sans', 'Instrument Sans', 'instrument-sans', {'wght': 400, 'wdth': 100}),
    # the tagline of the logo, as the header sets it (.tag-is): the narrowest width at 500, for the site card
    ('tag', 'Instrument Sans Condensed', 'instrument-sans', {'wght': 500, 'wdth': 75}),
]

def static(path, axes):
    f = TTFont(path)
    f = instancer.instantiateVariableFont(f, axes)
    f.flavor = None
    buf = io.BytesIO(); f.save(buf); buf.seek(0)
    return buf

def rename(f, family):
    ps = family.replace(' ', '') + '-Regular'
    for rec in list(f['name'].names):
        if rec.nameID in (1, 4, 16, 21): rec.string = family if rec.nameID != 4 else family + ' Regular'
        elif rec.nameID in (2, 17, 22): rec.string = 'Regular'
        elif rec.nameID == 6: rec.string = ps
        elif rec.nameID == 3: rec.string = ps + ';og'

os.makedirs(OUT, exist_ok=True)
metrics = {}
for key, family, stem, axes in FACES:
    parts = [static(os.path.join(VENDOR, f'{stem}-{sub}.woff2'), axes) for sub in ('latin', 'latin-ext')]
    font = Merger().merge(parts)
    rename(font, family)
    for t in ('STAT', 'fvar', 'avar', 'gvar', 'HVAR', 'MVAR'):
        if t in font: del font[t]
    name = family.lower().replace(' ', '-') + '.ttf'
    path = os.path.join(OUT, name)
    font.save(path)
    upem = font['head'].unitsPerEm
    hmtx = font['hmtx'].metrics
    adv = {str(cp): round(hmtx[g][0] / upem, 4) for cp, g in font.getBestCmap().items()}
    metrics[key] = {'family': family, 'file': name, 'cap': round(font['OS/2'].sCapHeight / upem, 4), 'adv': adv}
    print(f'{name}: {os.path.getsize(path)} bytes, {len(adv)} code points', file=sys.stderr)

with open(os.path.join(ROOT, 'src', 'og', 'metrics.mjs'), 'w') as fh:
    fh.write('// metrics.mjs: written by tools/og-fonts.py, the advance width of every code point\n')
    fh.write("// of the two faces the share images use and each face's cap height, in ems,\n")
    fh.write('// read from the TTFs in fonts/.\n')
    fh.write('export default ' + json.dumps(metrics, separators=(',', ':')) + ';\n')
