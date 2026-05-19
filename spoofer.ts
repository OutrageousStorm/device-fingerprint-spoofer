import * as fs from 'fs';
import * as path from 'path';

interface DeviceProfile {
  model: string;
  manufacturer: string;
  device: string;
  fingerprint: string;
  buildTags: string;
  securityPatch: string;
  hardwareSerial: string;
}

class DeviceSpoofing {
  private profiles: Map<string, DeviceProfile> = new Map();

  constructor() {
    this.loadProfiles();
  }

  private loadProfiles() {
    const profiles: DeviceProfile[] = [
      {
        model: "Pixel 8 Pro",
        manufacturer: "Google",
        device: "husky",
        fingerprint: "google/husky/husky:15/AP1A.240305.019:15.0.0_release",
        buildTags: "release-keys",
        securityPatch: "2024-03-05",
        hardwareSerial: "2Y4250Z2X7",
      },
      {
        model: "Galaxy S24",
        manufacturer: "Samsung",
        device: "dm3q",
        fingerprint: "samsung/dm3qxq/dm3q:14/UP1A.231105.001:1234",
        buildTags: "release-keys",
        securityPatch: "2024-03-01",
        hardwareSerial: "R9YT70C8X2T",
      },
    ];

    for (const p of profiles) {
      this.profiles.set(p.device, p);
    }
  }

  public spoof(device: string, propName: string): string | null {
    const profile = this.profiles.get(device);
    if (!profile) return null;

    const propMap: Record<string, string> = {
      "ro.product.model": profile.model,
      "ro.product.manufacturer": profile.manufacturer,
      "ro.product.device": profile.device,
      "ro.build.fingerprint": profile.fingerprint,
      "ro.build.tags": profile.buildTags,
      "ro.build.version.security_patch": profile.securityPatch,
      "ro.serialno": profile.hardwareSerial,
    };

    return propMap[propName] || null;
  }

  public listProfiles(): DeviceProfile[] {
    return Array.from(this.profiles.values());
  }
}

// CLI usage
const spoofer = new DeviceSpoofing();
if (process.argv.length > 2) {
  const device = process.argv[2];
  const prop = process.argv[3] || "ro.build.fingerprint";
  const value = spoofer.spoof(device, prop);
  console.log(value || "Unknown property");
} else {
  console.log("Usage: ts-node spoofer.ts <device> [property]");
  console.log("
Available devices:");
  spoofer.listProfiles().forEach(p => {
    console.log(`  ${p.device} — ${p.model}`);
  });
}
