import getPossibleValuesFromUiSchema from "./getPossibleValuesFromUiSchema";
export { getPossibleValuesFromUiSchema };
import type { FlowSettings } from "../api/types";
import type Control from "../types/Control";
import type { PartialDeep } from "type-fest";
import type { JsonSchema4, JsonSchema7 } from "@jsonforms/core";

export const optionsMapper = ({
  const: id,
  title: text,
}: JsonSchema4 | JsonSchema7) => ({ id: id as string, text: text! });

const isObject = (item: any) =>
  item && typeof item === "object" && !Array.isArray(item);

// Merge two objects deeply while overwriting only keys of obj1 if necessary. This can be used to alter the data
// in the dialog settings in a more simple way for complex data structures.
const mergeDeepUntyped = (obj1: any, obj2: any) => {
  const output = { ...obj1 };
  if (isObject(obj2)) {
    Object.keys(obj2).forEach((key) => {
      if (isObject(obj2[key])) {
        if (isObject(obj1) && !(key in obj1)) {
          Object.assign(output, { [key]: obj2[key] });
        } else {
          output[key] = mergeDeepUntyped(obj1[key], obj2[key]);
        }
      } else {
        Object.assign(output, { [key]: obj2[key] });
      }
    });
  }
  return output;
};

export const mergeDeep = <T extends object>(
  obj1: T,
  obj2: PartialDeep<T>,
): T => {
  return mergeDeepUntyped(obj1, obj2);
};

export const isModelSettingAndHasNodeView = (control: Control) =>
  control?.rootSchema.hasNodeView &&
  control?.uischema.scope?.startsWith("#/properties/model");

const isFlowSettings = (
  flowSettings: FlowSettings | undefined | null,
): flowSettings is FlowSettings => {
  return Boolean(flowSettings);
};

const toFlowVariablesMap = (
  rootSchema: Control["rootSchema"],
  configPaths: string[],
) => {
  const flowSettings = configPaths
    .map((key) => rootSchema?.flowVariablesMap?.[key])
    .filter(isFlowSettings);
  return flowSettings.reduce(
    (a, b) => {
      return {
        controllingFlowVariableAvailable:
          a?.controllingFlowVariableAvailable || // NOSONAR
          b?.controllingFlowVariableAvailable,
        controllingFlowVariableName: a?.controllingFlowVariableName
          ? a?.controllingFlowVariableName
          : b?.controllingFlowVariableName,
        exposedFlowVariableName: a?.exposedFlowVariableName
          ? a?.exposedFlowVariableName
          : b?.exposedFlowVariableName,
      };
    },
    null as FlowSettings | null,
  );
};

export const getConfigPaths = (
  path: string,
  configKeys: string[] | undefined,
) => {
  if (configKeys) {
    const pathParts = path.split(".");
    const parentPath = pathParts.slice(0, -1).join(".");
    return configKeys.map((key) => [parentPath, key].join("."));
  }
  return [path];
};

// expects a modified root schema which includes a flowVariablesMap
// the root schema should look like the following:
// rootSchema: {
//    flowVariablesMap: {},
//    schema: {},
//    uischema: {},
//    ...
// }
export const getFlowVariablesMap = ({ rootSchema, path, schema }: Control) => {
  return toFlowVariablesMap(
    rootSchema,
    getConfigPaths(path, schema.configKeys),
  );
};

// eslint-disable-next-line max-params
// recursive function to check if the object contains a key value pair with a given parent
const isKeyValuePresentInObject = (
  object: Object,
  params: {
    parentKey: string;
    keyName: string;
    value: any;
  },
  currentParentKey = "",
) => {
  if (object === null || typeof object === "undefined") {
    return false;
  }

  for (const [key, val] of Object.entries(object)) {
    if (
      params.parentKey === currentParentKey &&
      key === params.keyName &&
      val === params.value
    ) {
      return true;
    } else if (typeof val === "object") {
      currentParentKey = key;
      if (isKeyValuePresentInObject(val, params, currentParentKey) === true) {
        return true;
      }
    }
  }
  return false;
};
export const hasAdvancedOptions = (uischema: object) =>
  isKeyValuePresentInObject(uischema, {
    parentKey: "options",
    keyName: "isAdvanced",
    value: true,
  });
