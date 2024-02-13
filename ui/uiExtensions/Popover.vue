<script>
/**
 * A reusable component which has an overlay and a slot for content. It contains the styles and animations needed for
 * a smooth, full-size popover capable of replacing `window.alert` or displaying messaging within a container element.
 * The scope of the component can be configured via prop (@see level) and the transparent overlay background-color can
 * be changed with the @see type prop.
 *
 * This component blocks pointer-events with the overlay but emits an event when there is a click away from the popover
 * content; allowing the parent component to minimize or remove the popover as needed.
 */
export default {
  props: {
    /**
     * Controls the locality of the popover. `global` creates a sticky, fullscreen popover for the entire
     * application. 'local' creates an overlay which is the full size of the parent container.
     *
     * @values global, local (default)
     */
    level: {
      type: String,
      default: "local",
    },
    /**
     * Opens and closes the alert from the parent.
     */
    active: {
      type: Boolean,
      default: false,
    },
    /**
     * Controls the transparent background color of the overlay. `error` creates a red-tinted, transparent
     * background. Other values will use a light-gray tint.
     *
     * @values error (default), <anything else>
     */
    type: {
      type: String,
      default: "error",
    },
  },
  emits: ["clickAway"],
  methods: {
    /**
     * Detects any clicks on the overlay, allowing the popover to be dismissed without having to click a
     * specific button or control.
     *
     * @param {Object} e - the browser mouse event.
     * @emits {clickAway} - can be used by parent to close the popover.
     * @returns {undefined}
     */
    onClickAway(e) {
      if (e.target === this.$refs.overlay) {
        this.$emit("clickAway");
      }
    },
  },
};
</script>

<template>
  <div :class="['container', level, type, { active }]" @click="onClickAway">
    <transition name="fade">
      <div v-if="active" ref="overlay" :class="['overlay', level, type]" />
    </transition>
    <transition name="slide-fade">
      <div v-if="active" :class="['alert-body', level]">
        <slot name="popoverContent" />
      </div>
    </transition>
  </div>
</template>

<style lang="postcss" scoped>
.message-fade-enter-active,
.fade-enter-active {
  transition: opacity 0.1s ease-out;
}

.fade-enter,
.fade-leave-to,
.message-fade-enter,
.message-fade-leave-to {
  opacity: 0;
}

.fade-leave-active,
.message-fade-leave-active {
  transition: opacity 0.2s ease-in -0.1s;
}

.message-fade-enter-active {
  transition-duration: 0.15s;
  transition-delay: 0.3s;
}

.container {
  min-height: 50px;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;

  &.global {
    pointer-events: none;
    position: fixed;
    z-index: 3;

    &.active {
      pointer-events: all;
    }

    & .slide-fade-leave-active {
      transition: all 0.3s ease-in 0.1s;
    }

    & .slide-fade-enter-active {
      transition: all 0.3s ease-out 0.1s;
    }

    & .slide-fade-enter,
    & .slide-fade-leave-to {
      transform: translateY(25%);
      opacity: 0;
    }
  }

  &.local {
    & .slide-fade-leave-active {
      transition: all 0.2s ease-in;
    }

    & .slide-fade-enter-active {
      transition: all 0.3s ease-out 0.1s;
    }

    & .slide-fade-enter,
    & .slide-fade-leave-to {
      transform: translateY(-25%);
      opacity: 0;
    }
  }
}

.overlay {
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 0 1px var(--knime-white);
  background-color: var(--knime-gray-light-semi);

  &.local {
    &.error {
      background-color: var(--theme-color-error-semi);
    }

    &.warn {
      background-color: var(--theme-color-action-required-semi);
    }
  }
}

.alert-body {
  font-size: 16px;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &.global {
    position: fixed;
    z-index: 3;
  }

  & :deep(div:first-child) {
    pointer-events: all;
  }
}
</style>
