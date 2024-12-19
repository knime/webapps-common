/**
 * Gets the file extension
 * @param nameOrPath can take a full file name (e.g "file.txt") or a path to a file
 * (e.g "file://path/to/file.txt" OR "/path/to/file.txt")
 * @returns just the file extension (e.g "txt")
 */
export const getFileExtension = (nameOrPath: string): string => {
  const basename = nameOrPath.split(/[\\/]/).pop() ?? "";

  const parts = basename.split(".");

  if (basename === "" || parts.length === 1) {
    return "";
  }

  return parts.at(-1) ?? "";
};

/**
 * Metadata for .knar files, which corresponds to exported KNIME Workflow Groups
 * or Components
 */
const KNAR = Object.freeze({
  extension: "knar",
  mimeType: "application/vnd.knime.workflow-group+zip",
  matches(file: File) {
    const extension = getFileExtension(file.name);
    return extension === this.extension;
  },
});

/**
 * Metadata for .knwf files, which corresponds to exported KNIME Workflows
 */
const KNWF = Object.freeze({
  extension: "knwf",
  mimeType: "application/vnd.knime.workflow+zip",
  matches(file: File) {
    const extension = getFileExtension(file.name);
    return extension === this.extension;
  },
  /**
   * Gets the name of a .knwf file without the extension. If the file is not
   * matched as a .knwf file then this function will return the default value,
   * which is empty string ("") if param is not provided
   */
  getNameOrDefault(file: File, defaultValue = ""): string {
    if (!this.matches(file)) {
      return defaultValue;
    }

    return file.name.replace(`.${this.extension}`, "");
  },
});

export const knimeFileFormats = { KNAR, KNWF };

/**
 * Gets the mime type from a given file. Defaults to `application/octet-stream`
 * if mimeType cannot be detected
 * @param file File
 * @returns mimeType
 */
export const getFileMimeType = (file: File): string => {
  const DEFAULT_MIMETYPE = "application/octet-stream";

  const extension = getFileExtension(file.name);

  if (!extension) {
    return DEFAULT_MIMETYPE;
  }

  if (KNWF.matches(file)) {
    return KNWF.mimeType;
  }

  if (KNAR.matches(file)) {
    return KNAR.mimeType;
  }

  // file has extension but unrecognizable mime type
  if (!file.type) {
    return DEFAULT_MIMETYPE;
  }

  return file.type;
};
