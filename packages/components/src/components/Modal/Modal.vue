<script lang="ts">
import { type PropType, defineComponent } from "vue";

import CloseIcon from "@knime/styles/img/icons/close.svg";

import FunctionButton from "../Buttons/FunctionButton.vue";
import BaseModal from "../base/Modal/BaseModal.vue";

/**
 * See demo for documentation
 */
export default defineComponent({
  name: "Modal",
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
      type: String as PropType<"info" | "warn">,
      default: "info",
      validator(type: "info" | "warn" = "info") {
        return ["info", "warn"].includes(type);
      },
    },
    implicitDismiss: {
      type: Boolean,
      default: true,
    },
    animate: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["cancel"],
  methods: {
    onCloserClick() {
      this.$emit("cancel");
    },
  },
});
</script>

<template>
  <BaseModal
    :implicit-dismiss="implicitDismiss"
    :class="['modal', styleType]"
    :animate="animate"
    @cancel="$emit('cancel', $event)"
  >
    <div class="header">
      <span v-if="$slots.icon" class="header-icon">
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
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-left: 4px;
        vertical-align: -2px;
        content: "";
        background-color: var(--knime-masala); /* defines icon color */
        mask: url("@knime/styles/img/icons/link-external.svg?data") no-repeat
          50% 50%;
        mask-size: cover;
      }
    }

    &:hover {
      color: var(--theme-text-link-foreground-color-hover);
      text-decoration: none;
      outline: none;
      background-color: var(--theme-text-link-background-color-hover);

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
    margin-right: -6px;
    margin-left: auto;

    & :deep(svg) {
      stroke: var(--knime-white);
    }
  }

  & .header {
    display: flex;
    align-items: center;
    max-width: 100%;
    padding: 0 var(--modal-padding);
    color: var(--knime-white);

    & h2 {
      margin: 0;
      font-size: 19px;
      line-height: 50px;
    }

    & .header-icon {
      margin-right: 10px;
      line-height: 0;

      & :deep(svg) {
        width: 22px;
        height: 22px;
        stroke: var(--knime-white);
        stroke-width: 2.2px;
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
      background-color: var(--modal-notice-info-color, var(--knime-porcelain));
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
    display: flex;
    justify-content: space-between;
    padding: var(--modal-padding);
  }
}
</style>
