<script>
import CloseIcon from '../assets/img/icons/close.svg?inline';
import Button from './Button';

/**
 * Message banner component with close button
 */
export default {
    components: {
        CloseIcon,
        Button
    },
    props: {
        /**
         * One of 'info', 'error', 'success'. Defaults to 'info'.
         * This has no implication on functionality, only styling
         */
        type: {
            type: String,
            default: 'info',
            validator(type = 'info') {
                return ['info', 'error', 'success', 'transparent'].includes(type);
            }
        },
        /**
         * Optional button text.
         * If set, renders a button instead of the 'x' that is used for closing the Message.
         * If left blank, the 'x' is rendered.
         */
        button: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            active: true
        };
    },
    methods: {
        onDismiss() {
            consola.trace('dismissing message');
            this.active = false;
            /**
             * Dismiss event. Fired when the close button / 'x' is clicked.
             * The embedding component should use this to clean up the instance.
             * Otherwise the message will be visually hidden, but still in memory.
             *
             * @event success
             */
            this.$emit('dismiss');
        }
    }
};
</script>

<template>
  <em
    v-if="active"
    :class="type"
  >
    <!-- @slot Use this slot to add an icon. -->
    <slot name="icon" />
    <span class="message">
      <!-- @slot Use this slot to add text content (markup). -->
      <slot />
    </span>
    <Button
      v-if="button"
      class="close"
      compact
      on-dark
      @click="onDismiss"
    >
      {{ button }}
    </Button>
    <span
      v-else
      @click="onDismiss"
    >
      <CloseIcon class="close" />
    </span>
  </em>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables/colors";

em {
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
  padding: 15px;
  display: flex;
  position: relative;
  color: var(--theme-color-white);
  background: var(--theme-color-info);
  min-height: 68px;

  &.error {
    background: var(--theme-color-error);
  }

  &.success {
    background: var(--theme-color-success);
  }

  &.transparent {
    background: transparent;
    padding: 15px 0;
  }

  & > .message {
    flex-grow: 1;
  }

  & svg {
    width: 22px;
    height: 22px;
    stroke-width: calc(32px / 22);
    stroke: var(--theme-color-white);
    margin-right: 20px;
    flex-shrink: 0;
  }

  & button.close {
    flex-shrink: 0;
    margin-bottom: 0;
    margin-left: 10px;
  }

  & svg.close {
    margin-right: 0;
    height: 18px;
    width: 18px;
    stroke-width: calc(32px / 18);
    cursor: pointer;
  }
}
</style>
