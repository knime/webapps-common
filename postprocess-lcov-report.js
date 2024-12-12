/* eslint-disable no-process-exit */
/* eslint-disable no-console */
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";

// Get command-line arguments for file path and prefix
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Usage: node postprocess-lcov.mjs <lcovFilePath> <prefix>");
  process.exit(1);
}

const [lcovFilePathArg, prefixArg] = args;
const lcovFilePath = resolve(lcovFilePathArg);
const prefix = prefixArg;

try {
  // Read the lcov.info file
  const lcovContent = await readFile(lcovFilePath, "utf8");

  // Modify the file paths in the lcov content
  const updatedLcovContent = lcovContent.replace(
    /^SF:(.+)$/gm, // Match lines starting with "SF:"
    (_, filePath) => `SF:${prefix}${filePath}`,
  );

  // Write the updated content back to the lcov.info file
  await writeFile(lcovFilePath, updatedLcovContent, "utf8");

  console.log(`Updated ${lcovFilePath} file paths with prefix "${prefix}".`);
} catch (error) {
  console.error(`Error processing lcov file: ${error.message}`);
  process.exit(1);
}
