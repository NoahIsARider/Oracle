"""Generate one Oracle cast sheet through OpenRouter's image models.

The Codex built-in image_gen is bound to chatgpt.com, which Cloudflare blocks
from every proxy exit we have. OpenRouter reaches the same model family
(openai/gpt-5-image) through api.openrouter.ai, which is reachable over the AWS
SOCKS tunnel. This script posts the sheet prompt plus the style references and
saves the returned image.
"""

from __future__ import annotations

import base64
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = Path.home() / "AppData" / "Local" / "hermes" / ".env"
SOCKS = None  # set to "127.0.0.1:1081" to route through the AWS tunnel
REFS = [
    "assets/cards/prompts/ref/sheet-layout.jpg",
    "assets/cards/prompts/ref/card-athena.jpg",
    "assets/cards/prompts/ref/card-hades.jpg",
]


def env_value(name: str) -> str:
    for line in ENV_FILE.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if line.startswith(name + "="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit(f"{name} not found")


def build_payload(sheet: str, model: str) -> dict:
    prompt = (ROOT / "assets" / "cards" / "prompts" / sheet.replace(".png", ".md")).read_text(encoding="utf-8")
    style_lock = (
        "\n\nASSET FORMAT: one vertical portrait image, exactly 1024 by 1536 pixels (2:3). "
        "Never a square image. Six complete tarot cards in three equal columns and two rows, "
        "each card roughly 332 by 737 pixels, separated by a thin gutter on a flat dark olive background."
        "\nSTYLE LOCK, copy from the attached cards: a deep lapis-blue night sky panel inside a pointed arch, "
        "four ornate gold rosettes with foliage scrollwork in the frame corners, dense engraved linework over "
        "aged warm cream parchment, saturated accents in teal, oxblood, lapis and antique gold. "
        "Keep the rich saturated palette. Do not drift into olive monochrome or soft pastel washes. "
        "Every card keeps the same frame, the same arch, the same blank bottom cartouche. "
        "No lettering, no names, no numbers, no watermark anywhere. "
        "Each creature must be anatomically complete: Cerberus has exactly three heads."
    )
    content = [{"type": "text", "text": prompt + style_lock}]
    for ref in REFS:
        data = base64.b64encode((ROOT / ref).read_bytes()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{data}"}})
    return {
        "model": model,
        "messages": [{"role": "user", "content": content}],
        "modalities": ["image", "text"],
    }


def main() -> None:
    sheet = sys.argv[1] if len(sys.argv) > 1 else "oracle-cast-06.png"
    model = sys.argv[2] if len(sys.argv) > 2 else "openai/gpt-5-image"
    out_path = ROOT / "assets" / "cards" / "sheets" / sheet
    payload = build_payload(sheet, model)
    body = ROOT / "assets" / "cards" / "prompts" / "last-payload.json"
    body.write_text(json.dumps(payload), encoding="utf-8")
    print(f"model={model} sheet={sheet} payload={body.stat().st_size/1e6:.2f}MB")

    cmd = ["curl", "-s", "-m", "600"]
    if SOCKS:
        cmd += ["--socks5-hostname", SOCKS]
    cmd += ["-w", "\nHTTP:%{http_code}",
            "-X", "POST", "https://openrouter.ai/api/v1/chat/completions",
            "-H", "Content-Type: application/json",
            "-H", f"Authorization: Bearer {env_value('OPENROUTER_API_KEY')}",
            "--data-binary", "@" + str(body)]
    result = subprocess.run(cmd, capture_output=True)
    raw = result.stdout.decode("utf-8", "replace")
    if "HTTP:" in raw:
        code = raw.rsplit("HTTP:", 1)[1].strip()
        print("http:", code)
        raw = raw.rsplit("\nHTTP:", 1)[0]
    (ROOT / "assets" / "cards" / "prompts" / "last-response.json").write_text(raw, encoding="utf-8")
    try:
        data = json.loads(raw)
    except Exception:
        print("NON-JSON response:", raw[:800])
        raise SystemExit(1)

    if "error" in data:
        print("ERROR:", json.dumps(data["error"])[:800])
        raise SystemExit(1)

    message = data["choices"][0]["message"]
    images = message.get("images") or []
    if not images:
        print("no images in response; text:", (message.get("content") or "")[:400])
        raise SystemExit(1)

    url = images[0]["image_url"]["url"]
    if url.startswith("data:"):
        blob = base64.b64decode(url.split(",", 1)[1])
    else:
        blob = subprocess.run(["curl", "-s", "-L", "-m", "120", "--socks5-hostname", SOCKS, url],
                              capture_output=True).stdout
    out_path.write_bytes(blob)
    print(f"saved {out_path} {len(blob)/1e6:.2f}MB")


if __name__ == "__main__":
    main()
