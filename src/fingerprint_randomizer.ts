import * as crypto from "crypto";

interface DeviceFingerprint {
  androidId: string;
  serialNumber: string;
  buildFingerprint: string;
  bootloader: string;
  hardwareSerial: string;
  imei: string;
}

interface SpoofedPrint extends DeviceFingerprint {
  timestamp: number;
  seed: string;
}

/**
 * Generate randomized but consistent device fingerprint
 * Uses a seed so same fingerprint can be regenerated
 */
export class FingerprintRandomizer {
  private seed: string;

  constructor(customSeed?: string) {
    this.seed = customSeed || crypto.randomBytes(16).toString("hex");
  }

  /**
   * Generate pseudorandom value from seed
   */
  private deterministicRandom(salt: string): number {
    const hash = crypto
      .createHmac("sha256", this.seed)
      .update(salt)
      .digest();
    return parseInt(hash.toString("hex").slice(0, 8), 16) / 0xffffffff;
  }

  /**
   * Generate fake Android ID (16 hex chars)
   */
  private generateAndroidId(): string {
    const rand = this.deterministicRandom("android_id");
    return Math.floor(rand * 0xffffffff)
      .toString(16)
      .padStart(16, "0");
  }

  /**
   * Generate fake serial number (alphanumeric, 20 chars)
   */
  private generateSerial(): string {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let serial = "";
    for (let i = 0; i < 20; i++) {
      const idx = Math.floor(
        this.deterministicRandom(`serial_${i}`) * chars.length
      );
      serial += chars[idx];
    }
    return serial;
  }

  /**
   * Generate fake build fingerprint (google/device:version/etc)
   */
  private generateBuildFingerprint(): string {
    const brands = ["google", "samsung", "xiaomi", "oneplus", "motorola"];
    const devices = ["crosshatch", "blueline", "oriole", "walleye"];
    const versions = ["13", "14", "15"];

    const brandIdx = Math.floor(
      this.deterministicRandom("brand") * brands.length
    );
    const deviceIdx = Math.floor(
      this.deterministicRandom("device") * devices.length
    );
    const versionIdx = Math.floor(
      this.deterministicRandom("version") * versions.length
    );

    return `${brands[brandIdx]}/${devices[deviceIdx]}:${versions[versionIdx]}/000001:user/release-keys`;
  }

  /**
   * Generate fake IMEI (15 digits)
   */
  private generateIMEI(): string {
    let imei = "";
    for (let i = 0; i < 15; i++) {
      const digit = Math.floor(this.deterministicRandom(`imei_${i}`) * 10);
      imei += digit;
    }
    return imei;
  }

  /**
   * Generate complete spoofed fingerprint
   */
  spoof(): SpoofedPrint {
    return {
      androidId: this.generateAndroidId(),
      serialNumber: this.generateSerial(),
      buildFingerprint: this.generateBuildFingerprint(),
      bootloader: `HHZ20h`,
      hardwareSerial: `emulator-${Math.floor(this.deterministicRandom("hw") * 10000)}`,
      imei: this.generateIMEI(),
      timestamp: Date.now(),
      seed: this.seed,
    };
  }

  /**
   * Regenerate same fingerprint using original seed
   */
  regenerate(): SpoofedPrint {
    return this.spoof();
  }
}

// Example usage
const randomizer = new FingerprintRandomizer();
const spoofed = randomizer.spoof();

console.log("Spoofed Device Fingerprint:");
console.log(JSON.stringify(spoofed, null, 2));
