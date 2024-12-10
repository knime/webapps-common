/* eslint-disable camelcase */
/* eslint-disable complexity */
import type { Result } from "../api/types/Result";
import type { IndicesValuePairs, UpdateResult } from "../types/Update";

const errorFolder = "Open me to see an error message!";

const mockUpdate2 = (rpcRequest: {
  method: string;
  params: any[];
}): Result<UpdateResult[]> => {
  if (rpcRequest.params[1] === "textMessage.json") {
    const {
      title: [{ value: title }],
      description: [{ value: description }],
      type: [{ value: type }],
      show: [{ value: show }],
    } = rpcRequest.params[2];
    return {
      state: "SUCCESS",
      result: [
        {
          id: "textMessageProvider",
          values: [
            {
              indices: [],
              value: show
                ? {
                    type,
                    title,
                    description,
                  }
                : null,
            },
          ],
          scopes: null,
        },
      ],
    };
  }
  if (rpcRequest.params[1] === "ElementResetButton") {
    return {
      state: "SUCCESS",
      result: [
        {
          id: null,
          scopes: [
            "#/properties/view/properties/dummyArrayLayout",
            "#/properties/doubleInput",
          ],
          values: [{ indices: [], value: 0 }],
        },
        {
          id: null,
          scopes: [
            "#/properties/view/properties/dummyArrayLayout",
            "#/properties/stringInput",
          ],
          values: [{ indices: [], value: "" }],
        },
        {
          id: null,
          scopes: [
            "#/properties/view/properties/dummyArrayLayout",
            "#/properties/radioInput",
          ],
          values: [{ indices: [], value: "OPTION1" }],
        },
      ],
    };
  }
  if (
    rpcRequest.params[1] === "buttonTriggerId (from simpleButtonControl.json)"
  ) {
    window.alert("Button was clicked!");
    return { state: "CANCELED" };
  }
  const dependencies = rpcRequest.params[2] as Record<
    string,
    IndicesValuePairs
  >;
  /**
   * See update.json
   */
  if (Object.keys(dependencies).includes("UpdatedByA")) {
    const {
      UpdatedByA: [{ value: UpdatedByA }],
    } = dependencies;
    return {
      state: "SUCCESS",
      result: [
        {
          scopes: ["#/properties/view/properties/updatedByUpdatedByA"],
          id: null,
          values: [{ indices: [], value: UpdatedByA }],
        },
      ],
    } satisfies Result<UpdateResult[]>;
  }
  if (Object.keys(dependencies).includes("UpdatedByB")) {
    const {
      UpdatedByB: [{ value: UpdatedByB }],
    } = dependencies;
    return {
      state: "SUCCESS",
      result: [
        {
          scopes: ["#/properties/view/properties/updatedByUpdatedByB"],
          id: null,
          values: [{ indices: [], value: UpdatedByB }],
        },
      ],
    } satisfies Result<UpdateResult[]>;
  }
  if (Object.keys(dependencies).includes("A")) {
    const {
      A: [{ value: A }],
      B: [{ value: B }],
    } = dependencies;
    return {
      state: "SUCCESS",
      result: [
        {
          scopes: ["#/properties/view/properties/sum"],
          id: null,
          // @ts-expect-error
          values: [{ indices: [], value: A + B }],
        },
        {
          scopes: ["#/properties/view/properties/product"],
          id: null,
          // @ts-expect-error
          values: [{ indices: [], value: A * B }],
        },
        {
          scopes: ["#/properties/view/properties/updatedByA"],
          id: null,
          values: [{ indices: [], value: A }],
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
          values: [{ indices: [], value: dependencies.B[0].value }],
        },
      ],
    } satisfies Result<UpdateResult[]>;
  } else if (Object.keys(dependencies).includes("A_nested")) {
    /**
     * See updatesInArray.json
     */
    const {
      A_nested: [{ value: A_nested }],
      B_nested: [{ value: B_nested }],
    } = dependencies;
    return {
      state: "SUCCESS",
      result: [
        {
          scopes: ["#/properties/view/properties/myArray", "#/properties/sum"],
          id: null,
          values: [
            {
              indices: [],
              // @ts-expect-error
              value: A_nested + B_nested,
            },
          ],
        },
        {
          scopes: [
            "#/properties/view/properties/myArray",
            "#/properties/product",
          ],
          id: null,
          values: [
            {
              indices: [],
              // @ts-expect-error
              value: `A * B ${A_nested * B_nested}`,
            },
          ],
        },
        {
          id: "myChoicesProvider",
          scopes: null,
          values: [
            {
              indices: [],
              value: [
                {
                  id: `A ${A_nested}`,
                  text: `A (${A_nested})`,
                },
                {
                  id: `B ${B_nested}`,
                  text: `B (${B_nested})`,
                },
                {
                  // @ts-expect-error
                  id: `A * B ${A_nested * B_nested}`,
                  // @ts-expect-error
                  text: `A * B (${A_nested * B_nested})`,
                },
              ],
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
          values: [{ indices: [], value: dependencies.Title[0].value }],
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
          values: [{ indices: [], value: dependencies.SubTitle[0].value }],
        },
      ],
    };
  } else {
    const {
      A_nested_nested: [{ value: A_nested_nested }],
      B_nested_nested: [{ value: B_nested_nested }],
    } = dependencies;
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
          values: [
            {
              indices: [],
              // @ts-expect-error
              value: A_nested_nested + B_nested_nested,
            },
          ],
        },
        {
          scopes: [
            "#/properties/view/properties/myArray",
            "#/properties/nestedArray",
            "#/properties/product",
          ],
          id: null,
          values: [
            {
              indices: [],
              // @ts-expect-error
              value: `A * B ${A_nested_nested * B_nested_nested}`,
            },
          ],
        },
        {
          id: "myNestedChoicesProvider",
          scopes: null,
          values: [
            {
              indices: [],
              value: [
                {
                  id: `A ${A_nested_nested}`,
                  text: `A (${A_nested_nested})`,
                },
                {
                  id: `B ${B_nested_nested}`,
                  text: `B (${B_nested_nested})`,
                },
                {
                  // @ts-expect-error
                  id: `A * B ${A_nested_nested * B_nested_nested}`,
                  // @ts-expect-error
                  text: `A * B (${A_nested_nested * B_nested_nested})`,
                },
              ],
            },
          ],
        },
      ],
    } satisfies Result<UpdateResult[]>;
  }
};

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
      return mockUpdate2(rpcRequest);
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
          parentFolders: [
            {
              path: null,
              name: null,
            },
            {
              path: "/",
              name: null,
            },
            {
              path: "/path",
              name: "path",
            },
            {
              path: "/path/to",
              name: "to",
            },
            {
              path: "/path/to/folder",
              name: "folder",
            },
          ],
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
