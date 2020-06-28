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
                return ['info', 'error', 'success'].includes(type);
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
        },
        count: {
            type: Number,
            default: 1
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
             * @event dismiss
             */
            this.$emit('dismiss');
        }
    }
};
</script>

<template>
  <section
    v-if="active"
    :class="type"
  >
    <div class="grid-container">
      <em class="grid-item-12">
        <!-- @slot Use this slot to add an icon. -->
        <slot name="icon" />
        <span class="message">
          <!-- @slot Use this slot to add text content (markup). -->
          <slot />
          <span
            v-show="count && count > 1"
            class="message-count"
          >
            {{ '×' + count }}
          </span>
        </span>
        <Button
          v-if="button"
          class="close"
          primary
          compact
          on-dark
          @click="onDismiss"
          @keydown.space.stop.prevent="onDismiss"
        >
          {{ button }}
        </Button>
        <span
          v-else
          tabindex="0"
          class="close"
          title="Discard message"
          @click="onDismiss"
          @keydown.space.stop.prevent="onDismiss"
        >
          <CloseIcon />
        </span>
      </em>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.message-count {
  padding: 3px 7.5px;
  margin-left: 5px;
  background-color: white;
  border-radius: 12px;
}

section {
  border-bottom: 1px solid var(--theme-color-white);

  & em {
    font-weight: 700;
    font-style: normal;
    font-size: 16px;
    line-height: 24px;
    padding: 15px 0;
    display: flex;
    position: relative;
    align-items: center;
    color: var(--theme-color-white);

    & > .message {
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & >>> svg {
      width: 22px;
      height: 22px;
      stroke-width: calc(32px / 22);
      stroke: var(--theme-color-white);
      margin-right: 20px;
      flex-shrink: 0;
      top: 0;
    }

    & button.close {
      flex-shrink: 0;
      margin-bottom: 0;
      margin-left: 10px;
      display: flex;
      width: unset;
    }

    & span.close {
      height: 30px;
      width: 30px;
      border-radius: 50%;
    }

    & .close {
      outline: none;
      display: flex;
      align-items: center;
      text-align: center;

      /* hover/focus styles for type error and success */
      &:hover,
      &:focus {
        background-color: var(--theme-color-silver-sand-semi);
      }

      & svg {
        margin: auto;
        height: 18px;
        width: 18px;
        stroke-width: calc(32px / 18);
        cursor: pointer;
      }
    }
  }

  &:last-child {
    border-bottom: 0;
  }

  &.info {
    background-color: var(--theme-color-info);

    /* hover/focus styles for type info */
    & .close:hover >>> svg,
    & .close:focus >>> svg {
      filter: drop-shadow(0 0 4px white);
    }

    & .message-count {
      color: var(--theme-color-info);
    }
  }

  &.error {
    background-color: var(--theme-color-error);

    & .message-count {
      color: var(--theme-color-error);
    }
  }

  &.success {
    background-color: var(--theme-color-success);

    & .message-count {
      color: var(--theme-color-success);
    }
  }
}
</style>
