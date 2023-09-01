export default (rpcRequest: { method: string; params: any[] }) => {
  switch (rpcRequest.method) {
    case "getAvailableFlowVariables":
      return {
        STRING: [
          {
            name: "stringVariable",
            value: "the string flow variable value (abbrevia...",
            abbreviated: true,
          },
        ],
        BOOLEAN: [
          { name: "booleanVariable", value: "true", abbreviated: false },
        ],
        NUMBER: [{ name: "numberVariable", value: "100", abbreviated: false }],
      };
    case "getFlowVariableOverrideValue":
      switch (
        JSON.parse(rpcRequest.params[0]).flowVariableSettings[
          rpcRequest.params[1].join(".")
        ].controllingFlowVariableName
      ) {
        case "stringVariable":
          return "some string";
        case "booleanVariable":
          return true;
        case "numberVariable":
          return 100;
        default:
          return "someValue";
      }
    case "getChoices":
      if (rpcRequest.params[0] === "successfulChoicesProvider") {
        return {
          result: [
            {
              id: "NONE",
              text: "None",
            },
            {
              id: "COUNT",
              text: "Occurrence count",
            },
            {
              id: "SUM",
              text: "Sum",
            },
            {
              id: "AVG",
              text: "Average",
            },
          ],
          state: "SUCCESS",
        };
      } else {
        return {
          state: "FAIL",
          message: "Async choices fetching failed because xyz",
        };
      }
    default:
      return null;
  }
};
