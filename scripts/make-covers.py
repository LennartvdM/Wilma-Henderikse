#!/usr/bin/env python3
"""Render page 1 of every publication PDF to a small WebP cover + write PDF metadata.

    python3 scripts/make-covers.py            # only PDFs without a cover yet
    python3 scripts/make-covers.py --force    # re-render everything

Needs poppler (pdftoppm, pdfinfo) and Pillow. Output:
    public/covers/<pdf-name-without-.pdf>.webp
    src/data/pdf-meta.json   { "<file>.pdf": { "pages": 63, "bytes": 1946867 } }
A cover can be overridden by dropping a hand-picked image at the same path and
skipping --force. CROP takes the front half of a cover rendered as a spread.
"plain" marks a bare title page (no colour) — the site draws its own cover for those.
"""
import json, os, subprocess, sys, tempfile
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDFS = os.path.join(ROOT, 'public', 'wp-content', 'uploads', 'publications')
OUT = os.path.join(ROOT, 'public', 'covers')
META = os.path.join(ROOT, 'src', 'data', 'pdf-meta.json')
WIDTH = 480
# page 1 is a back+front spread: keep the front (right) half, or the middle
CROP = {
    '101-vragen-over-vrouwen-en-techniek.pdf': 'right',
    'alle-troeven-in-handen-veelbelovende-initiatieven-voor-emancipatie-en-participatie.pdf': 'right',
    'dealing-with-an-ageing-labour-force-what-do-european-employers-expect-and-do.pdf': 'right',
    'sleutels-tot-succes-hoe-organisaties-de-deur-naar-de-top-voor-vrouwen-kunnen-openen.pdf': 'right',
    'sleutels_tot_succes_vdh.pdf': 'right',
    'werken-aan-gelijke-kansen-en-non-discriminatie.pdf': 'right',
    'working-and-ageing-do-european-employers-support-longer-working-lives-cedefob.pdf': 'right',
    'scherven-brengen-geluk.pdf': 'center',
}

force = '--force' in sys.argv
os.makedirs(OUT, exist_ok=True)
meta = {}
for name in sorted(os.listdir(PDFS)):
    if not name.lower().endswith('.pdf'):
        continue
    path = os.path.join(PDFS, name)
    info = subprocess.run(['pdfinfo', path], capture_output=True, text=True).stdout
    pages = next((int(l.split()[-1]) for l in info.splitlines() if l.startswith('Pages:')), None)
    target = os.path.join(OUT, name[:-4] + '.webp')
    if force or not os.path.exists(target):
        with tempfile.TemporaryDirectory() as tmp:
            subprocess.run(['pdftoppm', '-f', '1', '-l', '1', '-scale-to-x', str(WIDTH * 4),
                            '-scale-to-y', '-1', '-png', path, os.path.join(tmp, 'p')], check=True)
            png = os.path.join(tmp, sorted(os.listdir(tmp))[0])
            im = Image.open(png).convert('RGB')
            w, h = im.size
            crop = CROP.get(name)
            if crop == 'right':
                im = im.crop((w // 2, 0, w, h))
            elif crop == 'center':
                im = im.crop((w // 4, 0, w - w // 4, h))
            im.thumbnail((WIDTH, WIDTH * 2), Image.LANCZOS)
            im.save(target, 'WEBP', quality=80, method=6)
        print('cover', name)
    im = Image.open(target)
    sat = sum(p[1] for p in im.convert('HSV').resize((60, 80)).getdata()) / (60 * 80)
    meta[name] = {'pages': pages, 'bytes': os.path.getsize(path),
                  'cover': {'w': im.width, 'h': im.height, 'plain': sat < 2}}

with open(META, 'w') as f:
    json.dump(meta, f, indent=2, ensure_ascii=False)
    f.write('\n')
print(f'{len(meta)} pdfs → {os.path.relpath(META, ROOT)}')
