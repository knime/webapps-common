export enum FSCategory {
  LOCAL,
  CUSTOM_URL,
}

export interface FileChooserValue {
  path: string;
  timeout: number;
  fsCategory: keyof typeof FSCategory;
  context?: {
    fsToString: string;
  };
}

interface FileChooserProps {
  modelValue: FileChooserValue;
  disabled: boolean;
  id: string | null;
}

export default FileChooserProps;
