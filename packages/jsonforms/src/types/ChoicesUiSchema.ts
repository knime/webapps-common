export type IdAndText = {
  id: string;
  text: string;
};

export type PossibleValue = IdAndText & {
  compatibleTypes?: string[];
  type?: IdAndText;
};

export type ChoicesUiSchemaOptions = {
  possibleValues?: PossibleValue[];
  choicesProviderClass?: string;
  setFirstValueOnUpdate?: boolean;
  includedLabel?: string;
  excludedLabel?: string;
};

export type ChoicesUiSchema = {
  options?: ChoicesUiSchemaOptions;
};
