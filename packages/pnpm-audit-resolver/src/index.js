/* eslint-disable no-console */
import fs from "fs/promises";
import path from "path";

const updateAuditConfig = async () => {
  const rootDir = process.cwd();
  const auditResolvePath = path.join(rootDir, "audit-resolve.json");
  const packageJsonPath = path.join(rootDir, "package.json");

  // Read and parse audit-resolve.json
  let auditResolveRaw;
  try {
    auditResolveRaw = await fs.readFile(auditResolvePath, "utf-8");
  } catch {
    throw "Could not find 'audit-resolve.json' file in your root directory";
  }

  const auditData = JSON.parse(auditResolveRaw);

  // Read and parse package.json
  const packageJsonRaw = await fs.readFile(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(packageJsonRaw);

  // Initialize pnpm audit config if not already present
  packageJson.pnpm = packageJson.pnpm || {};
  packageJson.pnpm.auditConfig = packageJson.pnpm.auditConfig || {};
  let ignoreGhsas = Array.isArray(packageJson.pnpm.auditConfig.ignoreGhsas)
    ? packageJson.pnpm.auditConfig.ignoreGhsas
    : [];

  const currentTime = Date.now();

  // Process each audit resolution from audit-resolve.json
  for (const [ghsaId, resolution] of Object.entries(auditData)) {
    if (resolution.decision === "ignore") {
      // If the ignore decision is still valid (not expired), add the GHSA id if it's missing
      if (currentTime < resolution.expiresAt) {
        if (!ignoreGhsas.includes(ghsaId)) {
          ignoreGhsas.push(ghsaId);
          console.log(`Added ${ghsaId} to ignore list.`);
        }
      } else {
        // If expired, remove it from the list if present
        if (ignoreGhsas.includes(ghsaId)) {
          ignoreGhsas = ignoreGhsas.filter((id) => id !== ghsaId);
          console.log(`Removed expired ${ghsaId} from ignore list.`);
        }
      }
    } else {
      console.log(`Decision for ${ghsaId} is not 'ignore'; skipping.`);
    }
  }

  // Update the package.json audit configuration
  packageJson.pnpm.auditConfig.ignoreGhsas = ignoreGhsas;

  // Write the updated package.json back to disk
  await fs.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    "utf-8",
  );
  console.log("Updated package.json audit configuration.");
};

updateAuditConfig().catch((error) => {
  console.error("Error updating audit configuration:", error);
});
