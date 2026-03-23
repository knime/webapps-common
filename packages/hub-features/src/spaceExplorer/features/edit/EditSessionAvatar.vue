<script setup lang="ts">
import Avatar from "../avatar/Avatar.vue";

type Props = {
  userId: string;
};

defineProps<Props>();
</script>

<template>
  <div class="session-user-avatar">
    <Avatar :account-name-or-id="userId" :clickable="false" />
  </div>
</template>

<style lang="postcss" scoped>
.session-user-avatar {
  --avatarSizePx: 20px;
}
</style>
