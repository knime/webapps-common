<script setup lang="ts">
import type FileChooserProps from "../types/FileChooserProps";
import type { FileChooserValue, FSCategory } from "../types/FileChooserProps";
import FileExplorerTab from "./FileExplorerTab.vue";
import UrlTab from "./UrlTab.vue";
import { TabBar } from "@knime/components";
import LinkIcon from "@knime/styles/img/icons/link.svg";
import FolderIcon from "@knime/styles/img/icons/folder.svg";
import LocalSpaceIcon from "@knime/styles/img/icons/local-space.svg";
import ComputerDesktopIcon from "@knime/styles/img/icons/computer-desktop.svg";
import PluginInputIcon from "@knime/styles/img/icons/plugin-input.svg";
import KnimeIcon from "./knime.svg";
import { useFileChooserBrowseOptions } from "../composables/useFileChooserBrowseOptions";
import { computed, FunctionalComponent, toRef } from "vue";
import useFileChooserStateChange from "../composables/useFileChooserStateChange";
import { BackendType } from "../types";
import { getBackendType } from "../composables/useFileChooserBackend";
import ConnectionPreventsTab from "./ConnectionPreventsTab.vue";

const props = withDefaults(defineProps<FileChooserProps>(), {
  options: () => ({}),
});
const emit = defineEmits(["update:modelValue"]);

const options = toRef(props, "options");
const { onFsCategoryUpdate, onPathUpdate, onTimeoutUpdate } =
  useFileChooserStateChange(
    toRef(props, "modelValue"),
    (value: FileChooserValue) => {
      emit("update:modelValue", value);
    },
    options,
  );
const {
  filteredExtensions,
  appendedExtension,
  isWriter,
  isLocal,
  isLoaded,
  spacePath,
  mountId,
  isConnected,
  portFileSystemName,
  portIndex,
} = useFileChooserBrowseOptions(options);

type TabSpec = {
  value: keyof typeof FSCategory;
  label: string;
  icon: FunctionalComponent;
};

const localFileSystemTab: TabSpec[] = isLocal.value
  ? [
      {
        value: "LOCAL",
        label: "Local File System",
        icon: ComputerDesktopIcon,
      },
    ]
  : [];

const connectedFileSystemTab: TabSpec[] = isConnected.value
  ? [
      {
        value: "CONNECTED",
        label: portFileSystemName.value,
        icon: PluginInputIcon,
      },
    ]
  : [];

const possibleCategories: TabSpec[] = [
  ...connectedFileSystemTab,
  ...localFileSystemTab,
  {
    value: "relative-to-current-hubspace",
    label: mountId.value,
    icon: isLocal.value ? LocalSpaceIcon : KnimeIcon,
  },
  {
    value: "relative-to-embedded-data",
    label: "Embedded Data",
    icon: FolderIcon,
  },
  {
    value: "CUSTOM_URL",
    label: "URL",
    icon: LinkIcon,
  },
];

const backendType = computed<BackendType>(() =>
  getBackendType(props.modelValue.fsCategory, portIndex.value),
);

const breadcrumbRoot = computed(() => {
  if (props.modelValue.fsCategory === "relative-to-current-hubspace") {
    return spacePath.value;
  }
  if (props.modelValue.fsCategory === "relative-to-embedded-data") {
    return "Data";
  }
  return null;
});

const browseAction: Record<
  Exclude<keyof typeof FSCategory, "CONNECTED">,
  string
> = {
  "relative-to-current-hubspace": "browse the current space",
  "relative-to-embedded-data": "browse the embedded data",
  CUSTOM_URL: "use a URL to read files",
  LOCAL: "browse the local file system",
};
</script>

<template>
  <div class="flex">
    <TabBar
      :possible-values="possibleCategories"
      :model-value="modelValue.fsCategory"
      @update:model-value="onFsCategoryUpdate"
    />
    <div class="flex-grow">
      <ConnectionPreventsTab
        v-if="isConnected && modelValue.fsCategory !== 'CONNECTED'"
        :browse-action="browseAction[modelValue.fsCategory]"
      />
      <UrlTab
        v-else-if="modelValue.fsCategory === 'CUSTOM_URL'"
        :id="id"
        :model-value="modelValue"
        :disabled="disabled"
        @update:path="onPathUpdate"
        @update:timeout="onTimeoutUpdate"
      />
      <FileExplorerTab
        v-else-if="isLoaded"
        :id="id"
        :filtered-extensions="filteredExtensions"
        :appended-extension="appendedExtension"
        :is-writer="isWriter"
        :backend-type="backendType"
        :initial-file-path="modelValue.path"
        :breadcrumb-root="breadcrumbRoot"
        @choose-file="onPathUpdate"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.flex {
  display: flex;
  flex-direction: column;
  height: 100%;

  & .flex-grow {
    flex-grow: 1;
    min-height: 0;
  }
}
</style>
