import { NodeService } from "src/types";
import { generateRequestId } from "./generateRequestId";

const JSON_RPC_VERSION = "2.0";

type JsonRpcRequest = {
  jsonrpc: string;
  method: any;
  params: string | string[];
  id: number;
};

export const createJsonRpcRequest = (
  method: NodeService | string,
  params = [],
): JsonRpcRequest => ({
  jsonrpc: JSON_RPC_VERSION,
  method,
  params,
  id: generateRequestId(),
});
