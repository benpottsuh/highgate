#!/usr/bin/env python3
"""
Imagen 3 image generator using Google AI Studio API.
Usage: python3 scripts/generate_image.py "your prompt here" [output_filename]
Output saved to: src/assets/generated/
"""

import sys
import os
import re
from pathlib import Path
from dotenv import dotenv_values

# Load .env from project root
env_path = Path(__file__).parent.parent / ".env"
config = dotenv_values(env_path)
api_key = config.get("GOOGLE_AI_API_KEY") or os.environ.get("GOOGLE_AI_API_KEY")

if not api_key:
    print("Error: GOOGLE_AI_API_KEY not found in .env or environment")
    sys.exit(1)

if len(sys.argv) < 2:
    print("Usage: python3 scripts/generate_image.py \"your prompt\" [output_filename]")
    sys.exit(1)

prompt = sys.argv[1]

# Auto-generate filename from prompt if not provided
if len(sys.argv) >= 3:
    filename = sys.argv[2]
else:
    slug = re.sub(r"[^a-z0-9]+", "_", prompt.lower())[:40].strip("_")
    filename = f"{slug}.png"

output_dir = Path(__file__).parent.parent / "src" / "assets" / "generated"
output_dir.mkdir(parents=True, exist_ok=True)
output_path = output_dir / filename

from google import genai
from google.genai import types

client = genai.Client(api_key=api_key)

print(f"🎨 Generating: \"{prompt}\"")
print(f"   Model: imagen-4.0-ultra-generate-001")
print(f"   Output: {output_path}")

response = client.models.generate_images(
    model="imagen-4.0-ultra-generate-001",
    prompt=prompt,
    config=types.GenerateImagesConfig(
        number_of_images=1,
        aspect_ratio="1:1",          # square by default; override with --ratio arg if needed
        safety_filter_level="block_low_and_above",
    ),
)

if response.generated_images:
    image_data = response.generated_images[0].image.image_bytes
    with open(output_path, "wb") as f:
        f.write(image_data)
    print(f"✅ Saved to: {output_path}")
else:
    print("❌ No image generated. Check your prompt or safety filters.")
    sys.exit(1)
