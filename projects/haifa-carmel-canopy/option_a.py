"""Option A drawn straight into the site DXF (site-original.dxf, units mm):
glass canopy on timber trusses over the purple site grid, joined to the existing canopy (south),
to the building wall (east) and to the site edge (north), with a garden laid out on the grid.
All geometry is placed in a local frame aligned to the purple grid (u along rows, v up the columns)."""
import math
from pathlib import Path

import ezdxf
from bidi.algorithm import get_display
from ezdxf.enums import TextEntityAlignment as TA

HERE = Path(__file__).parent
doc = ezdxf.readfile(HERE / "site-original.dxf")
doc.dxfversion = "R2018"   # file came in as R2000 (ANSI codepage, no true colour); R2018 keeps Hebrew + RGB fills
msp = doc.modelspace()

# local grid frame, measured from the purple lines (A-DETL colour 190)
O = (64114.0, 116696.0)
A = math.radians(6.78)
U = [64, 2067, 5691, 9404, 12864, 16173, 19764, 23071, 26332, 29592, 32597]   # column lines (east one = building wall)
V = [0, 2585, 5885, 9184, 12594, 16004, 19304]                               # row lines (top one = site edge)
UE, VN = U[-1], V[-1]


def W(u, v):
    return (O[0] + u * math.cos(A) - v * math.sin(A), O[1] + u * math.sin(A) + v * math.cos(A))


LAYERS = {"P-CANOPY-GLASS": 4, "P-TRUSS": 30, "P-BEAM": 32, "P-PURLIN": 8, "P-COLUMN": 7, "P-CONNECTION": 5,
          "P-PATH": 41, "P-PLANT": 3, "P-TREE": 94, "P-FURN": 34, "P-TEXT": 7}
for n, c in LAYERS.items():
    if n not in doc.layers:
        doc.layers.add(n, color=c)
if "DASHED" not in doc.linetypes:
    doc.linetypes.add("DASHED", pattern=[12.0, 7.0, -5.0], description="Dashed __ __")


def poly(pts, layer, close=True, **kw):
    msp.add_lwpolyline([W(*p) for p in pts], close=close, dxfattribs={"layer": layer, **kw})


def rect(u0, v0, u1, v1):
    return [(u0, v0), (u1, v0), (u1, v1), (u0, v1)]


def fill(pts, layer, rgb=None, pattern=None, scale=1.0):
    h = msp.add_hatch(dxfattribs={"layer": layer})
    if rgb:
        h.set_solid_fill(rgb=rgb)
        h.transparency = 0.55
    else:
        h.set_pattern_fill(pattern, scale=scale, angle=math.degrees(A))
    h.paths.add_polyline_path([W(*p) for p in pts], is_closed=True)


def text(u, v, s, h=450, align=TA.MIDDLE_CENTER):
    t = msp.add_text(get_display(s), height=h, rotation=math.degrees(A),
                     dxfattribs={"layer": "P-TEXT", "style": "ARIAL"})
    t.set_placement(W(u, v), align=align)


# --- roof: glass over the whole site, connection strip to the existing canopy along the south edge
poly(rect(U[0], V[0], UE, VN), "P-CANOPY-GLASS")
fill(rect(U[0], V[0], UE, VN), "P-CANOPY-GLASS", rgb=(150, 205, 230))
poly(rect(U[0], -1200, UE, 0), "P-CONNECTION")
fill(rect(U[0], -1200, UE, 0), "P-CONNECTION", pattern="ANSI31", scale=20)

# --- structure: timber trusses (span N-S) on column lines, timber beams on the other lines,
#     steel purlins on every row, columns 40/40 timber with steel collars, wall brackets on the east
COL_U = [U[0], U[2], U[4], U[6], U[8]]
COL_V = [V[0], V[3], V[6]]
for u in COL_U:
    poly(rect(u - 150, V[0], u + 150, VN), "P-TRUSS")
    zig = [(u - 150 + 300 * (k % 2), V[0] + k * VN / 12) for k in range(13)]
    poly(zig, "P-TRUSS", close=False)
for u in (U[1], U[3], U[5], U[7], U[9]):
    poly(rect(u - 80, V[0], u + 80, VN), "P-BEAM")
for v in V:
    msp.add_line(W(U[0], v), W(UE, v), dxfattribs={"layer": "P-PURLIN"})
for u in COL_U:
    for v in COL_V:
        poly(rect(u - 200, v - 200, u + 200, v + 200), "P-COLUMN")
        fill(rect(u - 200, v - 200, u + 200, v + 200), "P-COLUMN", pattern="ANSI37", scale=15)
for v in COL_V:
    poly(rect(UE - 300, v - 150, UE, v + 150), "P-COLUMN")          # bracket on the building wall

# --- garden laid out on the grid
south_walk = rect(U[0], V[0], UE, V[1])                       # links existing canopy, west side, building passage
promenade = rect(U[3], V[1], U[4], VN)                        # N-S axis to the site edge
cross_walk = rect(U[0], V[3], UE, V[4])                       # E-W link from the open west side to the building
for p in (south_walk, promenade, cross_walk):
    poly(p, "P-PATH")
    fill(p, "P-PATH", rgb=(220, 200, 160))

beds = [rect(U[0] + 600, V[1] + 600, U[3] - 600, V[3] - 600),         # SW
        rect(U[0] + 600, V[4] + 600, U[3] - 600, VN - 1800),          # NW
        rect(U[4] + 600, V[1] + 600, U[7] - 600, V[3] - 600),         # S middle
        rect(U[4] + 600, V[4] + 600, U[9] - 600, VN - 1800)]          # NE
for b in beds:
    poly(b, "P-PLANT")
    fill(b, "P-PLANT", rgb=(95, 158, 79))
for (u, v) in [(3800, 5900), (3800, 15000), (14500, 5900), (21400, 5900), (14500, 15000), (21400, 15000), (28000, 15000)]:
    msp.add_circle(W(u, v), 1800, dxfattribs={"layer": "P-TREE"})
msp.add_circle(W(21400, 15000), 2600, dxfattribs={"layer": "P-CANOPY-GLASS", "linetype": "DASHED"})   # roof opening

plaza = rect(U[7], V[1], UE, V[3])                                     # café plaza by the building
poly(plaza, "P-PATH")
fill(plaza, "P-PATH", pattern="NET", scale=60)
for (u, v) in [(25200, 4300), (28400, 4300), (31000, 4300), (25200, 7300), (28400, 7300), (31000, 7300)]:
    msp.add_circle(W(u, v), 450, dxfattribs={"layer": "P-FURN"})
for (u0, v0, u1, v1) in [(U[0] + 600, VN - 1300, U[3] - 300, VN - 800), (U[4] + 300, VN - 1300, U[9] - 600, VN - 800),
                         (U[0] + 900, V[3] - 450, U[2] - 600, V[3] - 100), (U[4] + 900, V[3] - 450, U[6] - 600, V[3] - 100)]:
    poly(rect(u0, v0, u1, v1), "P-FURN")                                # benches: along the edge and the paths

# --- labels
text(UE / 2, VN + 3200, "חלופה א' – סככת זכוכית על מסבכי עץ, המשך הגריד הקיים", 600)
text(UE / 2, -2300, "חיבור לסככה הקיימת – קורת מרזב משותפת על קו הגריד", 450)
text(UE / 2, VN - 400, "ספסל לאורך שפת האתר", 380)
text(UE + 400, 9000, "נשען על קיר הבניין", 380, TA.MIDDLE_LEFT)
text((U[3] + U[4]) / 2, 14500, "טיילת מרכזית", 380)
text(16000, (V[3] + V[4]) / 2, "מעבר מזרח–מערב", 380)
text(16000, (V[0] + V[1]) / 2, "מעבר מהסככה הקיימת לכניסה לבניין", 380)
text((U[7] + UE) / 2, 5800, "רחבת ישיבה / בית קפה", 420)
text(4700, 9600 - 1200, "ערוגות ועצים בתוך משבצות הגריד", 330)
text(21400, 18200 - 900, "פתח בגג מעל עץ", 330)
doc.saveas(HERE / "haifa-carmel-option-A.dxf")

# self-check: original content kept, new layers filled
chk = ezdxf.readfile(HERE / "haifa-carmel-option-A.dxf").modelspace()
assert len(chk.query('LINE[layer=="A-WALL"]')) == 101
assert len(chk.query('*[layer=="P-COLUMN"]')) == 2 * 15 + 3
print("saved", len(chk))
