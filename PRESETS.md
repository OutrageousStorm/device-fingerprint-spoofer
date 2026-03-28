# Device Fingerprint Presets

Current presets included in spoof.py:

## Google Pixel 8 Pro (pixel8pro)
```
Model: Pixel 8 Pro
Brand: google
Device: husky
Build: google/husky/husky:14.0/AP1A.240505.004/11680058:user/release-keys
Play Integrity: MEETS_DEVICE_INTEGRITY
SafetyNet: PASSES
```

## Google Pixel 8 (pixel8)
```
Model: Pixel 8
Brand: google
Device: shiba
Build: google/shiba/shiba:14.0/AP1A.240505.005/11680069:user/release-keys
Play Integrity: MEETS_DEVICE_INTEGRITY
```

## Google Pixel 7 Pro (pixel7pro)
```
Model: Pixel 7 Pro
Brand: google
Device: cheetah
Build: google/cheetah/cheetah:13.0/TP1A.220624.014/8958323:user/release-keys
Play Integrity: MEETS_DEVICE_INTEGRITY
```

## Samsung Galaxy S24 (samsung_s24)
```
Model: SM-S921B (Europe)
Brand: samsung
Device: x1s
Build: samsung/x1s/x1s:14/UP1A.231426.101/S921BXXU1AYGA:user/release-keys
Play Integrity: MEETS_BASIC_INTEGRITY
```

## Adding Custom Presets

Edit `spoof.py` and add to the `PRESETS` dict:

```python
"mypreset": {
    "model": "Device Name",
    "brand": "oem",
    "device": "codename",
    "build.fingerprint": "oem/codename/codename:14/VERSION/BUILD:user/release-keys",
    "build.tags": "release-keys",
    "build.type": "user",
}
```

Then use: `python3 spoof.py --spoof mypreset`
