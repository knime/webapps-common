export type State = "info" | "error" | "success" | "cancelled";

export type ProgressItemProps = {
  id: string;
  fileName: string;
  percentage?: number;
  fileSize?: number;
  status?: State;
};
