"""Régénère la liste des fichiers gardés hors connexion dans sw.js.
À lancer depuis le dossier builder-40k après avoir ajouté ou renommé des fichiers :
    python outils/maj-sw.py
(Facultatif : sans ça, un nouveau fichier est quand même gardé dès sa première ouverture en ligne.)"""
import os, json, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {".git", "outils", ".github"}
SKIP = lambda f: f.startswith(".") or "sauvegarde" in f or f.endswith((".py", ".md", ".txt", ".zip")) or f == "sw.js"
files = ["./"]
for d, dirs, fs in os.walk(ROOT):
    dirs[:] = sorted(x for x in dirs if x not in SKIP_DIRS)
    for f in sorted(fs):
        if not SKIP(f):
            files.append(os.path.relpath(os.path.join(d, f), ROOT).replace(os.sep, "/"))
version = datetime.datetime.now().strftime("%Y%m%d-%H%M")
tpl = open(os.path.join(ROOT, "outils", "sw-modele.js"), encoding="utf-8").read()
out = tpl.replace("__VERSION__", version).replace("__FILES__", json.dumps(files, ensure_ascii=False, indent=2))
open(os.path.join(ROOT, "sw.js"), "w", encoding="utf-8").write(out)
print(f"sw.js : {len(files)} fichiers, version {version}")
