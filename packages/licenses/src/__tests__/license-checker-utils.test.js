import { describe, expect, it } from "vitest";

import {
  buildLicenseCheckerOptions,
  toUniqueSortedPackages,
} from "../license-checker-utils.js";

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
});
