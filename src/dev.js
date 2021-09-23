import { KnimeService, JSONDataService } from './services';
import { extInfo } from '../test/mocks/extInfo';

window.getNodeViewInfo = () => extInfo;

const knime = new KnimeService();
const jsonDataService = new JSONDataService(knime);

jsonDataService.getInitialData();
