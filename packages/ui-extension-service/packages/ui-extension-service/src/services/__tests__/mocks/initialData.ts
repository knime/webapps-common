import { extensionConfig } from ".";

export const initialData = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  result: JSON.stringify(extensionConfig.initialData),
});
