#!/usr/bin/env node
/* eslint-disable no-process-env */
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const chalk = require("chalk");
const { Command } = require("commander");
const licensechecker = require("license-checker");
const pkgUp = require("pkg-up");
const semver = require("semver");

const config = require("../config/license.config");

const read = require("./read-packages");

const program = new Command();
const basePath = process.cwd();

program
  .name("KNIME License Checker and Open Source Credits collector")
  .description(
    "CLI to check for allowed licenses and collect open source license attributions",
  )
  .version("0.1.0");

program
  .option(
    "-c, --check-only",
    "Check for valid licenses and report not allowed ones",
  )
  .option("-s, --summary", "Print a summary of all used licenses")
  .option(
    "-o, --output <file>",
    "Location of the output file to be created, relative to the calling project root",
    path.resolve(basePath, "used-packages.json"),
  )
  // .option("-n, --no-overwrite", "skip generation of output file", true)
  .parse();

const programOptions = program.opts();
const outFile = path.resolve(basePath, programOptions.output);

const parentPkgPath =
  // find the package.json file path of the webapps-common parent project
  pkgUp.sync({ cwd: basePath }) ||
  // if used in development, there will be no parent project, so fallback to the root dir
  pkgUp.sync({ cwd: ".." });
const parentRoot = path.resolve(parentPkgPath, "..");

const checkLicenses = (knimePackages) => {
  // exclude parent package
  const parentPkg = require(parentPkgPath);

  // license-checker only accepts semver versions
  if (!semver.valid(parentPkg.version)) {
    throw new Error(`Invalid version ${parentPkg.version}`);
  }

  // semver.coerce does not respect prerelease, so we use semver.parse instead
  // see https://github.com/npm/node-semver/issues/473
  const parentPkgVersion = semver.parse(parentPkg.version, {
    includePrerelease: true,
  }).version;

  config.excludePackages.push(`${parentPkg.name}@${parentPkgVersion}`);
  config.excludePackages.push(...knimePackages);

  // collect all used production packages and their licenses
  const options = {
    start: parentRoot,
    production: false,
    onlyAllow: config.onlyAllow.join(";"),
    excludePackages: config.excludePackages.join(";"),
    customPath: path.resolve(
      __dirname,
      "../config/collect-packages-format.json",
    ),
  };

  licensechecker.init(options, (err, collectedPackages) => {
    if (err) {
      throw err;
    }
    if (programOptions.summary) {
      console.log("Summary of used licenses:");
      console.log(licensechecker.asSummary(collectedPackages));
    }
    if (programOptions.checkOnly) {
      console.log(
        chalk.green("License checker succeeded. All licenses allowed."),
      );
      return;
    }
    // convert collected packages to array and merge with manually added packages
    let allPackages = Object.values(collectedPackages).concat(
      config.manualPackages,
    );

    // keep only the needed props
    allPackages = allPackages.map((pkg) => ({
      name: pkg.name,
      repository: pkg.repository ?? "",
      licenseText: pkg.licenseText ?? "",
    }));

    let allUniquePackages = [];

    allPackages.forEach((pkg) => {
      const alreadyExists = allUniquePackages.some(
        (firstPkg) =>
          firstPkg.name.toLowerCase() === pkg.name.toLowerCase() &&
          firstPkg.repository?.toLowerCase() === pkg.repository.toLowerCase() &&
          firstPkg.licenseText?.replace(/\s+/g, "") ===
            pkg.licenseText.replace(/\s+/g, ""),
      );

      if (!alreadyExists) {
        allUniquePackages.push(pkg);
      }
    });

    // sort packages by name
    allUniquePackages.sort((a, b) => a.name.localeCompare(b.name));
    // write file to be imported by the app to show open source credits
    fs.writeFile(outFile, JSON.stringify(allUniquePackages), (err) => {
      if (err) {
        throw err;
      }
    });
  });
};

read(parentRoot, "@knime", (knimePackages) => {
  checkLicenses(knimePackages);
});
