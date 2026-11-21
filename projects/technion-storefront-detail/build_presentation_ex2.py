"""Exercise 2 presentation (Hebrew, RTL): steel/aluminium -> glulam timber with concealed steel connections.
Run after build_drawings.py and build_ex2.py:  python3 build_presentation_ex2.py   (needs python-pptx, pillow)
"""
from pathlib import Path

from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Emu, Inches, Pt

HERE = Path(__file__).parent
OUT, OUT1, PH = HERE / "out-ex2", HERE / "out", HERE / "photos"
W, H = Inches(13.333), Inches(7.5)
INK, ACCENT, MUTED = RGBColor(0x22, 0x22, 0x22), RGBColor(0x8A, 0x6A, 0x2E), RGBColor(0x66, 0x66, 0x66)

prs = Presentation()
prs.slide_width, prs.slide_height = W, H
BLANK = prs.slide_layouts[6]


def rtl(p, size, bold=False, color=INK, align=PP_ALIGN.RIGHT):
    p.alignment = align
    p._p.get_or_add_pPr().set("rtl", "1")
    for r in p.runs:
        r.font.size, r.font.bold, r.font.name, r.font.color.rgb = Pt(size), bold, "Arial", color
        r._r.get_or_add_rPr().set("lang", "he-IL")


def textbox(slide, x, y, w, h, lines, size=18, bold_first=False, color=INK, align=PP_ALIGN.RIGHT):
    tf = slide.shapes.add_textbox(x, y, w, h).text_frame
    tf.word_wrap = True
    for i, ln in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = ln
        rtl(p, size, bold=bold_first and i == 0, color=color, align=align)
        p.space_after = Pt(6)
    return tf


def slide(title, num):
    s = prs.slides.add_slide(BLANK)
    textbox(s, Inches(0.5), Inches(0.3), Inches(12.3), Inches(0.8), [title], 30, True)
    bar = s.shapes.add_shape(1, Inches(0.5), Inches(1.05), Inches(12.33), Emu(30000))
    bar.fill.solid(); bar.fill.fore_color.rgb = ACCENT; bar.line.fill.background()
    textbox(s, Inches(0.3), Inches(7.05), Inches(4), Inches(0.4), [f"{num}"], 11, color=MUTED, align=PP_ALIGN.LEFT)
    textbox(s, Inches(6), Inches(7.05), Inches(7), Inches(0.4),
            ["טכנולוגיות בניה 2 | תרגיל חקר 2 – Re-engineering"], 11, color=MUTED)
    return s


def pic(s, path, x, y, w=None, h=None):
    """Place an image fitted inside the (w, h) box, centred."""
    iw, ih = Image.open(path).size
    if w and h:
        k = min(w / iw, h / ih)
        pw, ph = int(iw * k), int(ih * k)
        return s.shapes.add_picture(str(path), x + (w - pw) // 2, y + (h - ph) // 2, pw, ph)
    return s.shapes.add_picture(str(path), x, y, w, h)



P = {k: PH / f"{k}.jpg" for k in ("street", "junction", "soffit", "elev-door-2", "angle-up")}

# 1 — title
s = prs.slides.add_slide(BLANK)
pic(s, P["street"], Inches(0), Inches(0), Inches(5.2), H)
textbox(s, Inches(5.6), Inches(1.6), Inches(7.2), Inches(1.2), ["Re-engineering – מפלדה לעץ"], 36, True)
textbox(s, Inches(5.6), Inches(2.7), Inches(7.2), Inches(2.0), [
    "עמוד וחלון מעץ למינציה, מחוברים בפלטות פלדה נסתרות",
    "בניין עמדו, קמפוס הטכניון",
], 24, color=ACCENT)
textbox(s, Inches(5.6), Inches(4.6), Inches(7.2), Inches(2), [
    "טכנולוגיות בניה 2 | תרגיל חקר 2",
    "הפקולטה לארכיטקטורה ובינוי ערים – חורף תשפ\"ז",
    "מגיש/ה: ____________",
], 18, color=MUTED)

# 2 — starting point
s = slide("נקודת המוצא – הפרט מתרגיל 1", 2)
pic(s, P["junction"], Inches(0.4), Inches(1.3), Inches(2.6), Inches(5.6))
pic(s, OUT1 / "iso-assembled.png", Inches(3.1), Inches(1.3), Inches(4.6), Inches(5.6))
textbox(s, Inches(7.9), Inches(1.3), Inches(5.0), Inches(5.6), [
    "הפרט הקיים",
    "• עמוד פלדה מגולוון, מרותך לפלטות ומעוגן לבטון.",
    "• חלון אלומיניום מוברג לעמוד ולמשקוף עיוור מפלדה.",
    "• כל המפגשים נסגרים בסיליקון – ושם הפרט נכשל: מריחות, תיקונים חוזרים.",
    "• חומרים קרים ותעשייתיים לאורך רחוב הולכי רגל.",
], 17, bold_first=True)

# 3 — the manipulation
s = slide("המניפולציה: חומר וחיבור", 3)
textbox(s, Inches(6.9), Inches(1.3), Inches(6.0), Inches(5.6), [
    "שינוי החומר",
    "• עמוד פלדה ← עמוד עץ למינציה GL24h 25/30.",
    "• חלון אלומיניום ← חלון עץ למינציה 68/90.",
    "• הבטון, הטיח, המעקה ועמוד ההצללה – ללא שינוי.",
    "למה עץ?",
    "• חום ומגע אנושי ברחוב הולכי רגל, ניגוד לבטון הכבד.",
    "• חומר מתחדש שאוגר פחמן; ייצור מדויק ב-CNC.",
], 17, bold_first=True)
textbox(s, Inches(0.4), Inches(1.3), Inches(6.2), Inches(5.6), [
    "שינוי החיבור – \"העץ נראה, הפלדה עובדת\"",
    "• עמוד: להב פלדה נסתר בחריץ בעמוד + דיבלים Ø12, במקום ריתוך גלוי.",
    "• העמוד מורם 6 ס\"מ מעל הריצוף על נעל פלדה – העץ לא נוגע במים.",
    "• חלון: פלטות T וזוויות פלדה נסתרות בחריצים במסגרת, במקום ברגים גלויים.",
    "• איטום: סרט איטום מתפשח + סרגלי כיסוי מעץ, במקום סיליקון.",
    "• הרכבה יבשה – אפשר לפרק ולהחליף חלקים.",
], 17, bold_first=True)

# 4 — before / after
s = slide("לפני ואחרי", 4)
pic(s, OUT1 / "iso-assembled.png", Inches(6.8), Inches(1.4), Inches(6.0), Inches(5.0))
pic(s, OUT / "iso-assembled.png", Inches(0.5), Inches(1.4), Inches(6.0), Inches(5.0))
textbox(s, Inches(6.8), Inches(6.4), Inches(6.0), Inches(0.5), ["לפני: פלדה ואלומיניום"], 16, True, MUTED, PP_ALIGN.CENTER)
textbox(s, Inches(0.5), Inches(6.4), Inches(6.0), Inches(0.5), ["אחרי: עץ למינציה"], 16, True, ACCENT, PP_ALIGN.CENTER)

# 5 — components
s = slide("פירוק לרכיבים", 5)
pic(s, OUT / "iso-exploded.png", Inches(0.3), Inches(1.2), Inches(7.6), Inches(5.8))
textbox(s, Inches(8.0), Inches(1.3), Inches(4.9), Inches(5.6), [
    "רכיבי הפרט החדש",
    "1. שלד: קורת יסוד וקורת שפה מבטון (קיים) + עמוד עץ למינציה על נעל פלדה.",
    "2. סף טרומי (קיים).",
    "3. מסגרות חלון מעץ למינציה, מחוברות בפלטות פלדה נסתרות.",
    "4. זיגוג: זכוכית מחוסמת 6 מ\"מ בסרגלי זיגוג מעץ.",
    "5. גמר: טיח, ריצוף ותקרה אקוסטית (קיימים); סרגלי כיסוי מעץ.",
    "6. מעקה ועמוד הצללה מפלדה (ללא שינוי).",
], 16, bold_first=True)

# 6..9 — drawings
for n, (img, title, note) in enumerate([
    ("sheet-1.png", "חזית וחתך כללי – 1:25", "קווי החתך: A-A דרך החלון, B-B אופקי, C-C דרך עמוד העץ."),
    ("sheet-2.png", "פרטים 1–2: חתך A-A – ראש וסף החלון – 1:5",
     "מסגרת עץ על פלטת T נסתרת; המרווח לבטון נסגר בסרט מתפשח ובסרגל כיסוי מעץ. בסף: שיפוע ואף מים בעץ."),
    ("sheet-3.png", "פרט 3: חתך B-B אופקי – עמוד ומזוזות – 1:5",
     "זווית פלדה נסתרת: רגל אחת מוברגת לעמוד והשנייה בחריץ במזוזה. סרגלי עץ מכסים את המישק משני הצדדים."),
    ("sheet-4.png", "פרט 4: חתך C-C – חיבורי עמוד העץ – 1:5",
     "בבסיס: נעל פלדה עם להב בחריץ בעמוד ודיבלים. בראש: פלטה מעוגנת לקורה עם להב נסתר. מבחוץ רואים רק עץ."),
], start=6):
    s = slide(title, n)
    pic(s, OUT / img, Inches(0.4), Inches(1.2), Inches(12.5), Inches(5.3))
    textbox(s, Inches(0.4), Inches(6.5), Inches(12.5), Inches(0.6), [note], 14, color=MUTED)

# 10 — assembly
s = slide("סדר הרכבה – מפעל ואתר", 10)
steps = [
    ("מפעל", "עמוד העץ נחתך ב-CNC: חריצים ללהבים וחורים לדיבלים. החלונות מיוצרים בנגרייה עם חריצים לפלטות.", "מפעל עץ + נגרייה"),
    ("בסיס", "עיגון נעל הפלדה (פלטה + להב) לקורת היסוד וגראוט.", "מסגר – באתר"),
    ("עמוד", "הורדת העמוד על הלהב, תקיעת דיבלים, פקקי עץ על הראשים; חיבור הראש לפלטה בקורה.", "נגר – באתר"),
    ("חלון", "פלטות T לבטון, הלבשת המסגרת על הפלטות, סרט מתפשח במרווח.", "נגר – באתר"),
    ("גמר", "סרגלי כיסוי מעץ, זיגוג וסרגלי זיגוג, שמן הגנה.", "נגר – באתר"),
]
for i, (k, d, who) in enumerate(steps):
    y = Inches(1.3 + i * 1.05)
    box = s.shapes.add_shape(1, Inches(11.3), y, Inches(1.6), Inches(0.9))
    box.fill.solid(); box.fill.fore_color.rgb = ACCENT; box.line.fill.background()
    tf = box.text_frame; tf.text = f"{i + 1}. {k}"; rtl(tf.paragraphs[0], 18, True, RGBColor(255, 255, 255), PP_ALIGN.CENTER)
    textbox(s, Inches(3.6), y, Inches(7.5), Inches(0.9), [d], 15)
    textbox(s, Inches(0.4), y, Inches(3.1), Inches(0.9), [who], 14, color=MUTED)
textbox(s, Inches(0.4), Inches(6.55), Inches(12.5), Inches(0.4),
        ["הרכבה יבשה: אין ריתוך ואין סיליקון באתר – רק ברגים, דיבלים וסרטים."], 14, color=MUTED)

# 11 — challenges
s = slide("אתגרים ופתרונות", 11)
pic(s, P["soffit"], Inches(0.4), Inches(1.3), Inches(3.0), Inches(5.6))
textbox(s, Inches(3.8), Inches(1.3), Inches(9.1), Inches(5.6), [
    "איך העץ שורד בחוץ?",
    "• רטיבות: העמוד מורם 6 ס\"מ מהריצוף; סף בשיפוע ואף מים; קצות הסיבים אטומים.",
    "• שמש: שמן הגנה UV, חידוש כל 2–3 שנים; הקורה העמוקה מצלה על העץ.",
    "• אש: עץ למינציה נחרך מבחוץ ושכבת הפחם מגינה; הפלדה הנסתרת מוגנת בתוך העץ.",
    "• תחזוקה: סרגלי הכיסוי והסרטים מתחלפים בלי לפרק את החלון.",
    "• תנועה: העץ מתכווץ ומתרחב – הסרט המתפשח והחריצים מאפשרים תנועה.",
], 17, bold_first=True)

# 12 — conclusions
s = slide("סיכום", 12)
textbox(s, Inches(0.8), Inches(1.5), Inches(11.7), Inches(5.0), [
    "מה השתנה?",
    "• החומר: פלדה ואלומיניום ← עץ למינציה – פרט חם יותר ובקנה מידה אנושי.",
    "• החיבור: ריתוך, ברגים גלויים וסיליקון ← פלטות פלדה נסתרות, דיבלים, סרטים וסרגלי כיסוי.",
    "• הרעיון: \"העץ נראה – הפלדה עובדת\". החוזק בפלדה, המראה והמגע בעץ.",
    "• נקודת התורפה של תרגיל 1 – הסיליקון – נעלמה; את המפגשים אפשר לפרק ולתקן.",
], 20, bold_first=True)

prs.save(OUT / "מצגת-תרגיל-2.pptx")
print("saved")
