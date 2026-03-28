# 🎭 Device Fingerprint Spoofer

Spoof Android device properties via ADB — change model, build, serial to fool Play Integrity and SafetyNet checks.

## Usage

```bash
# List current fingerprint
python3 spoof.py --show

# Spoof to Pixel 8 Pro
python3 spoof.py --spoof pixel8pro

# Spoof with custom values
python3 spoof.py --model "Pixel 8 Pro" --brand "google" --device "husky"

# Restore original (requires backup)
python3 spoof.py --restore
```

## Presets

| Preset | Device | Play Integrity |
|--------|--------|---|
| `pixel8pro` | Google Pixel 8 Pro | ✅ MEETS_DEVICE_INTEGRITY |
| `pixel8` | Google Pixel 8 | ✅ MEETS_DEVICE_INTEGRITY |
| `pixel7pro` | Google Pixel 7 Pro | ✅ MEETS_DEVICE_INTEGRITY |
| `samsung_s24` | Samsung Galaxy S24 | ⚠️ BASIC only |
