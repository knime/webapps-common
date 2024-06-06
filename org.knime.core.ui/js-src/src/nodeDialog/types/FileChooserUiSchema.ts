export interface FileChooserOptions {
  isWriter?: boolean;
  fileExtension?: string;
  fileExtensions?: string[];
  fileExtensionProvider?: string;
  mountId?: string;
  spacePath?: string;
}

export type FileChooserUiSchema = {
  options?: FileChooserOptions;
};
