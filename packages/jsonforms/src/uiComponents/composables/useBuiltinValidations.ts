import { type Ref, computed } from "vue";

import type {
  VueControlProps,
  VueControlPropsForLabelContent,
} from "../../higherOrderComponents";

import useProvidedState from "./useProvidedState";

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
  id: K;
  parameters: T[K];
  errorMessage: string;
};

/**
 * A list of built-in validations typed to T.
 * @type {T} - type defining the available built-in validations by id-param pairs
 */
export type BuiltinValidations<T> = Array<
  {
    [K in keyof T]: BuiltinValidation<T, K>;
  }[keyof T]
>;

const extractValidations = <T>(
  options: { validations?: BuiltinValidations<T> } = {},
) => options.validations ?? [];

const extractProvidedValidations = <T>(
  options: { validationProviders?: string[] } = {},
) =>
  (options.validationProviders ?? []).map((provider) =>
    useProvidedState<BuiltinValidation<T, keyof T> | null>(provider, null),
  );

const getValidationMethod = <T, S>(
  validations: BuiltinValidations<T>,
  validators: Validators<T, S>,
) => {
  const validationMethods = validations.map(
    ({ id, parameters, errorMessage }) => ({
      validate: validators[id](parameters),
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
  validators: Validators<T, S>,
) => {
  if (validationInput === null) {
    return null;
  }
  return getValidationMethod([validationInput], validators);
};

const registerValidationMethods = <T, S>(
  validations: BuiltinValidations<T>,
  providedValidations: Ref<BuiltinValidation<T, keyof T> | null>[],
  validators: Validators<T, S>,
  onRegisterValidation: VueControlProps<S>["onRegisterValidation"],
) => {
  if (validations.length) {
    const validationMethod = getValidationMethod(validations, validators);
    onRegisterValidation(validationMethod);
  }
  if (providedValidations.length) {
    const validationMethods = providedValidations.map((validation) =>
      computed(() => getProvidedValidationMethod(validation.value, validators)),
    );
    validationMethods.forEach(onRegisterValidation);
  }
};

type ProvidedBuiltinValidation<T> = Array<
  {
    [K in keyof T]: Ref<BuiltinValidation<T, K> | null>;
  }[keyof T]
>;

/**
 * Regardless of whether validations are provided via options or via state providers,
 * this function combines them into a single ref.
 */
const combineValidations = <T>({
  validations,
  providedValidations,
}: {
  validations: BuiltinValidations<T>;
  providedValidations: ProvidedBuiltinValidation<T>;
}): Ref<Partial<T>> => {
  const constantValidations = validations.reduce(
    (acc, validation) => ({ ...acc, [validation.id]: validation.parameters }),
    {},
  );
  return computed(() =>
    providedValidations
      .map((providedValidation) => providedValidation.value)
      .filter((val) => val !== null)
      .reduce(
        (acc, validation) => ({
          ...acc,
          // @ts-expect-error - we know that validation is not null here
          [validation.id]: validation.parameters,
        }),
        constantValidations,
      ),
  );
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
export const useBuiltinValidation = <T, S>(
  validators: Validators<T, S>,
  props: VueControlProps<S> | VueControlPropsForLabelContent<S>,
): Ref<Partial<T>> => {
  const options = props.control.uischema.options;
  const validations = extractValidations<T>(options);
  const providedValidations = extractProvidedValidations<T>(options);
  registerValidationMethods(
    validations,
    providedValidations,
    validators,
    props.onRegisterValidation,
  );
  return combineValidations({ validations, providedValidations });
};
