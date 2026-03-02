<script setup lang="ts">
import { type Ref, computed, ref, watch } from "vue";

import { KdsButton, KdsCheckbox, KdsToggleButton } from "@knime/kds-components";

import type { VueControlProps } from "../higherOrderComponents";
import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

const DEFAULT_COLUMN_COUNT = 7;
const DEFAULT_GRID_WIDTH = "auto";
const DEFAULT_TOGGLE_NAME = "Invert selection";

type GridSelectionItemId = string | number;

type GridMap = Map<GridSelectionItemId, { active: boolean }>;

interface GridSelectionUiSchemaOptions {
  possibleValues: { id: GridSelectionItemId; text: string }[];
  columnCount?: number;
  gridWidth?: string;
  toggleLabel: string;
  renderLastItemAsCheckbox?: boolean;
}

const props = defineProps<
  {
    handleChange: VueControlProps<GridSelectionItemId[]>["handleChange"];
    control: VueControlProps<GridSelectionItemId[]>["control"];
  } & VueControlPropsForLabelContent<GridSelectionItemId[]>
>();

const {
  control: { path, uischema: { options } = {} },
  handleChange,
} = props;

const {
  possibleValues = [],
  columnCount = DEFAULT_COLUMN_COUNT,
  gridWidth = DEFAULT_GRID_WIDTH,
  toggleLabel = DEFAULT_TOGGLE_NAME,
  renderLastItemAsCheckbox = false,
} = options as GridSelectionUiSchemaOptions;

const gridMap: Ref<GridMap> = ref(new Map());

const gridStyle = computed(() => ({
  "grid-template-columns": `repeat(${columnCount}, 1fr)`,
}));

const values = computed(() =>
  possibleValues.filter(
    (_item, index) =>
      !(renderLastItemAsCheckbox && index === possibleValues.length - 1),
  ),
);

const lastItem = computed(() =>
  renderLastItemAsCheckbox ? possibleValues[possibleValues.length - 1] : null,
);

const invertSelection = () => {
  const invertedMap: GridMap = new Map();
  gridMap.value.forEach(
    ({ active }: { active: boolean }, id: GridSelectionItemId) => {
      invertedMap.set(id, {
        active: !active,
      });
    },
  );
  gridMap.value = invertedMap;
};

const setGridMap = () => {
  const map: GridMap = new Map();
  possibleValues.forEach(({ id }) => {
    map.set(id, { active: props.control.data?.includes(id) ?? false });
  });
  return map;
};

const gridSelectionIds = computed(() => {
  const selectedIds: GridSelectionItemId[] = [];
  gridMap.value.forEach(
    ({ active }: { active: boolean }, id: GridSelectionItemId) => {
      if (active) {
        selectedIds.push(id);
      }
    },
  );
  return selectedIds;
});

const controlDataIds = computed(() => props.control.data ?? []);

const hasChanges = computed(() => {
  const selectedIds = gridSelectionIds.value;
  const controlIds = controlDataIds.value;
  if (selectedIds.length !== controlIds.length) {
    return true;
  }
  const controlSet = new Set(controlIds);
  return selectedIds.some((id) => !controlSet.has(id));
});

watch(
  () => props.control.data,
  () => {
    if (hasChanges.value) {
      gridMap.value = setGridMap();
    }
  },
  { immediate: true, deep: true },
);

watch(
  () => gridMap.value,
  () => {
    if (hasChanges.value) {
      handleChange(path, gridSelectionIds.value);
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="grid-list">
    <div
      v-if="possibleValues.length"
      class="grid-list-container"
      :style="gridStyle"
    >
      <KdsToggleButton
        v-for="{ id, text } in values"
        :key="`grid-item-${id}`"
        v-model="gridMap.get(id)!.active"
        class="overwrite-legacy-styles"
        :label="text"
        variant="outlined"
        size="xsmall"
      />
    </div>

    <div v-if="renderLastItemAsCheckbox && lastItem" class="checkbox">
      <KdsCheckbox
        v-model="gridMap.get(lastItem.id)!.active"
        :label="lastItem.text"
      />
    </div>

    <KdsButton
      v-if="toggleLabel"
      variant="outlined"
      size="xsmall"
      :label="toggleLabel"
      leading-icon="replace"
      class="invert overwrite-legacy-styles"
      @click.prevent="invertSelection"
    />
  </div>
</template>

<style lang="postcss" scoped>
.grid-list {
  width: v-bind(gridWidth);

  & .grid-list-container {
    display: grid;
    align-items: stretch;
    justify-items: stretch;
  }

  & .button {
    min-width: 36px;
    margin-bottom: var(--space-8);

    &.overwrite-legacy-styles {
      border-radius: 6px;

      &.toggled {
        border-radius: 6px;
        color: light-dark(hsl(0 0% 16%), hsl(0 0% 94%));
        background-color: light-dark(hsl(166 68% 93%), hsl(176 67% 22% / 0.32));
        border: 1px solid light-dark(hsl(172 27% 48%), hsl(168 47% 85%));

        &:hover {
          background-color: light-dark(
            hsl(168 47% 85%),
            hsl(174 48% 31% / 0.56)
          );
        }

        &:active {
          background-color: light-dark(
            hsl(169 34% 76%),
            hsl(172 27% 48% / 0.72)
          );
        }
      }
    }

    &.invert {
      margin-left: 0;
      margin-top: var(--space-12);
    }
  }

  & .checkbox {
    margin-top: var(--space-6);
  }
}
</style>
