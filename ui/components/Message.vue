<script>
import CloseIcon from '../assets/img/icons/close.svg?inline';
import InfoIcon from '../assets/img/icons/circle-info.svg?inline';
import WarnIcon from '../assets/img/icons/sign-warning.svg?inline';
import SuccessIcon from '../assets/img/icons/circle-check.svg?inline';
import Button from './Button';
import Collapser from './Collapser';

/**
 * Message banner component with close button
 */
export default {
    components: {
        CloseIcon,
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
        collapserItems: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            active: true
        };
    },
    computed: {
        icon() {
            if (this.type === 'error') {
                return WarnIcon;
            } else if (this.type === 'success') {
                return SuccessIcon;
            }
            return InfoIcon;
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
             * @event success
             */
            this.$emit('dismiss');
        },
        isNotEmpty(obj) {
            if (obj) {
                return Object.keys(obj).length !== 0;
            }
            return false;
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
        <div class="divider">
          <div>
            <!-- @slot Use this slot to add an icon. -->
            <Component
              :is="icon"
              class="type-icon"
            />
            <span class="message">
              <!-- @slot Use this slot to add text content (markup). -->
              <slot />
            </span>
          </div>
          <Collapser
            v-if="isNotEmpty(collapserItems)"
            class="collapser"
          >
            <ul
              v-for="(collapserItem, key, index) in collapserItems"
              :key="index"
            >
              <li>{{ key }}: {{ collapserItem.message }}</li>
            </ul>
          </Collapser>
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
            class="close"
            @click="onDismiss"
          >
            <CloseIcon />
          </span>
        </div>
      </em>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables/colors";

section {
  border-bottom: 1px solid var(--theme-color-white);

  &:last-child {
    border-bottom: 0;
  }

  &.info {
    background-color: var(--theme-color-info);
  }

  &.error {
    background-color: var(--theme-color-error);
  }

  &.success {
    background-color: var(--theme-color-success);
  }
}

em {
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
  }

  & svg {
    width: 22px;
    height: 22px;
    stroke-width: calc(32px / 22);
    stroke: var(--theme-color-white);
    margin-left: 35px;
    flex-shrink: 0;
    vertical-align: middle;
    margin-top: -3px;
  }

  & button.close {
    flex-shrink: 0;
    margin-bottom: 0;
    margin-left: 10px;
  }

  & .close {
    display: flex;
    align-items: center;

    & svg {
      position: absolute;
      right: 15px;
      top: 20px;
      margin-right: 0;
      height: 18px;
      width: 18px;
      stroke-width: calc(32px / 18);
      cursor: pointer;
    }
  }

  & .collapser {
    flex-grow: 1;
    margin-left: -180px;
    overflow: hidden;

    & >>> svg {
      top: -15px;
      right: 25px;
      stroke: var(--theme-color-white);
    }

    & li {
      list-style: none;
      font-size: 16px;
      font-weight: 300;
      line-height: 24px;
    }
  }

  & .divider {
    display: flex;
    justify-content: space-between;
    min-width: 100%;
  }
}
</style>
