<script>
import { FocusTrap } from 'focus-trap-vue';

/**
 * A reusable component which has an overlay and a slot for content. It contains the styles and animations needed for
 * a smooth, full-size modal capable of replacing `window.alert` or displaying messaging within a container element.
 *
 * This component blocks pointer-events with the overlay but emits an event when there is a click away from the modal
 * content; allowing the parent component to minimize or remove the modal as needed.
 */
export default {
    components: {
        FocusTrap
    },
    props: {
        /**
         * Opens and closes the alert from the parent.
         */
        active: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        /**
         * Detects any clicks on the overlay, allowing the modal to be dismissed without having to click a
         * specific button or control.
         *
         * @param {Object} e - the browser mouse event.
         * @emits {clickAway} - can be used by parent to close the modal.
         * @returns {undefined}
         */
        onClickAway(e) {
            if (e.target === this.$refs.overlay) {
                this.$emit('clickAway');
            }
        }
    }
};
</script>

<template>
  <FocusTrap :active="active">
    <div
      :class="['container', { active }]"
      @click="onClickAway"
    >
      <transition name="fade">
        <div
          v-if="active"
          ref="overlay"
          class="overlay"
        />
      </transition>
      <transition name="slide">
        <div
          v-if="active"
          class="wrapper"
        >
          <div class="inner">
            <slot />
          </div>
        </div>
      </transition>
    </div>
  </FocusTrap>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.fade-enter,
.fade-leave-to,
.slide-enter,
.slide-leave-to {
  opacity: 0;
}

.slide-enter {
  transform: translateY(25%);
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-enter-active {
  transition: all 0.15s ease-out 0.2s;
}

.fade-leave-active,
.slide-leave-active {
  transition: all 0.2s ease-in -0.1s;
}

.container {
  z-index: 100;
  min-height: 50px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;

  &.active {
    pointer-events: all;
  }
}

.overlay {
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--theme-color-overlay);
}

.wrapper {
  font-size: 16px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.inner {
  pointer-events: all;
}
</style>
