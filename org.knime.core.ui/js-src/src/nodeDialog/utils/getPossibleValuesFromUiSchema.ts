import { AlertTypes, type KnimeService } from "@knime/ui-extension-service";
import type Result from "../api/types/Result";
import type {
  ChoicesUiSchemaOptions,
  ChoicesUiSchema,
  PossibleValue,
} from "../types/ChoicesUiSchema";

const extractFromUiSchemaOptions = <Key extends keyof ChoicesUiSchemaOptions>(
  control: { uischema: ChoicesUiSchema },
  key: Key,
) => {
  const options = control.uischema.options;
  return options ? options[key] : false;
};

export default async (
  control: { uischema: ChoicesUiSchema },
  getAsyncPossibleValues: (
    choicesProviderClass: string,
  ) => Promise<Result<PossibleValue[]>>,
  sendAlert: (params: Parameters<KnimeService["createAlert"]>[0]) => void,
) => {
  let normalPossibleValues = extractFromUiSchemaOptions(
    control,
    "possibleValues",
  );
  if (!normalPossibleValues) {
    const choicesProviderClass = extractFromUiSchemaOptions(
      control,
      "choicesProviderClass",
    );
    if (typeof choicesProviderClass === "string") {
      const asyncResult = await getAsyncPossibleValues(choicesProviderClass);
      const { state } = asyncResult;
      if (asyncResult.state === "SUCCESS") {
        normalPossibleValues = asyncResult.result;
      } else {
        normalPossibleValues = [];
        if (state === "CANCELED") {
          sendAlert({
            type: AlertTypes.ERROR,
            message: `Receiving possible values from ${choicesProviderClass} canceled.`,
          });
        }
        if (state === "FAIL") {
          sendAlert({
            type: AlertTypes.ERROR,
            message: `Failed to fetch possible values: ${asyncResult.message}`,
          });
        }
      }
    } else {
      normalPossibleValues = [];
    }
  }
  const showNoneColumn = Boolean(
    extractFromUiSchemaOptions(control, "showNoneColumn"),
  );
  const showRowKeys = Boolean(
    extractFromUiSchemaOptions(control, "showRowKeys"),
  );
  return [
    ...(showNoneColumn ? [{ id: "<none>", text: "None" }] : []),
    ...(showRowKeys ? [{ id: "<row-keys>", text: "RowIDs" }] : []),
    ...normalPossibleValues,
  ];
};
