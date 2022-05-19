export type FlowVariableSetting = {
    controllingFlowVariableAvailable: boolean;
    controllingFlowVariableName: string | null;
    exposedFlowVariableName: string | null;
    leaf?: boolean;
    [key: string]: FlowVariableSetting | boolean | string | null | undefined;
};

export type FlowVariableSettings = {
    modelVariables: {
        [key: string]: FlowVariableSetting;
    };
    viewVariables: {
        [key: string]: FlowVariableSetting;
    };
};
