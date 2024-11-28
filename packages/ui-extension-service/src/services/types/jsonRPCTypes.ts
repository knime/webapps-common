/* eslint-disable no-magic-numbers */
export interface JSONRPCSuccessResponse {
  result: any;
  error?: null;
  warningMessages?: string[];
}

export const USER_ERROR_CODE = -32001;
export const INTERNAL_ERROR_CODE = -32000;

export type JsonRpcUserError = {
  code: typeof USER_ERROR_CODE;
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
  code: Exclude<number, typeof INTERNAL_ERROR_CODE | typeof USER_ERROR_CODE>;
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
