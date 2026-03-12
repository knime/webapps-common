import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import defaultConfig from "../config/license.config.js";

const DEFAULT_PROJECT_CONFIG_FILES = [
  "license.config.js",
  "license.config.mjs",
  "license.config.cjs",
  "license.config.json",
];

const toArray = (value) => (Array.isArray(value) ? value : []);

const arrayUnique = (values) => Array.from(new Set(values));

const mergeArrayBySerializedValue = (left = [], right = []) => {
  const seen = new Set();
  const merged = [];

  [...toArray(left), ...toArray(right)].forEach((entry) => {
    const serialized = JSON.stringify(entry);
    if (!seen.has(serialized)) {
      seen.add(serialized);
      merged.push(entry);
    }
  });

  return merged;
};

const mergeLicenseConfig = (baseConfig, projectConfig = {}) => ({
  ...baseConfig,
  ...projectConfig,
  onlyAllow: arrayUnique([
    ...toArray(baseConfig.onlyAllow),
    ...toArray(projectConfig.onlyAllow),
  ]),
  excludePackages: arrayUnique([
    ...toArray(baseConfig.excludePackages),
    ...toArray(projectConfig.excludePackages),
  ]),
  manualPackages: mergeArrayBySerializedValue(
    baseConfig.manualPackages,
    projectConfig.manualPackages,
  ),
});

const loadConfigFile = async (configFilePath) => {
  if (configFilePath.endsWith(".json")) {
    const content = await fs.promises.readFile(configFilePath, "utf-8");
    return JSON.parse(content);
  }

  const importedModule = await import(pathToFileURL(configFilePath).href);
  return importedModule.default ?? importedModule;
};

const findProjectConfig = (basePath, configPath) => {
  if (configPath) {
    return path.resolve(basePath, configPath);
  }

  return DEFAULT_PROJECT_CONFIG_FILES.map((candidate) =>
    path.resolve(basePath, candidate),
  ).find((candidatePath) => fs.existsSync(candidatePath));
};

export const loadAndMergeLicenseConfig = async ({ basePath, configPath }) => {
  const resolvedProjectConfigPath = findProjectConfig(basePath, configPath);

  if (!resolvedProjectConfigPath) {
    return {
      ...defaultConfig,
      onlyAllow: [...toArray(defaultConfig.onlyAllow)],
      excludePackages: [...toArray(defaultConfig.excludePackages)],
      manualPackages: [...toArray(defaultConfig.manualPackages)],
    };
  }

  if (!fs.existsSync(resolvedProjectConfigPath)) {
    return {
      ...defaultConfig,
      onlyAllow: [...toArray(defaultConfig.onlyAllow)],
      excludePackages: [...toArray(defaultConfig.excludePackages)],
      manualPackages: [...toArray(defaultConfig.manualPackages)],
    };
  }

  const projectConfig = await loadConfigFile(resolvedProjectConfigPath);

  if (!projectConfig || typeof projectConfig !== "object") {
    throw new Error(
      `Invalid project license config at ${resolvedProjectConfigPath}. Expected an object.`,
    );
  }

  return mergeLicenseConfig(defaultConfig, projectConfig);
};
