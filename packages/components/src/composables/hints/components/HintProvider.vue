<script lang="ts" setup>
/**
 * Renders the hints in the App, please put this somewhere top level in your application and trigger the hints with
 * the functions useHint() returns.
 */

import { computed } from "vue";

import {
  type HintComponentOptions,
  useHintProvider,
} from "../composables/useHintProvider";
import { sideAndAlignToPlacement } from "../util/sideAndAlignToPlacement";

import HintPopover from "./HintPopover.vue";

const { hintData } = useHintProvider();

const getContent = (hint: HintComponentOptions) => {
  return {
    title: hint.title,
    description: hint.description,
    linkHref: hint.linkHref,
    linkText: hint.linkText,
    hideButtons: hint.hideButtons,
    video: hint.video,
  };
};

const visibleHints = computed(() =>
  hintData.value.filter(({ isVisible }) => isVisible),
);
</script>

<template>
  <HintPopover
    v-for="(hint, index) in visibleHints"
    :key="index"
    :reference="hint.element"
    :placement="sideAndAlignToPlacement(hint.side, hint.align)"
    :content="getContent(hint)"
    :complete-hint="hint.onCompleteHint"
    :skip-all-hints="hint.onSkipAllHints"
  />
</template>
