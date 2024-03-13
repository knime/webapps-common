import { AlertType, type AlertingService } from "@knime/ui-extension-service";
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

const extractPossibleValues = (
  asyncResult: Result<PossibleValue[]>,
  sendAlert: (params: Parameters<AlertingService["sendAlert"]>[0]) => void,
  choicesProviderClass: string,
) => {
  const { state } = asyncResult;
  if (state === "SUCCESS") {
    return asyncResult.result;
  } else {
    if (state === "CANCELED") {
      sendAlert({
        type: AlertType.ERROR,
        subtitle: `Receiving possible values from ${choicesProviderClass} canceled.`,
      });
    }
    if (state === "FAIL") {
      sendAlert({
        type: AlertType.ERROR,
        subtitle: "Failed to fetch possible values.",
        message: asyncResult.message,
      });
    }
    return [];
  }
};

export default async (
  control: { uischema: ChoicesUiSchema },
  getAsyncPossibleValues: (
    choicesProviderClass: string,
  ) => Promise<Result<PossibleValue[]> | undefined>,
  sendAlert: (params: Parameters<AlertingService["sendAlert"]>[0]) => void,
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
      normalPossibleValues = asyncResult
        ? extractPossibleValues(asyncResult, sendAlert, choicesProviderClass)
        : [];
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
  const showRowNumbers = Boolean(
    extractFromUiSchemaOptions(control, "showRowNumbers"),
  );
  return [
    ...(showNoneColumn ? [{ id: "<none>", text: "None" }] : []),
    ...(showRowKeys
      ? [
          {
            id: "<row-keys>",
            text: "RowIDs",
            compatibleTypes: ["org.knime.core.data.StringValue"],
          },
        ]
      : []),
    ...(showRowNumbers
      ? [
          {
            id: "<row-numbers>",
            text: "Row numbers",
            compatibleTypes: ["org.knime.core.data.DoubleValue"],
          },
        ]
      : []),
    ...normalPossibleValues,
  ];
};
