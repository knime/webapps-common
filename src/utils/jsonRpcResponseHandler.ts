import { JsonRpcResponse } from '../types';

export const jsonRpcResponseHandler = (response: JsonRpcResponse | null) => {
    const { error, result } = response || {};
    if (error) {
        return Promise.reject(
            new Error(
                `Error code: ${error.code || 'UNKNOWN'}. Message: ${
                    error.message || 'not provided'
                }`
            )
        );
    }

    return Promise.resolve(result);
};
