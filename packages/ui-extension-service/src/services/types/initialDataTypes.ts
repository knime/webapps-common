export type InitialDataResponse = {
  result: any;
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
