"""Injects data/ncr-geo.json into scripts/app_template.html and writes index.html.
Run from the repo root:  python scripts/build_app.py
"""
template = open("scripts/app_template.html", encoding="utf-8").read()
geo = open("data/ncr-geo.json", encoding="utf-8").read()
open("index.html", "w", encoding="utf-8").write(template.replace("__GEO__", geo))
print("index.html written")
