<script>
import CloseIcon from '../assets/img/icons/close.svg?inline';
import CopyIcon from '../assets/img/icons/copy.svg?inline';
import Button from './Button';
import Collapser from './Collapser';
import { copyText } from '../../util/copyText';

/**
 * Message banner component with close button
 */
export default {
    components: {
        CloseIcon,
        CopyIcon,
        Button,
        Collapser
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
        },
        details: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            active: true
        };
    },
    computed: {
        hasDetails() {
            return this.details.length > 0;
        }
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
        },
        copyMessage(event) {
            copyText(this.details);
            /**
             * copied event. Fired when the copy button in the detail area is clicked.
             * The embedding component should use this to notify the user that the message was copied successfully.
             *
             * @event copied
             */
            this.$emit('copied');
            event.target.focus();
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
      <div class="grid-item-12">
        <Component
          :is="hasDetails ? 'Collapser' : 'div'"
          :class="hasDetails ? 'collapser' : 'banner'"
        >
          <Component
            :is="hasDetails ? 'template' : 'div'"
            slot="title"
            class="title"
          >
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
              tabindex="0"
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
          </Component>
          <div
            v-if="hasDetails"
            class="details"
          >
            <span id="detail-text">
              {{ details }}
            </span>
            <div
              class="copy-button"
              title="Copy to clipboard"
              tabindex="0"
              @click="copyMessage($event)"
              @keydown="copyMessage($event)"
            >
              <CopyIcon />
            </div>
          </div>
        </Component>
      </div>
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

.banner {
  width: 100%;

  & .close {
    top: 12px;
  }
}

section {
  border-bottom: 1px solid var(--theme-color-white);
  overflow: hidden;

  & .grid-item-12 {
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
      margin-right: 50px; /* this is set to not interfere with the dropdwon or close button */
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & .title {
      display: flex;
    }

    & >>> svg {
      width: 24px;
      height: 24px;
      stroke-width: calc(32px / 24);
      stroke: var(--theme-color-white);
      margin-right: 20px;
      flex-shrink: 0;
      top: 0;
    }

    & button.close {
      flex-shrink: 0;
      margin-bottom: 0;
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
      position: relative;
      right: -6px; /* align svg with right border */
      pointer-events: all;
      text-align: center;
      top: -3px;
      align-self: flex-start;
      float: right;
      margin-left: auto;

      /* hover/focus styles for type error and success */

      &:hover,
      &:focus {
        background-color: var(--knime-masala-semi);
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

.collapser {
  width: 100%;
  pointer-events: all;

  & >>> .button {
    display: flex;
    align-content: center;

    & .dropdown {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 13px;
      top: -3px;
      display: flex;
      align-items: center;

      &:hover {
        background-color: var(--knime-masala-semi);
      }

      & .dropdown-icon {
        stroke: var(--theme-color-white);
      }
    }

    &:focus { /* whole button gets focus but only dropdown icon is styled */
      & .dropdown {
        background-color: var(--knime-masala-semi);
      }
    }
  }

  & >>> .panel {
    width: 100vw;
    max-width: 100vw;
    background-color: var(--theme-color-white);
    opacity: 0.9;
    min-height: 50px;
    max-height: 100px;
    margin-bottom: -15px;
    display: flex;
    align-content: center;
    margin-top: 15px;
    padding-top: 10px;
    padding-bottom: 5px;
    padding-left: calc(3 * var(--grid-gap-width));
    padding-right: calc(3 * var(--grid-gap-width));
    position: relative;
    left: calc((100% - 100vw) / 2);

    & .details {
      min-width: var(--grid-min-width);
      display: flex;
      justify-content: space-between;
      overflow-y: auto;
      width: 100%;
      margin: 0 auto;
      max-width: calc(var(--grid-max-width) - 6 * var(--grid-gap-width)); /* same as grid-container */

      & #detail-text {
        display: inline-block;
        color: var(--theme-color-masala);
        font-size: 13px;
        font-weight: 300;
        line-height: 18px;
        margin: auto 0;
        max-width: 66%;
      }

      & .copy-button {
        border-radius: 50%;
        height: 30px;
        width: 30px;
        text-align: center;
        margin-right: 23px; /* line-up with dropdown icon */
        outline: none;

        &:hover,
        &:focus {
          background-color: var(--theme-color-silver-sand-semi);
        }

        & svg {
          margin: auto;
          stroke: var(--theme-color-dove-gray);
          height: 18px;
          width: 18px;
          stroke-width: calc(32px / 18);
          vertical-align: middle;
          margin-top: 3px;
        }
      }
    }
  }
}

@media only screen and (max-width: 1180px) {
  .collapser {
    & >>> .panel {
      padding-left: var(--grid-gap-width);
      padding-right: var(--grid-gap-width);
    }
  }
}
</style>
