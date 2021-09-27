import { KnimeService, JSONDataService } from './services';
import { extInfo } from '../test/mocks/extInfo';

const knime = new KnimeService(extInfo);
const jsonDataService = new JSONDataService(knime);

jsonDataService.getInitialData();
