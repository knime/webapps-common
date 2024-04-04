<script lang="ts">
import DialogFileExplorer, {
  type Props as DialogFileExplorerProps,
} from "../DialogFileExplorer.vue";

type Props = Omit<
  DialogFileExplorerProps,
  "clickOutsideException" | "openFileByExplorer"
>;
export { Props };
</script>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApplyButton } from "@/nodeDialog/layoutComponents/settingsSubPanel";

const props = withDefaults(defineProps<DialogFileExplorerProps>(), {
  initialFilePath: "",
  isWriter: false,
  filteredExtensions: () => [],
  appendedExtension: null,
});

const emit = defineEmits<{
  chooseFile: [
    /**
     * The full path of the chosen file
     */
    filePath: string,
  ];
}>();

const explorer = ref<typeof DialogFileExplorer | null>(null);
const openFile = () => explorer.value?.openFile();

const {
  element: applyButton,
  disabled: noFileSelected,
  text: applyText,
  onApply,
} = useApplyButton();

onMounted(() => {
  applyText.value = "Choose File";
  noFileSelected.value = true;
  onApply.value = openFile;
});

const onOpenFile = (name: string) => {
  emit("chooseFile", name);
};
</script>

<template>
  <div class="wrapper">
    <DialogFileExplorer
      ref="explorer"
      v-bind="props"
      :click-outside-exception="applyButton"
      @choose-file="onOpenFile"
      @file-is-selected="
        (isSelected) => {
          noFileSelected = !isSelected;
        }
      "
    />
  </div>
</template>

<style scoped lang="postcss">
.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;

  & .button-wrapper {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 10px 0;
  }
}
</style>
