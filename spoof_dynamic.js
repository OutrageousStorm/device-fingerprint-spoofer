/**
 * spoof_dynamic.js -- Dynamic fingerprint spoofer with custom values
 * Accepts any target device fingerprint
 * Usage: frida -U -f com.example.app -l spoof_dynamic.js --no-pause
 */

// CONFIGURE TARGET DEVICE HERE:
const TARGET = {
    MODEL: "Galaxy S23",
    MANUFACTURER: "Samsung",
    FINGERPRINT: "samsung/samsung/samsung:13/TP1A.220624.014/S911BXXU1BWL6:user/release-keys",
    HARDWARE: "smdk9110",
    BRAND: "samsung",
    DEVICE: "beyond0",
    TAGS: "release-keys",
};

setTimeout(function() {
    Java.perform(function() {
        var Build = Java.use("android.os.Build");
        Object.keys(TARGET).forEach(function(prop) {
            try {
                Build[prop].value = TARGET[prop];
            } catch(e) {}
        });

        var System = Java.use("java.lang.System");
        System.getProperty.overload("java.lang.String").implementation = function(key) {
            var val = this.getProperty.call(this, key);
            var map = {
                "ro.product.model": TARGET.MODEL,
                "ro.product.manufacturer": TARGET.MANUFACTURER,
                "ro.build.fingerprint": TARGET.FINGERPRINT,
                "ro.hardware": TARGET.HARDWARE,
                "ro.product.brand": TARGET.BRAND,
                "ro.product.device": TARGET.DEVICE,
                "ro.build.tags": TARGET.TAGS,
            };
            return (key in map) ? map[key] : val;
        };
        
        console.log("[Spoof] Device → " + TARGET.MODEL + " (" + TARGET.MANUFACTURER + ")");
    });
}, 0);
