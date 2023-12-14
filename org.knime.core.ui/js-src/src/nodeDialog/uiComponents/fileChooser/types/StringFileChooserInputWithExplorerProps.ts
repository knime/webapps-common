import { BackendType } from ".";

interface StringFileChooserInputWithExplorerProps {
  modelValue: string;
  disabled: boolean;
  placeholder: string;
  id: string | null;
  backendType: BackendType;
}

export default StringFileChooserInputWithExplorerProps;
