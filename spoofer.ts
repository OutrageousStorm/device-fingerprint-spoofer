import { execSync } from "child_process";

interface DeviceProps {
  brand: string;
  model: string;
  device: string;
  buildTags: string;
  fingerprint: string;
  serial: string;
}

class FingerprintSpoofer {
  private props: DeviceProps;

  constructor() {
    this.props = this.readDeviceProps();
  }

  private adb(cmd: string): string {
    try {
      return execSync(`adb shell ${cmd}`, { encoding: "utf-8" }).trim();
    } catch {
      return "";
    }
  }

  private readDeviceProps(): DeviceProps {
    return {
      brand: this.adb("getprop ro.product.brand"),
      model: this.adb("getprop ro.product.model"),
      device: this.adb("getprop ro.product.device"),
      buildTags: this.adb("getprop ro.build.tags"),
      fingerprint: this.adb("getprop ro.build.fingerprint"),
      serial: this.adb("getprop ro.serialno"),
    };
  }

  public generateGooglePixel(year: number = 2024): void {
    const models: { [key: number]: string } = {
      2023: "pixel-7-pro",
      2024: "pixel-9-pro",
      2025: "pixel-10-pro",
    };
    const model = models[year] || models[2024];
    this.spoof(model);
  }

  public generateSamsung(series: string = "s24"): void {
    const seriesMap: { [key: string]: string } = {
      s24: "samsung-s24-ultra",
      s25: "samsung-s25-ultra",
    };
    this.spoof(seriesMap[series] || "samsung-s24-ultra");
  }

  private spoof(target: string): void {
    console.log(`
🎭 Fingerprint Spoofer → ${target}`);
    const spoofProps: { [key: string]: string } = {
      "ro.product.brand": "Google",
      "ro.product.model": target,
      "ro.build.fingerprint": `google/${target}:14:BUILD.TP1A.220624.014:abcdef:user:keys`,
      "ro.build.tags": "release-keys",
    };

    for (const [key, val] of Object.entries(spoofProps)) {
      this.adb(`setprop ${key} "${val}"`);
      console.log(`  ✓ ${key} = ${val}`);
    }
    console.log("✅ Reboot for changes to take effect");
  }

  public getStatus(): void {
    console.log(`\n📱 Current Fingerprint:`);
    console.log(`  Brand: ${this.props.brand}`);
    console.log(`  Model: ${this.props.model}`);
    console.log(`  Device: ${this.props.device}`);
    console.log(`  Serial: ${this.props.serial}`);
    console.log(`  Fingerprint: ${this.props.fingerprint}`);
  }
}

const spoofer = new FingerprintSpoofer();
const cmd = process.argv[2];

switch (cmd) {
  case "pixel":
    spoofer.generateGooglePixel(2024);
    break;
  case "samsung":
    spoofer.generateSamsung("s24");
    break;
  case "status":
    spoofer.getStatus();
    break;
  default:
    console.log("Usage: npx ts-node spoofer.ts [pixel|samsung|status]");
}
