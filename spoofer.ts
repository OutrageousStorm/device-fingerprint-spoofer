/**
 * fingerprint-spoofer.ts
 * Spoof Android device fingerprint to pass hardware attestation
 * Requires: Magisk + PlayIntegrityFix module
 * This generates a valid-looking spoofed fingerprint string
 */

export interface DeviceFingerprint {
    brand: string;
    device: string;
    product: string;
    model: string;
    buildId: string;
    buildFingerprint: string;
}

const REAL_DEVICES: DeviceFingerprint[] = [
    {
        brand: "google",
        device: "shiba",
        product: "shiba",
        model: "Pixel 8",
        buildId: "AP3A.240905.015",
        buildFingerprint: "google/shiba/shiba:15/AP3A.240905.015:release-keys"
    },
    {
        brand: "google",
        device: "husky",
        product: "husky",
        model: "Pixel 8 Pro",
        buildId: "AP3A.240905.015",
        buildFingerprint: "google/husky/husky:15/AP3A.240905.015:release-keys"
    },
    {
        brand: "google",
        device: "akita",
        product: "akita",
        model: "Pixel 8a",
        buildId: "AP3A.240905.015",
        buildFingerprint: "google/akita/akita:15/AP3A.240905.015:release-keys"
    },
    {
        brand: "google",
        device: "panther",
        product: "panther",
        model: "Pixel 7",
        buildId: "TQ1D.230105.001",
        buildFingerprint: "google/panther/panther:13/TQ1D.230105.001:release-keys"
    },
    {
        brand: "samsung",
        device: "dm1q",
        product: "dm1q",
        model: "Galaxy S23",
        buildId: "TP1A.220624.014",
        buildFingerprint: "samsung/dm1q/dm1q:13/TP1A.220624.014:release-keys"
    },
];

export function getRandomDevice(): DeviceFingerprint {
    return REAL_DEVICES[Math.floor(Math.random() * REAL_DEVICES.length)];
}

export function generateSpoofedProps(baseDevice: DeviceFingerprint): Record<string, string> {
    return {
        "ro.build.fingerprint": baseDevice.buildFingerprint,
        "ro.build.id": baseDevice.buildId,
        "ro.build.product": baseDevice.product,
        "ro.product.brand": baseDevice.brand,
        "ro.product.device": baseDevice.device,
        "ro.product.model": baseDevice.model,
        "ro.build.tags": "release-keys",
        "ro.build.version.release": "15",
        "ro.build.version.sdk": "34",
        "ro.secure": "1",
        "ro.debuggable": "0",
        "ro.boot.verifiedbootstate": "green",
        "ro.boot.serialno": generateRandomSerial(),
    };
}

function generateRandomSerial(): string {
    // Format: GooglePixel8 format is like "12A3B4C5"
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let serial = "";
    for (let i = 0; i < 8; i++) {
        serial += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return serial;
}

export function generateMagiskModule(device: DeviceFingerprint): string {
    const props = generateSpoofedProps(device);
    let moduleContent = "#!/system/bin/sh\n";
    moduleContent += "# Fingerprint Spoofer Module for Magisk\n";
    moduleContent += "# Auto-generated - do not edit manually\n\n";

    for (const [key, value] of Object.entries(props)) {
        moduleContent += `resetprop ${key} "${value}"\n`;
    }

    return moduleContent;
}

// CLI usage
if (require.main === module) {
    const device = getRandomDevice();
    console.log("🎭 Spoofed Device Fingerprint");
    console.log("==============================");
    console.log(JSON.stringify(device, null, 2));
    console.log("\nMagisk resetprop commands:");
    const props = generateSpoofedProps(device);
    for (const [k, v] of Object.entries(props)) {
        console.log(`resetprop ${k} "${v}"`);
    }
}
