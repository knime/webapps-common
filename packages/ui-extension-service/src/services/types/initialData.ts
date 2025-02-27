export type InitialDataResponse = {
  result: unknown;
  warningMessages: string[];
  userError?: {
    message: string;
    details?: string | null;
  };
  internalError?: {
    message: string;
    stackTrace: string[];
    typeName: string;
  };
};
