<script>
import CopyIcon from "@knime/styles/img/icons/copy.svg";

import Collapser from "../Collapser/Collapser.vue";
import BaseMessage from "../base/Message/BaseMessage.vue";

import MessageLink from "./MessageLink.vue";
import MessageTitle from "./MessageTitle.vue";

/**
 * Message banner component with close button
 */
export default {
  name: "Message",
  components: {
    BaseMessage,
    MessageTitle,
    Collapser,
    MessageLink,
    CopyIcon,
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
     * Enable / disable collapser for details.
     * If true, details will be down inside of the collapser content area and accessed by clicking on the
     * expand icon.
     * If false, details will be shown in the main message body below the message itself.
     * This property has no effect if the message does not have details.
     * Defaults to `true`.
     */
    showCollapser: {
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
    details: {
      type: [String, Object],
      default: "",
    },
  },
  emits: ["copied", "dismiss"],
  data() {
    return {
      active: true,
    };
  },
  computed: {
    detailsText() {
      let detailsText = this.details;
      if (detailsText && typeof detailsText !== "string") {
        detailsText = this.details.text;
      }
      return detailsText;
    },
    detailsLink() {
      if (!this.detailsText) {
        return false;
      }
      // avoid passing a Vue watcher function (which can be picked up a truthy).
      return this.details.link && this.details.link.text
        ? this.details.link
        : false;
    },
    showDetailsCollapser() {
      return this.detailsText && this.showCollapser;
    },
  },
  methods: {
    onDismiss() {
      consola.trace("dismissing message");
      this.active = false;
      /**
       * Dismiss event. Fired when the close button / 'x' is clicked.
       * The embedding component should use this to clean up the instance.
       * Otherwise the message will be visually hidden, but still in memory.
       *
       * @event dismiss
       */
      this.$emit("dismiss");
    },
    async copyMessage(event) {
      await navigator.clipboard.writeText(this.detailsText);
      /**
       * copied event. Fired when the copy button in the detail area is clicked.
       * The embedding component should use this to notify the user that the message was copied successfully.
       *
       * @event copied
       */
      this.$emit("copied");
      event.target.focus();
    },
  },
};
</script>

<template>
  <BaseMessage v-if="active" :type="type" :class="type">
    <Component
      :is="showDetailsCollapser ? 'Collapser' : 'div'"
      :class="showDetailsCollapser ? 'collapser' : 'banner'"
    >
      <template v-if="showDetailsCollapser" #title>
        <MessageTitle
          :type="type"
          :button="button"
          :show-close-button="showCloseButton"
          :count="count"
          @dismiss="onDismiss"
        >
          <template #icon>
            <slot name="icon" />
          </template>
          <slot />
        </MessageTitle>
      </template>
      <div v-if="!showDetailsCollapser" class="title">
        <MessageTitle
          :type="type"
          :button="button"
          :show-close-button="showCloseButton"
          :count="count"
          @dismiss="onDismiss"
        >
          <template #icon>
            <slot name="icon" />
          </template>
          <slot />
        </MessageTitle>
      </div>

      <div v-if="detailsText" class="details">
        <span class="detail-text">
          {{ detailsText }}
          <MessageLink v-if="detailsLink" :link="detailsLink" />
        </span>
        <div
          v-if="showCollapser"
          class="copy-button"
          title="Copy to clipboard"
          tabindex="0"
          @click="copyMessage($event)"
          @keyup.space.prevent="copyMessage($event)"
        >
          <CopyIcon />
        </div>
      </div>
    </Component>
  </BaseMessage>
</template>

<style lang="postcss" scoped>
.banner {
  width: 100%;
}

.details {
  display: inline-block;
  font-size: 13px;
  font-weight: 300;
  line-height: 18px;
  margin: auto 0;
}

.title {
  display: flex;
  align-items: center;
}

.collapser :deep(svg),
.banner :deep(svg) {
  position: relative;
  width: 24px;
  height: 24px;
  stroke-width: calc(32px / 24);
  stroke: var(--knime-white);
  margin-right: 20px;
  flex-shrink: 0;
  top: 3px;
}

.collapser {
  width: 100%;
  pointer-events: all;

  & :deep(.button) {
    display: flex;
    align-content: center;

    & .message {
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
    }

    & .dropdown {
      width: 30px;
      height: 30px;
      margin-right: 15px;
      top: 0;

      &:hover {
        background-color: var(--knime-masala-semi);
      }

      & .dropdown-icon {
        stroke: var(--knime-white);
      }
    }

    &:focus .dropdown {
      /* whole button gets focus but only dropdown icon is styled */
      background-color: var(--knime-masala-semi);
    }
  }

  & :deep(.panel) {
    width: 100vw;
    max-width: 100vw;
    background-color: var(--knime-white);
    opacity: 0.9;
    min-height: 50px;
    max-height: 100px;
    margin-bottom: -15px;
    display: flex;
    align-content: center;
    margin-top: 15px;
    padding: 10px calc(3 * var(--grid-gap-width)) 5px;
    position: relative;
    left: calc((100% - 100vw) / 2);

    & .details {
      min-width: var(--grid-min-width);
      display: flex;
      justify-content: space-between;
      overflow-y: auto;
      width: 100%;
      margin: 0 auto;
      max-width: calc(
        var(--grid-max-width) - 6 * var(--grid-gap-width)
      ); /* same as grid-container */

      & .detail-text {
        display: inline-block;
        color: var(--knime-masala);
        font-size: 13px;
        font-weight: 300;
        line-height: 18px;
        margin: auto 0;
        max-width: 80%;
      }

      & .copy-button {
        border-radius: 50%;
        height: 30px;
        width: 30px;
        text-align: center;
        margin-right: 23px; /* line-up with dropdown icon */
        outline: none;
        cursor: pointer;

        &:hover,
        &:focus {
          background-color: var(--knime-silver-sand-semi);
        }

        & svg {
          margin: auto;
          top: 6px;
          stroke: var(--knime-dove-gray);
          height: 18px;
          width: 18px;
          stroke-width: calc(32px / 18);
        }
      }
    }
  }
}

@media only screen and (width <= 1180px) {
  .collapser {
    & :deep(.panel) {
      padding-left: var(--grid-gap-width);
      padding-right: var(--grid-gap-width);
    }
  }
}
</style>
