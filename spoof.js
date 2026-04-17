/**
 * spoof.js -- Frida script to spoof Android device fingerprint
 * Fakes: model, build fingerprint, hardware, manufacturer, ro.build.tags
 * Usage: frida -U -f com.example.app -l spoof.js --no-pause
 */

setTimeout(function() {
    Java.perform(function() {
        console.log("[Fingerprint Spoof] Active\n");

        var Build = Java.use("android.os.Build");
        var BuildConfig = Java.use("android.os.Build$VERSION");

        // Original values to mask
        var ORIGINAL = {
            MODEL: Build.MODEL.value,
            MANUFACTURER: Build.MANUFACTURER.value,
            FINGERPRINT: Build.FINGERPRINT.value,
            HARDWARE: Build.HARDWARE.value,
            BRAND: Build.BRAND.value,
            DEVICE: Build.DEVICE.value,
            TAGS: Build.TAGS.value,
            TYPE: Build.TYPE.value,
        };

        // Spoof to Pixel 7 (common baseline)
        var SPOOF_VALUES = {
            MODEL: "Pixel 7",
            MANUFACTURER: "Google",
            FINGERPRINT: "google/oriole/oriole:13/TP1A.220624.014/8816971:user/release-keys",
            HARDWARE: "oriole",
            BRAND: "google",
            DEVICE: "oriole",
            TAGS: "release-keys",
            TYPE: "user",
            PRODUCT: "oriole",
        };

        // Static property replacements
        var BUILD_PROPS = [
            "MODEL", "MANUFACTURER", "FINGERPRINT", "HARDWARE", 
            "BRAND", "DEVICE", "TAGS", "TYPE", "PRODUCT"
        ];

        BUILD_PROPS.forEach(function(prop) {
            try {
                Build[prop].value = SPOOF_VALUES[prop] || ORIGINAL[prop];
                console.log("[Spoof] " + prop + " → " + SPOOF_VALUES[prop]);
            } catch(e) {}
        });

        // Hook System.getProperty() to intercept ro.* reads
        var System = Java.use("java.lang.System");
        System.getProperty.overload("java.lang.String").implementation = function(key) {
            var val = this.getProperty.call(this, key);
            var spoof_map = {
                "ro.product.model": "Pixel 7",
                "ro.product.manufacturer": "Google",
                "ro.build.fingerprint": SPOOF_VALUES.FINGERPRINT,
                "ro.hardware": "oriole",
                "ro.product.brand": "google",
                "ro.product.device": "oriole",
                "ro.build.tags": "release-keys",
                "ro.build.type": "user",
                "ro.product.name": "oriole",
                "ro.build.description": "oriole-user 13 TP1A.220624.014 8816971 release-keys",
            };
            if (key in spoof_map) {
                return spoof_map[key];
            }
            return val;
        };

        console.log("[Fingerprint Spoof] Device spoofed to Pixel 7");
        console.log("  Original: " + ORIGINAL.MODEL + " (" + ORIGINAL.FINGERPRINT + ")")
        console.log("  Spoofed:  " + SPOOF_VALUES.MODEL + " (Pixel class device)");
    });
}, 0);
