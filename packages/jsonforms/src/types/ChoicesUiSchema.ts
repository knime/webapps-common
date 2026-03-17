import type { ControlElement } from "@jsonforms/core";

import type { UiSchemaWithProvidedOptions } from "../uiComponents/composables/useProvidedState";

import type { StateProviderLocation } from "./provided";

export type IdAndText = {
  id: string;
  text: string;
  disabled?: boolean;
};

export type SubText = {
  subText?: string;
};

export type DataType = {
  type: IdAndText;
};

export type LiveStatus = {
  type: "liveStatus";
  status: "red" | "orange" | "green" | "disabled" | "yellow";
  size?: "large" | "medium" | "small";
  label?: string;
};

export type TypedIdAndText = IdAndText & SubText & Partial<DataType>;

export type TypedIdAndTextWithLiveStatus = IdAndText &
  SubText &
  Partial<DataType> & {
    accessory: LiveStatus;
  };

export type PossibleValue<SpecialChoicesProps extends Record<string, unknown>> =
  IdAndText & SpecialChoicesProps;

export type ChoicesUiSchemaOptions<
  SpecialChoicesProps extends Record<string, unknown>,
> = {
  possibleValues?: PossibleValue<SpecialChoicesProps>[];
  choicesProvider?: StateProviderLocation;
};
export type IncludedExcludedLabelOptions = {
  includedLabel?: string;
  excludedLabel?: string;
};

export type ChoicesUiSchema<S extends Record<string, unknown>> =
  ControlElement & {
    options?: ChoicesUiSchemaOptions<S>;
  };

export type ChoicesUiSchemaWithProvidedOptions<
  S extends Record<string, unknown>,
> = UiSchemaWithProvidedOptions<ChoicesUiSchemaOptions<S>>;
