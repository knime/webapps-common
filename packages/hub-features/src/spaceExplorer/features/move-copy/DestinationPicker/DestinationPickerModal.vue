<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { InlineMessage } from "@knime/components";
import { KdsButton, KdsModal } from "@knime/kds-components";

import SpaceTree, { type SpaceTreeSelection } from "./SpaceTree.vue";
import { useDestinationPicker } from "./useDestinationPicker";

const { isActive, config, cancel, confirm } = useDestinationPicker();

const isValid = ref<boolean>(false);
const validationHint = ref<string | null>(null);

const selected = ref<SpaceTreeSelection>(null);

const onSpaceTreeSelection = (selection: SpaceTreeSelection) => {
  selected.value = selection;

  const { valid, hint } = config.value!.validate(selection);
  isValid.value = valid;
  validationHint.value = hint ?? null;
};

const onSubmit = () => {
  confirm({
    ...selected.value!,
  });
};

const resetModalState = () => {
  isValid.value = false;
  validationHint.value = null;
  selected.value = null;
};

watch(isActive, () => {
  if (!isActive.value) {
    resetModalState();
  }
});

const showValidationHint = computed(
  () => !isValid.value && validationHint.value,
);

// const { loggedInUser } = storeToRefs(useAuthStore());
// const { getSortedTeams } = useSortedTeams();
</script>

<template>
  <KdsModal
    :active="isActive"
    data-file-explorer-keep-selection
    :headline="config?.headline"
    width="large"
    height="full"
    variant="plain"
    @close="cancel"
  >
    <template #body>
      <div class="destination-picker-wrapper">
        <div class="spaced-container">{{ config?.description }}</div>
        <div class="space-tree-container">
          <!-- FIXME -->
          <!-- <SpaceTree
            class="space-tree"
            auto-expand
            :accounts="
              getSortedTeams() as AccountWithCustomData[]
            "
            @select-change="onSpaceTreeSelection"
          /> -->
        </div>
        <div
          v-if="showValidationHint"
          class="spaced-container validation-message"
        >
          <InlineMessage
            variant="info"
            title="Selection hint"
            :description="validationHint!"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <KdsButton label="Cancel" variant="transparent" @click="cancel" />
      <KdsButton
        :disabled="!isValid"
        label="Choose"
        variant="filled"
        @click="onSubmit"
      />
    </template>
  </KdsModal>
</template>

<style lang="postcss" scoped>
/* stylelint-disable csstools/value-no-unknown-custom-properties */
.destination-picker-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--modal-gap);
  height: 100%;
  padding: var(--modal-padding-top) 0 var(--modal-padding-bottom) 0;
}

.spaced-container {
  display: flex;
  flex-direction: column;
  gap: var(--modal-gap);
  padding: 0 var(--modal-padding-right) 0 var(--modal-padding-left);
}

.space-tree-container {
  height: 100%;
  padding: 0 var(--modal-padding-right) 0 var(--modal-padding-left);
  overflow: auto;
}

.space-tree {
  min-width: max-content;
}

.validation-message {
  margin-top: auto;
}
</style>
