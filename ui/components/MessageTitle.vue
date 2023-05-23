<script>
import Button from "./Button.vue";
import CloseIcon from "../assets/img/icons/close.svg";

export default {
  components: {
    Button,
    CloseIcon,
  },
  props: {
    /**
     * One of 'info', 'error', 'success', 'warn'. Defaults to 'info'.
     * This has no implication on functionality, only styling
     */
    type: {
      type: String,
      default: "info",
      validator(type = "info") {
        return ["info", "error", "success", "warn"].includes(type);
      },
    },
    /**
     * Enable / disable rendering of close button.
     * Defaults to `true`.
     */
    showCloseButton: {
      type: Boolean,
      default: true,
    },
    /**
     * Optional button text.
     * If set, renders a button instead of the 'x' that is used for closing the Message.
     * If left blank, the 'x' is rendered.
     * This property has no effect if `showCloseButton` is `false`.
     */
    button: {
      type: String,
      default: null,
    },
    count: {
      type: Number,
      default: 1,
    },
  },
  emits: ["dismiss"],
  methods: {
    onDismiss() {
      this.$emit("dismiss");
    },
  },
};
</script>

<template>
  <!-- @slot Use this slot to add an icon. -->
  <slot name="icon" />
  <span class="message">
    <!-- @slot Use this slot to add text content (markup). -->
    <slot />
    <span v-show="count && count > 1" class="message-count" :class="type">
      {{ "×" + count }}
    </span>
  </span>
  <template v-if="showCloseButton">
    <Button
      v-if="button"
      class="close"
      :class="type"
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
      :class="type"
      title="Discard message"
      @click="onDismiss"
      @keydown.space.stop.prevent="onDismiss"
    >
      <CloseIcon class="close-icon" />
    </span>
  </template>
</template>

<style lang="postcss" scoped>
.message-count {
  padding: 3px 7.5px;
  margin-left: 5px;
  background-color: white;
  border-radius: 12px;

  &.info {
    color: var(--theme-color-info);
  }

  &.error {
    color: var(--theme-color-error);
  }

  &.success {
    color: var(--theme-color-success);
  }

  &.warn {
    color: var(--theme-color-action-required);
  }
}

.message {
  flex-grow: 1;
  margin-right: 50px; /* this is set to not interfere with the dropdown or close button */
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 3px;
}

.close {
  outline: none;
  display: flex;
  align-items: center;
  position: relative;
  right: -6px; /* align svg with right border */
  pointer-events: all;
  text-align: center;
  top: 0;
  align-self: flex-start;
  float: right;
  margin-left: auto;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: var(--knime-masala-semi);

    &.info {
      background-color: var(--knime-dove-gray);
    }
  }

  & svg.close-icon {
    position: relative;
    top: 0;
    margin: auto;
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
  }
}

button.close {
  flex-shrink: 0;
  margin-bottom: 0;
  display: flex;
  width: unset;
}

span.close {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  flex-shrink: 0;
}

:last-child {
  border-bottom: 0;
}
</style>
