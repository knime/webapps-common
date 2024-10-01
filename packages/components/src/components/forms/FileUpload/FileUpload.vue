<script lang="ts" setup>
import { ref, computed } from "vue";
import ProgressLists from "../ProgressList/ProgressList.vue";
import File from "@knime/styles/img/icons/file.svg";
import Label from "../Label/Label.vue";
import Button from "../../../components/Buttons/Button.vue";

type State = "Info" | "Error" | "Success";

type Props = {
  modelValue: {
    fileName: string;
    percentage: number;
    fileSize: number;
    status: State;
    abortController?: AbortController;
  }[];
  compact?: boolean;
  label?: string;
  disabled?: boolean;
};

const dragOver = ref(false);
const dragging = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);
const icon = computed(() => File);

const handleUpdate = (updatedValues: {
  fileName: string;
  percentage: number;
  fileSize: number;
}) => {
  emit("update:modelValue", updatedValues);
};
const onDragOver = () => {
  dragOver.value = true;
};
const onDragLeave = () => {
  dragOver.value = false;
};

const handleFile = (file: File) => {
  const reader = new FileReader();
  const abortController = new AbortController();

  reader.onloadstart = () => {};

  // reader.onprogress = (event: ProgressEvent<FileReader>) => {
  //   if (event.lengthComputable) {
  //     const progress = Math.round((event.loaded / event.total) * 100);
  //   }
  // };

  reader.onload = () => {
    const initialFile = {
      fileName: file.name,
      percentage: 0,
      fileSize: file.size,
      abortController,
      status: "Info",
    };
    let updatedValues = [...props.modelValue, initialFile];
    emit("update:modelValue", updatedValues);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event: ProgressEvent<EventTarget>) => {
      if (event.lengthComputable) {
        const uploadProgress = Math.round((event.loaded / event.total) * 100);

        updatedValues = updatedValues.map((fileObj) =>
          fileObj.fileName === file.name
            ? {
                ...fileObj,
                percentage: uploadProgress,
                status: uploadProgress === 100 ? "Success" : "Info",
              }
            : fileObj,
        );

        emit("update:modelValue", updatedValues);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        updatedValues = updatedValues.map((fileObj) =>
          fileObj.fileName === file.name
            ? { ...fileObj, percentage: 100 }
            : fileObj,
        );

        emit("update:modelValue", updatedValues);
      }
    };

    abortController.signal.addEventListener("abort", () => {
      xhr.abort();
    });

    xhr.open("POST", "https://pdfreader-qpaf.onrender.com/upload", true);
    xhr.send(formData);
  };

  reader.readAsArrayBuffer(file);
};
const onDrop = (e: DragEvent) => {
  dragOver.value = false;
  let file = e.dataTransfer?.files[0];
  if (file) {
    handleFile(file);
  }
};
const triggerInput = () => {
  if (inputRef.value) {
    inputRef.value.click();
  }
};
const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    let file: File = target.files[0];
    handleFile(file);
  }
};
</script>

<template>
  <div class="file-upload-widget">
    <Label :text="label" large>
      <div
        class="dropzone"
        :class="{ 'dropzone-active': dragging, 'dropzone-hovered': dragOver }"
        @dragover.prevent="onDragOver"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop"
      >
        <div class="dropzone-content">
          <Component :is="icon" class="dropzone-icon" />
          <div class="dropzone-info">
            <p class="dropzone-text">Choose a file or drag it here</p>
            <p class="dropzone-format">
              Supported formats: .pdf, .docx, .jpeg, .png, .xls, .xlsx
            </p>
          </div>
          <Button
            primary
            compact
            :disabled="disabled"
            class="yellow-button"
            @click="triggerInput"
          >
            Browse files
          </Button>
        </div>
        <input ref="inputRef" type="file" hidden @change="onChange" />
      </div>
    </Label>
  </div>

  <ProgressLists
    :model-value="props.modelValue"
    :compact="true"
    @update:model-value="handleUpdate"
  />
</template>

<style scoped lang="postcss">
.file-upload-widget {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Center the dropzone horizontally */
  width: 100%;

  & .dropzone {
    background-color: var(--knime-gray-ultra-light);
    border: 2px dashed var(--knime-silver-sand-semi);
    width: 406px; /* Fixed width */
    height: 182px; /* Fixed height */
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s;
    margin: 0 auto; /* Center the dropzone */
    display: flex;
    flex-direction: column;
    gap: 12px;

    & .dropzone-active {
      border-color: var(--knime-cornflower-semi);
    }

    & .dropzone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    & .dropzone-icon {
      display: inline-block;
      text-decoration: none;
      vertical-align: middle;
      text-align: center;
      width: 32px;
      height: 32px;
    }

    & .dropzone-info {
      & .dropzone-text {
        font-weight: 600;
        font-size: 13px;
        text-align: center;
        line-height: 14px;
      }

      & .dropzone-format {
        font-weight: 400;
        font-size: 10px;
        text-align: center;
        line-height: 12px;
      }

      & .dropzone-max-size {
        margin-top: 5px;
        font-size: 12px;
        color: var(--knime-dove-gray); /* Grey color */
      }
    }
  }

  /* Base styles for the yellow button */
  & .yellow-button {
    background-color: var(--knime-yellow);
    color: var(--knime-black);
    padding: 6px 15px;
    border-radius: 1000px;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
  }

  /* Hover and state-specific styles */
  & .dropzone:hover {
    background-color: var(--knime-cornflower-semi);

    & .yellow-button {
      background-color: var(--knime-black);
      color: var(--knime-white);
    }
  }

  & .dropzone.dropzone-hovered {
    background-color: var(--knime-cornflower-semi);

    & .yellow-button {
      background-color: var(--knime-black);
      color: var(--knime-white);
    }
  }

  & .file-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    border-top: 1px solid var(--knime-gray-light-semi);
    margin-bottom: 10px;
    width: 100%;

    & .file-details {
      display: flex;
      width: 360px;
      gap: 8px;
      justify-content: space-between;
      align-items: center;

      & .file-icon {
        font-size: 24px;
        margin-right: 10px;
      }

      & .file-info {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;

        &:first-child {
          margin-bottom: 6px;
        }

        & .file-name {
          margin-right: 10px;
          margin-bottom: 10px;
          font-weight: 600;
          line-height: 14px;
          font-size: 13px;
        }

        & .file-size {
          font-weight: 400;
          line-height: 14px;
          font-size: 13px;
          color: var(--knime-dove-gray);
        }
      }

      & .file-action {
        display: flex;
        align-items: center;
        gap: 8px;

        & .remove-button {
          cursor: pointer;
          width: 15px;
          height: 30px;
        }
      }
    }
  }
}
</style>
