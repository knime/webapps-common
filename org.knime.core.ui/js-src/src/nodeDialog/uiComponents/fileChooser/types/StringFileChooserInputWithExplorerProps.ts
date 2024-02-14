import { BackendType } from ".";

interface StringFileChooserInputWithExplorerProps {
  modelValue: string;
  disabled: boolean;
  options?: {
    placeholder?: string;
    isWriter?: boolean;
    fileExtension?: string; // TODO use fileExtensionProvider instead
  };
  id: string | null;
  backendType: BackendType;
}

export default StringFileChooserInputWithExplorerProps;
