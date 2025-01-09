export interface AlertParams {
  type: "error" | "warning";
  message: string;
  details?: string;
}
