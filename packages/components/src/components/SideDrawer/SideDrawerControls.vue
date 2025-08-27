<script setup lang="ts">
import { Button, LoadingIcon } from "@knime/components";

type Props = {
  actionLabel?: string;
  editEnabled: boolean;
  disabled?: boolean;
  processing?: boolean;
};

const {
  actionLabel = "Save changes",
  editEnabled,
  disabled = false,
  processing = false,
} = defineProps<Props>();

defineEmits<{
  cancel: [];
  save: [];
}>();
</script>

<template>
  <div v-if="editEnabled" ref="controls" class="controls">
    <Button
      class="cancel"
      with-border
      :disabled="processing"
      @click.prevent="$emit('cancel')"
    >
      Cancel
    </Button>
    <Button
      class="save"
      primary
      :disabled="disabled || processing"
      @click.prevent="$emit('save')"
    >
      <LoadingIcon v-if="processing" class="loading-icon" />
      <span v-else>{{ actionLabel }}</span>
    </Button>
  </div>
  <div v-else class="spacer" />
</template>

<style lang="postcss" scoped>
.controls {
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: var(--knime-gray-ultra-light);
  padding: 12px 30px;
  border-top: 1px solid var(--knime-silver-sand);
  z-index: 1;

  & .loading-icon {
    margin-right: 0;
  }
}
</style>
