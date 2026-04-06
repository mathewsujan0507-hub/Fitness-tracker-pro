# FitTrack Pro

Static fitness tracker app (HTML/CSS/JS) with planner, session timer, analytics, and offline-friendly storage via `localStorage`.

## Run
- Open `login.html` (recommended) in a browser.
- Create an account, then use Library → Planner → Session.

## Docs (DOCX + Markdown)
Markdown docs live in `docs/`:
- `docs/PROJECT_OVERVIEW.md` (detailed)
- `docs/PROJECT_OVERVIEW_SHORT.md` (short)

To generate DOCX versions:

```bash
pip install -r requirements.txt
python scripts/generate_docx.py
```

Outputs:
- `docs/FitTrack-Pro_Detailed.docx`
- `docs/FitTrack-Pro_Short.docx`

