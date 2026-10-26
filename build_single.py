"""Bundle index.html + assets into one self-contained file (dist/portfolio.html).
Usage: python build_single.py"""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent
html = (root / "index.html").read_text(encoding="utf-8")
css = (root / "style.css").read_text(encoding="utf-8")
coast = (root / "coast-data.js").read_text(encoding="utf-8")
main = (root / "main.js").read_text(encoding="utf-8")
html = html.replace('<link rel="stylesheet" href="style.css">', f"<style>\n{css}</style>")
html = html.replace('<script src="coast-data.js" defer></script>\n', "")
html = html.replace('<script src="main.js" defer></script>\n', "")
html = html.replace("</body>", f"<script>\n{coast}\n{main}</script>\n</body>")
out = root / "dist" / "portfolio.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding="utf-8")
print("wrote", out, len(html), "bytes")
