type ExtInfo<T = any> = {
    nodeId: string;
    uicomponent?: boolean;
    url?: string;
    name?: string;
    initData?: T;
};
export { ExtInfo };
export * from "./types/JSONRpcServices";
export * from "./types/ViewDataServiceMethods";
