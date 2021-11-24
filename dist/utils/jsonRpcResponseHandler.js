const jsonRpcResponseHandler = (response) => {
    const { error } = response;
    if (error) {
        return Promise.reject(new Error(`Error code: ${(error === null || error === void 0 ? void 0 : error.code) || 'UNKNOWN'}. Message: ${(error === null || error === void 0 ? void 0 : error.message) || 'not provided'}`));
    }
    return Promise.resolve(response.result);
};

export { jsonRpcResponseHandler };
