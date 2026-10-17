from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
GEN = Path(r"C:\Users\Lenovo\.codex\generated_images\01a14874-78c1-7061-bf3c-ce9a92c8657c")
FONT = Path(r"C:\Windows\Fonts\georgia.ttf")


def crop_grid(source_name: str, output_dir: Path, names: list[str], columns: int, rows: int, size: tuple[int, int], inset: int = 0):
    source = Image.open(GEN / source_name).convert("RGBA")
    output_dir.mkdir(parents=True, exist_ok=True)
    width, height = source.size
    for index, name in enumerate(names):
        col, row = index % columns, index // columns
        x0, x1 = round(col * width / columns), round((col + 1) * width / columns)
        y0, y1 = round(row * height / rows), round((row + 1) * height / rows)
        if inset:
            x0, x1, y0, y1 = x0 + inset, x1 - inset, y0 + inset, y1 - inset
        tile = source.crop((x0, y0, x1, y1))
        tile = tile.resize(size, Image.Resampling.LANCZOS)
        tile.save(output_dir / name, optimize=True)


def crop_minor_sheet():
    source = Image.open(GEN / "exec-6e4a8e58-1e1b-4672-9520-da0194597194.png").convert("RGBA")
    output = ROOT / "public" / "minor"
    output.mkdir(parents=True, exist_ok=True)
    # This sheet's cards occupy x=0..984 and the rest is a blank white margin.
    # The three columns and two rows are exact, edge-to-edge 328x665 cells.
    # Cropping the active sheet area first prevents white gutters or a sliver
    # of the neighboring card from entering any exported image.
    width, height = 984, source.height
    source = source.crop((0, 0, width, height))
    boxes = []
    for row in range(2):
        for col in range(3):
            boxes.append((round(col * width / 3), round(row * height / 2),
                          round((col + 1) * width / 3), round((row + 1) * height / 2)))
    names = ["ace-wands.png", "two-cups.png", "three-swords.png", "four-pentacles.png", "six-cups.png", "seven-wands.png"]
    for box, name in zip(boxes, names):
        card = source.crop(box).resize((512, 1152), Image.Resampling.LANCZOS).convert("RGB")
        draw_name(card, name.removesuffix(".png").replace("-", " "))
        card.save(output / name, optimize=True)


def draw_name(card: Image.Image, name: str):
    draw = ImageDraw.Draw(card)
    font_size = 34
    while font_size > 18:
        font = ImageFont.truetype(str(FONT), font_size)
        if draw.textbbox((0, 0), name.upper(), font=font)[2] <= 385:
            break
        font_size -= 1
    box = draw.textbbox((0, 0), name.upper(), font=font)
    x = (card.width - (box[2] - box[0])) / 2
    draw.text((x, 1041 - box[1]), name.upper(), font=font, fill=(75, 54, 36))


def main():
    crop_minor_sheet()
    skins = ["apollo-cyberpunk.png", "athena-wasteland.png", "hades-cyberpunk.png", "medea-wasteland.png", "hermes-cyberpunk.png", "cassandra-wasteland.png"]
    crop_grid("exec-19490cd5-5c31-443a-ae85-3fa1e4db25c3.png", ROOT / "public" / "skins", [
        *skins,
    ], 3, 2, (512, 1152), 2)
    for filename in skins:
        image_path = ROOT / "public" / "skins" / filename
        card = Image.open(image_path).convert("RGB")
        draw_name(card, filename.split("-")[0])
        card.save(image_path, optimize=True)
    crop_grid("exec-14ad664a-ae86-4596-8299-0d9b9b7627c6.png", ROOT / "public" / "enemies", [
        "labyrinth-fury.png", "labyrinth-guard.png", "labyrinth-minotaur.png", "labyrinth-seer.png", "labyrinth-king.png", "labyrinth-sentinel.png",
    ], 3, 2, (512, 512), 1)

    backgrounds = ROOT / "public" / "backgrounds"
    backgrounds.mkdir(parents=True, exist_ok=True)
    for source, target in [
        ("exec-ab25c8b3-0b76-4739-ad8b-70df1d0bd827.png", "knossos-labyrinth.png"),
        ("exec-6567f30e-9586-4a05-9f0f-91b9030047c5.png", "rare-cyber-arcade.png"),
        ("exec-607de2c1-0160-493a-be00-9f0cf1223aae.png", "rare-ash-sanctuary.png"),
    ]:
        image = Image.open(GEN / source).convert("RGB")
        image.save(backgrounds / target, optimize=True)

    icon = Image.open(GEN / "exec-ee38c60e-2e9f-456e-87b8-4d37d0989fda.png").convert("RGBA")
    icon = icon.resize((256, 256), Image.Resampling.LANCZOS)
    (ROOT / "assets").mkdir(exist_ok=True)
    icon.save(ROOT / "assets" / "oracle-icon.png", optimize=True)
    icon.save(ROOT / "assets" / "oracle.ico", format="ICO", sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])


if __name__ == "__main__":
    main()
