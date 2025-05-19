import { type Ref, computed, toRef } from "vue";

import type {
  VueControlProps,
  VueControlPropsForLabelContent,
} from "../../higherOrderComponents";

import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./useProvidedState";

/**
 * @type {P} - parameters for the validation
 * @type {S} - type of the value to validate
 */
export type Validator<P, S> = (params: P) => (value: S) => boolean;

/**
 * @type {T} - type defining the available built-in validations by id-param pairs
 * @type {S} - type of the value to validate
 */
export type Validators<T, S> = {
  [K in keyof T]: Validator<T[K], S>;
};

/**
 * The data provided for a built-in validation.
 * @type {T} - type defining the available built-in validations by id-param pairs
 */
export type BuiltinValidation<T, K extends keyof T> = {
  parameters: T[K];
  errorMessage: string;
};

/**
 * An object of built-in validations typed to T.
 * @type {T} - type defining the available built-in validations by id-param pairs
 */
export type BuiltinValidations<T> = Record<
  keyof T,
  BuiltinValidation<T, keyof T>
>;

type ProvidedBuiltinValidations<T> = Record<
  keyof T,
  Ref<BuiltinValidation<T, keyof T> | null>
>;

type ValidationOptions<T> = {
  validation?: BuiltinValidations<T>;
};

type ValidationUiSchema<T> = UiSchemaWithProvidedOptions<ValidationOptions<T>>;

const extractValidations = <T>(options: ValidationOptions<T> = {}) =>
  options.validation || null;

const extractProvidedValidationOptionId = (providedValidationOption: string) =>
  providedValidationOption.replace(/^validation\./, "");

const extractProvidedValidations = <T extends Record<string, unknown>>(
  uischema: ValidationUiSchema<T>,
) => {
  const providedValidationOptions = (uischema.providedOptions ?? []).filter(
    (providedOption) => providedOption.startsWith("validation."),
  );
  if (providedValidationOptions.length === 0) {
    return null;
  }
  return providedValidationOptions.reduce(
    (acc, providedOption) => ({
      ...acc,
      [extractProvidedValidationOptionId(providedOption)]: useProvidedState(
        toRef(uischema) as Ref<ValidationUiSchema<T>>,
        // @ts-expect-error - the valid provided options cannot be inferred
        providedOption,
      ),
    }),
    {} as ProvidedBuiltinValidations<T>,
  );
};

const getTypedObjectEntries = <T extends Record<string, unknown>>(obj: T) =>
  Object.entries(obj) as [keyof T, T[keyof T]][];

const getValidationMethod = <T, S>(
  validations: BuiltinValidations<T>,
  validators: Validators<T, S>,
) => {
  const validationMethods = getTypedObjectEntries(validations).map(
    ([key, { parameters, errorMessage }]) => ({
      validate: validators[key](parameters),
      errorMessage,
    }),
  );
  return (value: S) => ({
    errors: validationMethods
      .filter(({ validate }) => !validate(value))
      .map(({ errorMessage }) => errorMessage),
  });
};

const getProvidedValidationMethod = <T, S>(
  validationInput: BuiltinValidation<T, keyof T> | null,
  key: keyof T,
  validators: Validators<T, S>,
) => {
  if (validationInput === null) {
    return null;
  }
  return getValidationMethod(
    {
      [key]: validationInput,
    } as BuiltinValidations<T>,
    validators,
  );
};

const registerValidationMethods = <T, S>(
  validations: BuiltinValidations<T> | null,
  providedValidations: ProvidedBuiltinValidations<T> | null,
  validators: Validators<T, S>,
  onRegisterValidation: VueControlProps<S>["onRegisterValidation"],
) => {
  if (validations) {
    const validationMethod = getValidationMethod(validations, validators);
    onRegisterValidation(validationMethod);
  }
  if (providedValidations) {
    const validationMethods = getTypedObjectEntries(providedValidations).map(
      ([key, validation]) =>
        computed(() =>
          getProvidedValidationMethod(validation.value, key, validators),
        ),
    );
    validationMethods.forEach(onRegisterValidation);
  }
};

/**
 * Regardless of whether validations are provided via options or via state providers,
 * this function combines them into a single ref.
 */
const combineValidations = <T>({
  validations,
  providedValidations,
}: {
  validations: BuiltinValidations<T> | null;
  providedValidations: ProvidedBuiltinValidations<T> | null;
}): Ref<Partial<T>> => {
  const constantValidations = getTypedObjectEntries(validations || {}).reduce(
    (acc, [key, { parameters }]) => ({ ...acc, [key]: parameters }),
    {},
  );
  return computed(() => {
    if (providedValidations === null) {
      return constantValidations;
    }
    return getTypedObjectEntries(providedValidations)
      .map(([key, providedValidation]) => ({
        key,
        providedValidation: providedValidation.value,
      }))
      .filter(({ providedValidation }) => providedValidation !== null)
      .reduce(
        (acc, { key, providedValidation }) => ({
          ...acc,
          // @ts-expect-error - we know that providedValidation is not null here
          [key]: providedValidation.parameters,
        }),
        constantValidations,
      );
  });
};

/**
 * Composable used within a control to define/handle its built-in validations.
 *
 * @param validators - the handlers for the supported validations
 * @param props - the props of the control
 * @returns a ref containing the validation parameters.
 * This is provided if these are required for custom behavior in the control
 * (e.g. setting the minimum in a number control)
 *
 * @type {T} - type defining the available built-in validations by id-param pairs
 * @type {S} - type of the value to validate, i.e. the type of the data of the control
 */
export const useBuiltinValidation = <T extends Record<string, unknown>, S>(
  validators: Validators<T, S>,
  props: VueControlProps<S> | VueControlPropsForLabelContent<S>,
): Ref<Partial<T>> => {
  const { uischema } = props.control;
  const { options } = uischema as ValidationUiSchema<T>;
  const validations = extractValidations(options);
  const providedValidations = extractProvidedValidations<T>(uischema);
  registerValidationMethods(
    validations,
    providedValidations,
    validators,
    props.onRegisterValidation,
  );
  return combineValidations({ validations, providedValidations });
};
