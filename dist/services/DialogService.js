import { createFlowVariablesMap } from '../utils/flowVariablesUtils.js';

/**
 * A utility class to interact with Dialog settings implemented by a UI Extension node.
 */
class DialogService {
    /**
     * @param {KnimeService<T> | IFrameKnimeService} knimeService - knimeService instance which is used to communicate
     *      with the framework.
     */
    constructor(knimeService) {
        this.knimeService = knimeService;
    }
    /**
     * @returns {FlowVariableSettings | null} - maps of model and view flow variables settings.
     */
    async getFlowVariableSettings() {
        var _a;
        const flowSettings = await Promise.resolve(((_a = this.knimeService.extensionConfig) === null || _a === void 0 ? void 0 : _a.flowVariableSettings) || {});
        return createFlowVariablesMap(flowSettings);
    }
}

export { DialogService };
