import { computed, type Ref } from "vue";

const INVALID_NAME_CHARACTERS = /[*?#:"<>%~|/\\]/;
/**
 * "/", "\" and "." are non-valid preffixes and will be auto-removed
 */
const INVALID_PREFIX = /^(\.)+|^(\\)+|^(\/)+/;
/**
 * "/", "\" and "." are non-valid suffixes and will be auto-removed
 */
const INVALID_SUFFIX = /(\.)+$|(\\)+$|(\/)+$/;

const NAME_CHAR_LIMIT = 255;

const UNAVAILABLE_NAME_DEFAULT_MSG = "Name is already taken";

type UseNameValidatorOptions = {
  name: Ref<string>;
  blacklistedNames: Ref<Array<string>>;
  unavailableNameMessage?: string;
};

export const useNameValidator = (options: UseNameValidatorOptions) => {
  const cleanName = (value: string) =>
    value.trim().replace(INVALID_PREFIX, "").replace(INVALID_SUFFIX, "");

  const isValidName = computed(() => {
    const newValue = cleanName(options.name.value);
    return (
      !INVALID_NAME_CHARACTERS.test(newValue) &&
      newValue.length <= NAME_CHAR_LIMIT
    );
  });

  const isNameAvailable = computed(
    () => !options.blacklistedNames.value.includes(options.name.value),
  );

  const isValid = computed(() => isValidName.value && isNameAvailable.value);

  const errorMessage = computed(() => {
    if (!isValidName.value) {
      return 'Name contains invalid characters *?#:"<>%~|/ or exceeds 255 characters';
    }

    if (!isNameAvailable.value) {
      return options.unavailableNameMessage || UNAVAILABLE_NAME_DEFAULT_MSG;
    }

    return "";
  });

  return {
    isValid,
    errorMessage,
    cleanName,
  };
};
