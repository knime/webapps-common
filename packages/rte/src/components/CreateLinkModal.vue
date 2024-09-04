<script setup lang="ts">
import { computed, ref, watch, type Ref } from "vue";

import { Modal, Button, InputField, Label } from "@knime/components";

interface Props {
  text: Ref<string>;
  url: Ref<string>;
  isActive: Ref<boolean>;
  isEdit: Ref<boolean>;
  urlValidator: (url: string) => boolean;
}

const props = defineProps<Props>();

const inputRef = ref<HTMLInputElement | null>(null);

const editedText = ref(props.text.value);
const editedUrl = ref(props.url.value);

watch(
  props,
  () => {
    editedText.value = props.text.value;
    editedUrl.value = props.url.value;
    setTimeout(() => {
      inputRef.value?.focus();
      // eslint-disable-next-line no-magic-numbers
    }, 200);
  },
  { deep: true },
);

const emit = defineEmits<{
  (e: "addLink", text: string, url: string): void;
  (e: "removeLink"): void;
  (e: "cancelAddLink"): void;
}>();

const closeModal = () => {
  emit("cancelAddLink");
};

const onSubmit = () => {
  emit("addLink", editedText.value, editedUrl.value);
};

const validateUrl = () => {
  const validScheme = props.urlValidator(editedUrl.value);

  return !editedUrl.value || validScheme;
};

const isValid = computed(() => {
  const textChanged = editedText.value !== props.text.value;
  const urlChanged = editedUrl.value !== props.url.value;
  const urlNotEmpty = editedUrl.value !== "";

  return (textChanged || urlChanged) && validateUrl() && urlNotEmpty;
});

const onkeyup = (keyupEvent: KeyboardEvent) => {
  if (keyupEvent.key === "Enter" && isValid.value) {
    onSubmit();
  }
};
</script>

<template>
  <Modal
    v-show="isActive.value"
    :active="isActive.value"
    :title="isEdit.value ? 'Edit link' : 'Add a link'"
    style-type="info"
    class="modal"
    @cancel="closeModal"
  >
    <template #confirmation>
      <Label #default="{ labelForId }" text="Text" compact class="text-input">
        <div>
          <InputField
            :id="labelForId"
            ref="inputRef"
            v-model="editedText"
            type="text"
            title="Text"
            @keyup="onkeyup"
          />
        </div>
      </Label>

      <Label #default="{ labelForId }" text="URL" compact>
        <div>
          <InputField
            :id="labelForId"
            v-model="editedUrl"
            type="text"
            title="URL"
            @keyup="onkeyup"
          />
          <div v-if="!validateUrl()" class="item-error">
            <span>Invalid URL</span>
          </div>
        </div>
      </Label>
    </template>
    <template #controls>
      <Button compact with-border @click="closeModal">
        <strong>Cancel</strong>
      </Button>
      <div class="controls-apply-group">
        <Button
          v-if="isEdit.value"
          compact
          with-border
          @click="emit('removeLink')"
        >
          <strong>Remove URL</strong>
        </Button>
        <Button compact primary :disabled="!isValid" @click="onSubmit">
          <strong>{{ isEdit.value ? "Apply" : "Add link" }}</strong>
        </Button>
      </div>
    </template>
  </Modal>
</template>

<style lang="postcss" scoped>
.modal {
  --modal-width: 500px;
}

.text-input {
  margin-bottom: 20px;
}

.controls-apply-group {
  display: flex;
  gap: 5px;
}

.item-error {
  font-size: 12px;
  font-weight: 400;
  color: var(--theme-color-error);
  margin-top: 7px;
  white-space: normal;
}
</style>
