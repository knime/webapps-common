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
    getFlowVariableSettings() {
        var _a;
        return Promise.resolve(((_a = this.knimeService.extensionConfig) === null || _a === void 0 ? void 0 : _a.flowVariableSettings) || null);
    }
}

export { DialogService };
