<script setup lang="ts">
import Button from "../Buttons/Button.vue";
import LoadingIcon from "../LoadingIcon/LoadingIcon.vue";

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
      compact
      @click.prevent="$emit('cancel')"
    >
      Cancel
    </Button>
    <Button
      class="save"
      primary
      compact
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
  z-index: 1;
  display: flex;
  flex: 0 0 auto;
  justify-content: space-between;
  width: 100%;
  padding: 12px 30px;
  background-color: var(--knime-gray-ultra-light);
  border-top: 1px solid var(--knime-silver-sand);

  & .loading-icon {
    margin-right: 0;
  }
}
</style>
