<script setup lang="ts">
import type { ControlElement } from "@jsonforms/core";
import { DispatchRenderer, rendererProps } from "@jsonforms/vue";

import VerticalLayoutBase from "../VerticalLayoutBase.vue";

import VennDiagram from "./VennDiagram.vue";

const props =
  defineProps(
    rendererProps<{
      elements: [
        left: ControlElement,
        middle: ControlElement,
        right: ControlElement,
      ];
    }>(),
  );
const [middle, left, right] = props.uischema.elements;
</script>

<template>
  <div class="horizontal">
    <VerticalLayoutBase
      #default="{ element }"
      :elements="[middle, left, right]"
    >
      <DispatchRenderer v-bind="props" :uischema="element as ControlElement" />
    </VerticalLayoutBase>
    <VennDiagram v-bind="props" class="venn-diagram" />
  </div>
</template>

<style lang="postcss" scoped>
.horizontal {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  & .venn-diagram {
    margin: 10px;
  }
}
</style>
