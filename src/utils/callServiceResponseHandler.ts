import { CallServiceResponse } from '../types';

export const callServiceResponseHandler = (response: CallServiceResponse | null) => {
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
