#!/usr/bin/env python3
"""Import the five Curious AI WebP illustration candidates from the review bundle.

From the repository root:
    python3 scripts/import-pr257-curious-artwork.py ~/Downloads/pr257-curious-ai-artwork-handoff.zip

This imports candidate files, not approval metadata; publication remains gated.
"""
import hashlib
import json
import pathlib
import struct
import sys
import zipfile

NAMES = (
    "2026-10-26-tv-cleanup",
    "2026-10-26-botober-racehorses",
    "2026-10-26-lagos-hiring",
    "2026-10-26-uae-ai-literacy",
    "2026-10-26-minecraft-coordination",
)
ROOT = pathlib.Path(__file__).resolve().parents[1]
TARGET = ROOT / "public/images/stories"


def check_webp(payload: bytes) -> None:
    if len(payload) < 30 or payload[:4] != b"RIFF" or payload[8:12] != b"WEBP":
        raise ValueError("invalid WebP header")
    if struct.unpack_from("<I", payload, 4)[0] + 8 != len(payload):
        raise ValueError("incomplete RIFF container")
    offset = 12
    while offset < len(payload):
        if offset + 8 > len(payload):
            raise ValueError("truncated WebP chunk header")
        chunk_size = struct.unpack_from("<I", payload, offset + 4)[0]
        offset += 8 + chunk_size + (chunk_size % 2)
        if offset > len(payload):
            raise ValueError("truncated WebP chunk data")
    if offset != len(payload):
        raise ValueError("unexpected data after WebP chunks")


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    archive = pathlib.Path(sys.argv[1]).expanduser().resolve()
    if not archive.is_file():
        raise FileNotFoundError(f"Missing artwork package: {archive}")
    with zipfile.ZipFile(archive) as bundle:
        manifest = json.loads(bundle.read("asset-candidate-manifest.json"))
        if manifest.get("package_type") != "CANDIDATE_ONLY_NOT_PUBLICATION_APPROVAL":
            raise ValueError("Unexpected package type")
        records = {entry["story_id"]: entry for entry in manifest["assets"]}
        if set(records) != set(NAMES) or manifest.get("image_count") != 5:
            raise ValueError("Expected precisely five Curious AI candidate assets")
        verified = []
        for story in NAMES:
            item = records[story]
            source = f"public/images/stories/{story}.webp"
            if item["asset_path"] != source:
                raise ValueError(f"Unexpected image destination for {story}")
            data = bundle.read(source)
            check_webp(data)
            digest = hashlib.sha256(data).hexdigest()
            if digest != item["sha256"] or len(data) != item["byte_length"]:
                raise ValueError(f"Integrity mismatch for {story}")
            if (item["width"], item["height"]) != (1600, 900):
                raise ValueError(f"Unexpected image dimensions for {story}")
            verified.append((source, data, digest))
        for name, data, digest in verified:
            target = ROOT / name
            if target.exists() and target.read_bytes() != data:
                raise FileExistsError(f"Existing image differs; refusing overwrite: {target}")
        TARGET.mkdir(parents=True, exist_ok=True)
        for name, data, digest in verified:
            target = ROOT / name
            target.write_bytes(data)
            print(f"Imported candidate {target.relative_to(ROOT)} (SHA-256 {digest})")
    print("\nAll five candidate WebPs copied, but NOT YET APPROVED OR PUBLISHED.")
    print("Complete three-candidate constitutional review and identity metadata,")
    print("then run illustration, content, translation and editorial checks.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
