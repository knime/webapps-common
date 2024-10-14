<script lang="ts" setup>
import { ref } from "vue";

import { FileUpload } from "@knime/components";

export type State = "info" | "error" | "success" | "cancelled";

const HTTP_STATUS_SUCCESS_MIN = 200;
const HTTP_STATUS_SUCCESS_MAX = 299;

type FileItem = {
  fileName: string;
  percentage: number;
  fileSize: number;
  status?: State;
  abortController?: AbortController;
};

const demoValues = ref<FileItem[]>([
  {
    fileName: "temp_name.pdf",
    percentage: 100,
    fileSize: 132,
  },
]);

const demoValuesNotRestricted = ref<FileItem[]>([
  {
    fileName: "temp1_name.pdf",
    percentage: 100,
    fileSize: 132,
  },
  {
    fileName: "temp2_name.pdf",
    percentage: 100,
    fileSize: 132,
  },
  {
    fileName: "temp3_name.pdf",
    percentage: 100,
    fileSize: 132,
  },
  {
    fileName: "temp4_name.pdf",
    percentage: 100,
    fileSize: 132,
  },
  {
    fileName: "temp5_name.pdf",
    percentage: 100,
    fileSize: 132,
  },
]);

const demoValuesDisabled = ref<FileItem[]>([]);

const updateFileProgress = (fileName: string, percentage: number) => {
  demoValues.value = demoValues.value.map((file) =>
    file.fileName === fileName
      ? { ...file, percentage, status: percentage === 100 ? "success" : "info" }
      : file,
  );
};

const updateFileStatus = (
  fileName: string,
  percentage: number,
  status: State,
) => {
  demoValues.value = demoValues.value.map((file) =>
    file.fileName === fileName ? { ...file, percentage, status } : file,
  );
};

const uploadFile = (file: File, fileItem: FileItem) => {
  const formData = new FormData();
  formData.append("file", file);

  const xhr = new XMLHttpRequest();

  xhr.upload.onprogress = (event: ProgressEvent<EventTarget>) => {
    if (event.lengthComputable) {
      const uploadProgress = Math.round((event.loaded / event.total) * 100);
      updateFileProgress(fileItem.fileName, uploadProgress);
    }
  };

  xhr.onload = () => {
    if (
      xhr.status >= HTTP_STATUS_SUCCESS_MIN &&
      xhr.status <= HTTP_STATUS_SUCCESS_MAX
    ) {
      updateFileStatus(fileItem.fileName, 100, "success");
    } else {
      updateFileStatus(fileItem.fileName, fileItem.percentage, "error");
    }
  };

  xhr.onerror = () => {
    updateFileStatus(fileItem.fileName, fileItem.percentage, "error");
  };

  xhr.onabort = () => {
    updateFileStatus(fileItem.fileName, fileItem.percentage, "error");
  };

  fileItem.abortController?.signal.addEventListener("abort", () => {
    xhr.abort();
  });

  xhr.open("POST", "https://pdfreader-qpaf.onrender.com/upload", true);
  xhr.send(formData);
};

const handleFileAdded = (file: File) => {
  const abortController = new AbortController();
  const newFile: FileItem = {
    fileName: file.name,
    percentage: 0,
    fileSize: file.size,
    status: "info",
    abortController,
  };

  demoValues.value = [newFile, ...demoValues.value];

  uploadFile(file, newFile);
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>FileUpload Component</p>
      </div>
    </div>
    <div class="grid-container">
      <div class="grid-item-6">
        <FileUpload v-model="demoValues" @file-added="handleFileAdded" />
      </div>
    </div>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>FileUpload Component with fixed height</p>
      </div>
    </div>
    <div class="grid-container">
      <div class="grid-item-6">
        <FileUpload
          v-model="demoValuesNotRestricted"
          :scrollable="4"
          @file-added="handleFileAdded"
        />
      </div>
    </div>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>Disabled</p>
      </div>
    </div>
    <div class="grid-container">
      <div class="grid-item-6">
        <FileUpload
          v-model="demoValuesDisabled"
          label-text="Choose a custom label"
          supported-formats="Choose custom supported formats"
          :disabled="true"
          @file-added="handleFileAdded"
        />
      </div>
    </div>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>Disallowed</p>
      </div>
    </div>
    <div class="grid-container">
      <div class="grid-item-6">
        <FileUpload
          v-model="demoValuesDisabled"
          label-text="Choose a custom label"
          supported-formats="Choose custom supported formats"
          :disabled="true"
          :disallowed="true"
          @file-added="handleFileAdded"
        />
      </div>
    </div>
  </section>
</template>
