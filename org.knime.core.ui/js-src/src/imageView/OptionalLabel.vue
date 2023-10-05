<script lang="ts">
import Label from "webapps-common/ui/components/forms/Label.vue";

export default {
  components: {
    Label,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<template>
  <Label v-if="title" #default="{ labelForId }" :text="title" large>
    <slot :label-for-id="labelForId" />
  </Label>
  <slot v-else :label-for-id="null" />
</template>

<style scoped></style>
