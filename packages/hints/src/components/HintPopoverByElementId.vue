<script lang="ts" setup>
/**
 * Same as HintPopover just with the element being a querySelector string useful for useHint / createHint.
 * Includes PopoverContent for easier creation via h() function in createHint. Completes hint on click outside.
 */
import { onMounted, ref, toRef, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import type { MaybeElement } from "@floating-ui/vue";

import { type Props as HitPopoverProps } from "./HintPopover.vue";
import HintPopover from "./HintPopover.vue";
import PopoverContent from "./PopoverContent.vue";

interface Props extends Omit<HitPopoverProps, "reference"> {
  content: InstanceType<typeof PopoverContent>["$props"];
  reference: string;
  completeHint: () => void;
  skipAllHints: () => void;
}

const props = defineProps<Props>();

// click outside
const hintPopover = ref<InstanceType<typeof HintPopover>>();
onClickOutside(hintPopover, () => {
  props.completeHint();
});

// get element from DOM via selector
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
    ref="hintPopover"
    :placement="placement"
    :is-visible="isVisible"
    :reference="referenceElement"
  >
    <PopoverContent
      v-bind="content"
      @close="completeHint"
      @skip-all="skipAllHints"
    />
  </HintPopover>
</template>
