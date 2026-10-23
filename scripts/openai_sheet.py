"""Generate an Oracle cast sheet through the official OpenAI Images API.

The Codex built-in image_gen goes through chatgpt.com, which Cloudflare blocks
from every proxy exit on this machine. api.openai.com answers 401 directly, so a
platform key reaches the same model family (gpt-image-2) without Cloudflare.

Uses /v1/images/edits with the style reference sheet and two finished cards, so
the frame, arch, cartouche and palette stay aligned with the first deck.
"""

from __future__ import annotations

import base64
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = Path.home() / "AppData" / "Local" / "hermes" / ".env"
REFS = [
    ("sheet-layout.png", "assets/cards/prompts/ref/sheet-layout.jpg"),
    ("card-athena.png", "assets/cards/prompts/ref/card-athena.jpg"),
    ("card-hades.png", "assets/cards/prompts/ref/card-hades.jpg"),
    ("sheet-05.png", "assets/cards/sheets/oracle-cast-05.png"),
]


def env_value(name: str) -> str:
    for line in ENV_FILE.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if line.startswith(name + "="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit(f"{name} not found")


def main() -> None:
    sheet = sys.argv[1] if len(sys.argv) > 1 else "oracle-cast-06.png"
    model = sys.argv[2] if len(sys.argv) > 2 else "gpt-image-2"
    quality = sys.argv[3] if len(sys.argv) > 3 else "high"
    prompt_file = ROOT / "assets" / "cards" / "prompts" / sheet.replace(".png", ".md")
    prompt = prompt_file.read_text(encoding="utf-8").strip()
    prompt += (
        "\n\nThe attached images are references, not edit targets. The first is the sheet layout, "
        "the second and third are finished cards from the first deck, and the fourth is a finished "
        "sheet from this same deck. Reproduce their frame, arch, cartouche, line weight and palette "
        "exactly; paint the six new subjects described above into that system. Output one portrait "
        "image of exactly 1024 by 1536 pixels."
    )

    cmd = [
        "curl", "-s", "-m", "600",
        "-w", "\nHTTP:%{http_code}",
        "https://api.openai.com/v1/images/edits",
        "-H", f"Authorization: Bearer {env_value('OPENAI_API_KEY')}",
        "-F", f"model={model}",
        "-F", f"prompt={prompt}",
        "-F", "size=1024x1536",
        "-F", f"quality={quality}",
        "-F", "n=1",
        "-F", "output_format=png",
    ]
    for field, rel in REFS:
        path = ROOT / rel
        if path.exists():
            cmd += ["-F", f"image[]=@{path}"]
    # A plain repeatable multipart field name is not portable in curl, so send
    # the same field several times as image[].
    result = subprocess.run(cmd, capture_output=True)
    raw = result.stdout.decode("utf-8", "replace")
    code = raw.rsplit("HTTP:", 1)[-1].strip() if "HTTP:" in raw else "?"
    body = raw.rsplit("\nHTTP:", 1)[0]
    print(f"model={model} quality={quality} http={code} bytes={len(body)}")
    (ROOT / "assets" / "cards" / "prompts" / "last-api-response.json").write_text(body[:200000], encoding="utf-8")

    try:
        data = json.loads(body)
    except Exception:
        print("non-JSON:", body[:600])
        raise SystemExit(1)
    if "error" in data:
        print("ERROR:", json.dumps(data["error"])[:600])
        raise SystemExit(1)

    item = data["data"][0]
    if "b64_json" in item:
        blob = base64.b64decode(item["b64_json"])
    else:
        blob = subprocess.run(["curl", "-s", "-L", "-m", "180", item["url"]], capture_output=True).stdout
    out = ROOT / "assets" / "cards" / "sheets" / sheet
    out.write_bytes(blob)
    from PIL import Image
    size = Image.open(out).size
    print(f"saved {out} {len(blob)/1e6:.2f}MB {size}")


if __name__ == "__main__":
    main()
