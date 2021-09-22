import { KnimeService, JsonDataService } from './services';
import { extInfo } from '../test/mocks/extInfo';

window.getNodeViewInfo = () => extInfo;

const knime = new KnimeService();
const jsonDataService = new JsonDataService(knime);

jsonDataService.getInitialData();
