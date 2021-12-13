const jsonRpcResponseHandler = (response) => {
    const error = response === null || response === void 0 ? void 0 : response.error;
    if (error) {
        return Promise.reject(new Error(`Error code: ${(error === null || error === void 0 ? void 0 : error.code) || 'UNKNOWN'}. Message: ${(error === null || error === void 0 ? void 0 : error.message) || 'not provided'}`));
    }
    return Promise.resolve(response === null || response === void 0 ? void 0 : response.result);
};

export { jsonRpcResponseHandler };
