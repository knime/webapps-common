<script>
import { FocusTrap } from 'focus-trap-vue';

const KEY_ESC = 27;

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
    data() {
        return {
            /**
             * 'showContent' is used to animate the modal content separately
             */
            showContent: false
        };
    },
    watch: {
        // Set and remove global event handlers on modal activation.
        // Only manual activation is supported.
        active(newVal) {
            if (newVal === true) {
                window.addEventListener('keyup', this.onGlobalKeyUp);
            } else {
                window.removeEventListener('keyup', this.onGlobalKeyUp);
            }
        }
    },
    methods: {
        onGlobalKeyUp(e) {
            if (e.keyCode === KEY_ESC) {
                consola.trace('ESC key press, closing modal');
                this.onCancel();
            }
        },
        /**
         * Detects any clicks on the overlay or the escape key, allowing the modal to be dismissed
         * without having to click a specific button or control.
         *
         * @param {Object} e - the browser mouse event.
         * @emits {cancel} - can be used by parent to close the modal.
         * @returns {undefined}
         */
        onCancel(e) {
            this.$emit('cancel');
        }
    }
};
</script>

<template>
  <transition
    v-if="active"
    name="fade"
    @after-enter="showContent = true"
    @leave="showContent = false"
  >
    <FocusTrap
      :active="active"
      class="container"
    >
      <div ref="dialog">
        <div
          class="overlay"
          @click="onCancel"
        />
        <transition name="slide">
          <div
            v-if="showContent"
            class="wrapper"
          >
            <div class="inner">
              <slot />
            </div>
          </div>
        </transition>
      </div>
    </FocusTrap>
  </transition>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(25%);
  opacity: 0;
}

.slide-enter-active,
.fade-enter-active {
  transition: all 0.1s ease-out;
}

.fade-leave-active,
.slide-leave-active {
  transition: all 0.1s ease-in;
}

.container {
  z-index: var(--z-index-common-modal, 100);
  min-height: 50px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--knime-black-semi);
}

.wrapper {
  /* Wrapper is used to center the modal and enable independent transitions from the overlay */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  font-size: 16px;
}

.inner {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 100%;

  & > >>> * {
    pointer-events: all;
    margin: auto;
    width: min(95%, 550px);
    background-color: var(--knime-white);
  }
}
</style>
