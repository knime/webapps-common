<script>
import BaseMessage from "../base/Message/BaseMessage.vue";
import Message from "./Message.vue";
import MessageLink from "./MessageLink.vue";

/**
 * Displays multiple stacked messages. If a message is added or removed (e.g. dismissed), a smooth animation is shown.
 */
export default {
  name: "Messages",
  components: {
    BaseMessage,
    Message,
    MessageLink,
  },
  props: {
    /**
     * Array with message configuration objects.
     *
     * @example
     * [{
     *    id
     *    type (see Message component for supported values)
     *    icon (Component)
     *    button (optional button text)
     *    message (actual message String)
     *    content (optional Vue component to render instead of text message, icon, etc.)
     *    link: { (optional link that will be displayed after the message)
     *       text
     *       href (external links, will become <a></a>)
     *       to (internal links, will become <nuxt-link></nuxt-link>)
     *    }
     * }]
     */
    messages: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["copied", "dismiss"],
};
</script>

<template>
  <TransitionGroup
    :class="[{ active: messages.length > 0 }, 'messages']"
    tag="div"
    name="messages"
  >
    <template v-for="message in messages" :key="message.id">
      <BaseMessage v-if="message.content" :type="message.type.toLowerCase()">
        <Component :is="message.content" />
      </BaseMessage>
      <Message
        v-else
        :type="message.type.toLowerCase()"
        :count="message.count"
        :button="message.button"
        :details="message.details"
        :show-close-button="message.showCloseButton"
        :show-collapser="message.showCollapser"
        :class="{ 'offset-details': message.icon }"
        @copied="$emit('copied')"
        @dismiss="$emit('dismiss', message.id)"
      >
        <template #icon>
          <Component :is="message.icon" />
        </template>
        {{ message.message }}
        <MessageLink v-if="message.link" :link="message.link" />
      </Message>
    </template>
  </TransitionGroup>
</template>

<style lang="postcss" scoped>
.messages {
  pointer-events: none;

  &.active {
    pointer-events: all;
  }

  & .offset-details :deep(.details) {
    padding-left: 47px;
  }
}

.message-link {
  text-decoration: underline;
  cursor: pointer;
}

.messages-enter-active,
.messages-leave-active {
  transition: all 0.3s;
}

.messages-enter-from,
.messages-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>
