"""Builds the Hebrew (RTL) presentation from the site photos and the rendered sheets.
Run after build_drawings.py:  python3 build_presentation.py   (needs python-pptx, pillow)
"""
from pathlib import Path

from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Emu, Inches, Pt

HERE = Path(__file__).parent
OUT, PH = HERE / "out", HERE / "photos"
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
            ["טכנולוגיות בניה 2 | תרגיל חקר 1 – Reverse Engineering"], 11, color=MUTED)
    return s


def pic(s, path, x, y, w=None, h=None):
    """Place an image fitted inside the (w, h) box, centred."""
    iw, ih = Image.open(path).size
    if w and h:
        k = min(w / iw, h / ih)
        pw, ph = int(iw * k), int(ih * k)
        return s.shapes.add_picture(str(path), x + (w - pw) // 2, y + (h - ph) // 2, pw, ph)
    return s.shapes.add_picture(str(path), x, y, w, h)


P = {k: PH / f"{k}.jpg" for k in
     ("angle-up", "street", "canopy", "junction", "elev-rail", "up-2", "soffit", "elev-door",
      "up-3", "elev-door-2", "railing", "interior")}

# 1 — title
s = prs.slides.add_slide(BLANK)
pic(s, P["street"], Inches(0), Inches(0), Inches(5.2), H)
textbox(s, Inches(5.6), Inches(1.6), Inches(7.2), Inches(1.2), ["ניתוח טכנולוגי – Reverse Engineering"], 36, True)
textbox(s, Inches(5.6), Inches(2.7), Inches(7.2), Inches(2.4), [
    "חזית זיגוג, עמוד וקורת שפה מטויחת עם מעקה",
    "מבנה בקמפוס הטכניון, חיפה",
], 24, color=ACCENT)
textbox(s, Inches(5.6), Inches(4.6), Inches(7.2), Inches(2), [
    "טכנולוגיות בניה 2 | תרגיל חקר 1",
    "הפקולטה לארכיטקטורה ובינוי ערים – חורף תשפ\"ז",
    "מגיש/ה: ____________",
], 18, color=MUTED)

# 2 — the detail
s = slide("הפרט שנבחר", 2)
for i, k in enumerate(("elev-door-2", "angle-up", "junction", "soffit")):
    pic(s, P[k], Inches(0.4 + i * 2.15), Inches(1.3), Inches(2.05), Inches(3.65))
textbox(s, Inches(9.1), Inches(1.3), Inches(3.8), Inches(5.6), [
    "מה רואים?",
    "• קומת קרקע מזוגגת – מסגרות אלומיניום בגוון ברונזה כהה, בין עמודי פלדה מגולוונים וצבועים.",
    "• מעל הזיגוג: קורת שפה עמוקה + מעקה בטון, בטיח התזה בהיר – \"פס\" אופקי רציף.",
    "• על המעקה: מעקה צינורות פלדה מגולוונת של מרפסת הקומה העליונה.",
    "• מעל הכל: יריעת הצללה מתוחה על מסגרת פלדה.",
    "המפגש הנחקר: עמוד – מסגרת אלומיניום – תחתית קורה.",
], 16, bold_first=True)
textbox(s, Inches(0.4), Inches(5.1), Inches(8.5), Inches(1.8), [
    "הפרט מחבר שלוש מערכות: שלד (בטון), מעטפת (זיגוג) וגמר (טיח, צבע, איטום) – ובו נקודות התורפה של המבנה: סדקים, מריחות סיליקון וצבע.",
], 15, color=MUTED)

# 3 — context
s = slide("רקע ותפיסה תכנונית", 3)
pic(s, P["interior"], Inches(0.4), Inches(1.3), Inches(3.4), Inches(5.6))
pic(s, P["canopy"], Inches(3.95), Inches(1.3), Inches(3.4), Inches(5.6))
textbox(s, Inches(7.6), Inches(1.3), Inches(5.3), Inches(5.6), [
    "שלד ומילוי",
    "• מבנה מודרניסטי-ברוטליסטי (שנות ה-60–70) – קורות ותקרות בטון מזוין יצוק באתר בטפסות קרשים (טביעת הקרשים גלויה), על עמודי פלדה דקים בחזית.",
    "• העמודים והקורה הם \"מסגרת\"; הזיגוג הוא מילוי לא נושא שנכנס בין רכיבי השלד.",
    "• קורת השפה העמוקה משמשת גם כמעקה מרפסת וגם כ\"מצחייה\" שמצלה על הזיגוג.",
    "אקלים ותרבות",
    "• אקלים ים-תיכוני חם: צל, הגנה מגשם והפרדה בין רחוב להולכי רגל לפנים.",
    "• הטיח החיצוני ויריעת ההצללה נוספו כנראה בשיפוץ מאוחר – שכבת \"גמר\" על שלד ותיק.",
], 16)

# 4 — components
s = slide("פירוק לרכיבים", 4)
pic(s, OUT / "iso-exploded.png", Inches(0.3), Inches(1.2), Inches(7.6), Inches(5.8))
textbox(s, Inches(8.0), Inches(1.3), Inches(4.9), Inches(5.6), [
    "רכיבי הפרט (מהשלד לגמר)",
    "1. שלד: עמוד פלדה 300/250/10 על פלטת בסיס; קורת יסוד, קורת שפה, תקרה ומעקה ב\"מ.",
    "2. סף בטון טרומי/אבן בשיפוע לחוץ, עם אף מים.",
    "3. משקוף עיוור מפלדה מגולוונת + מסגרות אלומיניום (משקוף, מזוזות, אגף, קורה אופקית).",
    "4. זיגוג: זכוכית מחוסמת 6 מ\"מ, אטמי EPDM, סרגלי זיגוג וקלוצי הנחה.",
    "5. גמר: טיח צמנטי + שליכט התזה, צבע, סיליקון, ריצוף אבן משתלבת.",
    "6. מעקה צינורות פלדה מגולוונת על פלטות בסיס מעוגנות.",
], 16, bold_first=True)

# 5..8 — drawings
for n, (img, title, note) in enumerate([
    ("sheet-1.png", "חזית וחתך כללי – 1:25", "מפתח החתכים: A-A אנכי דרך הזיגוג, B-B אופקי בגובה +1.50."),
    ("sheet-2.png", "פרטים 1–2: חתך A-A דרך עמוד הפלדה – ראש ובסיס – 1:5",
     "החתך עובר דרך עמוד הפלדה. בראש: פלטת ראש מעוגנת בברגים כימיים לקורה. בבסיס: פלטת בסיס על גראוט וברגי עיגון, מכוסה בבטון מתחת לריצוף."),
    ("sheet-3.png", "פרט 3: חתך B-B אופקי – עמוד ומזוזות – 1:5",
     "מרווח 1 ס\"מ בין העמוד למזוזה: שימס, בורג קודח עצמי לפלדה ופרופיל גב + סיליקון משני הצדדים."),
    ("sheet-4.png", "פרט 4: חתך A-A – מעקה וקופינג – 1:5",
     "גובה מעקה כולל 1.05 מ' מעל ריצוף המרפסת; קופינג טיח בשיפוע פנימה כדי שהמים לא ילכלכו את החזית."),
], start=5):
    s = slide(title, n)
    pic(s, OUT / img, Inches(0.4), Inches(1.2), Inches(12.5), Inches(5.3))
    textbox(s, Inches(0.4), Inches(6.5), Inches(12.5), Inches(0.6), [note], 14, color=MUTED)

# 9 — 3D
s = slide("מודל תלת-ממדי", 9)
pic(s, OUT / "iso-assembled.png", Inches(0.4), Inches(1.2), Inches(6.2), Inches(5.8))
pic(s, P["elev-rail"], Inches(6.9), Inches(1.2), Inches(3.0), Inches(5.8))
textbox(s, Inches(10.0), Inches(1.3), Inches(2.9), Inches(5.6), [
    "השוואה למצב הקיים",
    "המודל נבנה ב-AutoCAD (קובץ 3D נפרד) מאותן מידות של החתכים.",
    "ניתן לסובב אותו (3DORBIT) ולחתוך (SECTIONPLANE).",
], 15, bold_first=True)

# 10 — sequence
s = slide("סדר הרכבה – מי, איפה ומתי", 10)
steps = [
    ("שלד", "יציקת קורת יסוד עם ברגי עיגון; הצבת עמודי פלדה וגראוט; יציקת קורה, תקרה ומעקה בטפסות קרשים.", "קבלן שלד + מסגר – מסגרייה ואתר"),
    ("בניה", "הנחת סף, עיגון משקוף עיוור פלדה מגולוונת למפתח; איטום ביטומני במרפסת.", "קבלן ראשי – באתר"),
    ("מעטפת", "ייצור מסגרות האלומיניום והזיגוג במפעל לפי מידות מפתח מדודות; התקנה, פילוס בשימס ועיגון.", "קבלן אלומיניום – מפעל + אתר"),
    ("גמר", "טיח צמנטי + שליכט התזה, צבע לעמודים ולתחתית הקורה, סיליקון היקפי, ריצוף חוץ.", "טייח, צבע, רצף – באתר"),
    ("מעקה", "צינורות פלדה מגולוונים מיוצרים במסגרייה ומורכבים על פלטות עם ברגים כימיים.", "מסגר – מסגרייה + אתר"),
]
for i, (k, d, who) in enumerate(steps):
    y = Inches(1.3 + i * 1.05)
    box = s.shapes.add_shape(1, Inches(11.3), y, Inches(1.6), Inches(0.9))
    box.fill.solid(); box.fill.fore_color.rgb = ACCENT; box.line.fill.background()
    tf = box.text_frame; tf.text = f"{i + 1}. {k}"; rtl(tf.paragraphs[0], 18, True, RGBColor(255, 255, 255), PP_ALIGN.CENTER)
    textbox(s, Inches(3.6), y, Inches(7.5), Inches(0.9), [d], 15)
    textbox(s, Inches(0.4), y, Inches(3.1), Inches(0.9), [who], 14, color=MUTED)
textbox(s, Inches(0.4), Inches(6.55), Inches(12.5), Inches(0.4),
        ["רוב העבודה ידנית ובאתר (\"רטובה\"); רק האלומיניום והפלדה מיוצרים מראש – לכן הסבולות נסגרות בסיליקון ובטיח."], 14, color=MUTED)

# 11 — observations
s = slide("תצפיות באתר: בלאי ונקודות תורפה", 11)
pic(s, P["soffit"], Inches(0.4), Inches(1.3), Inches(3.0), Inches(5.6))
pic(s, P["junction"], Inches(3.55), Inches(1.3), Inches(3.0), Inches(5.6))
textbox(s, Inches(6.8), Inches(1.3), Inches(6.1), Inches(5.6), [
    "מה מספר הפרט על עצמו?",
    "• מריחות סיליקון לבן ומילוי חוזר במפגש עמוד-מסגרת – תיקוני איטום חוזרים.",
    "• צבע מתקלף ושאריות טיח על העמוד – ביצוע הגמר אחרי התקנת המסגרות, בלי הגנה.",
    "• תחתית הקורה שומרת את טביעת הקרשים המקורית – הטיח החדש לא הגיע אליה.",
    "• המסגרת \"נשענת\" על השלד: אין כיסוי למרווח – התנועה בין פלדה לאלומיניום נלקחת ע\"י הסיליקון בלבד.",
    "• הצעה: פרופיל כיסוי (פלאשינג) מאלומיניום במפגש עם הקורה והעמוד.",
], 16, bold_first=True)

# 12 — assumptions / conclusions
s = slide("הנחות, אימות ומסקנות", 12)
textbox(s, Inches(6.8), Inches(1.3), Inches(6.1), Inches(5.6), [
    "הנחות שיש לאמת באתר",
    "• חתך עמוד הפלדה (300/250/10) ומידות פלטות הבסיס והראש – מדידה ובדיקה בתוכניות.",
    "• מידות פרופיל האלומיניום (~45/100 מ\"מ) ועובי הזכוכית – מדידה בסרגל/קליבר.",
    "• עומק הקורה ומפלס המרפסת – ספירת שורות ריצוף/מדידה מהמרפסת.",
    "• קיום משקוף עיוור – נראה מבעד לתיקוני הסיליקון; לאמת בתוכניות הארכיון.",
], 16, bold_first=True)
textbox(s, Inches(0.4), Inches(1.3), Inches(6.1), Inches(5.6), [
    "מסקנות",
    "• הפרט הוא מפגש בין \"כבד\" ל\"קל\": שלד בטון יצוק באתר ועמודי פלדה, מול מערכת אלומיניום מתועשת.",
    "• כל הסבולות נבלעות בשכבות הגמר – ולכן שם מופיעים הכשלים.",
    "• הקורה העמוקה היא פתרון אקלימי ומבני בו-זמנית: מצחייה, מעקה ונשיאת התקרה.",
    "מקורות",
    "• Allen & Iano, Fundamentals of Building Construction",
    "• Deplazes (ed.), Constructing Architecture",
    "• ת\"י 1068 – חלונות אלומיניום; ת\"י 1142 – מעקות",
], 16, bold_first=True)

prs.save(OUT / "מצגת-ניתוח-פרט.pptx")
print("saved")
