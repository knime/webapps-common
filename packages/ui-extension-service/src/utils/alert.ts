import type { InitialDataResponse } from "../services/types/initialDataTypes";
import {
  INTERNAL_ERROR_CODE,
  USER_ERROR_CODE,
} from "../services/types/jsonRPCTypes";
import {
  AlertType,
  type InternalErrorAlert,
  type UserErrorAlert,
} from "../types";

export const initialDataResponseToAlert = (
  initialDataResponse: InitialDataResponse,
): null | UserErrorAlert | InternalErrorAlert => {
  if (initialDataResponse.userError) {
    return {
      type: AlertType.ERROR,
      code: USER_ERROR_CODE,
      message: initialDataResponse.userError.message,
      data: {
        details: initialDataResponse.userError.details,
      },
    };
  }
  if (initialDataResponse.internalError) {
    return {
      type: AlertType.ERROR,
      code: INTERNAL_ERROR_CODE,
      message: initialDataResponse.internalError.message,
      data: {
        stackTrace: initialDataResponse.internalError.stackTrace,
        typeName: initialDataResponse.internalError.typeName,
      },
    };
  }
  return null;
};
