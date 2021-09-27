import { ExtInfo } from 'src/types/ExtInfo';

export class KnimeService<T = null> {
    extInfo: ExtInfo<T>;

    constructor(extInfo) {
        this.extInfo = extInfo;
    }
}
