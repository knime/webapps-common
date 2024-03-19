import { BackendType } from ".";

interface StringFileChooserInputWithExplorerProps {
  modelValue: string;
  disabled: boolean;
  options?: {
    placeholder?: string;
    isWriter?: boolean;
    fileExtension?: string;
    fileExtensions?: string[];
    fileExtensionProvider?: string;
  };
  id: string | null;
  backendType: BackendType;
}

export default StringFileChooserInputWithExplorerProps;
