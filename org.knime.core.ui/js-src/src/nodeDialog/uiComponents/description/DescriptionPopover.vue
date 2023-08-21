<script setup lang="ts">
import Description from "webapps-common/ui/components/Description.vue";
import DescriptionIcon from "webapps-common/ui/assets/img/icons/circle-help.svg";
import DialogPopover from "@/nodeDialog/popover/DialogPopover.vue";
import type DescriptionPopoverProps from "./types/DescriptionPopoverProps";

withDefaults(defineProps<DescriptionPopoverProps>(), {
  hover: false,
  ignoredClickOutsideTarget: null,
});
</script>

<template>
  <DialogPopover
    tooltip="Click for more information"
    :ignored-click-outside-target="ignoredClickOutsideTarget"
  >
    <template #icon="{ expanded, focused }">
      <DescriptionIcon v-show="hover || expanded || focused" />
    </template>
    <template #popover>
      <div class="description-wrapper">
        <Description class="description" :text="html" render-as-html />
      </div>
    </template>
  </DialogPopover>
</template>

<style lang="postcss" scoped>
/** A deep selector is necessary, since Description is a multi-root component
* (see https://github.com/vuejs/core/issues/5446)
*/
.description-wrapper :deep(.description) {
  max-height: 300px;
  overflow: auto;
  pointer-events: auto;
  font-size: 13px;
  line-height: 18.78px; /* Description component line-height-to-font-size-ratio of 26/18 times font size of 13 */
  color: var(--knime-masala);
}
</style>
