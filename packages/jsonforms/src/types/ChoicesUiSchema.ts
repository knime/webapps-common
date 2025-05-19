import type { ControlElement } from "@jsonforms/core";

import type { UiSchemaWithProvidedOptions } from "../uiComponents/composables/useProvidedState";

import type { StateProviderLocation } from "./provided";

export type IdAndText = {
  id: string;
  text: string;
};

export type PossibleValue<SpecialChoicesProps extends Record<string, any>> =
  IdAndText & SpecialChoicesProps;

export type ChoicesUiSchemaOptions<
  SpecialChoicesProps extends Record<string, any> = {},
> = {
  possibleValues?: PossibleValue<SpecialChoicesProps>[];
  choicesProvider?: StateProviderLocation;
};
export type IncludedExcludedLabelOptions = {
  includedLabel?: string;
  excludedLabel?: string;
};

export type ChoicesUiSchema<S extends Record<string, any> = {}> =
  ControlElement & {
    options?: ChoicesUiSchemaOptions<S>;
  };

export type ChoicesUiSchemaWithProvidedOptions<
  S extends Record<string, unknown> = {},
> = UiSchemaWithProvidedOptions<ChoicesUiSchemaOptions<S>>;
