<script setup lang="ts">
import Label from "webapps-common/ui/components/forms/Label.vue";
defineProps<{ title: string }>();
</script>

<template>
  <Label
    v-if="title"
    #default="{ labelForId }"
    class="image-view-label"
    :text="title"
    large
  >
    <slot :label-for-id="labelForId" />
  </Label>
  <slot v-else :label-for-id="undefined" />
</template>

<style scoped>
.image-view-label {
  height: calc(100% - 30px);
}
</style>
