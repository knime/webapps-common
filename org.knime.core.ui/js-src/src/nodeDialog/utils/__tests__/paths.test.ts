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

    it("respects overridden config key when inferring sub config keys", () => {
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          a: {
            type: "object",
            configKey: "b",
            properties: {
              c: {
                type: "object",
                properties: {
                  d: {},
                  e: {},
                },
              },
            },
          },
        },
      };
      expect(getSubConfigKeys(persistSchema)).toStrictEqual([
        ["b", "c", "d"],
        ["b", "c", "e"],
      ]);
    });

    it("respects empty config keys when inferring sub config keys", () => {
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          a: {
            type: "object",
            configKeys: [],
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
      expect(getSubConfigKeys(persistSchema)).toStrictEqual([]);
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
  });

  describe("data paths", () => {
    it("returns given path if sub persist schema are empty", () => {
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
      expect(dataPaths).toStrictEqual([path]);
    });

    it("appends keys from sub persist schema", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: {
                type: "object",
                properties: {
                  first: {},
                  second: {},
                },
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
    it("returns given path if no configKeys and no sub persist schema are given", () => {
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

    it("returns given path if persist schema ends early", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {},
          },
        },
      };
      const configPaths = getConfigPaths(path, persistSchema);
      expect(configPaths).toStrictEqual([
        { configPath: path, deprecatedConfigPaths: [] },
      ]);
    });

    it("appends keys from sub persist schema", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: {
                type: "object",
                properties: { first: {}, second: {} },
              },
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

    it("uses configKey and continues traversal", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            configKey: "model_1",
            properties: {
              mySetting: {
                type: "object",
                properties: {
                  subConfigKey: {},
                },
              },
            },
          },
        },
      };
      const configPaths = getConfigPaths(path, persistSchema);
      expect(configPaths).toStrictEqual([
        {
          configPath: "model_1.mySetting.subConfigKey",
          deprecatedConfigPaths: [],
        },
      ]);
    });

    it("uses configKeys and stops traversal", () => {
      const path = "model";
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
                type: "object",
                properties: {
                  subConfigKey: {},
                },
              },
            },
          },
        },
      };
      const configPaths = getConfigPaths(path, persistSchema);
      expect(configPaths).toStrictEqual(
        ["model_1", "model_2.sub"].map((configPath) => ({
          configPath,
          deprecatedConfigPaths: [],
        })),
      );
    });

    it("returns an empty result if traversal is aborted before the path ended", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            configKeys: [],
            properties: {
              mySetting: {
                type: "object",
                properties: {
                  subConfigKey: {},
                },
              },
            },
          },
        },
      };
      const configPaths = getConfigPaths(path, persistSchema);
      expect(configPaths).toStrictEqual([]);
    });

    it("navigates to items and ignores segments for array schema ", () => {
      const path = "model.3.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "array",
            items: {
              type: "object",
              properties: {
                mySetting: {
                  configKeys: ["mySetting_1", "mySetting_2"],
                  type: "object",
                  properties: {
                    subConfigKey: {},
                  },
                },
              },
              configKeys: ["ignored"],
            } as any,
          },
        },
      };
      const configPaths = getConfigPaths(path, persistSchema);
      expect(configPaths).toStrictEqual(
        ["model.3.mySetting_1", "model.3.mySetting_2"].map((configPath) => ({
          configPath,
          deprecatedConfigPaths: [],
        })),
      );
    });

    it("detects deprecated configKeys", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            deprecatedConfigKeys: [
              {
                deprecated: [
                  ["deprecated", "1"],
                  ["deprecated", "2"],
                ],
                new: [["model"], ["model", "mySetting", "subSetting"]],
              },
              {
                deprecated: [["deprecated", "3"]],
                new: [
                  ["model", "mySetting_2"],
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
                type: "object",
                properties: {
                  subConfigKey: {},
                },
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
          configPath: "model.mySetting_1",
          deprecatedConfigPaths: ["deprecated.1", "deprecated.2"],
        },
        {
          configPath: "model.mySetting_2",
          deprecatedConfigPaths: [
            "deprecated.1",
            "deprecated.2",
            "deprecated.3",
            "model.deprecated.4",
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

    it("determines longest common prefix with keys from sub persist schema", () => {
      const path = "model.mySetting";
      const persistSchema: PersistSchema = {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: {
                type: "object",
                properties: {
                  one: {
                    type: "object",
                    properties: {
                      two: {},
                      three: {},
                    },
                  },
                },
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
