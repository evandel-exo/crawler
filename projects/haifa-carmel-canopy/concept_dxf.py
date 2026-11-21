"""Option A as an AutoCAD DXF (model space, metres) on its own layers.
Geometry = concept.py, converted from plan pixels to metres with an assumed 5.00 m grid bay.
shortcut: bay size is assumed, not read from the DWG; in AutoCAD use ALIGN (with scale) onto two purple grid points."""
from pathlib import Path

import ezdxf
from bidi.algorithm import get_display
from ezdxf.enums import TextEntityAlignment as TA

HERE = Path(__file__).parent
B = 5.0                                    # assumed bay (m)
NX, NY = 8, 5                              # bays along / across, as measured on the plan
N_STRIP, S_STRIP = 3.0, 4.5                # canopy reaching the site edge (north) / the existing canopy (south)
W, D = NX * B, NY * B

doc = ezdxf.new("R2018", setup=True)
doc.units = ezdxf.units.M
doc.styles.new("HEB", dxfattribs={"font": "arial.ttf"})
for name, col in {"A-GRID-REF": 6, "A-CANOPY-GLASS": 4, "A-TIMBER-BEAM": 30, "A-STEEL-BAR": 8,
                  "A-COLUMN": 7, "A-CONNECTION": 5, "A-PARK": 3, "A-TREE": 94, "A-PATH": 41,
                  "A-BENCH": 32, "A-TEXT": 7}.items():
    doc.layers.add(name, color=col)
msp = doc.modelspace()


def pl(pts, layer, close=True):
    return msp.add_lwpolyline(pts, close=close, dxfattribs={"layer": layer})


def hatch(pts, layer, pattern=None, rgb=None, scale=1.0):
    h = msp.add_hatch(dxfattribs={"layer": layer})
    if rgb:
        h.set_solid_fill(rgb=rgb)
        h.transparency = 0.6
    else:
        h.set_pattern_fill(pattern, scale=scale)
    h.paths.add_polyline_path(pts, is_closed=True)


def text(xy, s, h=0.6, align=TA.MIDDLE_RIGHT):
    t = msp.add_text(get_display(s), height=h, dxfattribs={"layer": "A-TEXT", "style": "HEB"})
    t.set_placement(xy, align=align)


rect = lambda x0, y0, x1, y1: [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]

# reference grid (to snap onto the purple grid) + glass roof + connection strips
for i in range(NX + 1):
    msp.add_line((i * B, -S_STRIP - 2), (i * B, D + N_STRIP + 2), dxfattribs={"layer": "A-GRID-REF"})
for j in range(NY + 1):
    msp.add_line((-2, j * B), (W + 2, j * B), dxfattribs={"layer": "A-GRID-REF"})
pl(rect(0, 0, W, D), "A-CANOPY-GLASS")
hatch(rect(0, 0, W, D), "A-CANOPY-GLASS", rgb=(160, 210, 230))
for (y0, y1) in ((-S_STRIP, 0), (D, D + N_STRIP)):
    pl(rect(0, y0, W, y1), "A-CONNECTION")
    hatch(rect(0, y0, W, y1), "A-CONNECTION", "ANSI31", scale=0.4)

# timber main beams on every grid line (across), steel glazing bars at 1/3 bay (along)
for i in range(NX + 1):
    x = i * B
    pl(rect(x - 0.12, -S_STRIP, x + 0.12, D + N_STRIP), "A-TIMBER-BEAM")
for j in range(NY * 3 + 1):
    y = j * B / 3
    msp.add_line((0, y), (W, y), dxfattribs={"layer": "A-STEEL-BAR"})
# columns 40x40 every second grid line (double bays)
for i in range(0, NX + 1, 2):
    for j in range(0, NY + 1, 2):
        x, y = i * B, j * B
        pl(rect(x - 0.2, y - 0.2, x + 0.2, y + 0.2), "A-COLUMN")
        hatch(rect(x - 0.2, y - 0.2, x + 0.2, y + 0.2), "A-COLUMN", "ANSI37", scale=0.02)

# park: beds, trees, path, benches, roof opening (coordinates in bays, from the concept sketch)
beds = [[(0.3, 4.6), (1.5, 4.7), (1.8, 3.6), (0.8, 3.2), (0.3, 3.7)],
        [(4.5, 4.7), (5.8, 4.8), (5.7, 3.6), (4.8, 3.4)],
        [(2.3, 2.6), (3.7, 2.7), (3.9, 1.7), (2.9, 1.4), (2.2, 1.8)],
        [(6.5, 2.7), (7.8, 2.8), (7.8, 1.6), (6.8, 1.4)],
        [(0.3, 1.4), (1.5, 1.6), (1.7, 0.5), (0.5, 0.3)]]
for b in beds:
    pts = [(x * B, y * B) for x, y in b]
    pl(pts, "A-PARK")
    hatch(pts, "A-PARK", rgb=(95, 158, 79))
for (x, y, r) in [(1.0, 4.0, 1.6), (5.1, 4.1, 1.9), (3.1, 2.0, 2.1), (7.2, 2.0, 1.7), (1.0, 0.9, 1.5), (4.1, 3.6, 1.1)]:
    msp.add_circle((x * B, y * B), r, dxfattribs={"layer": "A-TREE"})
msp.add_circle((3.1 * B, 2.0 * B), 3.9, dxfattribs={"layer": "A-CANOPY-GLASS", "linetype": "DASHED"})
path = [(0, -0.25), (1.8, -0.15), (2.6, 0.75), (4.1, 0.75), (4.6, 1.9), (5.8, 2.9), (6.5, 3.5), (8, 3.75)]
msp.add_lwpolyline([(x * B, y * B) for x, y in path], dxfattribs={"layer": "A-PATH", "const_width": 1.8})
for (x, y) in [(4.5, 1.4), (5.8, 1.4), (2.3, 3.2)]:
    pl(rect(x * B - 0.9, y * B - 0.25, x * B + 0.9, y * B + 0.25), "A-BENCH")

# labels
for s, xy in [("חיבור לסככה הקיימת – המשך הגריד", (-3, -S_STRIP / 2)),
              ("הסככה מגיעה עד שפת האתר", (-3, D + N_STRIP / 2)),
              ("קורות עץ ראשיות על צירי הגריד", (-3, D - 2)),
              ("עמוד עץ 40/40 עם טבעות פלדה – כל שני צירים", (-3, 2 * B)),
              ("גג זכוכית על מוטות פלדה", (-3, 3 * B))]:
    text(xy, s)
for s, xy in [("פתח בגג מעל עץ מרכזי", (W + 3, 2.6 * B)), ("פארק: ערוגות, עצים ופינות ישיבה", (W + 3, 1.6 * B)),
              ("שביל הליכה מתפתל", (W + 3, 0.8 * B))]:
    text(xy, s, align=TA.MIDDLE_LEFT)
text((W, D + N_STRIP + 4), "חלופה א' – סככת זכוכית ועץ על הגריד הקיים", 1.2)
text((W, D + N_STRIP + 2.4), "סכמטי | צירים @5.00 מ' (הנחה – ליישר לגריד הסגול עם ALIGN)", 0.6)
doc.saveas(HERE / "concept-option-A.dxf")

# self-check: reopen and count what was drawn per layer
chk = ezdxf.readfile(HERE / "concept-option-A.dxf").modelspace()
assert len(chk.query('*[layer=="A-COLUMN"]')) == 2 * 15 and len(chk.query('*[layer=="A-PARK"]')) == 10
print("saved", len(chk))
