import { extensionConfig } from '.';

export const rpcInitialData = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    result: JSON.stringify(extensionConfig.initialData)
});
