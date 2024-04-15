<script setup lang="ts">
import type FileChooserProps from "../types/FileChooserProps";
import type { FileChooserValue, FSCategory } from "../types/FileChooserProps";
import FileExplorerTab from "./FileExplorerTab.vue";
import UrlTab from "./UrlTab.vue";
import TabBar from "webapps-common/ui/components/TabBar.vue";
import LinkIcon from "webapps-common/ui/assets/img/icons/link.svg";
import KnimeIcon from "./knime.svg";
import { useFileChooserBrowseOptions } from "../composables/useFileChooserBrowseOptions";
import { FunctionalComponent, onMounted, toRef } from "vue";
import useFileChooserStateChange from "../composables/useFileChooserStateChange";

const props = withDefaults(defineProps<FileChooserProps>(), {
  options: () => ({}),
});
const emit = defineEmits(["update:modelValue"]);

const { onFsCategoryUpdate, onPathUpdate, onTimeoutUpdate } =
  useFileChooserStateChange(
    toRef(props, "modelValue"),
    (value: FileChooserValue) => {
      emit("update:modelValue", value);
    },
  );
const { filteredExtensions, appendedExtension, isWriter, isLoaded } =
  useFileChooserBrowseOptions(toRef(props, "options"));

const possibleCategories: {
  value: keyof typeof FSCategory;
  label: string;
  icon: FunctionalComponent;
}[] = [
  {
    value: "relative-to-current-hubspace",
    label: "Community Hub",
    icon: KnimeIcon,
  },
  {
    value: "CUSTOM_URL",
    label: "URL",
    icon: LinkIcon,
  },
];

/**
 * This currently can happen in case a node implementation sets the default value to one that is not supported in this frontend.
 * In this case, we switch to a default when the drawer is opened.
 */
onMounted(() => {
  if (
    !possibleCategories
      .map(({ value }) => value)
      .includes(props.modelValue.fsCategory)
  ) {
    onFsCategoryUpdate("relative-to-current-hubspace");
  }
});
</script>

<template>
  <div class="flex">
    <TabBar
      :possible-values="possibleCategories"
      :model-value="modelValue.fsCategory"
      @update:model-value="onFsCategoryUpdate"
    />
    <div class="flex-grow">
      <UrlTab
        v-if="modelValue.fsCategory === 'CUSTOM_URL'"
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
        backend-type="relativeToCurrentHubSpace"
        :initial-file-path="modelValue.path"
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
