"""
Makes the web images for one project card: the photo, and a blueprint version of the
same photo (light lines on blueprint blue). Both come from one source file, so they line
up exactly for the wipe on the Selected Work cards.

    pip install opencv-python-headless pillow
    python3 tools/blueprint.py photos/chicago-residential.jpg chicago-residential

Writes to src/assets/img/work/:
    <name>-1600.webp, <name>-900.webp                  the photo
    <name>-blueprint-1600.webp, <name>-blueprint-900.webp
"""

import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "img" / "work"
WIDTHS = (1600, 900)
GROUND = (18, 53, 94)      # blueprint blue
LINE = (220, 235, 250)     # pale line colour
GRID_EVERY = 48


def edges(rgb):
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
    gray = cv2.bilateralFilter(gray, 7, 40, 40)
    median = float(np.median(gray))
    lo, hi = int(max(0, 0.66 * median)), int(min(255, 1.33 * median))
    found = cv2.Canny(gray, lo, hi, L2gradient=True)
    found = cv2.dilate(found, np.ones((2, 2), np.uint8), iterations=1)
    return cv2.GaussianBlur(found, (3, 3), 0).astype(np.float32) / 255.0


def blueprint(rgb):
    h, w = rgb.shape[:2]
    base = np.zeros((h, w, 3), np.float32) + GROUND
    grid = np.zeros((h, w), np.float32)
    grid[::GRID_EVERY, :] = 0.08
    grid[:, ::GRID_EVERY] = 0.08
    strength = np.clip(edges(rgb) * 0.9 + grid, 0, 1)[..., None]
    out = base * (1 - strength) + np.array(LINE, np.float32) * strength
    return out.clip(0, 255).astype(np.uint8)


def save(img, name):
    OUT.mkdir(parents=True, exist_ok=True)
    for width in WIDTHS:
        if img.width < width:
            continue
        height = round(img.height * width / img.width)
        img.resize((width, height), Image.LANCZOS).save(OUT / f"{name}-{width}.webp", quality=82, method=6)
        print(f"  {name}-{width}.webp")


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    source, name = Path(sys.argv[1]), sys.argv[2]
    photo = Image.open(source).convert("RGB")
    if photo.width < 1600:
        print(f"note: {source.name} is {photo.width}px wide, 1600px or more looks better")
    rgb = np.array(photo)
    save(photo, name)
    save(Image.fromarray(blueprint(rgb)), f"{name}-blueprint")


if __name__ == "__main__":
    main()
