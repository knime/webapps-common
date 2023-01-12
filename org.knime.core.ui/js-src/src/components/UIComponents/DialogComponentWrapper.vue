<script>
import { defineComponent } from '@vue/composition-api';
import isSettingsVisibleMixin from '../mixins/isSettingsVisibleMixin';

const DialogComponentWrapper = defineComponent({
    name: 'DialogComponentWrapper',
    mixins: [isSettingsVisibleMixin],
    props: {
        control: {
            type: Object,
            default: () => {}
        }
    }
});
export default DialogComponentWrapper;
</script>

<template>
  <div
    v-if="isVisible"
    :class="{fadeContainer: isAdvanced}"
  >
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
@import "../../utils/animation.css";
</style>
