export type JsonRpcResponse = {
    error: {
        code: string;
        message: string;
    };
    result: string;
};
