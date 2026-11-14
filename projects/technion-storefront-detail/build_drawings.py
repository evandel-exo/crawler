"""Builds the AutoCAD DXF drawings (2D sheets + 3D model) and PNG/PDF previews
for the storefront detail: facade column + aluminium glazing + plastered RC
edge beam/parapet + steel pipe railing (Technion campus).

Units: millimetres in model space. Dimension text shows centimetres.
Hebrew text is stored in visual order (python-bidi) because AutoCAD TEXT does
not reorder right-to-left scripts.

Run:  python3 build_drawings.py   (needs: ezdxf matplotlib python-bidi)
"""
from pathlib import Path

import ezdxf
from bidi.algorithm import get_display
from ezdxf.enums import TextEntityAlignment as TA
from ezdxf.render import forms

OUT = Path(__file__).parent / "out"
OUT.mkdir(exist_ok=True)


def he(s: str) -> str:
    return get_display(s)


# ---------------------------------------------------------------- document
doc = ezdxf.new("R2018", setup=True)
doc.units = ezdxf.units.MM
doc.header["$MEASUREMENT"] = 1
doc.header["$INSUNITS"] = 4
doc.styles.new("HEB", dxfattribs={"font": "arial.ttf"})
msp = doc.modelspace()

LAYERS = {  # name: (aci color, lineweight 1/100 mm)
    "A-CUT": (7, 50), "A-CUT-THIN": (7, 25), "A-BEYOND": (8, 13), "A-HIDDEN": (8, 13),
    "A-HATCH": (8, 5), "A-ALUM": (7, 35), "A-GLASS": (4, 18), "A-SEAL": (6, 18),
    "A-STEEL": (7, 35), "A-DIM": (3, 13), "A-TEXT": (7, 18), "A-TITLE": (7, 35),
    "A-SYMB": (1, 25), "A-BREAK": (8, 13), "A-VPORT": (9, 5),
    "3D-CONC": (8, 25), "3D-PLASTER": (31, 25), "3D-ALUM": (250, 25),
    "3D-GLASS": (4, 25), "3D-STEEL": (9, 25), "3D-STONE": (33, 25), "3D-PAVING": (42, 25),
}
for name, (col, lw) in LAYERS.items():
    lay = doc.layers.add(name, color=col)
    lay.dxf.lineweight = lw
doc.layers.get("A-HIDDEN").dxf.linetype = "DASHED"
doc.layers.get("A-VPORT").off()

GLASS_RGB = (205, 232, 240)
ALUM_RGB = (95, 80, 70)        # dark bronze anodised
STEEL_RGB = (150, 150, 150)
SEAL_RGB = (30, 30, 30)


def dimstyle(scale: int) -> str:
    name = f"D{scale}"
    if name not in doc.dimstyles:
        doc.dimstyles.new(name, dxfattribs={
            "dimtxt": 2.0 * scale, "dimtsz": 1.0 * scale, "dimexe": 1.0 * scale,
            "dimexo": 1.0 * scale, "dimgap": 0.8 * scale, "dimdle": 1.0 * scale,
            "dimtad": 1, "dimlfac": 0.1, "dimdec": 1, "dimzin": 8, "dimclrd": 3,
            "dimclre": 3, "dimclrt": 7, "dimtxsty": "Standard", "dimtih": 0, "dimtoh": 0,
        })
    return name


# ---------------------------------------------------------------- 2D helpers
class Pen:
    """Draws into model space with an origin offset and an annotation scale."""

    def __init__(self, ox: float, oy: float, scale: int, rot: bool = False):
        self.ox, self.oy, self.s = ox, oy, scale

    def p(self, x, y):
        return (self.ox + x, self.oy + y)

    def poly(self, pts, layer="A-CUT", hatch=None, hscale=1.0, rgb=None, holes=(), close=True, angle=0):
        P = [self.p(*q) for q in pts]
        if hatch or rgb:
            h = msp.add_hatch(dxfattribs={"layer": "A-HATCH"})
            if rgb:
                h.set_solid_fill(rgb=rgb)
            else:
                h.set_pattern_fill(hatch, scale=hscale, angle=angle)
            h.paths.add_polyline_path(P, is_closed=True)
            for hole in holes:
                h.paths.add_polyline_path([self.p(*q) for q in hole], is_closed=True)
        msp.add_lwpolyline(P, close=close, dxfattribs={"layer": layer})
        for hole in holes:
            msp.add_lwpolyline([self.p(*q) for q in hole], close=True, dxfattribs={"layer": layer})

    def rect(self, x0, y0, x1, y1, layer="A-CUT", **kw):
        self.poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], layer, **kw)

    def line(self, a, b, layer="A-BEYOND"):
        msp.add_line(self.p(*a), self.p(*b), dxfattribs={"layer": layer})

    def circle(self, c, r, layer="A-CUT", rgb=None, hole=None):
        if rgb:
            h = msp.add_hatch(dxfattribs={"layer": "A-HATCH"})
            h.set_solid_fill(rgb=rgb)
            ep = h.paths.add_edge_path()
            ep.add_arc(self.p(*c), r, 0, 360)
            if hole:
                ep2 = h.paths.add_edge_path()
                ep2.add_arc(self.p(*c), hole, 0, 360)
        msp.add_circle(self.p(*c), r, dxfattribs={"layer": layer})
        if hole:
            msp.add_circle(self.p(*c), hole, dxfattribs={"layer": layer})

    def text(self, xy, s, h=2.5, align=TA.BOTTOM_RIGHT, layer="A-TEXT", rot=0):
        t = msp.add_text(he(s), height=h * self.s, dxfattribs={"layer": layer, "style": "HEB", "rotation": rot})
        t.set_placement(self.p(*xy), align=align)

    def label(self, target, at, s):
        """Leader from target to `at`; text sits on a shoulder on the far side."""
        tx, ty = at
        right = tx >= target[0]
        sh = 4 * self.s * (1 if right else -1)
        msp.add_lwpolyline([self.p(*target), self.p(tx, ty), self.p(tx + sh, ty)], dxfattribs={"layer": "A-TEXT"})
        msp.add_circle(self.p(*target), 0.5 * self.s, dxfattribs={"layer": "A-TEXT"})
        lines = s.split("\n")
        for i, ln in enumerate(lines):
            y = ty + 0.6 * self.s - i * 3.6 * self.s
            self.text((tx + sh + (1 if right else -1) * self.s, y), ln, 2.2,
                      TA.BOTTOM_LEFT if right else TA.BOTTOM_RIGHT)

    def dim(self, a, b, base, vertical=False):
        d = msp.add_linear_dim(base=self.p(*base), p1=self.p(*a), p2=self.p(*b),
                               angle=90 if vertical else 0, dimstyle=dimstyle(self.s),
                               dxfattribs={"layer": "A-DIM"})
        d.render()

    def level(self, x, y, s, left=True):
        k = self.s
        tri = [(x, y), (x - 1.5 * k, y + 2.2 * k), (x + 1.5 * k, y + 2.2 * k)]
        self.poly(tri, "A-SYMB")
        self.line((x - 9 * k if left else x, y), (x + 9 * k if not left else x, y), "A-SYMB")
        self.text((x + (-1 if left else 1) * 2.5 * k, y + 0.8 * k), s, 2.2,
                  TA.BOTTOM_RIGHT if left else TA.BOTTOM_LEFT)

    def breakline(self, a, b):
        (x0, y0), (x1, y1) = a, b
        mx, my = (x0 + x1) / 2, (y0 + y1) / 2
        dx, dy = (x1 - x0), (y1 - y0)
        L = (dx * dx + dy * dy) ** 0.5
        nx, ny = -dy / L, dx / L
        k = 2.5 * self.s
        pts = [a, (mx - dx * 0.03 + nx * k, my - dy * 0.03 + ny * k),
               (mx + dx * 0.03 - nx * k, my + dy * 0.03 - ny * k), b]
        msp.add_lwpolyline([self.p(*q) for q in pts], dxfattribs={"layer": "A-BREAK"})


def alu_box(P: Pen, x0, y0, x1, y1, t=2.0):
    P.rect(x0, y0, x1, y1, "A-ALUM", rgb=ALUM_RGB,
           holes=[[(x0 + t, y0 + t), (x1 - t, y0 + t), (x1 - t, y1 - t), (x0 + t, y1 - t)]])


def sealant(P: Pen, pts):
    P.poly(pts, "A-SEAL", rgb=SEAL_RGB)


# hatch pattern + scale per annotation scale (ISO patterns, mm drawing)
def hz(s, key):
    table = {"conc": ("AR-CONC", 0.045), "plaster": ("AR-SAND", 0.25), "earth": ("EARTH", 0.5),
             "gravel": ("GRAVEL", 0.25), "steel": ("ANSI31", 0.2), "stone": ("ANSI33", 0.5),
             "screed": ("AR-SAND", 0.3), "tile": ("ANSI37", 0.35), "pave": ("ANSI31", 0.6),
             "membrane": ("SOLID", 1)}
    name, k = table[key]
    return {"hatch": name, "hscale": k * s}


# ---------------------------------------------------------------- geometry
# Vertical section (cut mid-bay, perpendicular to facade). x: depth, exterior < 0.
# y: elevation, interior FFL = 0.  Key levels (assumed / measured on site):
FFL, HEAD, BEAM_TOP, SLAB_TOP, PARAPET_TOP = 0, 2400, 3200, 3400, 3900
UP_FFL = 3450
RAIL_TOP = UP_FFL + 1050


def vertical_section(P: Pen, full_labels: bool):
    s = P.s
    # Section A-A cuts mid-bay through the fixed glazing.
    # --- ground: soil, base, grade beam, slab on grade
    P.rect(-650, -700, 600, -260, "A-CUT-THIN", **hz(s, "earth"))
    P.rect(-650, -260, -200, -110, "A-CUT-THIN", **hz(s, "gravel"))
    P.rect(-650, -110, -200, -80, "A-CUT-THIN", **hz(s, "screed"))  # sand bed
    P.rect(-650, -80, -210, -20, "A-CUT", **hz(s, "pave"))           # 6cm concrete pavers
    P.rect(-200, -700, 100, -50, "A-CUT", **hz(s, "conc"))           # grade beam
    P.rect(100, -200, 600, -50, "A-CUT", **hz(s, "conc"))            # slab on grade
    P.rect(100, -260, 600, -200, "A-CUT-THIN", **hz(s, "gravel"))
    P.line((-200, -700), (-200, -80), "A-SEAL")                        # bitumen coat
    # interior floor: mortar + terrazzo tile
    P.rect(60, -50, 600, -20, "A-CUT-THIN", **hz(s, "screed"))
    P.rect(60, -20, 600, 0, "A-CUT", **hz(s, "tile"))
    # threshold (precast concrete / stone sill) with drip groove
    P.rect(-210, -50, 60, -30, "A-CUT-THIN", **hz(s, "screed"))
    P.poly([(-210, -30), (-200, -30), (-200, -22), (-190, -22), (-190, -30), (60, -30), (60, 15),
            (-50, 15), (-210, 5)], "A-CUT", **hz(s, "stone"))
    # --- bottom rail (dark bronze aluminium)
    alu_box(P, -50, 15, 50, 85)
    P.rect(-50, 85, -11, 105, "A-ALUM", rgb=ALUM_RGB)       # fixed outer leg
    P.rect(11, 85, 30, 105, "A-ALUM", rgb=ALUM_RGB)         # snap-in glazing bead
    P.rect(-11, 92, -3, 105, "A-SEAL", rgb=SEAL_RGB)        # EPDM gasket
    P.rect(3, 92, 11, 105, "A-SEAL", rgb=SEAL_RGB)
    P.rect(-3, 85, 3, 90, "A-SEAL", rgb=(80, 80, 80))       # setting block
    sealant(P, [(-50, 15), (-62, 11), (-50, 11)])            # silicone bead outside
    # --- glass (cut, with break)
    P.rect(-3, 90, 3, 2325, "A-GLASS", rgb=GLASS_RGB)
    # --- transom (seen beyond at 880-945 is in other bays; this bay is full height)
    # --- head: galvanised steel sub-frame + aluminium head
    P.rect(-50, 2380, 50, 2400, "A-STEEL", rgb=STEEL_RGB,
           holes=[[(-47, 2383), (47, 2383), (47, 2397), (-47, 2397)]])
    alu_box(P, -50, 2335, 50, 2380)
    P.rect(-50, 2315, -11, 2335, "A-ALUM", rgb=ALUM_RGB)
    P.rect(11, 2315, 30, 2335, "A-ALUM", rgb=ALUM_RGB)
    P.rect(-11, 2315, -3, 2328, "A-SEAL", rgb=SEAL_RGB)
    P.rect(3, 2315, 11, 2328, "A-SEAL", rgb=SEAL_RGB)
    sealant(P, [(-50, 2400), (-62, 2400), (-50, 2388)])
    sealant(P, [(50, 2400), (62, 2400), (50, 2388)])
    P.line((0, 2390), (0, 2470), "A-HIDDEN")                 # anchor screw into beam
    P.line((-50, 2325), (-50, 2315), "A-ALUM")
    # --- seen beyond: steel column (RHS 300x250x10) and the free-standing shading post in front of it
    P.line((-200, 15), (-200, 2400), "A-BEYOND")
    P.line((100, 0), (100, 2400), "A-BEYOND")
    P.rect(-350, -8, -270, 2380, "A-BEYOND")                       # shading post SHS 80/80/4, open top
    P.rect(-410, -20, -210, -8, "A-BEYOND")                         # its base plate
    P.rect(-350, -8, -330, 22, "A-BEYOND")                          # drain slot at the base
    # interior acoustic ceiling: perforated metal tiles 600/600 + mineral wool, on T-grid hung from slab
    P.rect(100, 2400, 103, 2425, "A-STEEL", rgb=STEEL_RGB)           # wall angle L24 on beam face
    P.rect(100, 2400, 124, 2403, "A-STEEL", rgb=STEEL_RGB)
    P.rect(103, 2403, 600, 2418, "A-CUT", hatch="DOTS", hscale=0.5 * s)   # perforated tile
    P.rect(103, 2418, 600, 2448, "A-CUT-THIN", hatch="ANSI37", hscale=0.4 * s)  # mineral wool
    for hx in (400,):
        P.rect(hx - 12, 2403, hx + 12, 2440, "A-STEEL", rgb=STEEL_RGB)   # main T-runner
        P.line((hx, 2440), (hx, BEAM_TOP), "A-HIDDEN")                 # hanger rod to slab
    # --- RC edge beam + slab + parapet, cast monolithic in board formwork
    P.poly([(-200, 2400), (-180, 2400), (-180, 2415), (-165, 2415), (-165, 2400), (100, 2400),
            (100, BEAM_TOP), (600, BEAM_TOP), (600, SLAB_TOP), (-50, SLAB_TOP), (-50, PARAPET_TOP),
            (-200, PARAPET_TOP)], "A-CUT", **hz(s, "conc"))
    # exterior plaster (cement render + textured spray finish), sloped coping
    P.poly([(-225, 2400), (-200, 2400), (-200, PARAPET_TOP), (-50, PARAPET_TOP), (-50, UP_FFL),
            (-30, UP_FFL), (-30, 3920), (-225, 3930)], "A-CUT", **hz(s, "plaster"))
    # upper balcony build-up: membrane, screed, tile
    P.poly([(-50, SLAB_TOP), (600, SLAB_TOP), (600, SLAB_TOP + 5), (-45, SLAB_TOP + 5),
            (-45, 3560), (-50, 3560)], "A-SEAL", rgb=SEAL_RGB)
    P.rect(-45, 3405, 600, 3435, "A-CUT-THIN", **hz(s, "screed"))
    P.rect(-30, 3435, 600, UP_FFL, "A-CUT", **hz(s, "tile"))
    # --- railing: post (seen) on base plate, rails cut
    P.rect(-200, 3930, -50, 3940, "A-STEEL", rgb=STEEL_RGB)
    for ax in (-160, -90):
        P.line((ax, 3940), (ax, 3820), "A-HIDDEN")
    P.rect(-149, 3940, -101, RAIL_TOP - 30, "A-BEYOND")
    for (cy, r) in ((RAIL_TOP - 30, 30.2), (4200, 24.2), (3990, 24.2)):
        P.circle((-125, cy), r, "A-STEEL", rgb=STEEL_RGB, hole=r - 3)
    # --- interior soffit & breaks
    P.breakline((600, -720), (600, 0))
    P.breakline((600, 3180), (600, 3470))
    P.breakline((-670, -720), (-670, -20))

    if not full_labels:   # overall 1:25 section — short labels
        for (t, a, txt) in [
            ((-125, 3700), (-450, 3750), "מעקה בטון מטויח"),
            ((-125, RAIL_TOP - 30), (-450, 4350), "מעקה צינורות פלדה"),
            ((-100, 2800), (-450, 2800), "קורת שפה ב\"מ"),
            ((0, 1400), (-500, 1400), "זיגוג קבוע"),
            ((-310, 900), (-500, 900), "עמוד הצללה"),
            ((450, 2410), (650, 2200), "תקרה אקוסטית"),
            ((-500, -50), (-450, -450), "אבן משתלבת"),
            ((450, -10), (650, 600), "ריצוף טרצו"),
            ((450, 3300), (650, 2900), "תקרה ב\"מ חשופה"),
        ]:
            P.label(t, a, txt)
        P.level(-400, FFL, "±0.00")
        P.level(-400, HEAD, "+2.40")
        P.level(300, UP_FFL, "+3.45", left=False)
        P.level(-400, PARAPET_TOP + 30, "+3.93")
        P.level(-400, RAIL_TOP, "+4.50")
        for a, b in ((FFL, HEAD), (HEAD, PARAPET_TOP + 30), (PARAPET_TOP + 30, RAIL_TOP)):
            P.dim((900, a), (900, b), (1000, 0), vertical=True)


def head_labels(P: Pen):
    P.label((-212, 2520), (-480, 2600), "טיח צמנטי 2 ס\"מ + שליכט התזה\nבגוון בהיר (טיח חוץ)")
    P.label((-120, 2408), (-480, 2490), "תחתית קורה: בטון חשוף\nבטביעת קרשים, צבוע")
    P.label((-172, 2414), (-480, 2410), "אף מים 1.5/1.5 ס\"מ")
    P.label((-56, 2397), (-480, 2340), "סיליקון ניטרלי + פרופיל גב")
    P.label((40, 2420), (600, 2640), "קורת שפה ב\"מ ב-30\nיצוקה מונוליטית עם התקרה")
    P.label((30, 2390), (600, 2210), "משקוף עיוור – פרופיל\nפלדה מגולוונת 100/20/3")
    P.label((0, 2440), (600, 2170), "בורג עיגון + דיבל @60 ס\"מ")
    P.label((30, 2360), (600, 2120), "משקוף עליון – אלומיניום\nאנודייז ברונזה, ~45/100 מ\"מ")
    P.label((7, 2322), (600, 2075), "אטם EPDM + סרגל זיגוג")
    P.label((0, 2280), (-480, 2200), "זכוכית 6 מ\"מ מחוסמת\n(קבוע, זיגוג יחיד)")
    P.label((-310, 2300), (-480, 2270), "עמוד הצללה SHS 80/80/4 (מבט)\nראש פתוח, לא מחובר לקורה")
    P.label((300, 2410), (600, 2330), "תקרה אקוסטית – פח מחורר 60/60")
    P.label((300, 2435), (600, 2380), "צמר סלעים 3 ס\"מ מעל האריחים")
    P.label((400, 2600), (600, 2470), "רשת T + מוטות תליה")
    P.label((112, 2410), (600, 2290), "זווית שוליים L24 מעוגנת לקורה")
    P.label((100, 2250), (600, 2250), "עמוד פלדה (מבט)")
    P.text((-950, 2640), "חוץ", 3.5, TA.BOTTOM_LEFT)
    P.text((860, 2640), "פנים", 3.5, TA.BOTTOM_RIGHT)
    P.level(-370, HEAD + 10, "+2.40")
    for a, b in ((-225, -50), (-50, 50), (50, 100)):
        P.dim((a, 2400), (b, 2400), (0, 2500))
    P.dim((50, 2315), (50, 2400), (150, 0), vertical=True)
    P.breakline((-420, 2160), (260, 2160))
    P.breakline((-260, 2620), (260, 2620))


def sill_labels(P: Pen):
    P.label((0, 150), (-700, 160), "זכוכית 6 מ\"מ מחוסמת")
    P.label((-7, 98), (-700, 90), "אטם EPDM")
    P.label((-30, 50), (-700, 50), "משקוף תחתון – אלומיניום אנודייז ברונזה")
    P.label((-58, 13), (-700, 0), "סיליקון ניטרלי")
    P.label((-150, -10), (-700, -110), "סף בטון טרומי/אבן, בשיפוע לחוץ, עם אף מים")
    P.label((-400, -50), (-700, -160), "אבן משתלבת 6 ס\"מ על מצע חול 3 ס\"מ")
    P.label((-400, -180), (-700, -210), "מצע מהודק 15 ס\"מ")
    P.label((-200, -300), (-700, -240), "ציפוי ביטומני")
    P.label((-100, -330), (-700, -310), "קורת יסוד ב\"מ")
    P.label((0, 89), (620, 160), "שמשה על קלוצי הנחה")
    P.label((20, 95), (620, 120), "סרגל זיגוג")
    P.label((300, -10), (620, 40), "טרצו 2 ס\"מ + טיט 3 ס\"מ")
    P.label((400, -150), (620, -130), "מרצפת ב\"מ על הקרקע 15 ס\"מ")
    P.label((400, -230), (620, -230), "מצע מהודק")
    P.label((-310, 150), (-700, 125), "עמוד הצללה (מבט) – מי גשם יורדים בתוכו")
    P.label((-340, 8), (-700, -50), "חריץ ניקוז בבסיס עמוד ההצללה")
    P.text((-640, 175), "חוץ", 3.5, TA.BOTTOM_LEFT)
    P.text((590, 175), "פנים", 3.5, TA.BOTTOM_RIGHT)
    P.level(400, FFL, "±0.00", left=False)
    P.level(-450, -20, "-0.02")
    P.dim((-50, 15), (-50, 105), (-120, 0), vertical=True)
    P.dim((-210, -50), (60, -50), (0, -360))
    P.breakline((-670, 190), (620, 190))
    P.breakline((-670, -400), (620, -400))


def railing_labels(P: Pen):
    P.label((-125, RAIL_TOP - 30), (60, 4560), "מאחז יד – צינור פלדה מגולוונת Ø60.3")
    P.label((-110, 4200), (60, 4250), "רווק ביניים – צינור Ø48.3")
    P.label((-110, 3990), (60, 4040), "רווק תחתון – צינור Ø48.3")
    P.label((-125, 4100), (-330, 4120), "עמוד מעקה Ø48.3 @150 ס\"מ\n(מבט)")
    P.label((-180, 3935), (-330, 3960), "פלטת בסיס 150/150/10\n2 ברגים כימיים M12")
    P.label((-150, 3926), (-330, 3870), "קופינג טיח בשיפוע פנימה")
    P.label((-212, 3700), (-330, 3700), "טיח צמנטי + שליכט התזה")
    P.label((-120, 3650), (60, 3700), "מעקה בטון ב-15")
    P.label((-47, 3530), (60, 3590), "איטום ביטומני מורם 15 ס\"מ")
    P.label((300, 3445), (300, 3530), "ריצוף + מדה משופעת")
    P.text((-330, 4620), "חוץ", 3.5, TA.BOTTOM_LEFT)
    P.text((330, 4620), "פנים (מרפסת)", 3.5, TA.BOTTOM_RIGHT)
    P.level(250, UP_FFL, "+3.45", left=False)
    P.level(-260, RAIL_TOP, "+4.50")
    P.dim((-30, UP_FFL), (-30, RAIL_TOP), (0, 0), vertical=True)
    P.dim((-225, 3930), (-225, RAIL_TOP), (-280, 0), vertical=True)
    P.breakline((-360, 3600 - 10), (360, 3600 - 10))


# Horizontal section B-B at +1.50. x: along facade, y: depth (exterior < 0).
def horizontal_section(P: Pen):
    s = P.s
    # paving & threshold seen below
    P.rect(-460, -420, 460, -210, "A-BEYOND", hatch="NET", hscale=7.8)
    P.line((-460, 60), (460, 60), "A-BEYOND")
    P.line((-460, -210), (460, -210), "A-BEYOND")
    P.line((-460, -225), (460, -225), "A-HIDDEN")   # plaster face of beam above
    # shading post SHS 80/80/4 in front of the column
    P.rect(-40, -350, 40, -270, "A-STEEL", rgb=STEEL_RGB, holes=[[(-36, -346), (36, -346), (36, -274), (-36, -274)]])
    # steel column RHS 300x250x10, galvanised + painted, hollow
    P.rect(-125, -200, 125, 100, "A-STEEL", rgb=STEEL_RGB, holes=[[(-115, -190), (115, -190), (115, 90), (-115, 90)]])
    for sg in (1, -1):
        def X(x):
            return sg * x
        # jamb profile
        alu_box(P, X(135), -50, X(180), 50) if sg > 0 else alu_box(P, X(180), -50, X(135), 50)
        legs = [(180, 200, -50, -11), (180, 200, 11, 30)]
        for (a, b, y0, y1) in legs:
            P.rect(min(X(a), X(b)), y0, max(X(a), X(b)), y1, "A-ALUM", rgb=ALUM_RGB)
        for (y0, y1) in ((-11, -3), (3, 11)):
            P.rect(min(X(187), X(200)), y0, max(X(187), X(200)), y1, "A-SEAL", rgb=SEAL_RGB)
        P.rect(min(X(190), X(460)), -3, max(X(190), X(460)), 3, "A-GLASS", rgb=GLASS_RGB)
        # 10mm perimeter joint: backer rod + silicone both faces, shims + anchor
        P.circle((X(130), -40), 5, "A-SEAL")
        P.circle((X(130), 40), 5, "A-SEAL")
        P.rect(min(X(125), X(135)), -50, max(X(125), X(135)), -46, "A-SEAL", rgb=SEAL_RGB)
        P.rect(min(X(125), X(135)), 46, max(X(125), X(135)), 50, "A-SEAL", rgb=SEAL_RGB)
        P.rect(min(X(125), X(135)), -10, max(X(125), X(135)), 10, "A-CUT-THIN", rgb=(170, 170, 120))
        P.line((X(160), 0), (X(55), 0), "A-HIDDEN")
        P.breakline((X(460), -440), (X(460), 120))

    P.label((-60, -120), (-560, -150), "עמוד פלדה – צינור מלבני 300/250/10\nמגולוון וצבוע, חלול")
    P.label((-130, -48), (-560, -60), "סיליקון ניטרלי + פרופיל גב")
    P.label((-160, 30), (-560, 130), "מזוזה – אלומיניום אנודייז ברונזה")
    P.label((-130, 0), (-560, 200), "פלסטיק פילוס (שימס)")
    P.label((90, 0), (520, 270), "בורג קודח עצמי לפלדה @60 ס\"מ")
    P.label((195, -7), (520, 140), "אטם EPDM")
    P.label((190, 20), (520, 205), "סרגל זיגוג")
    P.label((350, 0), (520, -90), "זכוכית 6 מ\"מ מחוסמת")
    P.label((350, -300), (520, -330), "ריצוף אבנים משתלבות (מבט)")
    P.label((420, -225), (520, -170), "קו פני טיח הקורה מעל")
    P.label((30, -330), (-560, -330), "עמוד הצללה SHS 80/80/4 (חתוך), חלול")
    P.text((-450, -400), "חוץ", 3.5, TA.BOTTOM_LEFT)
    P.text((450, 90), "פנים", 3.5, TA.BOTTOM_RIGHT)
    P.dim((-125, -200), (125, -200), (0, -260))
    P.dim((125, -200), (180, -200), (0, -260))
    P.dim((125, -200), (125, 100), (160, 0), vertical=True)
    P.dim((180, -50), (180, 50), (240, 0), vertical=True)


# Elevation (1:25). x along facade, y elevation.
def elevation(P: Pen):
    L, R = -2525, 3125
    P.line((L - 300, -20), (R + 300, -20), "A-CUT")
    P.rect(-125, -20, 125, HEAD, "A-CUT-THIN")
    # plaster band
    P.rect(L, HEAD, R, PARAPET_TOP + 30, "A-CUT-THIN", rgb=(236, 232, 220))
    # door bay: pair of doors + sidelight
    def frame(x0, x1, y0=15, y1=2400, f=45):
        P.rect(x0, y0, x1, y1, "A-ALUM")
        P.rect(x0 + f, y0 + (90 if y0 < 100 else f), x1 - f, y1 - 85, "A-GLASS", rgb=GLASS_RGB)
    frame(-2525, -1625); frame(-1625, -725); frame(-725, -135)
    P.line((-725 + 45, 900), (-135 - 45, 900), "A-ALUM")
    for x in (-1700, -1550):
        P.rect(x - 12, 1000, x + 12, 1250, "A-ALUM")
    # window bay: two fixed lights with transom
    frame(135, 1625); frame(1625, 3125)
    P.rect(-40, -20, 40, 2380, "A-STEEL", rgb=STEEL_RGB)   # shading post in front of column
    for x0, x1 in ((180, 1580), (1670, 3080)):
        P.rect(x0, 880, x1, 945, "A-ALUM")
    # railing
    for x in (-2300, -800, 700, 2200):
        P.rect(x - 24, 3940, x + 24, RAIL_TOP, "A-STEEL")
    for y, r in ((RAIL_TOP - 30, 30), (4200, 24), (3990, 24)):
        P.rect(L, y - r, R, y + r, "A-STEEL")
    P.line((L, 4950), (R, 4850), "A-HIDDEN")
    P.text((0, 4960), "קו יריעת הצללה מתוחה (מעל, מחוץ לגבולות הפרט)", 2.2, TA.BOTTOM_CENTER)
    # section markers
    for (a, b, t) in (((800, -350), (800, 4700), "A"), ((-2850, 1500), (3450, 1500), "B")):
        P.line(a, b, "A-SYMB")
        for q in (a, b):
            P.circle(q, 4 * P.s, "A-SYMB")
            P.text(q, t, 3, TA.MIDDLE_CENTER, layer="A-SYMB")
    P.text((-1100, 2600), "קורת שפה + מעקה בטון בטיח התזה", 2.5, TA.BOTTOM_CENTER)
    P.text((1600, 450), "זיגוג קבוע", 2.5, TA.BOTTOM_CENTER)
    P.text((-1625, 450), "דלת כפולה", 2.5, TA.BOTTOM_CENTER)
    P.text((0, 2500), "עמוד פלדה", 2.2, TA.BOTTOM_CENTER)
    P.level(R + 120, FFL, "±0.00", left=False)
    P.level(R + 120, HEAD, "+2.40", left=False)
    P.level(R + 120, PARAPET_TOP + 30, "+3.93", left=False)
    P.level(R + 120, RAIL_TOP, "+4.50", left=False)
    for a, b in ((-2525, -125), (-125, 125), (125, 1625), (1625, 3125)):
        P.dim((a, -20), (b, -20), (0, -480))


# ---------------------------------------------------------------- place in model space
V1 = Pen(0, 0, 5)          # detail copy for head / sill / railing viewports
vertical_section(V1, True)
head_labels(V1)
sill_labels(V1)
railing_labels(V1)

V25 = Pen(-4500, 0, 25)    # overall section
vertical_section(V25, False)

HB = Pen(4000, 1500, 5)    # horizontal section
horizontal_section(HB)

EL = Pen(-12000, 0, 25)    # elevation
elevation(EL)


# ---------------------------------------------------------------- paper space sheets (A3)
def sheet(name, title, scale_note, num, views):
    lay = doc.layouts.new(name)
    lay.page_setup(size=(420, 297), margins=(0, 0, 0, 0), units="mm")
    for e in list(lay.query("VIEWPORT"))[1:]:
        lay.delete_entity(e)
    a = {"layer": "A-TITLE"}
    lay.add_lwpolyline([(0, 0), (420, 0), (420, 297), (0, 297)], close=True, dxfattribs={"layer": "A-VPORT"})
    lay.add_lwpolyline([(10, 10), (410, 10), (410, 287), (10, 287)], close=True, dxfattribs=a)
    lay.add_lwpolyline([(10, 10), (410, 10), (410, 32), (10, 32)], close=True, dxfattribs=a)
    for x in (120, 200, 290):
        lay.add_line((x, 10), (x, 32), dxfattribs=a)

    def t(xy, s, h, al=TA.MIDDLE_RIGHT):
        e = lay.add_text(he(s), height=h, dxfattribs={"layer": "A-TEXT", "style": "HEB"})
        e.set_placement(xy, align=al)
    t((406, 25), "הטכניון – הפקולטה לארכיטקטורה ובינוי ערים", 2.8)
    t((406, 17), "טכנולוגיות בניה 2 | תרגיל חקר 1 – Reverse Engineering", 2.5)
    t((286, 25), title, 4)
    t((286, 16), "חזית זיגוג, עמוד וקורת שפה – קמפוס הטכניון", 2.3)
    t((196, 25), scale_note, 3.5)
    t((196, 16), "מידות בס\"מ, מפלסים במ'", 2.5)
    t((116, 25), "שם הסטודנט/ית: ____________", 2.5)
    t((116, 16), f"גיליון {num}/4   |   חורף תשפ\"ז 2026", 2.5)
    for (pc, psz, mc, sc, cap) in views:
        lay.add_viewport(center=pc, size=psz, view_center_point=mc, view_height=psz[1] * sc,
                         dxfattribs={"layer": "A-VPORT"})
        e = lay.add_text(he(cap), height=3.5, dxfattribs={"layer": "A-TITLE", "style": "HEB"})
        e.set_placement((pc[0] + psz[0] / 2, pc[1] - psz[1] / 2 - 6), align=TA.MIDDLE_RIGHT)
        lay.add_line((pc[0] - psz[0] / 2, pc[1] - psz[1] / 2 - 9), (pc[0] + psz[0] / 2, pc[1] - psz[1] / 2 - 9),
                     dxfattribs={"layer": "A-TITLE"})
    return lay


sheet("SHEET-1", "חזית וחתך כללי", "קנ\"מ 1:25", 1, [
    ((143, 168), (262, 235), (-12000 + 300, 2300), 25, "חזית – קנ\"מ 1:25"),
    ((342, 168), (130, 235), (-4500 - 200, 2300), 25, "חתך A-A כללי – קנ\"מ 1:25"),
])
sheet("SHEET-2", "חתכים אנכיים A-A", "קנ\"מ 1:5", 2, [
    ((210, 229), (380, 108), (-40, 2420), 5, "פרט 1 – חתך A-A דרך החלון: ראש החלון וקורת השפה – 1:5"),
    ((210, 103), (380, 112), (-80, -100), 5, "פרט 2 – חתך A-A דרך החלון: סף ומפגש עם הריצוף – 1:5"),
])
sheet("SHEET-3", "חתך אופקי B-B", "קנ\"מ 1:5", 3, [
    ((210, 165), (380, 225), (4000, 1500 - 40), 5, "פרט 3 – חתך B-B אופקי: עמוד ומזוזות – 1:5"),
])
sheet("SHEET-4", "חתך אנכי A-A – מעקה", "קנ\"מ 1:5", 4, [
    ((210, 165), (300, 225), (-40, 4100), 5, "פרט 4 – חתך A-A: מעקה וקופינג – 1:5"),
])

doc.saveas(OUT / "storefront-detail.dxf")

# ---------------------------------------------------------------- 3D model
d3 = ezdxf.new("R2018")
d3.units = ezdxf.units.MM
for name, (col, lw) in LAYERS.items():
    if name.startswith("3D"):
        d3.layers.add(name, color=col)
m3 = d3.modelspace()


def box(group, layer, rgb, x0, x1, y0, y1, z0, z1):
    if x1 <= x0:
        return
    m = forms.cube().scale(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2)
    PARTS.append((group, layer, rgb, m))


def tube(group, layer, rgb, a, b, r):
    PARTS.append((group, layer, rgb, forms.cylinder_2p(count=16, radius=r, base_center=a, top_center=b)))


CONC, PLA, ALU, GLS, STL, STN, PAV = ((175, 172, 165), (226, 220, 205), ALUM_RGB, (170, 210, 225),
                                      (160, 165, 170), (200, 190, 175), (150, 140, 130))
def build_parts(XL, XR, posts):
    global PARTS
    PARTS = []  # (group, layer, rgb, mesh)
    box(0, "3D-CONC", CONC, XL, XR, -200, 100, -600, -50)               # grade beam
    box(0, "3D-STEEL", (140, 145, 150), -125, 125, -200, 100, -50, 2400)  # steel column
    box(0, "3D-CONC", CONC, XL, XR, -200, 100, 2400, 3200)               # beam
    box(0, "3D-CONC", CONC, XL, XR, -200, 900, 3200, 3400)               # slab
    box(0, "3D-CONC", CONC, XL, XR, -200, -50, 3400, 3900)               # parapet
    for x0, x1 in ((XL, -125), (125, XR)):
        box(1, "3D-STONE", STN, x0, x1, -210, 60, -30, 15)               # threshold
        box(2, "3D-STEEL", STL, x0 + 10, x1 - 10, -50, 50, 2380, 2400)   # sub-frame
        box(2, "3D-ALUM", ALU, x0 + 10, x1 - 10, -50, 50, 2315, 2380)    # head
        box(2, "3D-ALUM", ALU, x0 + 10, x1 - 10, -50, 50, 15, 105)       # sill rail
    for xj in (135, 1580, XR - 55, -180, -770):
        box(2, "3D-ALUM", ALU, xj, xj + 45, -50, 50, 105, 2315)          # jambs / mullions
    box(2, "3D-ALUM", ALU, 180, 1580, -50, 50, 880, 945)                 # transom
    box(2, "3D-ALUM", ALU, 1625, XR - 55, -50, 50, 880, 945)
    for x0, x1 in ((180, 1580), (1625, XR - 55), (-725, -180), (XL + 10, -770)):
        box(3, "3D-GLASS", GLS, x0, x1, -3, 3, 105, 2315)                # glass
    box(4, "3D-PLASTER", PLA, XL, XR, -225, -200, 2400, 3930)             # plaster face
    box(4, "3D-PLASTER", PLA, XL, XR, -225, -30, 3900, 3930)              # coping
    box(4, "3D-PAVING", PAV, XL, XR, -1100, -210, -80, -20)               # pavers
    for x in posts:
        tube(5, "3D-STEEL", STL, (x, -125, 3930), (x, -125, RAIL_TOP), 24)
    box(5, "3D-STEEL", STL, -40, 40, -350, -270, -20, 2380)          # shading post
    box(4, "3D-PLASTER", (235, 235, 235), XL, XR, 103, 600, 2403, 2418)  # acoustic ceiling
    for z, r in ((RAIL_TOP - 30, 30), (4200, 24), (3990, 24)):
        tube(5, "3D-STEEL", STL, (XL, -125, z), (XR, -125, z), r)

    return PARTS


XL = -1500
PARTS = build_parts(XL, 3125, (-800, 700, 2200))
for _, layer, _, m in PARTS:
    m.render_mesh(m3, dxfattribs={"layer": layer})
d3.saveas(OUT / "storefront-detail-3D.dxf")


# ---------------------------------------------------------------- previews
def render_previews():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from ezdxf.addons.drawing import Frontend, RenderContext
    from ezdxf.addons.drawing.config import Configuration, LineweightPolicy
    from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
    from matplotlib.backends.backend_pdf import PdfPages
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection

    cfg = Configuration(lineweight_policy=LineweightPolicy.ABSOLUTE, lineweight_scaling=1.0)
    with PdfPages(OUT / "storefront-detail-sheets.pdf") as pdf:
        for i in (1, 2, 3, 4):
            fig = plt.figure(figsize=(420 / 25.4, 297 / 25.4))
            ax = fig.add_axes([0, 0, 1, 1])
            lay = doc.paperspace(f"SHEET-{i}")
            Frontend(RenderContext(doc), MatplotlibBackend(ax), config=cfg).draw_layout(lay, finalize=True)
            ax.set_xlim(0, 420); ax.set_ylim(0, 297)
            fig.savefig(OUT / f"sheet-{i}.png", dpi=200, facecolor="white")
            pdf.savefig(fig, facecolor="white")
            plt.close(fig)

    def draw3d(fname, explode):
        parts = build_parts(-700, 1625, (500,)) if explode else build_parts(-1500, 3125, (-800, 700, 2200))
        fig = plt.figure(figsize=(12, 10) if explode else (10, 10))
        ax = fig.add_subplot(projection="3d", proj_type="ortho")
        shift = {0: (0, 0, 0), 1: (0, -1300, -500), 2: (0, -2600, 0), 3: (0, -3900, 0),
                 4: (0, -5200, 0), 5: (0, -5200, 700)}
        for g, _, rgb, m in parts:
            dx, dy, dz = shift[g] if explode else (0, 0, 0)
            polys = [[(m.vertices[i].x + dx, m.vertices[i].y + dy, m.vertices[i].z + dz) for i in f] for f in m.faces]
            alpha = 0.35 if g == 3 else 1.0
            ax.add_collection3d(Poly3DCollection(polys, facecolor=[c / 255 for c in rgb], edgecolor=(0.2, 0.2, 0.2),
                                                 linewidths=0.3, alpha=alpha))
        if explode:
            ax.set_xlim(-800, 1700); ax.set_ylim(-6500, 1000); ax.set_zlim(-1300, 5400)
            ax.set_box_aspect((2500, 7500, 6700))
            ax.view_init(elev=20, azim=-25)
        else:
            ax.set_xlim(-1600, 3200); ax.set_ylim(-1700, 900); ax.set_zlim(-700, 4600)
            ax.set_box_aspect((4800, 2600, 5300))
            ax.view_init(elev=22, azim=-58)
        ax.set_axis_off()
        if explode:
            names = {0: "1  שלד: עמוד פלדה, קורת יסוד, קורה, תקרה ומעקה ב\"מ",
                     1: "2  סף טרומי", 2: "3  משקוף עיוור + מסגרות אלומיניום",
                     3: "4  זיגוג", 4: "5  גמר: טיח, ריצוף ותקרה אקוסטית", 5: "6  מעקה צינורות ועמוד הצללה מפלדה"}
            for g, txt in names.items():
                vs = [(v.x, v.y, v.z) for gg, _, _, m in parts if gg == g for v in m.vertices]
                dx, dy, dz = shift[g]
                y = sum(v[1] for v in vs) / len(vs) + dy
                z = max(v[2] for v in vs) + dz + 250
                ax.text(450, y, z, txt, fontsize=11, ha="center", va="bottom",
                        bbox={"fc": "white", "ec": "none", "alpha": 0.8, "pad": 1})
        fig.savefig(OUT / fname, dpi=170, bbox_inches="tight", facecolor="white")
        plt.close(fig)

    draw3d("iso-assembled.png", False)
    draw3d("iso-exploded.png", True)


if __name__ == "__main__":
    render_previews()
    print("written:", sorted(p.name for p in OUT.iterdir()))
