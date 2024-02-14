export type FileChooserUiSchemaOptions = {
  isWriter?: boolean;
  placeholder?: string;
  fileExtension?: string;
  fileExtensionProvider?: string;
};

export type FileChooserUiSchema = {
  options?: FileChooserUiSchemaOptions;
};
