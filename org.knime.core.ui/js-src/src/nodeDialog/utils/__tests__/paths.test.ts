import { describe, expect, it } from "vitest";
import { getConfigPaths, getDataPaths } from "../paths";
import Control from "@/nodeDialog/types/Control";

describe("paths", () => {
  describe("data paths", () => {
    it("returns given path if subConfigKeys are undefined", () => {
      const path = "myPath";
      const dataPaths = getDataPaths({ path, subConfigKeys: undefined });
      expect(dataPaths).toStrictEqual([path]);
    });

    it("returns given path if subConfigKeys are empty", () => {
      const path = "myPath";
      const dataPaths = getDataPaths({ path, subConfigKeys: [] });
      expect(dataPaths).toStrictEqual([path]);
    });

    it("appends subConfigKeys", () => {
      const path = "myPath";
      const dataPaths = getDataPaths({
        path,
        subConfigKeys: ["first", "second"],
      });
      expect(dataPaths).toStrictEqual(["myPath.first", "myPath.second"]);
    });
  });

  describe("config paths", () => {
    const createControl = (rootSchema: Control["rootSchema"]): Control =>
      ({
        rootSchema,
      }) as any;

    it("returns given path if no configKeys and no subConfigKeys are given", () => {
      const path = "model.mySetting";
      const control: Control = createControl({
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: {},
            },
          },
        },
      });
      const configPaths = getConfigPaths({
        path,
        subConfigKeys: undefined,
        control,
      });
      expect(configPaths).toStrictEqual([path]);
    });

    it("appends subConfigKeys", () => {
      const path = "model.mySetting";
      const control: Control = createControl({
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              mySetting: {},
            },
          },
        },
      });
      const configPaths = getConfigPaths({
        path,
        subConfigKeys: ["first", "second"],
        control,
      });
      expect(configPaths).toStrictEqual([
        "model.mySetting.first",
        "model.mySetting.second",
      ]);
    });

    it("uses configKeys", () => {
      const path = "model.mySetting";
      const control: Control = createControl({
        type: "object",
        properties: {
          model: {
            type: "object",
            configKeys: ["model_1", "model_2"],
            properties: {
              mySetting: {
                configKeys: ["mySetting_1", "mySetting_2"],
              },
            },
          },
        },
      });
      const configPaths = getConfigPaths({
        path,
        subConfigKeys: ["subConfigKey"],
        control,
      });
      expect(configPaths).toStrictEqual([
        "model_1.mySetting_1.subConfigKey",
        "model_1.mySetting_2.subConfigKey",
        "model_2.mySetting_1.subConfigKey",
        "model_2.mySetting_2.subConfigKey",
      ]);
    });

    it("navigates to items and ignores config keys for array schema ", () => {
      const path = "model.3.mySetting";
      const control: Control = createControl({
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
                },
              },
              configKeys: ["ignored"],
            } as any,
          },
        },
      });
      const configPaths = getConfigPaths({
        path,
        subConfigKeys: ["subConfigKey"],
        control,
      });
      expect(configPaths).toStrictEqual([
        "model_1.3.mySetting_1.subConfigKey",
        "model_1.3.mySetting_2.subConfigKey",
        "model_2.3.mySetting_1.subConfigKey",
        "model_2.3.mySetting_2.subConfigKey",
      ]);
    });
  });
});
