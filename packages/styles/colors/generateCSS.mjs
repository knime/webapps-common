/* eslint-disable no-console */
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Converts string to camelCase
 * @param {String} str Input string
 * @returns {String}
 */
const camelToSnake = (str) =>
  str.replace(
    /(.?)([A-Z])/g,
    (_, before, letter) =>
      `${before}${before ? "-" : ""}${letter.toLowerCase()}`,
  );

/* ['filename', css variable prefix, output file] */
const assets = [
  ["knimeColors", "knime", "../css/variables/knime-colors.css"],
  ["nodeColors", "knime-node", "../css/variables/nodes.css"],
  ["portColors", "knime-port", "../css/variables/ports.css"],
];

/**
 * Converts a [key, value] pair into a css property
 * @param {String} prefix Adds the given prefix to the css property name
 * @returns {String} css property
 */
const objectEntryToStyleProperty =
  (prefix = "") =>
  ([key, value]) =>
    `--${prefix}-${camelToSnake(key)}: ${value}`;

/**
 * Converts an object's keys and values into css property declarations
 * using the object key as the css property name and the object value as the
 * css property value
 * @param {Object} inputObject
 * @param {String} prefix prefix to add to the css property name
 * @param {String} generatedPath path where the css file will be written to
 * @returns {String} generated css file contents
 */
const generateCSSFromObject = (inputObject, prefix, generatedPath) => {
  const l1 = "/* This is an auto-generated file.\n";
  const l2 = " * Do not change manually.\n";
  const l3 = ` * Changes should go to ${generatedPath}.\n`;
  const l4 = "*/\n\n";

  const cssProperties = Object.entries(inputObject)
    .map(objectEntryToStyleProperty(prefix))
    .join(";\n  ");

  const variables = `:root {\n  ${cssProperties};\n}\n`;

  return [].concat(l1, l2, l3, l4, variables).join("");
};

const generateCss = async () => {
  for (let [filename, prefix, output] of assets) {
    const filePath = `${path.join(__dirname, filename)}.mjs`;
    const fileContentJS = await import(pathToFileURL(filePath).toString());

    const outputPath = path.join(__dirname, output);

    console.log("Generating CSS at:", outputPath);
    const contents = generateCSSFromObject(
      fileContentJS,
      prefix,
      filePath.replace(/.*webapps-common\//, ""),
    );
    fs.writeFileSync(path.join(__dirname, output), contents);
  }
};

generateCss();
