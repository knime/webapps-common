<script setup lang="ts">
import { onMounted, ref, type Ref, computed } from "vue";
import FileExplorer from "webapps-common/ui/components/FileExplorer/FileExplorer.vue";
import type { FileExplorerItem } from "webapps-common/ui/components/FileExplorer/types";
import useFileChooserBackend from "./useFileChooserBackend";
import type { Folder, FolderAndError } from "./types";
import { toFileExplorerItem } from "./utils";
import Button from "webapps-common/ui/components/Button.vue";
import LoadingIcon from "webapps-common/ui/components/LoadingIcon.vue";
import FolderIcon from "webapps-common/ui/assets/img/icons/folder.svg";

const { listItems, getFilePath } = useFileChooserBackend();

const currentPath: Ref<string | null> = ref(null);

const currentPathDisplay = computed(() => {
  return currentPath.value ?? "Root directories";
});
const items: Ref<FileExplorerItem[]> = ref([]);
const props = withDefaults(defineProps<{ initialFilePath?: string }>(), {
  initialFilePath: "",
});
const isLoading = ref(true);

const setNextItems = (folder: Folder) => {
  isLoading.value = false;
  currentPath.value = folder.path;
  items.value = folder.items.map(toFileExplorerItem);
};

const displayedError: Ref<string | null> = ref(null);
const setErrorMessage = (errorMessage: string | undefined) => {
  displayedError.value = errorMessage ?? null;
};

const handleListItemsResult = (folderAndError: FolderAndError) => {
  setNextItems(folderAndError.folder);
  setErrorMessage(folderAndError.errorMessage);
};

onMounted(() => {
  listItems(null, props.initialFilePath).then(handleListItemsResult);
});

const selectedItem: Ref<FileExplorerItem | null> = ref(null);

const changeDirectory = (nextFolder: string) => {
  selectedItem.value = null;
  isLoading.value = true;
  listItems(currentPath.value, nextFolder).then(handleListItemsResult);
};

const emit = defineEmits<{
  chooseFile: [
    /**
     * The full path of the chosen file
     */
    filePath: string,
  ];
  cancel: [];
}>();
const onOpenFile = async (item: FileExplorerItem) => {
  const filePath = await getFilePath(currentPath.value, item.name);
  emit("chooseFile", filePath);
};

const onChangeSelection = (itemIds: string[]) => {
  if (itemIds.length === 0) {
    selectedItem.value = null;
    return;
  }
  const newSelectedItem = items.value.find(({ id }) => id === itemIds[0])!;
  selectedItem.value = newSelectedItem;
};

const onCancel = () => {
  emit("cancel");
};
</script>

<template>
  <div class="wrapper">
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
      <FileExplorer
        class="explorer"
        :is-root-folder="currentPath === null"
        :items="items"
        :disable-context-menu="true"
        :disable-multi-select="true"
        :disable-dragging="true"
        @change-directory="changeDirectory"
        @open-file="onOpenFile"
        @change-selection="onChangeSelection"
      />
    </template>
    <div class="button-wrapper">
      <Button compact with-border @click="onCancel">Cancel</Button>
      <Button
        v-if="selectedItem?.isDirectory === false"
        compact
        primary
        @click="() => onOpenFile(selectedItem!)"
        >Choose</Button
      >
      <Button
        v-if="selectedItem?.isDirectory === true"
        compact
        primary
        @click="() => changeDirectory(selectedItem!.name)"
        >Open</Button
      >
    </div>
  </div>
</template>

<style scoped lang="postcss">
.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;

  & .loading-animaton {
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

  & .current-path {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 13px;
    margin: 5px;

    & svg {
      width: 15px;
      height: 15px;
    }

    & span.error {
      color: var(--theme-color-error);
    }
  }

  & .explorer {
    min-height: 0;
    overflow-y: auto;
    flex: 1;
  }

  & .button-wrapper {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 10px 0;
  }
}
</style>
