import type { FunctionalComponent, SVGAttributes } from "vue";

export type State = "info" | "error" | "success" | "cancelled";

export type ProgressItemProps = {
  fileName: string;
  percentage?: number;
  fileSize?: number;
  status?: State;
};

export type DropzoneProps = {
  labelText?: string;
  supportedFormats?: string;
  icon: FunctionalComponent<SVGAttributes>;
  disabled?: boolean;
};

export type List = ProgressItemProps & {
  abortController?: AbortController;
};

export type FileUploadProps = {
  modelValue: List[];
  label?: string;
  labelText?: string;
  supportedFormats?: string;
  disabled?: boolean;
  disallowed?: boolean;
  scrollable?: number;
};
