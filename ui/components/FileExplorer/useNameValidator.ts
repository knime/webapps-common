import { computed, type Ref } from "vue";

const INVALID_NAME_CHARACTERS = /[*?#:"<>%~|/\\]/;

const NAME_CHAR_LIMIT = 255;

const UNAVAILABLE_NAME_DEFAULT_MSG = "Name is already in use";

type UseNameValidatorOptions = {
  name: Ref<string>;
  blacklistedNames: Ref<Array<string>>;
  unavailableNameMessage?: string;
};

export const useNameValidator = (options: UseNameValidatorOptions) => {
  const cleanName = (value: string) => value.trim();

  const startsWithDot = computed(() => options.name.value.startsWith("."));
  const endsWithDot = computed(() => options.name.value.endsWith("."));

  const isValidName = computed(() => {
    return (
      !startsWithDot.value &&
      !endsWithDot.value &&
      !INVALID_NAME_CHARACTERS.test(options.name.value) &&
      options.name.value.length <= NAME_CHAR_LIMIT
    );
  });

  const isNameAvailable = computed(
    () => !options.blacklistedNames.value.includes(options.name.value),
  );

  const isValid = computed(() => isValidName.value && isNameAvailable.value);

  const errorMessage = computed(() => {
    if (startsWithDot.value) {
      return "Name cannot start with a dot (.)";
    }

    if (endsWithDot.value) {
      return "Name cannot end with a dot (.)";
    }

    if (!isValidName.value) {
      return 'Name contains invalid characters *?#:"<>%~|/\\ or exceeds 255 characters';
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
