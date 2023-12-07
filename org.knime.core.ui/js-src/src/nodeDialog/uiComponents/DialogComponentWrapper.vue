<script>
import { defineComponent } from "vue";
import isSettingsVisibleMixin from "../mixins/isSettingsVisibleMixin";

const DialogComponentWrapper = defineComponent({
  name: "DialogComponentWrapper",
  mixins: [isSettingsVisibleMixin],
  props: {
    control: {
      type: Object,
      default: () => {},
    },
  },
});
export default DialogComponentWrapper;
</script>

<template>
  <div v-if="isVisible" :class="['wrapper', { fadeContainer: isAdvanced }]">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
@import url("../utils/animation.css");

.wrapper {
  min-width: 0;
}
</style>
