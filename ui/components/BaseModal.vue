<script>
import { FocusTrap } from 'focus-trap-vue';

const KEY_ESC = 27;

/**
 * A reusable component which has an overlay and a slot for content. It contains the styles and animations needed for
 * a smooth, full-size modal capable of replacing `window.alert` or displaying messaging within a container element.
 *
 * This component blocks pointer-events with the overlay but emits an event when there is a click away from the modal
 * content; allowing the parent component to minimize or remove the modal as needed.
 *
 * Note that the widget width can be set vial the `--modal-width` CSS property, which defaults to `550px`.
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
    emits: ['cancel'],
    data() {
        return {
            /**
             * 'showContent' is used to animate the modal content separately
             */
            showContent: false,
            /**
             * 'focusTrapActive' is used to activate the FocusTrap.
             * it's false by default until component is mounted
             */
            focusTrapActive: false
        };
    },
    watch: {
        // Set and remove global event handlers on modal activation.
        // Only manual activation is supported.
        active(newVal, oldVal) {
            if (newVal === true) {
                window.addEventListener('keyup', this.onGlobalKeyUp);
            } else {
                window.removeEventListener('keyup', this.onGlobalKeyUp);
            }
     
            if (newVal !== oldVal) {
                // set FocusTrap's active prop on BaseModel's prop change
                this.focusTrapActive = newVal;
            }
        }
    },
    mounted() {
        /**
        * set FocusTrap's active prop on mounted to ensure that the component
        * is focusable when the focus trap component mounts.
        */
        this.focusTrapActive = this.active;
    },
    methods: {
        onGlobalKeyUp(e) {
            if (e.keyCode === KEY_ESC) {
                consola.trace('ESC key press, closing modal');
                this.cancel();
            }
        },
        /**
         * Detects any clicks on the overlay or the escape key, allowing the modal to be dismissed
         * without having to click a specific button or control.
         *
         * @param {Object} e - the browser mouse event.
         * @returns {undefined}
         */
        onOverlayClick() {
            this.cancel();
        },
        /**
         * @emits {cancel} - can be used by parent to close the modal.
         * @returns {undefined}
         */
        cancel() {
            this.$emit('cancel');
        }
    }
};
</script>

<template>
  <Transition
    name="fade"
    @after-enter="showContent = true"
    @leave="showContent = false"
  >
    <FocusTrap
      v-if="active"
      :active="active && showContent"
      :initial-focus="() => $refs.dialog"
      :allow-outside-click="true"
      class="container"
    >
      <div
        ref="dialog"
        tabindex="-1"
      >
        <div
          class="overlay"
          @click.stop="onOverlayClick"
        />
        <Transition name="slide">
          <div
            v-if="showContent"
            class="wrapper"
          >
            <div class="inner">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Focustrap>
  </Transition>
</template>

<style lang="postcss" scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-from,
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
  pointer-events: all;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: min(95%, var(--modal-width, 550px));
  background-color: var(--knime-white);
}
</style>
