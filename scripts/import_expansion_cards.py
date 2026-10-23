"""Crop the expansion cast sheets into single tarot cards.

The cast sheets are one 1024x1536 image holding six cards in three columns and
two rows. The image model never draws lettering, so this script prints the name
into the empty cartouche with Georgia, exactly like build_oracle_cards.py.

Card boundaries are read from the sheet itself, because a generated sheet drifts
a few pixels from the reference grid. The reference grid is the fallback.
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageStat

ROOT = Path(__file__).resolve().parents[1]
SHEETS = ROOT / "assets" / "cards" / "sheets"
OUTPUTS = [ROOT / "public" / "cards", ROOT / "assets" / "cards" / "individual"]
PREVIEW = ROOT / "assets" / "cards" / "previews"
SPEC = ROOT / "assets" / "cards" / "expansion-cast.json"
FONT_PATH = Path(r"C:\Windows\Fonts\georgia.ttf")
CARD_SIZE = (512, 1152)

# Fallback grid measured on oracle-cast-01.png in 1024x1536 space.
REFERENCE_GRID = {
    "rows": [(8, 745), (753, 1510)],
    "cols": [(8, 340), (346, 678), (684, 1017)],
}


def _bands(profile: list[float], threshold: float) -> list[tuple[int, int]]:
    """Split a background profile into the spans that carry content."""
    bands: list[tuple[int, int]] = []
    start: int | None = None
    for index, value in enumerate(profile):
        busy = value > threshold
        if busy and start is None:
            start = index
        elif not busy and start is not None:
            bands.append((start, index))
            start = None
    if start is not None:
        bands.append((start, len(profile)))
    return [(a, b) for a, b in bands if b - a > 40]


def detect_grid(sheet: Image.Image) -> dict[str, list[tuple[int, int]]]:
    grey = sheet.convert("L")
    width, height = grey.size
    # A gutter is flat dark background: low mean brightness and low variance.
    stat = ImageStat.Stat(grey)
    base = stat.mean[0]
    corner = grey.crop((0, 0, 24, 24))
    background = ImageStat.Stat(corner).mean[0]
    col_profile = []
    for x in range(width):
        column = grey.crop((x, 0, x + 1, height))
        col_profile.append(ImageStat.Stat(column).stddev[0])
    row_profile = []
    for y in range(height):
        row = grey.crop((0, y, width, y + 1))
        row_profile.append(ImageStat.Stat(row).stddev[0])
    threshold = max(6.0, min(col_profile) + 4.0)
    cols = _bands(col_profile, threshold)
    rows = _bands(row_profile, threshold)
    if len(cols) != 3 or len(rows) != 2:
        print(f"  grid detection fell back to reference (cols={len(cols)}, rows={len(rows)}, base={base:.1f}, bg={background:.1f})")
        return REFERENCE_GRID
    return {"rows": rows, "cols": cols}


def add_name(card: Image.Image, name: str) -> Image.Image:
    card = card.convert("RGB")
    draw = ImageDraw.Draw(card)
    max_width = 385
    size = 34
    font = ImageFont.truetype(str(FONT_PATH), size)
    while size > 18:
        font = ImageFont.truetype(str(FONT_PATH), size)
        if draw.textbbox((0, 0), name.upper(), font=font)[2] <= max_width:
            break
        size -= 1
    box = draw.textbbox((0, 0), name.upper(), font=font)
    x = (card.width - (box[2] - box[0])) / 2
    y = 1041 - box[1]
    draw.text((x, y), name.upper(), font=font, fill=(75, 54, 36))
    return card


def main() -> None:
    spec = json.loads(SPEC.read_text(encoding="utf-8"))
    by_sheet: dict[str, list[dict]] = {}
    for card in spec["cards"]:
        by_sheet.setdefault(card["sheet"], []).append(card)

    for output in OUTPUTS:
        output.mkdir(parents=True, exist_ok=True)
    PREVIEW.mkdir(parents=True, exist_ok=True)

    made: list[Path] = []
    for sheet_name, entries in sorted(by_sheet.items()):
        path = SHEETS / sheet_name
        if not path.exists():
            print(f"MISSING SHEET {sheet_name}")
            continue
        sheet = Image.open(path)
        grid = detect_grid(sheet)
        print(f"{sheet_name}: {sheet.size} rows={grid['rows']} cols={grid['cols']}")
        for card in entries:
            row, col = card["slot"]
            y0, y1 = grid["rows"][row]
            x0, x1 = grid["cols"][col]
            crop = sheet.crop((x0, y0, x1, y1)).resize(CARD_SIZE, Image.Resampling.LANCZOS)
            crop = add_name(crop, card["name"])
            for output in OUTPUTS:
                target = output / f"{card['id']}.png"
                crop.save(target, optimize=True)
                made.append(target)
            print(f"  {card['id']:<10} <- {x0},{y0},{x1},{y1}")

    if made:
        columns = 8
        thumb = (112, 252)
        gutter = 8
        rows = (len(made) + columns - 1) // columns
        sheet_preview = Image.new(
            "RGB",
            (columns * thumb[0] + (columns + 1) * gutter, rows * thumb[1] + (rows + 1) * gutter),
            (39, 44, 38),
        )
        public_cards = OUTPUTS[0]
        for index, path in enumerate(sorted(p.name for p in made if p.parent == public_cards)):
            image = Image.open(public_cards / path).convert("RGB").resize(thumb, Image.Resampling.LANCZOS)
            x = gutter + (index % columns) * (thumb[0] + gutter)
            y = gutter + (index // columns) * (thumb[1] + gutter)
            sheet_preview.paste(image, (x, y))
        out = PREVIEW / "oracle-expansion-cast.png"
        sheet_preview.save(out, optimize=True)
        print(f"preview {out}")

    print(f"wrote {len(made)} files")


if __name__ == "__main__":
    main()
