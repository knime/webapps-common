<script lang="ts">
import type { BackendType, Folder, FolderAndError } from "./types";
interface Props {
  initialFilePath?: string;
  isWriter?: boolean;
  filteredExtensions?: string[];
  appendedExtension?: string | null;
  backendType: BackendType;
}
export { Props };
</script>

<script setup lang="ts">
import { onMounted, ref, computed, toRefs, watch } from "vue";
import FileExplorer from "webapps-common/ui/components/FileExplorer/FileExplorer.vue";
import type { FileExplorerItem } from "webapps-common/ui/components/FileExplorer/types";
import useFileChooserBackend from "./composables/useFileChooserBackend";
import { toFileExplorerItem } from "./utils";
import LoadingIcon from "webapps-common/ui/components/LoadingIcon.vue";
import FolderIcon from "webapps-common/ui/assets/img/icons/folder.svg";
import InputField from "webapps-common/ui/components/forms/InputField.vue";

const currentPath = ref<string | null>(null);

const currentPathDisplay = computed(() => {
  return currentPath.value ?? "";
});
const items = ref<FileExplorerItem[]>([]);
const props = withDefaults(
  defineProps<
    Props & {
      clickOutsideException?: null | HTMLElement;
    }
  >(),
  {
    initialFilePath: "",
    isWriter: false,
    filteredExtensions: () => [],
    appendedExtension: null,
    clickOutsideException: null,
  },
);

const emit = defineEmits<{
  fileIsSelected: [boolean];
  chooseFile: [
    /**
     * The full path of the chosen file
     */
    filePath: string,
  ];
}>();

const isLoading = ref(true);

const setNextItems = (folder: Folder) => {
  isLoading.value = false;
  currentPath.value = folder.path;
  items.value = folder.items.map(toFileExplorerItem);
};

const displayedError = ref<string | null>(null);
const setErrorMessage = (errorMessage: string | undefined) => {
  displayedError.value = errorMessage ?? null;
};

const selectedFileName = ref("");

watch(
  () => selectedFileName.value,
  (file) => emit("fileIsSelected", file !== ""),
);

const setRelativeFilePathFromBackend = (filePathRelativeToFolder: string) => {
  if (props.isWriter) {
    selectedFileName.value = filePathRelativeToFolder;
  }
};

const handleListItemsResult = (folderAndError: FolderAndError) => {
  setNextItems(folderAndError.folder);
  setErrorMessage(folderAndError.errorMessage);
  setRelativeFilePathFromBackend(folderAndError.filePathRelativeToFolder);
};

const { filteredExtensions, appendedExtension, isWriter, backendType } =
  toRefs(props);

const { listItems, getFilePath } = useFileChooserBackend({
  filteredExtensions,
  appendedExtension,
  isWriter,
  backendType,
});

onMounted(() => {
  listItems(null, props.initialFilePath).then(handleListItemsResult);
});

const selectedDirectoryName = ref("");

const changeDirectory = (nextFolder: string) => {
  selectedDirectoryName.value = "";
  selectedFileName.value = "";
  isLoading.value = true;
  listItems(currentPath.value, nextFolder).then(handleListItemsResult);
};

const onOpenFile = async (name: string) => {
  const { path, errorMessage } = await getFilePath(currentPath.value, name);
  if (path === null) {
    setErrorMessage(errorMessage);
    return Promise.reject(errorMessage);
  } else {
    emit("chooseFile", path);
    return Promise.resolve();
  }
};

defineExpose({
  openFile: () => onOpenFile(selectedFileName.value),
});

const onChangeSelection = (itemIds: string[]) => {
  if (itemIds.length === 0) {
    selectedDirectoryName.value = "";
    if (!props.isWriter) {
      selectedFileName.value = "";
    }
    return;
  }
  const newSelectedItem = items.value.find(({ id }) => id === itemIds[0])!;
  if (newSelectedItem.isDirectory) {
    selectedDirectoryName.value = newSelectedItem.name;
    selectedFileName.value = "";
  } else {
    selectedDirectoryName.value = "";
    selectedFileName.value = newSelectedItem.name;
  }
};
</script>

<template>
  <div v-if="isLoading" class="loading-animaton">
    <LoadingIcon class="icon" />
  </div>
  <template v-else>
    <div class="current-path">
      <FolderIcon />
      <span :title="currentPathDisplay"> {{ currentPathDisplay }}</span>
      <span v-if="displayedError !== null" class="error"
        >({{ displayedError }})</span
      >
    </div>
    <div v-if="isWriter" class="name-input-wrapper">
      <span>Name:</span>
      <InputField v-model="selectedFileName" />
    </div>
    <FileExplorer
      class="explorer"
      :is-root-folder="currentPath === null"
      :items="items"
      :disable-context-menu="true"
      :disable-multi-select="true"
      :disable-dragging="true"
      :click-outside-exception="clickOutsideException"
      @change-directory="changeDirectory"
      @open-file="onOpenFile($event.name).catch(() => {})"
      @change-selection="onChangeSelection"
    />
  </template>
</template>

<style scoped lang="postcss">
.loading-animaton {
  align-items: center;
  flex: 1;
  display: flex;
  min-height: 0;
  flex-direction: column;
  justify-content: center;

  & .icon {
    width: 15px;
    height: 15px;
  }
}

.current-path {
  font-size: 13px;
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 5px;

  & svg {
    width: 15px;
    height: 15px;
  }

  & span.error {
    color: var(--theme-color-error);
  }
}

.name-input-wrapper {
  display: flex;
  font-size: 13px;
  flex-direction: row;
  gap: 10px;
  align-items: baseline;
  margin: 5px;
}

.explorer {
  min-height: 0;
  overflow-y: auto;
  flex: 1;
}
</style>
