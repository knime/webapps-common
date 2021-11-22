import { KnimeService, JsonDataService } from 'src/services';
import { extensionConfig } from 'test/mocks/extensionConfig';
import { ExtensionTypes, ResourceTypes } from './types';

window.getNodeViewInfo = () => extensionConfig;

const knime = new KnimeService({
    nodeId: '123',
    projectId: 'knime workflow',
    workflowId: 'root:10',
    resourceInfo: {
        id: 'org.knime.base.views.scatterplot.ScatterPlotNodeFactory',
        type: ResourceTypes.VUE_COMPONENT_LIB,
        path: null,
        url: 'http://localhost:4000/ScatterPlot.js'
    },
    nodeInfo: {
        nodeAnnotation: '',
        nodeState: 'executed',
        nodeErrorMessage: null,
        nodeWarnMessage: null,
        nodeName: 'Scatter Plot'
    },
    initialData: '{"settings":null}',
    extensionType: ExtensionTypes.VIEW
});

const jsonDataService = new JsonDataService(knime);

const asyncCall = async function () {
    // eslint-disable-next-line no-console
    console.log(await jsonDataService.initialData());
};

asyncCall();
