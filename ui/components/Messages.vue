<script>
import Message from './Message';


export default {
    components: {
        Message
    },
    props: {
        notifications: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<template>
  <transition-group
    :class="[{'active': notifications.length > 0}, 'notifications' ]"
    tag="div"
    name="notifications"
  >
    <Message
      v-for="notification in notifications"
      :key="notification.id"
      :type="notification.type.toLowerCase()"
      @dismiss="$emit('dismiss', notification.id)"
    >
      {{ notification.message }}
    </Message>
  </transition-group>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.notifications-enter-active,
.notifications-leave-active {
  transition: all 0.3s;
}

.notifications-enter,
.notifications-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

</style>
