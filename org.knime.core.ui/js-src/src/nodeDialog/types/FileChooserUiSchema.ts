export interface FileChooserOptions {
  isWriter?: boolean;
  isLocal?: boolean;
  portIndex?: number;
  fileSystemType?: string;
  fileSystemSpecifier?: string;
  /**
   * true whenever there exists a portIndex but a connection could not be established
   */
  fileSystemConnectionMissing?: true;
  fileExtension?: string;
  fileExtensions?: string[];
  fileExtensionProvider?: string;
  mountId?: string;
  spacePath?: string;
}

export type FileChooserUiSchema = {
  options?: FileChooserOptions;
};
