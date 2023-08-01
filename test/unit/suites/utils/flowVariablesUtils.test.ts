import { createFlowVariablesMap } from "src/utils/flowVariablesUtils";

describe("Utils", () => {
  it("createFlowVariablesMap maps flowVariables correctly", () => {
    const viewVariables = {
      test: {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: "knime.test",
        exposedFlowVariablename: "test",
        leaf: true,
      },
      nestedTest: {
        "0": {
          value: {
            controllingFlowVariableAvailable: true,
            controllingFlowVariableName: "knime.nestedTest",
            exposedFlowVariablename: "nestedTest",
            leaf: true,
          },
        },
        "1": {
          nestedTest2: {
            controllingFlowVariableAvailable: true,
            controllingFlowVariableName: "knime.nestedTest",
            exposedFlowVariablename: "nestedTest",
            leaf: true,
          },
        },
      },
    };
    const modelVariables = {};
    const expectedResult = {
      "view.test": {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: "knime.test",
        exposedFlowVariablename: "test",
        leaf: true,
      },
      "view.nestedTest.0.value": {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: "knime.nestedTest",
        exposedFlowVariablename: "nestedTest",
        leaf: true,
      },
      "view.nestedTest.1.nestedTest2": {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: "knime.nestedTest",
        exposedFlowVariablename: "nestedTest",
        leaf: true,
      },
    };
    expect(createFlowVariablesMap({ viewVariables, modelVariables })).toEqual(
      expectedResult,
    );
  });
});
