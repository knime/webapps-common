/* eslint-disable complexity */
import Result from "../api/types/Result";
import { UpdateResult } from "../types/Update";

const errorFolder = "Open me to see an error message!";

export default (rpcRequest: { method: string; params: any[] }) => {
  switch (rpcRequest.method) {
    case "flowVariables.getAvailableFlowVariables":
      return {
        STRING: [
          {
            name: "stringVariable",
            value: "the string flow variable value (abbrevia...",
            abbreviated: true,
          },
          {
            name: "nullVariable",
            value: null,
            abbreviated: false,
          },
        ],
        BOOLEAN: [
          { name: "booleanVariable", value: "true", abbreviated: false },
        ],
        CREDENTIALS: [
          {
            name: "credentialsVariable",
            value: "Credentials (...)",
            abbreviated: false,
          },
        ],
        NUMBER: [{ name: "numberVariable", value: "100", abbreviated: false }],
      };
    case "settings.update2": {
      if (rpcRequest.params[1] === "ElementResetButton") {
        return {
          state: "SUCCESS",
          result: [
            {
              scopes: [
                "#/properties/view/properties/dummyArrayLayout",
                "#/properties/doubleInput",
              ],
              value: 0,
            },
            {
              scopes: [
                "#/properties/view/properties/dummyArrayLayout",
                "#/properties/stringInput",
              ],
              value: "",
            },
            {
              scopes: [
                "#/properties/view/properties/dummyArrayLayout",
                "#/properties/radioInput",
              ],
              value: "OPTION1",
            },
          ],
        };
      }
      if (
        rpcRequest.params[1] ===
        "buttonTriggerId (from simpleButtonControl.json)"
      ) {
        window.alert("Button was clicked!");
        return { result: [] };
      }
      const dependencies = rpcRequest.params[2];
      /**
       * See update.json
       */
      if (Object.keys(dependencies).includes("UpdatedByA")) {
        return {
          state: "SUCCESS",
          result: [
            {
              scopes: ["#/properties/view/properties/updatedByUpdatedByA"],
              id: null,
              value: dependencies.UpdatedByA,
            },
          ],
        } satisfies Result<UpdateResult[]>;
      }
      if (Object.keys(dependencies).includes("UpdatedByB")) {
        return {
          state: "SUCCESS",
          result: [
            {
              scopes: ["#/properties/view/properties/updatedByUpdatedByB"],
              id: null,
              value: dependencies.UpdatedByB,
            },
          ],
        } satisfies Result<UpdateResult[]>;
      }
      if (Object.keys(dependencies).includes("A")) {
        return {
          state: "SUCCESS",
          result: [
            {
              scopes: ["#/properties/view/properties/sum"],
              id: null,
              value: dependencies.A + dependencies.B,
            },
            {
              scopes: ["#/properties/view/properties/product"],
              id: null,
              value: dependencies.A * dependencies.B,
            },
            {
              scopes: ["#/properties/view/properties/updatedByA"],
              id: null,
              value: dependencies.A,
            },
          ],
        } satisfies Result<UpdateResult[]>;
      } else if (Object.keys(dependencies).includes("B")) {
        return {
          state: "SUCCESS",
          result: [
            {
              scopes: ["#/properties/view/properties/updatedByB"],
              id: null,
              value: dependencies.B,
            },
          ],
        } satisfies Result<UpdateResult[]>;
      } else if (Object.keys(dependencies).includes("A_nested")) {
        /**
         * See updatesInArray.json
         */
        return {
          state: "SUCCESS",
          result: [
            {
              scopes: [
                "#/properties/view/properties/myArray",
                "#/properties/sum",
              ],
              id: null,
              value: dependencies.A_nested + dependencies.B_nested,
            },
            {
              scopes: [
                "#/properties/view/properties/myArray",
                "#/properties/product",
              ],
              id: null,
              value: `A * B ${dependencies.A_nested * dependencies.B_nested}`,
            },
            {
              id: "myChoicesProvider",
              scopes: null,
              value: [
                {
                  id: `A ${dependencies.A_nested}`,
                  text: `A (${dependencies.A_nested})`,
                },
                {
                  id: `B ${dependencies.B_nested}`,
                  text: `B (${dependencies.B_nested})`,
                },
                {
                  id: `A * B ${dependencies.A_nested * dependencies.B_nested}`,
                  text: `A * B (${
                    dependencies.A_nested * dependencies.B_nested
                  })`,
                },
              ],
            },
          ],
        } satisfies Result<UpdateResult[]>;
      } else if (Object.keys(dependencies).includes("Title")) {
        return {
          state: "SUCCESS",
          result: [
            {
              scopes: null,
              id: "myTitleProvider",
              value: dependencies.Title,
            },
          ],
        };
      } else if (Object.keys(dependencies).includes("SubTitle")) {
        return {
          state: "SUCCESS",
          result: [
            {
              scopes: null,
              id: "mySubTitleProvider",
              value: dependencies.SubTitle,
            },
          ],
        };
      } else {
        /**
         * See updatesInArray.json
         */
        return {
          state: "SUCCESS",
          result: [
            {
              scopes: [
                "#/properties/view/properties/myArray",
                "#/properties/nestedArray",
                "#/properties/sum",
              ],
              id: null,
              value:
                dependencies.A_nested_nested + dependencies.B_nested_nested,
            },
            {
              scopes: [
                "#/properties/view/properties/myArray",
                "#/properties/nestedArray",
                "#/properties/product",
              ],
              id: null,
              value: `A * B ${
                dependencies.A_nested_nested * dependencies.B_nested_nested
              }`,
            },
            {
              id: "myNestedChoicesProvider",
              scopes: null,
              value: [
                {
                  id: `A ${dependencies.A_nested_nested}`,
                  text: `A (${dependencies.A_nested_nested})`,
                },
                {
                  id: `B ${dependencies.B_nested_nested}`,
                  text: `B (${dependencies.B_nested_nested})`,
                },
                {
                  id: `A * B ${
                    dependencies.A_nested_nested * dependencies.B_nested_nested
                  }`,
                  text: `A * B (${
                    dependencies.A_nested_nested * dependencies.B_nested_nested
                  })`,
                },
              ],
            },
          ],
        } satisfies Result<UpdateResult[]>;
      }
    }
    case "flowVariables.getFlowVariableOverrideValue":
      switch (
        JSON.parse(rpcRequest.params[0]).flowVariableSettings[
          rpcRequest.params[1].join(".")
        ].controllingFlowVariableName
      ) {
        case "stringVariable":
          return "some string";
        case "booleanVariable":
          return true;
        case "nullVariable":
          return null;
        case "numberVariable":
          return 100;
        case "credentialsVariable":
          return {
            username: "Hello",
            isHiddenPassword: true,
          };
        default:
          return "someValue";
      }
    case "settings.getChoices":
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
          message: ["Async choices fetching failed because xyz"],
        };
      }
    case "fileChooser.listItems":
      return {
        folder: {
          items: [
            {
              isDirectory: true,
              name: "I am a directory",
            },
            {
              isDirectory: true,
              name: errorFolder,
            },
            {
              isDirectory: false,
              name: "I am a file, select me!",
            },
          ],
          path: "/path/to/folder",
        },
        ...(rpcRequest.params[2] === errorFolder
          ? { errorMessage: "I am an error message" }
          : {}),
      };
    case "fileChooser.getFilePath":
      return { path: `path/to/folder/${rpcRequest.params[2]}` };
    default:
      return null;
  }
};
