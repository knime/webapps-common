<script setup lang="ts">
import { computed, ref, watch } from "vue";

import { Modal, Button, InputField, Label } from "@knime/components";

import { buildUrlRegex } from "../utils/regex";

const URL_REGEX = buildUrlRegex();

interface Props {
  text: string;
  url: string;
  isActive: boolean;
  isEdit: boolean;
}

const props = defineProps<Props>();

const inputRef = ref<HTMLInputElement | null>(null);

const editedText = ref(props.text);
const editedUrl = ref(props.url);

watch(
  props,
  () => {
    editedText.value = props.text;
    editedUrl.value = props.url;
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
  const validScheme = URL_REGEX.test(editedUrl.value);

  return !editedUrl.value || validScheme;
};

const isValid = computed(() => {
  const textChanged = editedText.value !== props.text;
  const urlChanged = editedUrl.value !== props.url;
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
    v-show="isActive"
    :active="isActive"
    :title="isEdit ? 'Edit link' : 'Add a link'"
    style-type="info"
    class="modal"
    @cancel="closeModal"
  >
    <template #confirmation>
      <Label text="Text" compact class="text-input">
        <div>
          <InputField
            ref="inputRef"
            v-model="editedText"
            type="text"
            title="Text"
            @keyup="onkeyup"
          />
        </div>
      </Label>

      <Label text="URL" compact>
        <div>
          <InputField
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
        <Button v-if="isEdit" compact with-border @click="emit('removeLink')">
          <strong>Remove URL</strong>
        </Button>
        <Button compact primary :disabled="!isValid" @click="onSubmit">
          <strong>{{ isEdit ? "Apply" : "Add link" }}</strong>
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
