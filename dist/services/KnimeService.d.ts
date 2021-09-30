type ExtInfo<T = any> = {
    uicomponent: boolean;
    url: string;
    name: string;
    initData: T;
};
declare class KnimeService<T = any> {
    extInfo: ExtInfo<T>;
    constructor(extInfo: any);
}
export { ExtInfo, KnimeService };
