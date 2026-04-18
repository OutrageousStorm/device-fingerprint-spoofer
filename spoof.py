#!/usr/bin/env python3
"""
spoof.py -- Device fingerprint spoofing tool for Android
Modifies ro.build.fingerprint and related props via Magisk/build.prop patching
Usage: python3 spoof.py --device pixel6 --target pixel7
       python3 spoof.py --fingerprint "google/oriole/oriole:13/TP1A:user/release-keys"
"""
import subprocess, argparse, sys, re
from datetime import datetime

DEVICE_FINGERPRINTS = {
    "pixel6": "google/oriole/oriole:13/TP1A.220624.014/8816326:user/release-keys",
    "pixel7": "google/panther/panther:13/TP1A.220624.014/8816326:user/release-keys",
    "pixel8": "google/shiba/shiba:14/AD1A.000297.030/10881267:user/release-keys",
    "samsung-s21": "samsung/r8s/r8s:13/S901U1UEU1BWH4/S901U1UEU1BWH4012715:user/release-keys",
    "xiaomi-poco-f3": "Xiaomi/alioth/alioth:12/RKQ1.200826.002/V13.0.1.0.SJUCNXM:user/release-keys",
}

def adb(cmd):
    r = subprocess.run(f"adb shell {cmd}", shell=True, capture_output=True, text=True)
    return r.stdout.strip()

def parse_fp(fp):
    """Parse fingerprint into components"""
    parts = fp.split('/')
    if len(parts) < 7:
        return None
    return {
        'brand': parts[0],
        'device': parts[1],
        'codename': parts[2],
        'android': parts[3],
        'build_id': parts[4],
        'type': parts[5],
        'tags': parts[6],
    }

def spoof_via_magisk(target_fp):
    """Create Magisk module to spoof fingerprint"""
    parsed = parse_fp(target_fp)
    if not parsed:
        print("Invalid fingerprint format")
        return False

    module_name = "fingerprint-spoof"
    module_dir = f"/data/adb/modules/{module_name}"

    # Create module structure
    print(f"Creating Magisk module: {module_name}")

    # module.prop
    adb(f"mkdir -p {module_dir}")
    adb(f"echo 'id={module_name}' > {module_dir}/module.prop")
    adb(f"echo 'name=Device Fingerprint Spoof' >> {module_dir}/module.prop")
    adb(f"echo 'version=1.0' >> {module_dir}/module.prop")
    adb(f"echo 'versionCode=1' >> {module_dir}/module.prop")
    adb(f"echo 'author=OutrageousStorm' >> {module_dir}/module.prop")
    adb(f"echo 'description=Spoof device fingerprint to {parsed["device"]}' >> {module_dir}/module.prop")

    # system.prop (the actual spoofing)
    props_content = f"""ro.build.fingerprint={target_fp}
ro.build.brand={parsed['brand']}
ro.product.device={parsed['codename']}
ro.build.version.release={parsed['android'].split(':')[0]}
ro.build.id={parsed['build_id']}
ro.build.type={parsed['type']}
ro.build.tags={parsed['tags']}
ro.product.model={parsed['device']}
"""

    for line in props_content.split('\n'):
        if line.strip():
            adb(f"echo '{line}' >> {module_dir}/system.prop")

    print(f"✓ Magisk module created at {module_dir}")
    print("Reboot to apply changes")
    return True

def spoof_via_adb(target_fp):
    """Direct ADB setprop (temporary, until reboot)"""
    parsed = parse_fp(target_fp)
    if not parsed:
        return False

    adb(f"setprop ro.build.fingerprint {target_fp}")
    adb(f"setprop ro.build.brand {parsed['brand']}")
    adb(f"setprop ro.product.device {parsed['codename']}")
    print(f"✓ Temporary spoof applied (reboot to revert)")
    return True

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--device", choices=list(DEVICE_FINGERPRINTS.keys()),
                        help="Spoof to this device")
    parser.add_argument("--fingerprint", help="Custom fingerprint string")
    parser.add_argument("--list", action="store_true", help="List known devices")
    parser.add_argument("--check", action="store_true", help="Show current fingerprint")
    parser.add_argument("--magisk", action="store_true", help="Create Magisk module (persistent)")
    parser.add_argument("--temp", action="store_true", help="Temporary ADB spoof (reverts on reboot)")
    args = parser.parse_args()

    if args.list:
        print("Known devices:\n")
        for dev, fp in DEVICE_FINGERPRINTS.items():
            parsed = parse_fp(fp)
            print(f"  {dev.ljust(20)} {parsed['device']} ({parsed['android']})")
        return

    if args.check:
        fp = adb("getprop ro.build.fingerprint")
        print(f"Current fingerprint: {fp}")
        return

    target_fp = None
    if args.device:
        target_fp = DEVICE_FINGERPRINTS[args.device]
    elif args.fingerprint:
        target_fp = args.fingerprint
    else:
        parser.print_help()
        return

    print(f"Target fingerprint: {target_fp}\n")

    if args.magisk:
        spoof_via_magisk(target_fp)
    elif args.temp:
        spoof_via_adb(target_fp)
    else:
        # Default: try Magisk first, fallback to ADB
        if not spoof_via_magisk(target_fp):
            print("Magisk module failed, trying temporary ADB spoof...")
            spoof_via_adb(target_fp)

if __name__ == "__main__":
    main()
