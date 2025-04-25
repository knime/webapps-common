<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { useTextareaAutosize } from "@vueuse/core";

import { Button, InputField, Label, TextArea } from "@knime/components";

const emit = defineEmits<{
  create: [{ name: string; description: string }];
  cancel: [];
}>();

const versionName = ref("");
const versionDescription = ref("");

const descriptionEditor = ref<InstanceType<typeof TextArea> | null>(null);

onMounted(() => {
  useTextareaAutosize({
    element: descriptionEditor.value?.$el.getElementsByTagName("textarea")[0],
    input: versionDescription,
  });
});

const doValidate = ref(false);

const isVersionNameInvalid = computed(() => {
  return versionName.value.length <= 0 && doValidate.value;
});

const onCreate = async () => {
  doValidate.value = true;
  await nextTick();

  if (!isVersionNameInvalid.value) {
    emit("create", {
      name: versionName.value,
      description: versionDescription.value,
    });
  }
};
</script>

<template>
  <div class="create-version-form">
    <Label text="Version name">
      <InputField
        v-model="versionName"
        type="text"
        required
        :is-valid="!isVersionNameInvalid"
      />
      <div v-if="isVersionNameInvalid" class="error">
        Please enter at least 1 character.
      </div>
    </Label>
    <Label text="Description">
      <TextArea
        ref="descriptionEditor"
        v-model="versionDescription"
        class="description"
      />
    </Label>
    <div class="controls">
      <Button
        with-border
        compact
        class="button cancel"
        @click="$emit('cancel')"
      >
        <strong>Cancel</strong>
      </Button>
      <Button
        primary
        compact
        class="button create"
        :disabled="isVersionNameInvalid"
        @click="onCreate"
      >
        <strong>Create</strong>
      </Button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.create-version-form {
  height: 100%;
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 30px 30px 0;
  gap: 30px;
  overscroll-behavior: none;
  isolation: isolate;
  overflow: auto;
  z-index: 1;
  background-color: var(--knime-gray-ultra-light);

  & .description {
    width: 100%;
    max-width: unset;
    display: flex;

    & :deep(textarea) {
      width: 100%;
      box-sizing: content-box;
      max-height: 200px;
      resize: none;
    }
  }

  & .error {
    position: absolute;
    word-break: keep-all;
    margin-top: 6px;
    font-weight: 300;
    font-size: 13px;
    color: var(--theme-color-error);
    line-height: 18px;
  }

  & .controls {
    border-top: 1px solid var(--knime-silver-sand);
    display: flex;
    margin: 0 -30px;
    padding: 10px 20px;
    gap: 10px;
    justify-content: space-between;
    margin-top: auto;
  }
}
</style>
