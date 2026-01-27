<script lang="ts">
export const DEFAULT_ANY_UNKNOWN_VALUES_ID = "<any unknown new column>";
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { indexOf } from "lodash-es"; // eslint-disable-line depend/ban-dependencies

import { SortList } from "@knime/components";
import { KdsButton, KdsDataType } from "@knime/kds-components";

import LabeledControl from "../higherOrderComponents/control/LabeledControl.vue";
import ErrorMessages from "../higherOrderComponents/control/errorMessage/ErrorMessages.vue";
import type { VueControlProps } from "../higherOrderComponents/control/types";

import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./composables/useProvidedState";

type SortListControlOptions = {
  possibleValues?: { id: string; text: string; special?: true }[];
  unknownElementId?: string;
  unknownElementLabel?: string;
  resetSortButtonLabel?: string;
};

type SortListControlUiSchema =
  UiSchemaWithProvidedOptions<SortListControlOptions>;

const props = defineProps<VueControlProps<string[]>>();

const data = computed(() => props.control.data);
const uischema = computed(
  () => props.control.uischema as SortListControlUiSchema,
);
const anyUnknownValuesId = computed(
  () =>
    uischema.value.options?.unknownElementId ?? DEFAULT_ANY_UNKNOWN_VALUES_ID,
);
const anyUnknownValuesText = computed(
  () => uischema.value.options?.unknownElementLabel ?? "Any unknown column",
);
const resetSortButtonLabel = computed(
  () => uischema.value.options?.resetSortButtonLabel ?? "Reset all",
);

const possibleValues = useProvidedState(
  uischema,
  "possibleValues",
  [] as SortListControlOptions["possibleValues"],
);

const possibleValuesWithUnknownValues = computed(() =>
  possibleValues.value.concat({
    id: anyUnknownValuesId.value,
    text: anyUnknownValuesText.value,
    special: true,
  }),
);

const addUnknownValuesToData = (currentPossibleValues: { id: string }[]) => {
  /**
   * This way, the dialog does not need to receive an initial materialized default order
   */
  if (data.value.length === 0) {
    resetAll();
    return;
  }
  const unknownValuesIndex = indexOf(data.value, anyUnknownValuesId.value);
  if (unknownValuesIndex === -1) {
    throw new Error(
      `SortList data have to contain the value "${anyUnknownValuesId.value}"`,
    );
  }
  const before = data.value.slice(0, unknownValuesIndex + 1);
  const after = data.value.slice(unknownValuesIndex + 1);
  const dataSet = new Set(data.value);
  const unknownValues = currentPossibleValues
    .map(({ id }) => id)
    .filter((id) => !dataSet.has(id));
  if (unknownValues.length > 0) {
    props.changeValue(before.concat(unknownValues, after));
  }
};

onMounted(() => {
  addUnknownValuesToData(possibleValues.value);
});

const withTypes = computed(() =>
  Boolean(possibleValues.value?.[0]?.hasOwnProperty("type")),
);

watch(() => possibleValues.value, addUnknownValuesToData);

const sortAToZ = () => {
  props.changeValue(data.value.toSorted((a, b) => a.localeCompare(b)));
};
const sortZToA = () => {
  props.changeValue(data.value.toSorted((a, b) => b.localeCompare(a)));
};
const resetAll = () => {
  props.changeValue(possibleValuesWithUnknownValues.value.map(({ id }) => id));
};
const controlElement = ref<typeof SortList | null>(null);
</script>

<template>
  <div :class="['flex', 'space-between']">
    <div class="flex">
      <KdsButton
        variant="outlined"
        size="small"
        label="A - Z"
        @click="sortAToZ"
      />
      <KdsButton
        variant="outlined"
        size="small"
        label="Z - A"
        @click="sortZToA"
      />
    </div>
    <KdsButton
      variant="outlined"
      size="small"
      :label="resetSortButtonLabel"
      @click="resetAll"
    />
  </div>
  <LabeledControl
    :label="control.label"
    @controlling-flow-variable-set="changeValue"
  >
    <template #default="{ labelForId }">
      <ErrorMessages :errors="messages.errors">
        <!--  eslint-disable vue/attribute-hyphenation ariaLabel needs to be given like this for typescript to not complain -->
        <SortList
          :id="labelForId ?? undefined"
          ref="controlElement"
          :possible-values="possibleValuesWithUnknownValues"
          :model-value="data"
          :ariaLabel="control.label"
          :disabled="disabled"
          @update:model-value="changeValue"
          ><template v-if="withTypes" #option="{ slotItem }">
            <div
              :class="[
                'data-type-entry',
                {
                  invalid: slotItem.invalid,
                  'with-type': slotItem.invalid || slotItem.type?.id,
                  special: slotItem.special,
                },
              ]"
            >
              <template v-if="slotItem.invalid">
                <KdsDataType size="small" />
                <span>{{ slotItem.text }}</span>
              </template>
              <template v-else>
                <template v-if="slotItem.type?.id">
                  <KdsDataType
                    :icon-name="slotItem.type.id"
                    :icon-title="slotItem.type.text"
                    size="small"
                  />
                </template>
                <span>{{ slotItem.text }}</span>
              </template>
            </div>
          </template>
        </SortList>
      </ErrorMessages>
    </template>
    <template #icon>
      <slot name="icon" />
    </template>
    <template #buttons="{ hover }">
      <slot
        name="buttons"
        :hover="hover"
        :control-h-t-m-l-element="controlElement"
      />
    </template>
  </LabeledControl>
</template>

<style scoped>
.flex {
  display: flex;
  flex-direction: row;
  gap: 4px;

  &.space-between {
    justify-content: space-between;
  }
}

.data-type-entry.with-type {
  display: flex;
  gap: var(--space-4);
  align-items: center;

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
