#!/usr/bin/env python3
"""
fingerprint_generator.py — Generate realistic Android fingerprints for your device
Useful for: passing SafetyNet, matching device to ROM, testing device detection

Usage: python3 fingerprint_generator.py --device oriole --android 14
"""
import argparse, random, string, json

DEVICES = {
    'oriole': {'model': 'Pixel 6 Pro', 'brand': 'google', 'manufacturer': 'Google'},
    'raven': {'model': 'Pixel 6', 'brand': 'google', 'manufacturer': 'Google'},
    'taimen': {'model': 'Pixel 2 XL', 'brand': 'google', 'manufacturer': 'Google'},
    'crosshatch': {'model': 'Pixel 3 XL', 'brand': 'google', 'manufacturer': 'Google'},
    'blueline': {'model': 'Pixel 3', 'brand': 'google', 'manufacturer': 'Google'},
}

ANDROID_BUILDS = {
    '14': ['UP1A.231005.007', 'UP1A.231105.003', 'TP1A.220624.014', 'TQ1A.221205.011'],
    '13': ['TQ1A.230405.107', 'TQ3A.200805.001', 'TP1A.220624.014', 'TQ2A.225.002.20220301'],
    '12': ['SQ1D.211205.003', 'SKG.211119.001', 'SKD.211215.001'],
    '11': ['RP1A.201005.004', 'RQ3A.210705.005', 'RQ3A.210805.001'],
}

def generate_fingerprint(device_code, android_version):
    if device_code not in DEVICES:
        print(f"Unknown device: {device_code}")
        print(f"Available: {', '.join(DEVICES.keys())}")
        return None

    dev = DEVICES[device_code]
    builds = ANDROID_BUILDS.get(android_version, ANDROID_BUILDS['14'])
    build = random.choice(builds)
    
    # Format: google/oriole/oriole:14/UP1A.231005.007/1234567:user/release-keys
    fingerprint = f"{dev['brand']}/{device_code}/{device_code}:{android_version}/{build}/{''.join(random.choices(string.digits, k=7))}:user/release-keys"
    
    return {
        'fingerprint': fingerprint,
        'device': device_code,
        'model': dev['model'],
        'manufacturer': dev['manufacturer'],
        'android': android_version,
        'build': build,
        'build_type': 'user',
        'security_patch': '2024-02-05',
    }

def main():
    parser = argparse.ArgumentParser(description='Generate Android fingerprints')
    parser.add_argument('--device', default='oriole', help='Device code (oriole, raven, taimen, etc)')
    parser.add_argument('--android', default='14', help='Android version')
    parser.add_argument('--count', type=int, default=1, help='Generate N fingerprints')
    parser.add_argument('--set', action='store_true', help='Set on device via ADB')
    args = parser.parse_args()

    print(f"\n🎯 Android Fingerprint Generator\n")
    
    for i in range(args.count):
        fp = generate_fingerprint(args.device, args.android)
        if fp:
            print(f"Generated fingerprint #{i+1}:")
            print(f"  {fp['fingerprint']}")
            if args.set:
                import subprocess
                cmds = [
                    f"setprop ro.build.fingerprint '{fp['fingerprint']}'",
                    f"setprop ro.product.model '{fp['model']}'",
                    f"setprop ro.product.manufacturer '{fp['manufacturer']}'",
                ]
                for cmd in cmds:
                    subprocess.run(['adb', 'shell', cmd], capture_output=True)
                print("  ✓ Set on device (requires root)")
            print()

if __name__ == '__main__':
    main()
