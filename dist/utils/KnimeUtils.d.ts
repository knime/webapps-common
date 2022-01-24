declare const KnimeUtils: {
    UI_EXT_POST_MESSAGE_PREFIX: "knimeUIExtension";
    UI_EXT_POST_MESSAGE_TIMEOUT: 10000;
    generateRequestId: () => number;
    createJsonRpcRequest: (method: any, params?: any[]) => {
        jsonrpc: string;
        method: any;
        params: string | string[];
        id: number;
    };
};
export { KnimeUtils };
