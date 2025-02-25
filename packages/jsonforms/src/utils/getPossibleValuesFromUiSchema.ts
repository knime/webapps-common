import { type Ref, ref, watch } from "vue";

import type {
  ChoicesUiSchema,
  ChoicesUiSchemaOptions,
  PossibleValue,
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

const addSpecialColumns = (
  normalPossibleValues: PossibleValue[],
  control: { uischema: ChoicesUiSchema },
) => {
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
            text: "RowID",
            compatibleTypes: ["org.knime.core.data.StringValue"],
          },
        ]
      : []),
    ...(showRowNumbers
      ? [
          {
            id: "<row-numbers>",
            text: "Row number",
            compatibleTypes: [
              "org.knime.core.data.LongValue",
              "org.knime.core.data.DoubleValue",
            ],
          },
        ]
      : []),
    ...normalPossibleValues,
  ];
};

export const withSpecialChoices = <T extends PossibleValue[] | null>(
  choicesRef: Ref<T>,
  control: { uischema: ChoicesUiSchema },
) => {
  /**
   * TODO UIEXT-1491 Ideally we want to use a computed property here like so:
   *  computed(() =>
        choicesRef.value === null
          ? null
          : addSpecialColumns(choicesRef.value, control),
      )
      but this is only possible until we get rid of the other ways to update these
      choices in the respective input components
   */
  const withSpecialColumns = ref(choicesRef.value);
  watch(
    () => choicesRef.value,
    () => {
      // @ts-expect-error Type 'PossibleValue[] | null' is not assignable to type 'UnwrapRef<T>'
      withSpecialColumns.value =
        choicesRef.value === null
          ? null
          : addSpecialColumns(choicesRef.value, control);
    },
  );
  return withSpecialColumns;
};

export default async (
  control: { uischema: ChoicesUiSchema },
  getAsyncPossibleValues: (choicesProviderClass: string) => Promise<any>,
  sendAlert: (params: AlertParams) => void,
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
  // @ts-expect-error Argument of type 'boolean | PossibleValue[] | undefined' is not assignable to parameter of type 'PossibleValue[]'.
  return addSpecialColumns(normalPossibleValues, control);
};
