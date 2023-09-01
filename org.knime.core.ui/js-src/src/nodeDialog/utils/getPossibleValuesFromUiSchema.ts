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
      if (asyncResult.state === "SUCCESS") {
        normalPossibleValues = asyncResult.result;
      } else {
        normalPossibleValues = []; // TODO: UIEXT-1285 Handle/display error
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
