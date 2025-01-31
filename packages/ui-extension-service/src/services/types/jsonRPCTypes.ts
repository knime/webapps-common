/* eslint-disable no-magic-numbers */
export interface JSONRPCSuccessResponse {
  result: any;
  error?: null;
  warningMessages?: string[];
}

export const USER_ERROR_CODE = -32001;
export const INTERNAL_ERROR_CODE = -32000;
export const USER_ERROR_CODE_BLOCKING = -32002;

export type UserErrorCode =
  | typeof USER_ERROR_CODE
  | typeof USER_ERROR_CODE_BLOCKING;

export type JsonRpcUserError = {
  code: UserErrorCode;
  message: string;
  data: {
    details?: string | null;
  };
};

export type JsonRpcInternalError = {
  code: typeof INTERNAL_ERROR_CODE;
  message: string;
  data: {
    stackTrace: string[];
    typeName: string;
  };
};
export interface JsonRpcOtherError {
  code: Exclude<number, typeof INTERNAL_ERROR_CODE | UserErrorCode>;
  message: string;
  data: null;
}

/**
 *  See org.knime.core.webui.data.rpc.json.impl.JsonRpcSingleServer
 */
export type JSONRPCError =
  | JsonRpcUserError
  | JsonRpcInternalError
  | JsonRpcOtherError;

export interface JSONRPCErrorResponse {
  error: JSONRPCError;
}

export type JSONRPCResponse = JSONRPCSuccessResponse | JSONRPCErrorResponse;
