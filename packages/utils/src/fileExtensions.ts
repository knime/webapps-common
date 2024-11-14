export const getFileExtension = (nameOrPath: string) => {
  const basename = nameOrPath.split(/[\\/]/).pop();
  const position = basename?.lastIndexOf(".") as number;

  if (basename === "" || position < 1) {
    return "";
  }

  return basename?.slice(position + 1);
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
