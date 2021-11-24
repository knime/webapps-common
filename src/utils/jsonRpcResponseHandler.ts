export const jsonRpcResponseHandler = (response) => {
    const { error } = response;
    if (error) {
        return Promise.reject(
            new Error(
                `Error code: ${error?.code || 'UNKNOWN'}. Message: ${
                    error?.message || 'not provided'
                }`
            )
        );
    }

    return Promise.resolve(response.result);
};
