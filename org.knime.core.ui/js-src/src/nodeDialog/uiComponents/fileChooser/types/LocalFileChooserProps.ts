interface LocalFileChooserProps {
  modelValue: string;
  disabled: boolean;
  options?: {
    placeholder?: string;
    isWriter?: boolean;
    fileExtension?: string; // TODO use fileExtensionProvider instead
  };
  id: string | null;
}

export default LocalFileChooserProps;
