/**
 * spoof-fingerprint.js
 * Spoof Android device fingerprint and hardware details
 * Usage: frida -U -f com.example.app -l spoof-fingerprint.js --no-pause
 */

setTimeout(function() {
    Java.perform(function() {
        console.log("[Fingerprint Spoofer] Starting...\n");

        var Build = Java.use("android.os.Build");
        var SystemProperties = Java.use("android.os.SystemProperties");

        // Original values
        var original = {
            MANUFACTURER: Build.MANUFACTURER.$h.value,
            MODEL: Build.MODEL.$h.value,
            PRODUCT: Build.PRODUCT.$h.value,
            DEVICE: Build.DEVICE.$h.value,
            FINGERPRINT: Build.FINGERPRINT.$h.value,
            BRAND: Build.BRAND.$h.value,
            HARDWARE: Build.HARDWARE.$h.value,
        };

        console.log("Original fingerprint:");
        Object.keys(original).forEach(k => {
            console.log(`  ${k}: ${original[k]}`);
        });

        // Spoof to a generic/common device
        var spoofed = {
            MANUFACTURER: "Google",
            MODEL: "Pixel 6",
            PRODUCT: "oriole",
            DEVICE: "oriole",
            FINGERPRINT: "google/oriole/oriole:12.0.0/S5Y200314:user/release-keys",
            BRAND: "google",
            HARDWARE: "oriole",
        };

        console.log("\nApplying spoofed fingerprint:");
        Object.keys(spoofed).forEach(k => {
            try {
                Build[k].$h.value = spoofed[k];
                console.log(`  ✓ ${k} → ${spoofed[k]}`);
            } catch(e) {
                console.log(`  ✗ ${k}: ${e}`);
            }
        });

        // Also spoof system properties
        console.log("\nSpoofing system properties:");
        var props = {
            'ro.product.manufacturer': spoofed.MANUFACTURER,
            'ro.product.model': spoofed.MODEL,
            'ro.product.brand': spoofed.BRAND,
            'ro.build.fingerprint': spoofed.FINGERPRINT,
            'ro.hardware': spoofed.HARDWARE,
        };

        Object.keys(props).forEach(k => {
            SystemProperties.set.overload('java.lang.String', 'java.lang.String').call(
                SystemProperties, k, props[k]);
            console.log(`  ✓ ${k} = ${props[k]}`);
        });

        console.log("\n[Fingerprint Spoofer] Complete. Device reports as: " + spoofed.MODEL);
    });
}, 0);
