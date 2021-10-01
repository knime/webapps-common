import { KnimeService, JSONDataService } from './services';
import { extInfo } from '../test/mocks/extInfo';

(window as any).getNodeViewInfo = () => extInfo;

const knime = new KnimeService({
    nodeId: '123',
    initData: '{"settings":null}'
});
const jsonDataService = new JSONDataService(knime);


const asyncCall = async function () {
    // eslint-disable-next-line no-console
    console.log(await jsonDataService.getInitialData());
};

asyncCall();
