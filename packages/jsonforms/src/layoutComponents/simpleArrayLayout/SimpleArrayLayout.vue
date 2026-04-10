<script setup lang="ts">
import { computed } from "vue";
import {
  type ControlElement,
  type JsonSchema,
  type UISchemaElement,
  composePaths,
} from "@jsonforms/core";
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsArrayControl,
} from "@jsonforms/vue";

import { Label } from "@knime/components";
import { KdsButton } from "@knime/kds-components";

import ArrayLayoutItemControls from "./SimpleArrayLayoutItemControls.vue";

const props = defineProps(rendererProps<ControlElement>());

const { control, addItem, moveUp, moveDown, removeItems } =
  useJsonFormsArrayControl(props) as Required<
    ReturnType<typeof useJsonFormsArrayControl>
  >;

const uischemaOptions = computed(() => control.value.uischema.options ?? {});

const showSortControls = computed(
  () => uischemaOptions.value.showSortButtons ?? false,
);

const elements = computed((): [string, UISchemaElement][] =>
  Object.entries(
    (uischemaOptions.value.detail as Record<string, UISchemaElement>) ?? {},
  ),
);

const showElementTitles = computed(
  () => "arrayElementTitle" in uischemaOptions.value,
);

const isHidingControlHeader = computed(
  () => uischemaOptions.value.hideControlHeader ?? false,
);

const createDefaultValue = (schema: NonNullable<JsonSchema>) => {
  const primitives = ["integer", "number", "boolean", "string"];
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;

  if (!schema.properties && primitives.includes(type ?? "")) {
    return schema.default;
  }

  const properties =
    schema.properties && !Array.isArray(schema.properties)
      ? schema.properties
      : undefined;

  if (!properties) {
    return schema.default ?? {};
  }

  return Object.fromEntries(
    Object.entries(properties).map(([key, val]) => [key, val.default]),
  );
};

const addDefaultItem = () => {
  addItem(control.value.path, createDefaultValue(control.value.schema))();
};

const returnLabel = (index: number) =>
  `${uischemaOptions.value.arrayElementTitle ?? ""} ${index + 1}`;
</script>

<template>
  <div v-if="control.visible" class="simple-array">
    <div
      v-for="(_obj, objIndex) in control.data"
      :key="`${control.path}-${objIndex}`"
    >
      <div v-if="showElementTitles" class="item-header">
        <Label :text="returnLabel(objIndex)" />
        <ArrayLayoutItemControls
          :is-first="objIndex === 0"
          :is-last="objIndex === control.data.length - 1"
          :show-sort-controls="showSortControls"
          :is-hiding-control-header="isHidingControlHeader"
          @move-up="moveUp(control.path, objIndex)()"
          @move-down="moveDown(control.path, objIndex)()"
          @delete="removeItems(composePaths(control.path, ''), [objIndex])()"
        />
      </div>
      <div
        v-for="([elemKey, element], elemIndex) in elements"
        :key="`${control.path}-${objIndex}-${elemKey}`"
        class="element"
      >
        <DispatchRenderer
          class="form-component"
          :schema="control.schema"
          :uischema="element"
          :path="composePaths(control.path, `${objIndex}`)"
          :enabled="control.enabled"
          :renderers="control.renderers"
          :cells="control.cells"
        />
        <ArrayLayoutItemControls
          v-if="elemIndex === 0 && !showElementTitles"
          :is-first="objIndex === 0"
          :is-last="objIndex === control.data.length - 1"
          :show-sort-controls="showSortControls"
          :is-hiding-control-header="isHidingControlHeader"
          @move-up="moveUp(control.path, objIndex)()"
          @move-down="moveDown(control.path, objIndex)()"
          @delete="removeItems(composePaths(control.path, ''), [objIndex])()"
        />
      </div>
    </div>
    <KdsButton
      :label="uischemaOptions.addButtonText"
      leading-icon="plus"
      size="small"
      variant="outlined"
      @click="addDefaultItem"
    />
  </div>
</template>

<style lang="postcss" scoped>
.simple-array {
  & .item-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-top: var(--kds-spacing-container-0-5x);
    margin-bottom: var(--kds-spacing-container-0-5x);
  }

  & .element {
    display: flex;
    gap: var(--kds-spacing-container-0-25x);
    align-items: end;
    margin-bottom: var(--kds-spacing-container-1x);

    & .form-component {
      flex-grow: 1;
      min-width: 0;
    }
  }

  & > *:last-child > * {
    margin-bottom: 0;
  }
}
</style>
