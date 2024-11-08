<script lang="ts" setup>
/**
 * HintPopover supports element being a querySelector string useful for useHint / createHint.
 * Includes PopoverContent for easier creation via h() function in createHint. Completes hint on click outside.
 */
import { type MaybeRef, onMounted, ref, toRef, unref, watch } from "vue";
import { onClickOutside } from "@vueuse/core";

import { sleep } from "@knime/utils";

import type { MaybeElement } from "../types";

import { type Props as BasePopoverProps } from "./BasePopover.vue";
import BasePopover from "./BasePopover.vue";
import PopoverContent from "./PopoverContent.vue";

interface Props extends Omit<BasePopoverProps, "reference"> {
  content: InstanceType<typeof PopoverContent>["$props"];
  reference: string | MaybeRef<MaybeElement>;
  completeHint: () => void;
  skipAllHints: () => void;
}

const props = defineProps<Props>();

// click outside
const basePopover = ref<InstanceType<typeof BasePopover>>();
onClickOutside(basePopover, () => {
  props.completeHint();
});

// get element from DOM via selector
const referenceElement = ref<MaybeElement>();
onMounted(async () => {
  // we want to executed last so its more likely that our reference is there
  await sleep(0);
  watch(
    toRef(props, "reference"),
    (reference) => {
      if (typeof reference === "string") {
        referenceElement.value = document.querySelector(reference);
      } else {
        referenceElement.value = unref(reference);
      }
    },
    { immediate: true },
  );
});
</script>

<template>
  <BasePopover
    ref="basePopover"
    :placement="placement"
    :reference="referenceElement"
  >
    <PopoverContent
      v-bind="content"
      @close="completeHint"
      @skip-all="skipAllHints"
    />
  </BasePopover>
</template>
