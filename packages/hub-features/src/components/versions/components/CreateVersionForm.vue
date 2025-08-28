<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { useTextareaAutosize } from "@vueuse/core";

import {
  InputField,
  Label,
  SideDrawerControls,
  SideDrawerHeader,
  TextArea,
} from "@knime/components";

type Props = {
  isCreationPending?: boolean;
};

withDefaults(defineProps<Props>(), { isCreationPending: false });

const emit = defineEmits<{
  create: [{ name: string; description: string }];
  cancel: [hasUnsavedChanges: boolean];
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
  return doValidate.value && versionName.value.length <= 0;
});

const hasUnsavedChanges = computed(() => {
  return versionName.value !== "" || versionDescription.value !== "";
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
    <SideDrawerHeader
      title="Create Version"
      description="Give your version a name and description. Versions can be used to create a deployment.
      "
      :is-sub-drawer="true"
      @close="$emit('cancel', hasUnsavedChanges)"
    />
    <div class="form-content">
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
        <SideDrawerControls
          class="create-version-controls"
          :edit-enabled="true"
          :processing="isCreationPending"
          action-label="Create"
          :disabled="isVersionNameInvalid || isCreationPending"
          @save="onCreate"
          @cancel="$emit('cancel', hasUnsavedChanges)"
        />
      </div>
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

  & .form-content {
    display: flex;
    flex-direction: column;
    height: 100%;
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
      margin: 0 -30px;
      margin-top: auto;
    }

    .create-version-controls {
      margin: 0;
    }
  }
}
</style>
