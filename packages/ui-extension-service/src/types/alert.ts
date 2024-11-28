/* eslint-disable no-magic-numbers */

import {
  INTERNAL_ERROR_CODE,
  USER_ERROR_CODE,
} from "../services/types/jsonRPCTypes";

export { INTERNAL_ERROR_CODE, USER_ERROR_CODE };

export enum AlertType {
  ERROR = "error",
  WARN = "warn",
}

export type WarningData = {
  message: string;
  details?: string;
};

export type WarningAlert = {
  type: AlertType.WARN;
  warnings: WarningData[];
};

export type ErrorDetails = {};

export type UserErrorAlert = {
  type: AlertType.ERROR;
  code: typeof USER_ERROR_CODE;
  message: string;
  data: {
    details?: string | null;
  };
};

export type InternalErrorAlert = {
  type: AlertType.ERROR;
  code: typeof INTERNAL_ERROR_CODE;
  message: string;
  data: {
    stackTrace: string[];
    typeName: string;
  };
};

export type OtherErrorAlert = {
  type: AlertType.ERROR;
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
  originalCode?: Exclude<
    number,
    typeof INTERNAL_ERROR_CODE | typeof USER_ERROR_CODE
  >;
  message: string;
  data?: null;
};

export type ErrorAlert = UserErrorAlert | InternalErrorAlert | OtherErrorAlert;

export type Alert = ErrorAlert | WarningAlert;

export type AlertParams = {
  type: AlertType;
  /**
   * Message that should become visible to the user.
   */
  message: string;
  /**
   * Additional details about the problem that are displayed on demand.
   */
  details?: string;
};
