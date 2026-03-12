import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildLicenseCheckerOptions,
  throwOnLicenseError,
  toUniqueSortedPackages,
} from "../license-checker-utils.js";

const createTempDir = () => fs.mkdtemp(path.join(os.tmpdir(), "licenses-"));

const customPath = fileURLToPath(
  new URL("../../config/collect-packages-format.json", import.meta.url),
);

describe("license-checker-utils", () => {
  it("builds license-checker options in normal operation", () => {
    const options = buildLicenseCheckerOptions({
      parentRoot: "/tmp/project",
      config: {
        onlyAllow: ["MIT", "Apache-2.0"],
        excludePackages: ["pkg-a@1.0.0", "pkg-b@2.0.0"],
      },
      customPath: "/tmp/format.json",
    });

    expect(options).toEqual({
      start: "/tmp/project",
      production: false,
      onlyAllow: "MIT;Apache-2.0",
      excludePackages: "pkg-a@1.0.0;pkg-b@2.0.0",
      customPath: "/tmp/format.json",
    });
  });

  it("normalizes, deduplicates and sorts collected packages", () => {
    const result = toUniqueSortedPackages({
      collectedPackages: {
        "pkg-b@1.0.0": {
          name: "pkg-b",
          repository: "https://b.example",
          licenseText: "License text",
        },
      },
      manualPackages: [
        {
          name: "pkg-a",
          repository: "https://a.example",
          licenseText: "A",
        },
        {
          name: "PKG-B",
          repository: "https://b.example",
          licenseText: "License\ntext",
        },
      ],
    });

    expect(result).toEqual([
      {
        name: "pkg-a",
        repository: "https://a.example",
        licenseText: "A",
      },
      {
        name: "pkg-b",
        repository: "https://b.example",
        licenseText: "License text",
      },
    ]);
  });

  it("throws not allowed license errors", () => {
    const error = new Error(
      "Package foo@1.0.0 is licensed under GPL-3.0, which is not permitted by --onlyAllow",
    );

    expect(() => throwOnLicenseError({ error })).toThrow(error);
  });

  it("fails when checker finds dependency with not allowed license", async () => {
    const tempDir = await createTempDir();
    const badPackageName = "spectre-blofeld-operation";

    await fs.mkdir(path.join(tempDir, "node_modules", badPackageName), {
      recursive: true,
    });

    await fs.writeFile(
      path.join(tempDir, "package.json"),
      JSON.stringify(
        {
          name: "mi6-mission-control",
          version: "1.0.0",
          license: "MIT",
          dependencies: {
            [badPackageName]: "1.0.0",
          },
        },
        null,
        2,
      ),
      "utf-8",
    );

    await fs.writeFile(
      path.join(tempDir, "node_modules", badPackageName, "package.json"),
      JSON.stringify(
        {
          name: badPackageName,
          version: "1.0.0",
          license: "GPL-3.0",
          repository: "https://example.com/spectre/blofeld-operation",
        },
        null,
        2,
      ),
      "utf-8",
    );

    const result = spawnSync(
      process.execPath,
      [
        "-e",
        `const licensechecker = require("license-checker");\nlicensechecker.init({ start: ${JSON.stringify(
          tempDir,
        )}, production: false, onlyAllow: "MIT", customPath: ${JSON.stringify(
          customPath,
        )} }, () => {});`,
      ],
      {
        cwd: tempDir,
        encoding: "utf-8",
      },
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(badPackageName);
    expect(result.stderr).toContain("not permitted");
  });

  it("succeeds when checker finds dependency with allowed MIT license", async () => {
    const tempDir = await createTempDir();
    const goodPackageName = "mi6-q-branch-gadgets";

    await fs.mkdir(path.join(tempDir, "node_modules", goodPackageName), {
      recursive: true,
    });

    await fs.writeFile(
      path.join(tempDir, "package.json"),
      JSON.stringify(
        {
          name: "mission-goldeneye-tracker",
          version: "1.0.0",
          license: "MIT",
          dependencies: {
            [goodPackageName]: "1.0.0",
          },
        },
        null,
        2,
      ),
      "utf-8",
    );

    await fs.writeFile(
      path.join(tempDir, "node_modules", goodPackageName, "package.json"),
      JSON.stringify(
        {
          name: goodPackageName,
          version: "1.0.0",
          license: "MIT",
          repository: "https://example.com/mi6/q-branch-gadgets",
        },
        null,
        2,
      ),
      "utf-8",
    );

    const result = spawnSync(
      process.execPath,
      [
        "-e",
        `const licensechecker = require("license-checker");\nlicensechecker.init({ start: ${JSON.stringify(
          tempDir,
        )}, production: false, onlyAllow: "MIT", customPath: ${JSON.stringify(
          customPath,
        )} }, (err) => { if (err) { throw err; } console.log("ok"); });`,
      ],
      {
        cwd: tempDir,
        encoding: "utf-8",
      },
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("ok");
    expect(result.stderr).not.toContain("not permitted");
  });
});
