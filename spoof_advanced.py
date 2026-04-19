#!/usr/bin/env python3
"""
spoof_advanced.py -- Advanced device fingerprint spoofing
Spoof: build type, Knox flags, ro.build.tags (test-keys), SELinux, OEM unlock bits
Usage: python3 spoof_advanced.py --mode realistic --target flagship
       python3 spoof_advanced.py --list-targets
"""
import subprocess, argparse, json

TARGETS = {
    "flagship": {
        "ro.build.tags": "release-keys",
        "ro.build.type": "user",
        "ro.secure": "1",
        "ro.boot.serialno": "UNKNOWN",
        "ro.boot.verifiedbootstate": "green",
        "ro.oem_unlock_supported": "1",
    },
    "oneplus": {
        "ro.build.fingerprint": "OnePlus/OnePlus9/OnePlus9:12/RKQ1.201105.003/2021:user/release-keys",
        "ro.product.model": "OnePlus 9",
        "ro.build.tags": "release-keys",
        "ro.secure": "1",
    },
    "samsung": {
        "ro.build.fingerprint": "samsung/beyond1/beyond1:12/SMD187F/G973FXXU9DUC2:user/release-keys",
        "ro.product.model": "SM-G973F",
        "ro.build.tags": "release-keys",
        "ro.secure": "1",
        "ro.boot.verifiedbootstate": "green",
    },
    "pixel": {
        "ro.build.fingerprint": "google/raven/raven:13/TP1A.221105.002/8869899:user/release-keys",
        "ro.product.model": "Pixel 7 Pro",
        "ro.build.tags": "release-keys",
        "ro.secure": "1",
        "ro.boot.verifiedbootstate": "green",
    },
    "grapheneos": {
        "ro.build.version.release": "13",
        "ro.build.fingerprint": "google/raven/raven:13.0:user/release-keys",
        "ro.product.model": "Pixel 7 Pro",
        "ro.build.tags": "release-keys",
        "ro.secure": "1",
        "ro.debuggable": "0",
    },
}

def adb(cmd):
    subprocess.run(f"adb shell {cmd}", shell=True, capture_output=True)

def spoof_target(target_name):
    if target_name not in TARGETS:
        print(f"Unknown target: {target_name}")
        print(f"Available: {', '.join(TARGETS.keys())}")
        return

    props = TARGETS[target_name]
    print(f"\\nSpoofing as: {target_name}")
    print(f"Properties to set: {len(props)}\n")

    for key, val in props.items():
        # Note: these require root/Magisk module to persist
        print(f"  {key} = {val}")
        adb(f"setprop {key} '{val}'")  # Temporary (until reboot)

    print("\\n⚠️  These changes are temporary and reset on reboot.")
    print("To persist: use Magisk module or edit /system/build.prop")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", default="realistic", choices=["realistic", "obfuscated"])
    parser.add_argument("--target", help="Target device fingerprint")
    parser.add_argument("--list-targets", action="store_true")
    parser.add_argument("--randomize", action="store_true", help="Randomize build ID")
    args = parser.parse_args()

    if args.list_targets:
        print("Available targets:")
        for name, props in TARGETS.items():
            model = props.get("ro.product.model", "?")
            print(f"  {name:<15} {model}")
        return

    if not args.target:
        print("Usage: python3 spoof_advanced.py --target [flagship|oneplus|samsung|pixel|grapheneos]")
        print("       python3 spoof_advanced.py --list-targets")
        return

    spoof_target(args.target)

if __name__ == "__main__":
    main()
