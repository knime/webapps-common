import { type Ref, onMounted, ref, unref } from "vue";

import inject from "../../utils/inject";

export type UiSchemaWithProvidedOptions<T extends Record<string, unknown>> = {
  options?: T;
  providedOptions?: string[];
} & (
  | {
      scope: string;
    }
  | {
      id: string;
    }
);

type NonUndefined<T> = T extends undefined ? never : T;

// taken from https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
type Join<K, P> = K extends string
  ? P extends string
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Prev = [never, 0, 1];

export type Paths<T, D extends number = 2> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string
          ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
          : never;
      }[keyof T]
    : "";

export type ExtractNestedValue<
  T,
  P extends string,
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? ExtractNestedValue<T[Key], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;
export default <
  U extends UiSchemaWithProvidedOptions<Record<string, unknown>>,
  K extends Paths<NonUndefined<U["options"]>>,
  D = ExtractNestedValue<NonUndefined<U["options"]>, K> | null,
>(
  uischema: Ref<U>,
  providedOptionName: K,
  defaultValue: D | null = null,
) => {
  const addStateProviderListener = inject("addStateProviderListener");

  const state = ref(
    uischema.value.options?.[providedOptionName] ?? defaultValue,
  ) as Ref<NonUndefined<D>>;

  const uischemaValue = unref(uischema);
  const identifier =
    "scope" in uischemaValue
      ? { scope: uischemaValue.scope }
      : { id: uischemaValue.id };

  onMounted(() => {
    if ((uischema.value.providedOptions ?? []).includes(providedOptionName)) {
      addStateProviderListener(
        { ...identifier, providedOptionName },
        (providedValue: NonUndefined<D>) => {
          state.value = providedValue;
        },
      );
    }
  });

  return state;
};
