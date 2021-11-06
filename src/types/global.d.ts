export {};
declare global {
  export interface Window {
    getNodeViewInfo: () => any;
    jsonrpc?: (request: any) => any;
    jsonrpcNotification?: (param?: any) => any;
  }
}
