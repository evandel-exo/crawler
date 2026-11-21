"""Concept alternative (schematic) drawn over the site plan from the presentation:
a glass + timber/steel truss canopy on the extended purple grid, joined to the existing
canopy on the south and to the site edge on the north, with a garden inside.
Grid lines were measured on site-plan.png after rotating it -6.7 deg (grid axis-aligned)."""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyBboxPatch, Polygon, Rectangle
from PIL import Image

HERE = Path(__file__).parent
img = Image.open(HERE / "site-plan.png").convert("RGB").rotate(-6.7, resample=Image.BICUBIC, fillcolor="white")

C = [233, 318, 400, 486, 566, 647, 725, 800, 877]      # grid lines (px) along the facade
R = [190, 267, 347, 426, 504, 581]                      # grid lines (px) across
assert all(b - a > 60 for a, b in zip(C, C[1:])) and all(b - a > 60 for a, b in zip(R, R[1:]))
X0, X1, Y0, Y1 = C[0], C[-1], R[0], R[-1]
EXIST = 650     # edge of the existing canopy / existing grid (south)
EDGE = 140      # site edge (north)

WOOD, STEEL, GLASS, GREEN = "#b07a3e", "#2b2b2b", "#9fd3e6", "#5f9e4f"
fig, ax = plt.subplots(figsize=(16.5, 11.7))
ax.imshow(img, alpha=0.55)
ax.set_xlim(60, 1300); ax.set_ylim(800, 40); ax.axis("off")

# glass roof over the whole extended grid + strips that join the existing canopy and the site edge
ax.add_patch(Rectangle((X0, Y0), X1 - X0, Y1 - Y0, fc=GLASS, ec=STEEL, lw=2, alpha=0.35))
ax.add_patch(Rectangle((X0, Y1), X1 - X0, EXIST - Y1, fc=GLASS, ec=STEEL, lw=1.5, alpha=0.25, hatch="///"))
ax.add_patch(Rectangle((X0, EDGE), X1 - X0, Y0 - EDGE, fc=GLASS, ec=STEEL, lw=1.5, alpha=0.25, hatch="\\\\\\"))
# timber main beams on every grid line one way, steel glazing bars the other way
for x in C:
    ax.plot([x, x], [EDGE, EXIST], color=WOOD, lw=4, solid_capstyle="butt")
for y0, y1 in zip(R, R[1:]):
    for k in (1, 2):
        y = y0 + (y1 - y0) * k / 3
        ax.plot([X0, X1], [y, y], color=STEEL, lw=0.6, alpha=0.7)
for y in R:
    ax.plot([X0, X1], [y, y], color=STEEL, lw=1.4)
# columns: timber with black steel collars, every second grid line (double bay like the reference)
for x in C[::2]:
    for y in R[::2]:
        ax.add_patch(Rectangle((x - 9, y - 9), 18, 18, fc=WOOD, ec=STEEL, lw=2.2))

# garden inside: planting beds, trees, a winding path, seating
beds = [[(260, 220), (360, 215), (380, 300), (300, 330), (255, 290)],
        [(600, 215), (700, 210), (690, 300), (620, 320)],
        [(420, 390), (530, 380), (545, 460), (470, 485), (415, 450)],
        [(760, 380), (860, 375), (860, 470), (780, 490)],
        [(255, 470), (350, 455), (370, 540), (270, 560)]]
for b in beds:
    ax.add_patch(Polygon(b, closed=True, fc=GREEN, ec="#2f6b2a", lw=1.2, alpha=0.75))
for (x, y, r) in [(305, 265, 26), (650, 255, 30), (480, 425, 34), (810, 430, 28), (310, 510, 24), (560, 300, 18)]:
    ax.add_patch(Circle((x, y), r, fc="#3f7f3a", ec="#24521f", lw=1, alpha=0.8))
path = [(X0, 600), (380, 590), (440, 520), (560, 520), (600, 430), (700, 350), (760, 300), (X1, 280)]
ax.plot(*zip(*path), color="#d8c7a6", lw=14, solid_capstyle="round", alpha=0.95)
for (x, y) in [(590, 470), (700, 470), (420, 330)]:
    ax.add_patch(FancyBboxPatch((x - 28, y - 6), 56, 12, boxstyle="round,pad=2", fc="#8a6a4a", ec="none"))
ax.add_patch(Circle((480, 425), 62, fill=False, ec=STEEL, lw=1.5, ls="--"))   # opening in the glass over the big tree

# labels (Hebrew; matplotlib lays out right-to-left itself)
def lab(xy, at, t, ha="right"):
    ax.annotate(t, xy=xy, xytext=at, fontsize=12, ha=ha, va="center",
                arrowprops=dict(arrowstyle="-", lw=0.8, color="#333"),
                bbox=dict(fc="white", ec="none", alpha=0.85, pad=2))
lab((X0 + 5, 620), (180, 700), "חיבור לסככה הקיימת – המשך הגריד")
lab((X0 + 5, 165), (180, 95), "הסככה מגיעה עד שפת האתר")
lab((400, 347), (180, 300), "עמוד עץ עם טבעות פלדה – כל שני צירים")
lab((C[1], 230), (180, 230), "קורות עץ ראשיות על צירי הגריד")
lab((X1 - 40, R[2] + 26), (1180, 400), "גג זכוכית על מוטות פלדה", ha="left")
lab((480, 365), (1180, 300), "פתח בגג מעל עץ מרכזי", ha="left")
lab((820, 440), (1180, 500), "פארק: ערוגות, עצים ופינות ישיבה", ha="left")
lab((700, 352), (1180, 580), "שביל הליכה מתפתל", ha="left")
ax.text(1290, 60, "חלופה א' – סככת זכוכית ועץ על הגריד הקיים", fontsize=20, weight="bold", ha="right", va="top")
ax.text(1290, 100, "תכנית סכמטית – ללא קנ\"מ | המשך הגריד הסגול, חיבור לסככה הקיימת ולשפה, פארק בפנים",
        fontsize=12, ha="right", va="top", color="#555")
fig.savefig(HERE / "concept-plan.png", dpi=150, bbox_inches="tight", facecolor="white")
fig.savefig(HERE / "concept-plan.pdf", bbox_inches="tight", facecolor="white")
print("saved")
