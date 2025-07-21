import { generateRequestId } from "./generateRequestId";

const JSON_RPC_VERSION = "2.0";

type JsonRpcRequest = {
  jsonrpc: string;
  method: unknown;
  params: unknown[];
  id: number;
};

export const createJsonRpcRequest = (
  method: string,
  params: unknown[] = [],
): JsonRpcRequest => ({
  jsonrpc: JSON_RPC_VERSION,
  method,
  params,
  id: generateRequestId(),
});
