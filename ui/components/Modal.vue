<script>
import BaseModal from './BaseModal';
import FunctionButton from './FunctionButton';
import CloseIcon from '../assets/img/icons/close.svg?inline';

/**
* See demo for documentation
*/
export default {
    components: {
        BaseModal,
        CloseIcon,
        FunctionButton
    },
    props: {
        /**
         * @see {@link BaseModal.vue}
         */

        title: {
            default: null,
            type: String
        },
        /**
         * One of 'info', 'warn'. Defaults to 'info'.
         * This has no implication on functionality, only styling,
         */
        styleType: {
            type: String,
            default: 'info',
            validator(type = 'info') {
                return ['info', 'warn'].includes(type);
            }
        }
    },
    methods: {
        onCloserClick() {
            this.$emit('cancel');
        }
    }
};
</script>

<template>
  <BaseModal
    v-bind="$attrs"
    :class="['modal', styleType]"
    v-on="$listeners"
  >
    <div class="header">
      <span class="header-icon">
        <slot name="icon" />
      </span>
      <h2>{{ title }}</h2>
      <FunctionButton
        class="closer"
        @click="onCloserClick"
      >
        <CloseIcon />
      </FunctionButton>
    </div>
    <div
      v-if="$slots.notice"
      class="notice"
    >
      <slot name="notice" />
    </div>
    <div
      v-if="$slots.confirmation"
      class="confirmation"
    >
      <slot name="confirmation" />
    </div>
    <div class="controls">
      <slot name="controls" />
    </div>
  </BaseModal>
</template>

<style lang="postcss" scoped>
.modal {
  --modal-padding: 20px;
  --modal-color-content: var(--theme-color-error-semi);
  --modal-color-header: var(--theme-color-error);

  & >>> strong {
    font-weight: 500;
  }

  & >>> a {
    color: var(--theme-text-link-foreground-color);
    background: var(--theme-text-link-background-color);

    @supports (mask: url("") no-repeat 50% 50%) {
      &[href^="http"]::after {
        content: "";
        mask: url("../assets/img/icons/link-external.svg?data") no-repeat 50% 50%;
        mask-size: cover;
        background-color: var(--knime-masala); /* defines icon color */
        width: 16px;
        height: 16px;
        display: inline-block;
        margin-left: 4px;
        vertical-align: -2px;
      }
    }

    &:hover {
      outline: none;
      color: var(--theme-text-link-foreground-color-hover);
      background-color: var(--theme-text-link-background-color-hover);
      text-decoration: none;

      &::after {
        background-color: var(--theme-text-link-foreground-color-hover); /* defines icon color */
      }
    }
  }


  & >>> p {
    margin: 0;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  & .closer {
    margin-left: auto;
    margin-right: -6px;

    & >>> svg {
      stroke: var(--knime-white);
    }
  }

  & .header {
    display: flex;
    color: var(--knime-white);
    max-width: 100%;
    padding: 0 var(--modal-padding);
    align-items: center;

    & h2 {
      margin: 0;
      font-size: 19px;
      line-height: 50px;
    }

    & .header-icon {
      line-height: 0;
      margin-right: 10px;

      & >>> svg {
        width: 22px;
        height: 22px;
        stroke-width: 2.2px;
        stroke: var(--knime-white);
      }
    }
  }

  &.info {
    & .header {
      background: var(--knime-masala);
    }

    & .notice {
      background-color: var(--knime-porcelain);
    }
  }

  &.warn {
    & .header {
      background: var(--modal-color-header);
    }

    & .notice {
      background-color: var(--modal-color-content);
    }
  }

  & .notice >>> {
    padding: var(--modal-padding);
    font-weight: 300;

    & p {
      font-size: 16px;
      line-height: 25px;
    }

    & ul {
      padding: 0 0 0 30px;
      margin: 0;

      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }

    & li {
      font-size: 16px;
      line-height: 25px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  & .confirmation >>> {
    padding: var(--modal-padding) var(--modal-padding) 0;

    & p {
      font-size: 13px;
      line-height: 18px;
    }
  }

  & .controls {
    padding: var(--modal-padding);
    display: flex;
    justify-content: space-between;
  }
}

</style>
