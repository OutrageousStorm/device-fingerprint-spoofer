#!/usr/bin/env python3
import subprocess, json, argparse, sys
from datetime import datetime
from pathlib import Path

PRESETS = {
    "pixel8pro": {
        "model": "Pixel 8 Pro", "brand": "google", "device": "husky",
        "manufacturer": "Google",
        "build.fingerprint": "google/husky/husky:14.0/AP1A.240505.004/11680058:user/release-keys",
        "build.tags": "release-keys", "build.type": "user",
    },
    "pixel8": {
        "model": "Pixel 8", "brand": "google", "device": "shiba",
        "manufacturer": "Google",
        "build.fingerprint": "google/shiba/shiba:14.0/AP1A.240505.005/11680069:user/release-keys",
        "build.tags": "release-keys", "build.type": "user",
    },
}

def adb(cmd, check=False):
    r = subprocess.run(f"adb shell {cmd}", shell=True, capture_output=True, text=True)
    return r.stdout.strip() if not check or r.returncode == 0 else None

def adb_setprop(key, val):
    return adb(f"setprop {key} \'{val}\'") is not None

def backup_fingerprint(path="fingerprint_backup.json"):
    props = {}
    for key in ["ro.product.model", "ro.product.brand", "ro.product.device",
                "ro.product.manufacturer", "ro.build.fingerprint"]:
        props[key] = adb(f"getprop {key}")
    with open(path, "w") as f:
        json.dump(props, f, indent=2)
    print(f"✓ Backup: {path}")

def show_fingerprint():
    print("\n📱 Device Fingerprint\n")
    for k in ["ro.product.model", "ro.product.brand", "ro.product.device",
              "ro.build.fingerprint", "ro.build.tags"]:
        v = adb(f"getprop {k}")
        print(f"  {k.split('.')[-1]:<20} {v}")

def apply_preset(name):
    if name not in PRESETS:
        print(f"Unknown preset: {name}")
        return
    preset = PRESETS[name]
    print(f"\n🎭 Applying: {name}")
    backup_fingerprint(f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
    for key, val in preset.items():
        ro_key = f"ro.{key}" if not key.startswith("ro.") else key
        if not key.startswith("build."):
            adb_setprop(f"ro.product.{key}" if key in ["model","brand","device"] else ro_key, val)
            print(f"  ✓ {key}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--show", action="store_true")
    parser.add_argument("--spoof", help="Preset name")
    args = parser.parse_args()
    if args.show or not args.spoof:
        show_fingerprint()
    elif args.spoof:
        apply_preset(args.spoof)

if __name__ == "__main__":
    main()
