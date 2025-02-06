import type {
  ChoicesUiSchema,
  ChoicesUiSchemaOptions,
} from "../types/ChoicesUiSchema";
import type { AlertParams } from "../types/alert";

const extractFromUiSchemaOptions = <Key extends keyof ChoicesUiSchemaOptions>(
  control: { uischema: ChoicesUiSchema },
  key: Key,
) => {
  const options = control.uischema.options;
  return options ? options[key] : false;
};

const extractPossibleValues = (
  asyncResult: any,
  sendAlert: (params: AlertParams) => void,
  choicesProviderClass: string,
) => {
  const { state } = asyncResult;
  if (state === "SUCCESS") {
    return asyncResult.result;
  } else {
    if (state === "CANCELED") {
      sendAlert({
        message: "Fetching possible values has been canceled.",
        details: `Fetching possible values from ${choicesProviderClass} has been canceled.`,
        type: "error",
      });
    }
    if (state === "FAIL") {
      sendAlert({
        message: "Failed to fetch possible values.",
        details: asyncResult.message[0],
        type: "error",
      });
    }
    return [];
  }
};

export default async (
  control: { uischema: ChoicesUiSchema },
  getAsyncPossibleValues: (choicesProviderClass: string) => Promise<any>,
  sendAlert: (params: AlertParams) => void,
) => {
  const normalPossibleValues = extractFromUiSchemaOptions(
    control,
    "possibleValues",
  );
  if (normalPossibleValues) {
    return normalPossibleValues;
  }
  if (!normalPossibleValues) {
    const choicesProviderClass = extractFromUiSchemaOptions(
      control,
      "choicesProviderClass",
    );
    if (typeof choicesProviderClass === "string") {
      const asyncResult = await getAsyncPossibleValues(choicesProviderClass);
      return asyncResult
        ? extractPossibleValues(asyncResult, sendAlert, choicesProviderClass)
        : [];
    } else {
      return [];
    }
  }
};
