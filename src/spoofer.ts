import * as os from "os";

interface FingerprintProfile {
  manufacturer: string;
  device: string;
  model: string;
  product: string;
  buildId: string;
  buildFingerprint: string;
}

// Popular device fingerprints for spoofing
const PROFILES: Record<string, FingerprintProfile> = {
  pixel6: {
    manufacturer: "Google",
    device: "oriole",
    model: "Pixel 6",
    product: "oriole",
    buildId: "TP1A.220624.014",
    buildFingerprint: "google/oriole/oriole:12/TP1A.220624.014/8617238:user/release-keys",
  },
  pixel7: {
    manufacturer: "Google",
    device: "cheetah",
    model: "Pixel 7",
    product: "cheetah",
    buildId: "TQ2A.230405.003",
    buildFingerprint: "google/cheetah/cheetah:13/TQ2A.230405.003/9477611:user/release-keys",
  },
  samsung_s23: {
    manufacturer: "samsung",
    device: "dm3q",
    model: "SM-S911B",
    product: "dm3q",
    buildId: "TP1A.220624.014",
    buildFingerprint: "samsung/dm3q/dm3q:13/TP1A.220624.014/S911BXXU1AVC5:user/release-keys",
  },
};

export function spoof(profile: string): FingerprintProfile | null {
  return PROFILES[profile.toLowerCase()] || null;
}

export function listProfiles(): string[] {
  return Object.keys(PROFILES);
}

export async function setFingerprintViaAdb(
  profile: FingerprintProfile
): Promise<boolean> {
  const { spawn } = await import("child_process");
  
  const cmds = [
    `setprop ro.manufacturer "${profile.manufacturer}"`,
    `setprop ro.product.device "${profile.device}"`,
    `setprop ro.product.model "${profile.model}"`,
    `setprop ro.product.brand "${profile.manufacturer.toLowerCase()}"`,
    `setprop ro.build.fingerprint "${profile.buildFingerprint}"`,
  ];

  for (const cmd of cmds) {
    const proc = spawn("adb", ["shell", cmd]);
    await new Promise((r) => proc.on("close", r));
  }

  return true;
}
