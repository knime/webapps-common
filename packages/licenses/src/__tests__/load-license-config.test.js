import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import defaultConfig from "../../config/license.config.js";
import { loadAndMergeLicenseConfig } from "../load-license-config.js";

const createTempDir = () => fs.mkdtemp(path.join(os.tmpdir(), "licenses-"));

describe("loadAndMergeLicenseConfig", () => {
  it("returns default config if no project config exists", async () => {
    const tempDir = await createTempDir();

    const config = await loadAndMergeLicenseConfig({
      basePath: tempDir,
    });

    expect(config.onlyAllow).toEqual(defaultConfig.onlyAllow);
    expect(config.excludePackages).toEqual(defaultConfig.excludePackages);
    expect(config.manualPackages).toEqual(defaultConfig.manualPackages);
  });

  it("auto-discovers project config and merges with defaults", async () => {
    const tempDir = await createTempDir();
    await fs.writeFile(
      path.join(tempDir, "license.config.json"),
      JSON.stringify({
        onlyAllow: ["TEST-LICENSE"],
        excludePackages: ["my-package@1.0.0"],
        manualPackages: [
          {
            name: "manual-package",
            repository: "",
            licenseText: "test",
          },
        ],
      }),
      "utf-8",
    );

    const config = await loadAndMergeLicenseConfig({ basePath: tempDir });

    expect(config.onlyAllow).toContain("TEST-LICENSE");
    expect(config.onlyAllow).toContain(defaultConfig.onlyAllow[0]);
    expect(config.excludePackages).toContain("my-package@1.0.0");
    expect(config.excludePackages).toContain(defaultConfig.excludePackages[0]);
    expect(
      config.manualPackages.some((pkg) => pkg.name === "manual-package"),
    ).toBe(true);
  });

  it("uses explicit config path and does not leak values to future loads", async () => {
    const tempDirWithConfig = await createTempDir();
    const configDir = path.join(tempDirWithConfig, "configs");
    await fs.mkdir(configDir);
    await fs.writeFile(
      path.join(configDir, "my-license.config.json"),
      JSON.stringify({
        onlyAllow: ["EXPLICIT-LICENSE"],
      }),
      "utf-8",
    );

    const mergedConfig = await loadAndMergeLicenseConfig({
      basePath: tempDirWithConfig,
      configPath: "configs/my-license.config.json",
    });

    expect(mergedConfig.onlyAllow).toContain("EXPLICIT-LICENSE");

    const freshTempDir = await createTempDir();
    const freshConfig = await loadAndMergeLicenseConfig({
      basePath: freshTempDir,
    });

    expect(freshConfig.onlyAllow).not.toContain("EXPLICIT-LICENSE");
  });

  it("falls back to defaults when explicit config file does not exist", async () => {
    const tempDir = await createTempDir();

    const config = await loadAndMergeLicenseConfig({
      basePath: tempDir,
      configPath: "does-not-exist/license.config.json",
    });

    expect(config.onlyAllow).toEqual(defaultConfig.onlyAllow);
    expect(config.excludePackages).toEqual(defaultConfig.excludePackages);
    expect(config.manualPackages).toEqual(defaultConfig.manualPackages);
  });
});
