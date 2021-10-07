export type ExtInfo<T = any> = {
    nodeId: string;
    uicomponent?: boolean;
    url?: string;
    name?: string;
    initData?: T;
};
