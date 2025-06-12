import type { MaybeRef } from "vue";

export type Messages = {
  errors: string[];
};

/**
 * A registered validation method.
 * Since some validation methods are dynamic, this can be a ref.
 * Since some validation methods are not known initially (e.g. async validation),
 * this can be null.
 */
export type ValidationMethod<D> = MaybeRef<((value: D) => Messages) | null>;

export type ValidationSettings<D> = {
  isValid: boolean;
  messages: Messages;
  /**
   * @param validation the validation method to register.
   * @returns the cleanup callback with which the validation can be unregistered.
   */
  onRegisterValidation: (validation: ValidationMethod<D>) => () => void;
};

export type PerformExternalValidation<D> = (
  id: string,
  value: D,
) => Promise<string | null>;
