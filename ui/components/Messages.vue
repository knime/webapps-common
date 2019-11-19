<script>
import Message from './Message';

/**
 * Displays multiple stacked messages. If a message is added or removed (e.g. dismissed), a smooth animation is shown.
 */
export default {
    components: {
        Message
    },
    props: {
        /**
         * Array with message configuration objects supporting the following props:
         *  - id
         *  - type (see Message component for supported values)
         *  - icon (Component)
         *  - button
         *  - message
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
      :button="message.button"
      @dismiss="$emit('dismiss', message.id)"
    >
      <Component
        :is="message.icon"
        slot="icon"
      />
      {{ message.message }}
    </Message>
  </transition-group>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

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
