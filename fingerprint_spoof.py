#!/usr/bin/env python3
"""
fingerprint_spoof.py -- Spoof Android device fingerprint via ADB
Useful for bypassing IMEI checks and device-specific restrictions.
Usage: python3 fingerprint_spoof.py --list     # show current fingerprint
       python3 fingerprint_spoof.py --random    # set random fingerprint
       python3 fingerprint_spoof.py --set "brand:model:..."
"""
import subprocess, sys, argparse, random, string

def adb(cmd):
    return subprocess.run(f"adb shell {cmd}", shell=True, capture_output=True, text=True).stdout.strip()

def get_fingerprint():
    return adb("getprop ro.build.fingerprint")

def get_build_id():
    return adb("getprop ro.build.id")

def get_display():
    return adb("getprop ro.build.display.id")

def show_fingerprint():
    fp = get_fingerprint()
    bid = get_build_id()
    disp = get_display()
    print(f"Current fingerprint: {fp}")
    print(f"Build ID: {bid}")
    print(f"Display: {disp}")
    parts = fp.split("/")
    if len(parts) >= 5:
        print(f"\nParsed:")
        print(f"  Brand/Manufacturer: {parts[0]}")
        print(f"  Product/Device: {parts[1]}")
        print(f"  Device codename: {parts[2]}")
        print(f"  Build type: {parts[3]}")
        print(f"  Build tags: {parts[4]}")

def generate_random_fingerprint():
    """Generate a random fingerprint based on common formats"""
    brands = ["samsung", "google", "xiaomi", "oneplus", "oppo", "vivo"]
    models = ["SM-G991B", "Pixel7", "Mi11", "OP9", "CPH2209", "V2109"]
    codenames = ["b0q", "bluejay", "star", "lemonade", "kona", "bilibili"]
    build_ids = ["".join(random.choices(string.ascii_uppercase + string.digits, k=2)) for _ in range(3)]
    tags = ["release-keys", "test-keys"]
    
    brand = random.choice(brands)
    model = random.choice(models)
    codename = random.choice(codenames)
    build_id = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
    tag = random.choice(tags)
    
    fingerprint = f"{brand}/{model}/{codename}:11/RP1A.200720.011/{build_id}:{tag}"
    return fingerprint

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--list", action="store_true", help="Show current fingerprint")
    parser.add_argument("--random", action="store_true", help="Set random fingerprint")
    parser.add_argument("--set", help="Set custom fingerprint")
    args = parser.parse_args()

    if not any([args.list, args.random, args.set]):
        args.list = True

    if args.list:
        show_fingerprint()
    elif args.random:
        fp = generate_random_fingerprint()
        print(f"\nGenerated: {fp}")
        print("Note: Setting fingerprint requires root or Magisk")
        print("With Magisk, add to system.prop in a module, or use:")
        print("  adb shell su -c 'setprop ro.build.fingerprint \"<fingerprint>\"'")
    elif args.set:
        print(f"Note: Requires root/Magisk to actually apply")
        print(f"Would set to: {args.set}")

if __name__ == "__main__":
    main()
