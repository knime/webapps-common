<script>
import BaseModal from "./BaseModal.vue";
import FunctionButton from "./FunctionButton.vue";
import CloseIcon from "../assets/img/icons/close.svg";

/**
 * See demo for documentation
 */
export default {
  components: {
    BaseModal,
    CloseIcon,
    FunctionButton,
  },
  props: {
    /**
     * @see {@link BaseModal.vue}
     */

    title: {
      default: null,
      type: String,
    },
    /**
     * One of 'info', 'warn'. Defaults to 'info'.
     * This has no implication on functionality, only styling,
     */
    styleType: {
      type: String,
      default: "info",
      validator(type = "info") {
        return ["info", "warn"].includes(type);
      },
    },
  },
  emits: ["cancel"],
  methods: {
    onCloserClick() {
      this.$emit("cancel");
    },
  },
};
</script>

<template>
  <BaseModal
    v-bind="$attrs"
    :class="['modal', styleType]"
    @cancel="$emit('cancel', $event)"
  >
    <div class="header">
      <span class="header-icon">
        <slot name="icon" />
      </span>
      <h2>{{ title }}</h2>
      <FunctionButton class="closer" @click="onCloserClick">
        <CloseIcon />
      </FunctionButton>
    </div>
    <div v-if="$slots.notice" class="notice">
      <slot name="notice" />
    </div>
    <div v-if="$slots.confirmation" class="confirmation">
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

  color: var(--theme-text-link-foreground-color);

  & :deep(strong) {
    font-weight: 500;
  }

  & :deep(a) {
    color: var(--theme-text-link-foreground-color);
    background-color: var(--theme-text-link-background-color);

    @supports (mask: url("") no-repeat 50% 50%) {
      &[href^="http"]::after {
        content: "";
        mask: url("../assets/img/icons/link-external.svg?data") no-repeat 50%
          50%;
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
        background-color: var(
          --theme-text-link-foreground-color-hover
        ); /* defines icon color */
      }
    }
  }

  & :deep(p) {
    margin: 0;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  & .closer {
    margin-left: auto;
    margin-right: -6px;

    & :deep(svg) {
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

      & :deep(svg) {
        width: 22px;
        height: 22px;
        stroke-width: 2.2px;
        stroke: var(--knime-white);
      }
    }
  }

  & .notice {
    padding: var(--modal-padding);
    font-weight: 300;

    & :deep(p) {
      font-size: 16px;
      line-height: 25px;
    }

    & :deep(ul) {
      padding: 0 0 0 30px;
      margin: 0;

      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }

    & :deep(li) {
      font-size: 16px;
      line-height: 25px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &.info {
    & .header {
      background-color: var(--knime-masala);
    }

    & .notice {
      background-color: var(--knime-porcelain);
    }
  }

  &.warn {
    & .header {
      background-color: var(--theme-color-error);
    }

    & .notice {
      background-color: var(--theme-color-error-semi);
    }
  }

  & .confirmation {
    padding: var(--modal-padding) var(--modal-padding) 0;

    & :deep(p) {
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
