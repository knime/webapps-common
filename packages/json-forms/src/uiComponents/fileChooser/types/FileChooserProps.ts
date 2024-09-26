import { FileChooserOptions } from "@/nodeDialog/types/FileChooserUiSchema";

export enum FSCategory {
  LOCAL,
  CUSTOM_URL,
  CONNECTED,
  "relative-to-current-hubspace",
  "relative-to-embedded-data",
}

export interface FileChooserValue {
  path: string;
  timeout: number;
  fsCategory: keyof typeof FSCategory;
  context?: {
    fsToString: string;
    fsSpecifier?: string;
  };
}

interface FileChooserProps {
  modelValue: FileChooserValue;
  disabled: boolean;
  id: string | null;
  options?: FileChooserOptions;
}
export default FileChooserProps;
