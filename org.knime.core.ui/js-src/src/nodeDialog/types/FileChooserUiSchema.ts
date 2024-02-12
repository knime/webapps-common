export type FileChooserUiSchemaOptions = {
  isWriter?: boolean;
  placeholder?: string;
  fileExtension?: string; // TODO replace with fileExtensionProvider
};

export type FileChooserUiSchema = {
  options?: FileChooserUiSchemaOptions;
};
