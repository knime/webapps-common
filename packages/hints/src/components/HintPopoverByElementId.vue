<script lang="ts" setup>
/**
 * Same as HintPopover just with the element being a querySelector string useful for useHint / createHint
 */
import { onMounted, ref, toRef, watch } from "vue";
import type { MaybeElement } from "@floating-ui/vue";

import { type Props as HitPopoverProps } from "./HintPopover.vue";
import HintPopover from "./HintPopover.vue";

interface Props extends Omit<HitPopoverProps, "reference"> {
  reference: string;
}

const props = defineProps<Props>();

const referenceElement = ref<MaybeElement<Element>>();

onMounted(async () => {
  // we want to executed last so its more likely that our reference is there
  await new Promise((r) => setTimeout(r, 0));
  watch(
    toRef(props, "reference"),
    (reference) => {
      referenceElement.value = document.querySelector(reference);
    },
    { immediate: true },
  );
});
</script>

<template>
  <HintPopover
    :content="content"
    :placement="placement"
    :is-visible="isVisible"
    :reference="referenceElement"
    :data-reference-id="reference"
  />
</template>
