export enum FSCategory {
  LOCAL,
  CUSTOM_URL,
  "relative-to-current-hubspace",
}

export interface FileChooserValue {
  path: string;
  timeout: number;
  fsCategory: keyof typeof FSCategory;
  context?: {
    fsToString: string;
  };
}

export type WriterProps = {};

interface FileChooserProps {
  modelValue: FileChooserValue;
  disabled: boolean;
  id: string | null;
  browseOptions?: {
    isWriter?: boolean;
    fileExtension?: string; // TODO use fileExtensionProvider instead
  };
}

export default FileChooserProps;
