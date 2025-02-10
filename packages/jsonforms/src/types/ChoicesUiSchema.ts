export type IdAndText = {
  id: string;
  text: string;
};

export type PossibleValue<SpecialChoicesProps extends Record<string, any>> =
  IdAndText & SpecialChoicesProps;

export type ChoicesUiSchemaOptions<
  SpcialChoicesProps extends Record<string, any> = {},
> = {
  possibleValues?: PossibleValue<SpcialChoicesProps>[];
  choicesProvider?: string;
};
export type IncludedExcludedLabelOptions = {
  includedLabel?: string;
  excludedLabel?: string;
};

export type ChoicesUiSchema<S extends Record<string, any> = {}> = {
  options?: ChoicesUiSchemaOptions<S>;
};
