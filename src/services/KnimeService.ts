import { ExtInfo } from 'src/types/ExtInfo';

export class KnimeService<T = any> {
    extInfo: ExtInfo<T>;

    constructor(extInfo) {
        this.extInfo = extInfo;
    }
}
