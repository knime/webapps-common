import { type Ref, ref, watch } from "vue";

import { type AlertParams, AlertType } from "@knime/ui-extension-service";

import type { Result } from "../api/types/Result";
import type {
  ChoicesUiSchema,
  ChoicesUiSchemaOptions,
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
        type: AlertType.ERROR,
      });
    }
    if (state === "FAIL") {
      sendAlert({
        message: "Failed to fetch possible values.",
        details: asyncResult.message[0],
        type: AlertType.ERROR,
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
      // @ts-expect-error
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
  getAsyncPossibleValues: (
    choicesProviderClass: string,
  ) => Promise<Result<PossibleValue[]> | undefined>,
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
  return addSpecialColumns(normalPossibleValues, control);
};
