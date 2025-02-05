import type { MaybeRef } from "vue";

export type Messages = {
  errors: string[];
};

export type ValidationMethod<D> = MaybeRef<(value: D) => Messages>;

export type ValidationSettings<D> = {
  isValid: boolean;
  messages: Messages;
  onRegisterValidation: (validation: ValidationMethod<D>) => void;
};
