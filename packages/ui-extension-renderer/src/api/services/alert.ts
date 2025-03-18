export const USER_ERROR_CODE = -32001;
export const INTERNAL_ERROR_CODE = -32000;
export const USER_ERROR_CODE_BLOCKING = -32002;

export type UserErrorCode =
  | typeof USER_ERROR_CODE
  | typeof USER_ERROR_CODE_BLOCKING;

export type AlertType = "error" | "warn";

export type WarningData = {
  message: string;
  details?: string;
};

export type WarningAlert = {
  type: "warn";
  warnings: WarningData[];
};

export type UserErrorAlert = {
  type: "error";
  code: UserErrorCode;
  message: string;
  data: {
    details?: string | null;
  };
};

export type InternalErrorAlert = {
  type: "error";
  code: typeof INTERNAL_ERROR_CODE;
  message: string;
  data: {
    stackTrace: string[];
    typeName: string;
  };
};

export type OtherErrorAlert = {
  type: "error";
  /**
   * This code is just an internal tool to identify the error type. If there exists a
   * specific code for the error, it is instead stored in the `originalCode` field.
   */
  code?: null;
  /**
   * We include this as a separate field since if we would use it as the `code` field,
   * it would no longer be possible to distinguish between a generic error and a
   * user/internal error for typescript by checking the `code` field.
   */
  originalCode?: Exclude<number, typeof INTERNAL_ERROR_CODE | UserErrorCode>;
  message: string;
  data?: null;
};

export type ErrorAlert = UserErrorAlert | InternalErrorAlert | OtherErrorAlert;

export type Alert = ErrorAlert | WarningAlert;
