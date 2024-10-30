export type State = "info" | "error" | "success" | "cancelled";

export type ProgressItemProps = {
  id: string;
  fileName: string;
  percentage?: number;
  fileSize?: number;
  status?: State;
};

export type DropzoneProps = {
  labelText?: string;
  supportedFormats?: string[];
  disabled?: boolean;
};

export type FileUploadProps = {
  modelValue: ProgressItemProps[];
  label?: string;
  labelText?: string;
  supportedFormats?: string[];
  disabled?: boolean;
  disallowed?: boolean;
  maxDisplayedItems?: number;
};
