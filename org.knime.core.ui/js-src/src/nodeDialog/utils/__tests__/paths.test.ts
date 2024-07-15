import { describe, expect, it } from "vitest";
import {
  getConfigPaths,
  getDataPaths,
  getLongestCommonPrefix,
  getSubConfigKeys,
} from "../paths";
import Control, { Schema } from "@/nodeDialog/types/Control";

describe("paths", () => {
  const createControl = (
    schema: Schema,
    rootSchema: Control["rootSchema"],
  ): Control =>
    ({
      rootSchema,
      schema,
    }) as any;

  describe("sub config keys", () => {
    it("returns empty sub config keys if provided", () => {
      const schema: Schema = {
        subConfigKeys: [],
      } as any;
      expect(getSubConfigKeys(schema)).toStrictEqual(schema.subConfigKeys);
    });

    it("returns non-empty sub config keys if provided", () => {
      const schema: Schema = {
        subConfigKeys: [["first"], ["second", "third"]],
      } as any;
      expect(getSubConfigKeys(schema)).toStrictEqual(schema.subConfigKeys);
    });

    it("infers sub config keys from atomic schema if no sub config keys provided", () => {
      const schema: Schema = {
        type: "string",
      } as any;
      expect(getSubConfigKeys(schema)).toStrictEqual([]);
    });

    it("infers sub config keys from nested schema if no sub config keys provided", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          a: {
            type: "object",
            properties: {
              b: {
                type: "string",
              },
              c: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
          },
          d: {
            type: "array",
            items: {
              type: "object",
              properties: {
                e: {
                  type: "string",
                },
              },
            },
          },
        },
      } as any;
      expect(getSubConfigKeys(schema)).toStrictEqual([
        ["a", "b"],
        ["a", "c"],
        ["d", "e"],
      ]);
    });

    it("respects overridden config keys when inferring sub config keys", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          a: {
            type: "object",
            configKeys: ["b", "c"],
            properties: {
              d: {
                type: "object",
                properties: {
                  e: {
                    type: "string",
                  },
                  f: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      } as any;
      expect(getSubConfigKeys(schema)).toStrictEqual([
        ["b", "d", "e"],
        ["b", "d", "f"],
        ["c", "d", "e"],
        ["c", "d", "f"],
      ]);
    });

    it("ignores hidden settings when inferring sub config keys", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          a: {
            type: "string",
            configKeys: ["b", "c_Internals", "d"],
          },
          d: {
            type: "string",
            configKeys: ["e_Internals"],
          },
        },
      } as any;
      expect(getSubConfigKeys(schema)).toStrictEqual([["b"], ["d"]]);
    });

    it("respects overridden sub config keys when inferring sub config keys", () => {
      const schema: Schema = {
        type: "object",
        properties: {
          a: {
            type: "object",
            configKeys: ["b", "c"],
            subConfigKeys: ["d", "e"],
            properties: {
              f: {
                type: "object",
                properties: {
                  g: {
                    type: "string",
                  },
                  h: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      } as any;
      expect(getSubConfigKeys(schema)).toStrictEqual([
        ["b", "d"],
        ["b", "e"],
        ["c", "d"],
        ["c", "e"],
      ]);
    });
  });

  describe("data paths", () => {
    it("returns given path if subConfigKeys are empty", () => {
      const path = "model.mySetting";
      const schema: Schema = {};
      const control: Control = createControl(schema, {
        type: "object",
        properties: {
          model: {
            type: "object",
            subConfigKeys: [],
            properties: {
              mySetting: schema,
            },
          },
        },
      });
      const dataPaths = getDataPaths({ control, path });
      expect(dataPaths).toStrictEqual([path]);
    });

    it("appends subConfigKeys", () => {
      const path = "model.mySetting";
      const schema: Schema = { subConfigKeys: [["first"], ["second"]] };
      const control: Control = createControl(schema, {
        type: "object",
        properties: {
          model: {
            type: "object",

            properties: {
              mySetting: schema,
            },
          },
        },
      });
      const dataPaths = getDataPaths({
        control,
        path,
      });
      expect(dataPaths).toStrictEqual([
        "model.mySetting.first",
        "model.mySetting.second",
      ]);
    });
  });

  describe("config paths", () => {
    it("returns given path if no configKeys and no subConfigKeys are given", () => {
      const path = "model.mySetting";
      const schema: Schema = {};
      const control: Control = createControl(schema, {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: schema,
            },
          },
        },
      });
      const configPaths = getConfigPaths({
        path,
        control,
      });
      expect(configPaths).toStrictEqual([
        { configPath: path, deprecatedConfigPaths: [] },
      ]);
    });

    it("appends subConfigKeys", () => {
      const path = "model.mySetting";
      const schema: Schema = { subConfigKeys: [["first"], ["second"]] };
      const control: Control = createControl(schema, {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: schema,
            },
          },
        },
      });
      const configPaths = getConfigPaths({
        path,
        control,
      });
      expect(configPaths).toStrictEqual(
        ["model.mySetting.first", "model.mySetting.second"].map(
          (configPath) => ({ configPath, deprecatedConfigPaths: [] }),
        ),
      );
    });

    it("uses configKeys", () => {
      const path = "model.mySetting";
      const schema: Schema = {
        configKeys: ["mySetting_1", "mySetting_2"],
        subConfigKeys: [["subConfigKey"]],
      };
      const control: Control = createControl(schema, {
        type: "object",
        properties: {
          model: {
            type: "object",
            configKeys: ["model_1", "model_2"],
            properties: {
              mySetting: schema,
            },
          },
        },
      });
      const configPaths = getConfigPaths({
        path,
        control,
      });
      expect(configPaths).toStrictEqual(
        [
          "model_1.mySetting_1.subConfigKey",
          "model_1.mySetting_2.subConfigKey",
          "model_2.mySetting_1.subConfigKey",
          "model_2.mySetting_2.subConfigKey",
        ].map((configPath) => ({ configPath, deprecatedConfigPaths: [] })),
      );
    });

    it("navigates to items and ignores config keys for array schema ", () => {
      const path = "model.3.mySetting";
      const schema: Schema = {
        configKeys: ["mySetting_1", "mySetting_2"],
        subConfigKeys: [["subConfigKey"]],
      };
      const control: Control = createControl(schema, {
        type: "object",
        properties: {
          model: {
            type: "array",
            configKeys: ["model_1", "model_2"],
            items: {
              type: "object",
              properties: {
                mySetting: schema,
              },
              configKeys: ["ignored"],
            } as any,
          },
        },
      });
      const configPaths = getConfigPaths({
        path,
        control,
      });
      expect(configPaths).toStrictEqual(
        [
          "model_1.3.mySetting_1.subConfigKey",
          "model_1.3.mySetting_2.subConfigKey",
          "model_2.3.mySetting_1.subConfigKey",
          "model_2.3.mySetting_2.subConfigKey",
        ].map((configPath) => ({ configPath, deprecatedConfigPaths: [] })),
      );
    });

    it("detects deprecated configKeys", () => {
      const path = "model.mySetting";
      const schema: Schema = {
        deprecatedConfigKeys: [
          {
            deprecated: [["deprecated", "4"]],
            new: [["mySetting_2"]],
          },
        ],
        configKeys: ["mySetting_1", "mySetting_2"],
        subConfigKeys: [["subConfigKey"]],
      };
      const control: Control = createControl(schema, {
        type: "object",
        properties: {
          model: {
            type: "object",
            configKeys: ["model_1", "model_2"],
            deprecatedConfigKeys: [
              {
                deprecated: [
                  ["deprecated", "1"],
                  ["deprecated", "2"],
                ],
                new: [["model_1"], ["model_1", "mySetting", "subSetting"]],
              },
              {
                deprecated: [["deprecated", "3"]],
                new: [
                  ["model_2", "mySetting_2"],
                  ["view", "otherSetting"],
                ],
              },
            ],
            properties: {
              mySetting: schema,
            },
          },
          view: {
            type: "object",
            properties: {},
          },
        },
      });
      const configPaths = getConfigPaths({
        path,
        control,
      });
      expect(configPaths).toStrictEqual([
        {
          configPath: "model_1.mySetting_1.subConfigKey",
          deprecatedConfigPaths: ["deprecated.1", "deprecated.2"],
        },
        {
          configPath: "model_1.mySetting_2.subConfigKey",
          deprecatedConfigPaths: [
            "deprecated.1",
            "deprecated.2",
            "model_1.deprecated.4",
            "model_2.deprecated.4",
          ],
        },
        {
          configPath: "model_2.mySetting_1.subConfigKey",
          deprecatedConfigPaths: [],
        },
        {
          configPath: "model_2.mySetting_2.subConfigKey",
          deprecatedConfigPaths: [
            "deprecated.3",
            "model_1.deprecated.4",
            "model_2.deprecated.4",
          ],
        },
      ]);
    });
  });

  describe("longest common prefixes", () => {
    it("determines longest common prefix for empty path array", () => {
      expect(getLongestCommonPrefix([])).toBe("");
    });

    it("determines longest common prefix", () => {
      const path = "model.mySetting";
      const schema: Schema = {};
      const control: Control = createControl(schema, {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: schema,
            },
          },
        },
      });
      const dataPaths = getDataPaths({
        control,
        path,
      });
      const prefix = getLongestCommonPrefix(dataPaths);
      expect(prefix).toBe("model.mySetting");
    });

    it("determines longest common prefix with subConfigKeys", () => {
      const path = "model.mySetting";
      const schema: Schema = {
        subConfigKeys: [
          ["one", "two"],
          ["one", "three"],
        ],
      };
      const control: Control = createControl(schema, {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: schema,
            },
          },
        },
      });
      const dataPaths = getDataPaths({
        control,
        path,
      });
      const prefix = getLongestCommonPrefix(dataPaths);
      expect(prefix).toBe("model.mySetting.one.");
    });
  });
});
