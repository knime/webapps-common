import { describe, expect, it } from "vitest";
import {
  getDataAndConfigPaths,
  getLongestCommonPrefix,
  getSubConfigKeys,
} from "../paths";
import { PersistSchema } from "@/nodeDialog/types/Persist";

describe("paths", () => {
  const getDataPaths = (path: string, persistSchema: PersistSchema) =>
    getDataAndConfigPaths({ path, persistSchema }).dataPaths;
  const getConfigPaths = (path: string, persistSchema: PersistSchema) =>
    getDataAndConfigPaths({ path, persistSchema }).configPaths;

  describe("sub config keys", () => {
    it("returns empty sub config keys if provided", () => {
      const persistSchema = {
        subConfigKeys: [],
      };
      expect(getSubConfigKeys(persistSchema)).toStrictEqual(
        persistSchema.subConfigKeys,
      );
    });

    it("returns non-empty sub config keys if provided", () => {
      const persistSchema = {
        subConfigKeys: [["first"], ["second", "third"]],
      };
      expect(getSubConfigKeys(persistSchema)).toStrictEqual(
        persistSchema.subConfigKeys,
      );
    });

    it("infers sub config keys from atomic schema if no sub config keys provided", () => {
      const persistSchema = {};
      expect(getSubConfigKeys(persistSchema)).toStrictEqual([]);
    });

    it("infers sub config keys from nested schema if no sub config keys provided", () => {
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          a: {
            type: "object",
            properties: {
              b: {},
              c: {
                type: "array",
                items: {},
              },
            },
          },
          d: {
            type: "array",
            items: {
              type: "object",
              properties: {
                e: {},
              },
            },
          },
        },
      };
      expect(getSubConfigKeys(persistSchema)).toStrictEqual([
        ["a", "b"],
        ["a", "c"],
        ["d", "e"],
      ]);
    });

    it("respects overridden config keys when inferring sub config keys", () => {
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          a: {
            type: "object",
            configKeys: ["b", "c"],
            properties: {
              d: {
                type: "object",
                properties: {
                  e: {},
                  f: {},
                },
              },
            },
          },
        },
      };
      expect(getSubConfigKeys(persistSchema)).toStrictEqual([
        ["b", "d", "e"],
        ["b", "d", "f"],
        ["c", "d", "e"],
        ["c", "d", "f"],
      ]);
    });

    it("ignores hidden settings when inferring sub config keys", () => {
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          a: {
            configKeys: ["b", "c_Internals", "d"],
          },
          d: {
            configKeys: ["e_Internals"],
          },
        },
      };
      expect(getSubConfigKeys(persistSchema)).toStrictEqual([["b"], ["d"]]);
    });

    it("respects overridden sub config keys when inferring sub config keys", () => {
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          a: {
            type: "object",
            configKeys: ["b", "c"],
            subConfigKeys: [["d"], ["e"]],
            properties: {
              f: {
                type: "object",
                properties: {
                  g: {},
                  h: {},
                },
              },
            },
          },
        },
      };
      expect(getSubConfigKeys(persistSchema)).toStrictEqual([
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
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            subConfigKeys: [],
            properties: {
              mySetting: { type: "leaf" },
            },
          },
        },
      };

      const dataPaths = getDataPaths(path, persistSchema);
      expect(dataPaths).toStrictEqual([path]);
    });

    it("appends subConfigKeys", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",

            properties: {
              mySetting: {
                subConfigKeys: [["first"], ["second"]],
              },
            },
          },
        },
      };
      const dataPaths = getDataPaths(path, persistSchema);
      expect(dataPaths).toStrictEqual([
        "model.mySetting.first",
        "model.mySetting.second",
      ]);
    });
  });

  describe("config paths", () => {
    it("returns given path if no configKeys and no subConfigKeys are given", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: {},
            },
          },
        },
      };
      const configPaths = getConfigPaths(path, persistSchema);
      expect(configPaths).toStrictEqual([
        { configPath: path, deprecatedConfigPaths: [] },
      ]);
    });

    it("appends subConfigKeys", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: { subConfigKeys: [["first"], ["second"]] },
            },
          },
        },
      };
      const configPaths = getConfigPaths(path, persistSchema);
      expect(configPaths).toStrictEqual(
        ["model.mySetting.first", "model.mySetting.second"].map(
          (configPath) => ({ configPath, deprecatedConfigPaths: [] }),
        ),
      );
    });

    it("uses configKeys", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            /**
             * TODO: UIEXT-2127 Remove the ".sub" again
             */
            configKeys: ["model_1", "model_2.sub"],
            properties: {
              mySetting: {
                configKeys: ["mySetting_1", "mySetting_2"],
                subConfigKeys: [["subConfigKey"]],
              },
            },
          },
        },
      };
      const configPaths = getConfigPaths(path, persistSchema);
      expect(configPaths).toStrictEqual(
        [
          "model_1.mySetting_1.subConfigKey",
          "model_1.mySetting_2.subConfigKey",
          "model_2.sub.mySetting_1.subConfigKey",
          "model_2.sub.mySetting_2.subConfigKey",
        ].map((configPath) => ({ configPath, deprecatedConfigPaths: [] })),
      );
    });

    it("navigates to items and ignores config keys for array schema ", () => {
      const path = "model.3.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "array",
            configKeys: ["model_1", "model_2"],
            items: {
              type: "object",
              properties: {
                mySetting: {
                  configKeys: ["mySetting_1", "mySetting_2"],
                  subConfigKeys: [["subConfigKey"]],
                },
              },
              configKeys: ["ignored"],
            } as any,
          },
        },
      };
      const configPaths = getConfigPaths(path, persistSchema);
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
      const persistSchema: PersistSchema = {
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
              mySetting: {
                deprecatedConfigKeys: [
                  {
                    deprecated: [["deprecated", "4"]],
                    new: [["mySetting_2"]],
                  },
                ],
                configKeys: ["mySetting_1", "mySetting_2"],
                subConfigKeys: [["subConfigKey"]],
              },
            },
          },
          view: {
            type: "object",
            properties: {},
          },
        },
      };
      const configPaths = getConfigPaths(path, persistSchema);
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
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: {},
            },
          },
        },
      };
      const dataPaths = getDataPaths(path, persistSchema);
      const prefix = getLongestCommonPrefix(dataPaths);
      expect(prefix).toBe("model.mySetting");
    });

    it("determines longest common prefix with subConfigKeys", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: {
                subConfigKeys: [
                  ["one", "two"],
                  ["one", "three"],
                ],
              },
            },
          },
        },
      };
      const dataPaths = getDataPaths(path, persistSchema);
      const prefix = getLongestCommonPrefix(dataPaths);
      expect(prefix).toBe("model.mySetting.one.");
    });
  });
});
