# python
from pathlib import Path
import sys
import re
import html
import markdown

def md_to_html_dir(dir_path: Path):
    if not dir_path.exists() or not dir_path.is_dir():
        print(f"directory not found: {dir_path}")
        return
    for md in sorted(dir_path.glob("*.md")):
        text = md.read_text(encoding="utf-8")
        m = re.search(r'^\s*#\s+(.+)$', text, re.M)
        title = m.group(1).strip() if m else md.stem
        body = markdown.markdown(text, extensions=["extra", "toc"])
        out = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{html.escape(title)}</title>
</head>
<body>
{body}
</body>
</html>"""
        out_path = md.with_suffix(".html")
        out_path.write_text(out, encoding="utf-8")
        print(f"wrote {out_path}")

if __name__ == "__main__":
    p = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("./logs")
    md_to_html_dir(p)
