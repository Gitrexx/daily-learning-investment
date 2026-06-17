#!/usr/bin/env python3
"""Regenerate content/manifest.json from the content/*.md files.

For each content/YYYY-MM-DD.md file:
  - date  = the filename (without .md)
  - title = the first markdown "# heading", else the date
Entries are sorted newest first so the page defaults to the latest date.

Run locally with:  python3 scripts/build_manifest.py
"""

import json
import re
from pathlib import Path

CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"
MANIFEST = CONTENT_DIR / "manifest.json"
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def title_for(md_path: Path) -> str:
    for line in md_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line.startswith("# "):
            return line[2:].strip()
    return md_path.stem


def main() -> None:
    entries = []
    for md in sorted(CONTENT_DIR.glob("*.md")):
        if not DATE_RE.match(md.stem):
            # Skip files that aren't named YYYY-MM-DD.
            continue
        entries.append({
            "date": md.stem,
            "file": md.name,
            "title": title_for(md),
        })

    # Newest first.
    entries.sort(key=lambda e: e["date"], reverse=True)

    MANIFEST.write_text(
        json.dumps(entries, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {MANIFEST} with {len(entries)} entr"
          f"{'y' if len(entries) == 1 else 'ies'}.")


if __name__ == "__main__":
    main()
