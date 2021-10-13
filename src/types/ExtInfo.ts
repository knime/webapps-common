// @TODO: NXTEXT-80 add JSDoc comments
export type ExtInfo<T = any> = {
    nodeId: string;
    uicomponent?: boolean;
    url?: string;
    name?: string;
    initData?: T;
};
