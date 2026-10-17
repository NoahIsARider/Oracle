from pathlib import Path
import json

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SHEETS = ROOT / "assets" / "cards" / "sheets"
OUTPUT = ROOT / "assets" / "cards" / "individual"
VARIANT_OUTPUT = ROOT / "assets" / "cards" / "variants"
PREVIEW_OUTPUT = ROOT / "assets" / "cards" / "previews"
FONT_PATH = Path(r"C:\Windows\Fonts\georgia.ttf")
CARD_SIZE = (512, 1152)

# Generated sheets have three equal columns and two rows. Crops retain the
# complete illustrated card, including its parchment edge and decorative frame.
GRID = {
    "top": (8, 745),
    "bottom": (753, 1510),
    "left": (8, 340),
    "middle": (346, 678),
    "right": (684, 1017),
}

CAST = [
    ("oracle-cast-01.png", "top", "left", "apollo"),
    ("oracle-cast-01.png", "top", "middle", "athena"),
    ("oracle-cast-01.png", "top", "right", "aphrodite"),
    ("oracle-cast-01.png", "bottom", "left", "hades"),
    ("oracle-cast-01.png", "bottom", "middle", "oedipus"),
    ("oracle-cast-01.png", "bottom", "right", "medea"),
    ("oracle-cast-numbered-source.png", "top", "right", "persephone"),
    ("oracle-cast-02-variant.png", "top", "left", "zeus"),
    ("oracle-cast-02-variant.png", "top", "middle", "poseidon"),
    ("oracle-cast-02-variant.png", "top", "right", "artemis"),
    ("oracle-cast-02-variant.png", "bottom", "left", "dionysus"),
    ("oracle-cast-02-variant.png", "bottom", "middle", "ajax"),
    ("oracle-cast-02-variant.png", "bottom", "right", "cassandra"),
    ("oracle-cast-03.png", "top", "left", "demeter"),
    ("oracle-cast-03.png", "top", "middle", "hermes"),
    ("oracle-cast-03.png", "top", "right", "ares"),
    ("oracle-cast-03.png", "bottom", "left", "hestia"),
    ("oracle-cast-03.png", "bottom", "middle", "odysseus"),
    ("oracle-cast-03.png", "bottom", "right", "penelope"),
    ("oracle-cast-04.png", "top", "left", "hera"),
    ("oracle-cast-04.png", "top", "middle", "hephaestus"),
    ("oracle-cast-04.png", "top", "right", "heracles"),
    ("oracle-cast-04.png", "bottom", "left", "iphigenia"),
    ("oracle-cast-04.png", "bottom", "middle", "electra"),
    ("oracle-cast-04.png", "bottom", "right", "orpheus"),
]

ALL_GENERATED_CARDS = [
    ("oracle-cast-numbered-source.png", "top", "left", "apollo"),
    ("oracle-cast-numbered-source.png", "top", "middle", "athena"),
    ("oracle-cast-numbered-source.png", "top", "right", "persephone"),
    ("oracle-cast-numbered-source.png", "bottom", "left", "hades"),
    ("oracle-cast-numbered-source.png", "bottom", "middle", "hestia"),
    ("oracle-cast-numbered-source.png", "bottom", "right", "medea"),
    ("oracle-cast-01.png", "top", "left", "apollo"),
    ("oracle-cast-01.png", "top", "middle", "athena"),
    ("oracle-cast-01.png", "top", "right", "aphrodite"),
    ("oracle-cast-01.png", "bottom", "left", "hades"),
    ("oracle-cast-01.png", "bottom", "middle", "oedipus"),
    ("oracle-cast-01.png", "bottom", "right", "medea"),
    ("oracle-cast-02.png", "top", "left", "zeus"),
    ("oracle-cast-02.png", "top", "middle", "poseidon"),
    ("oracle-cast-02.png", "top", "right", "artemis"),
    ("oracle-cast-02.png", "bottom", "left", "dionysus"),
    ("oracle-cast-02.png", "bottom", "middle", "oedipus"),
    ("oracle-cast-02.png", "bottom", "right", "cassandra"),
    ("oracle-cast-02-variant.png", "top", "left", "zeus"),
    ("oracle-cast-02-variant.png", "top", "middle", "poseidon"),
    ("oracle-cast-02-variant.png", "top", "right", "artemis"),
    ("oracle-cast-02-variant.png", "bottom", "left", "dionysus"),
    ("oracle-cast-02-variant.png", "bottom", "middle", "ajax"),
    ("oracle-cast-02-variant.png", "bottom", "right", "cassandra"),
    ("oracle-cast-03.png", "top", "left", "demeter"),
    ("oracle-cast-03.png", "top", "middle", "hermes"),
    ("oracle-cast-03.png", "top", "right", "ares"),
    ("oracle-cast-03.png", "bottom", "left", "hestia"),
    ("oracle-cast-03.png", "bottom", "middle", "odysseus"),
    ("oracle-cast-03.png", "bottom", "right", "penelope"),
    ("oracle-cast-04.png", "top", "left", "hera"),
    ("oracle-cast-04.png", "top", "middle", "hephaestus"),
    ("oracle-cast-04.png", "top", "right", "heracles"),
    ("oracle-cast-04.png", "bottom", "left", "iphigenia"),
    ("oracle-cast-04.png", "bottom", "middle", "electra"),
    ("oracle-cast-04.png", "bottom", "right", "orpheus"),
]


def crop_card(sheet: Image.Image, row: str, col: str) -> Image.Image:
    x0, x1 = GRID[col]
    y0, y1 = GRID[row]
    return sheet.crop((x0, y0, x1, y1)).resize(CARD_SIZE, Image.Resampling.LANCZOS)


def remove_top_numeral(card: Image.Image, blank_reference: Image.Image) -> Image.Image:
    """Replace only the inner top cartouche with matching blank parchment."""
    card = card.convert("RGB")
    blank_reference = blank_reference.convert("RGB")
    mask = Image.new("L", card.size, 0)
    draw = ImageDraw.Draw(mask)
    # The center of the plaque is kept inside the etched outline.
    draw.rounded_rectangle((202, 20, 310, 79), radius=24, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(1.0))
    card.paste(blank_reference.crop((202, 20, 310, 79)), (202, 20), mask.crop((202, 20, 310, 79)))
    return card


def add_name(card: Image.Image, name: str) -> Image.Image:
    card = card.convert("RGB")
    draw = ImageDraw.Draw(card)
    max_width = 385
    size = 34
    while size > 18:
        font = ImageFont.truetype(str(FONT_PATH), size)
        if draw.textbbox((0, 0), name.upper(), font=font)[2] <= max_width:
            break
        size -= 1
    box = draw.textbbox((0, 0), name.upper(), font=font)
    text_width = box[2] - box[0]
    x = (card.width - text_width) / 2
    # Place names in the middle of the lower cartouche, one line-height above
    # the previous baseline so they do not sit against its lower ornament.
    y = 1041 - box[1]
    draw.text((x, y), name.upper(), font=font, fill=(75, 54, 36))
    return card


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    VARIANT_OUTPUT.mkdir(parents=True, exist_ok=True)
    PREVIEW_OUTPUT.mkdir(parents=True, exist_ok=True)
    cache: dict[str, Image.Image] = {}
    blank_reference = crop_card(Image.open(SHEETS / "oracle-cast-01.png").convert("RGB"), "top", "middle")

    variant_counts: dict[str, int] = {}
    for sheet_name, row, col, character in ALL_GENERATED_CARDS:
        if sheet_name not in cache:
            cache[sheet_name] = Image.open(SHEETS / sheet_name).convert("RGB")
        card = crop_card(cache[sheet_name], row, col)
        if sheet_name == "oracle-cast-numbered-source.png":
            card = remove_top_numeral(card, blank_reference)
        card = add_name(card, character)
        variant_counts[character] = variant_counts.get(character, 0) + 1
        variant_index = variant_counts[character]
        card.save(VARIANT_OUTPUT / f"{character}-variant-{variant_index:02}.png", optimize=True)

    cache.clear()
    for sheet_name, row, col, character in CAST:
        if sheet_name not in cache:
            cache[sheet_name] = Image.open(SHEETS / sheet_name).convert("RGB")
        card = crop_card(cache[sheet_name], row, col)
        if character == "persephone":
            card = remove_top_numeral(card, blank_reference)
        card = add_name(card, character)
        card.save(OUTPUT / f"{character}.png", optimize=True)

    manifest = {
        "title": "Oracle Character Tarot",
        "card_count": len(CAST),
        "card_size": {"width": CARD_SIZE[0], "height": CARD_SIZE[1]},
        "cards": [
            {"id": character, "name": character.replace("-", " ").title(), "file": f"individual/{character}.png"}
            for _, _, _, character in CAST
        ],
    }
    (ROOT / "assets" / "cards" / "card-manifest.json").write_text(
        json.dumps(manifest, indent=2), encoding="utf-8"
    )

    columns = 5
    thumb_size = (156, 351)
    gutter = 14
    preview = Image.new(
        "RGB",
        (columns * thumb_size[0] + (columns + 1) * gutter,
         5 * thumb_size[1] + 6 * gutter),
        (39, 44, 38),
    )
    for index, (_, _, _, character) in enumerate(CAST):
        card = Image.open(OUTPUT / f"{character}.png").convert("RGB")
        card = card.resize(thumb_size, Image.Resampling.LANCZOS)
        x = gutter + (index % columns) * (thumb_size[0] + gutter)
        y = gutter + (index // columns) * (thumb_size[1] + gutter)
        preview.paste(card, (x, y))
    preview.save(PREVIEW_OUTPUT / "oracle-25-character-cards.png", optimize=True)

    print(f"Created {len(CAST)} final cards, {len(ALL_GENERATED_CARDS)} source variants, and a catalog preview.")


if __name__ == "__main__":
    main()
