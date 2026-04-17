# Supported Device Fingerprints

This is a reference list of known device fingerprints you can spoof.

## Format

Fingerprints are extracted from stock builds. Format:
```
brand/product/device:android_version/build_id/buildtype:user/release
```

Example: `google/bluejay/bluejay:14/UP1A.231105.003/11588526:user/release`

---

## Google Pixel

| Device | Fingerprint |
|--------|-------------|
| Pixel 6a | `google/bluejay/bluejay:14/UP1A.231105.003/11588526:user/release` |
| Pixel 7 | `google/panther/panther:14/UP1A.231105.003/11588526:user/release` |
| Pixel 7a | `google/lynx/lynx:14/UP1A.231105.003/11588526:user/release` |
| Pixel 8 | `google/shiba/shiba:14/UP1A.231105.003/11588526:user/release` |
| Pixel 8 Pro | `google/husky/husky:14/UP1A.231105.003/11588526:user/release` |
| Pixel 9 | `google/tokay/tokay:15/AP2A.240305.005/11673057:user/release` |

## Samsung Galaxy

| Device | Fingerprint |
|--------|-------------|
| S23 | `samsung/dm1q/dm1q:14/TP1A.220624.014/S911BXXS9CWI1:user/release` |
| S24 | `samsung/d1xtq/d1xt:15/TP1A.220624.014/S241BXXU1AXI1:user/release` |
| A54 | `samsung/a54nfc/a54:14/TP1A.220624.014/A546BXXU5AXI1:user/release` |

## OnePlus

| Device | Fingerprint |
|--------|-------------|
| 12 | `OnePlus/CPH2513/OP5CF:15/AAOS.250101.001/1234567:user/release` |
| 11 | `OnePlus/OP5169/OP559L:14/SKQ1.230825.001/1234567:user/release` |

## Xiaomi

| Device | Fingerprint |
|--------|-------------|
| 14 Ultra | `Xiaomi/zizia/fuxi:14/MIUI14/26.12.12:user/release` |
| 14 | `Xiaomi/space/unicorn:14/MIUI14/26.12.12:user/release` |

---

## How to change fingerprint

### Via Magisk module (easiest)
- Install **BootloaderSpoofer** LSPosed module
- Or use **PlayIntegrityFix** (spoofs for Play Integrity API specifically)

### Via build.prop patch (root)
```bash
adb shell su -c "sed -i 's/ro\.build\.fingerprint=.*/ro.build.fingerprint=NEWFINGERPRINT/g' /system/build.prop"
```

### Via Magisk props
Create `/data/adb/modules/fingerprint-spoofer/system.prop`:
```
ro.build.fingerprint=google/panther/panther:14/TP1A.220624.014/1234567:user/release
ro.build.tags=release-keys
ro.build.type=user
```

---

## Important

- Fingerprint should match your device's Android version
- Using a completely foreign fingerprint may cause issues
- Always test with a backup before relying on it
- Some banking/payment apps check fingerprint — use TrickyStore module instead for better compatibility
