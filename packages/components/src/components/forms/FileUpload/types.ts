export type State = "info" | "error" | "success" | "cancelled";

export type AllowedFileFormat =
  | "csv"
  | "docx"
  | "html"
  | "md"
  | "odp"
  | "ods"
  | "odt"
  | "pdf"
  | "pptx"
  | "ps"
  | "xls"
  | "xlsx"
  | "xml"
  | "zip"
  | "exe"
  | "txt";

export type ProgressItemProps = {
  id: string;
  fileName: string;
  percentage?: number;
  fileSize?: number;
  status?: State;
};

export type DropzoneProps = {
  labelText?: string;
  allowedFiles: AllowedFileFormat[];
  disabled?: boolean;
};

export type List = ProgressItemProps & {
  abortController?: AbortController;
};

export type FileUploadProps = {
  modelValue: List[];
  label?: string;
  labelText?: string;
  supportedFormats?: AllowedFileFormat[];
  disabled?: boolean;
  disallowed?: boolean;
  numberOfVisibleItems?: number;
};
