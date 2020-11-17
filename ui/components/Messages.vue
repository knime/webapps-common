<script>
import Message from './Message';
import MessageLink from './MessageLink';

/**
 * Displays multiple stacked messages. If a message is added or removed (e.g. dismissed), a smooth animation is shown.
 */
export default {
    components: {
        Message,
        MessageLink
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
         *    link: { (optional link that will be displayed after the message)
         *       text
         *       href (external links, will become <a></a>)
         *       to (internal links, will become <nuxt-link></nuxt-link>)
         *    }
         * }]
         */
        messages: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<template>
  <transition-group
    :class="[{'active': messages.length > 0}, 'messages' ]"
    tag="div"
    name="messages"
  >
    <Message
      v-for="message in messages"
      :key="message.id"
      :type="message.type.toLowerCase()"
      :count="message.count"
      :button="message.button"
      :details="message.details"
      :show-close-button="message.showCloseButton"
      :show-collapser="message.showCollapser"
      @copied="$emit('copied')"
      @dismiss="$emit('dismiss', message.id)"
    >
      <Component
        :is="message.icon"
        slot="icon"
      />
      {{ message.message }}
      <MessageLink
        v-if="message.link"
        :link="message.link"
      />
    </Message>
  </transition-group>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.messages {
  pointer-events: none;

  &.active {
    pointer-events: all;
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

.messages-enter,
.messages-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>
