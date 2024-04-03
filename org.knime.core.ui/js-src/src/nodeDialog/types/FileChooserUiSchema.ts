export interface FileChooserOptions {
  isWriter?: boolean;
  fileExtension?: string;
  fileExtensions?: string[];
  fileExtensionProvider?: string;
}

export type FileChooserUiSchema = {
  options?: FileChooserOptions;
};
