# ניתוח טכנולוגי – חזית זיגוג, עמוד וקורת שפה (טכניון)

טכנולוגיות בניה 2 | תרגיל חקר 1 – Reverse Engineering

## קבצים (`out/`)
| קובץ | תוכן |
|---|---|
| `storefront-detail.dxf` | קובץ AutoCAD 2D: חזית, חתך כללי ו-4 פרטים, ב-4 גיליונות A3 (Layouts: SHEET-1..4) |
| `storefront-detail-3D.dxf` | מודל תלת-ממדי (Mesh) – לפתוח ב-AutoCAD ולסובב עם 3DORBIT |
| `storefront-detail-sheets.pdf` | הדפסת 4 הגיליונות |
| `מצגת-ניתוח-פרט.pptx` / `.pdf` | מצגת 12 שקפים בעברית (~5 דק') |
| `iso-*.png`, `sheet-*.png` | תמונות לשימוש במצגת |

## הערות לעבודה ב-AutoCAD
- יחידות: מ"מ במודל; מידות מוצגות בס"מ; גיליונות בקנ"מ 1:25 ו-1:5 דרך Viewports.
- שכבות: `A-CUT` (חתוך), `A-BEYOND` (מבט), `A-ALUM`, `A-GLASS`, `A-STEEL`, `A-SEAL`, `A-DIM`, `A-TEXT` ועוד.
- הטקסט העברי שמור בסדר חזותי (הפוך) כדי שיוצג נכון ב-AutoCAD. אם בגרסה שלך הוא מופיע הפוך – זו הסיבה.
- לשמירה כ-DWG: `SAVEAS` → AutoCAD Drawing.

## הנחות לאימות באתר
מידות הפרופילים, עובי הזכוכית, חתך עמוד הפלדה ופלטות הבסיס והראש, עומק הקורה ומפלס המרפסת הוערכו מהתמונות.

## בנייה מחדש
`pip install ezdxf matplotlib python-bidi python-pptx pillow`
`python3 build_drawings.py && python3 build_presentation.py`

## תרגיל 2 – Re-engineering (`out-ex2/`)
מניפולציה: עמוד הפלדה וחלון האלומיניום הוחלפו בעץ למינציה, והחיבורים שונו לפלטות פלדה נסתרות
(להבים ודיבלים בעמוד, פלטות T וזוויות בחריצים במסגרת), עם סרט איטום מתפשח וסרגלי כיסוי מעץ במקום סיליקון.
- `ex2-timber.dxf` – 4 גיליונות A3: חזית וחתך 1:25, חתכי A-A ראש/סף 1:5, חתך B-B אופקי 1:5, חתך C-C חיבורי העמוד 1:5
- `ex2-timber-3D.dxf`, `ex2-timber-sheets.pdf`, `מצגת-תרגיל-2.pptx`
- בנייה: `python3 build_ex2.py && python3 build_presentation_ex2.py`
