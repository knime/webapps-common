<script lang="ts" setup>
import { ref } from "vue";

import { FileUpload } from "@knime/components";

export type State = "info" | "error" | "success";

const HTTP_STATUS_SUCCESS_MIN = 200;
const HTTP_STATUS_SUCCESS_MAX = 299;

type FileItem = {
  fileName: string;
  percentage: number;
  fileSize: number;
  status: State;
  abortController?: AbortController;
};

const demoValues = ref<FileItem[]>([
  {
    fileName: "temp_name.pdf",
    percentage: 100,
    fileSize: 132,
    status: "success",
  },
]);

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

  demoValues.value = [...demoValues.value, newFile];

  uploadFile(file, newFile);
};

const handleFileRemoved = (fileName: string) => {
  const fileToRemove = demoValues.value.find(
    (file) => file.fileName === fileName,
  );

  if (fileToRemove) {
    fileToRemove.abortController?.abort();

    demoValues.value = demoValues.value.filter(
      (file) => file.fileName !== fileName,
    );
  }
};
</script>

<template>
  <FileUpload
    v-model="demoValues"
    @file-added="handleFileAdded"
    @file-removed="handleFileRemoved"
  />
</template>
