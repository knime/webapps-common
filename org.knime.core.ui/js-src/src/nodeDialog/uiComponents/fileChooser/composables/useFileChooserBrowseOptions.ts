import { FileChooserOptions } from "@/nodeDialog/types/FileChooserUiSchema";
import inject from "@/nodeDialog/utils/inject";
import { computed, onMounted, ref, type Ref } from "vue";

export const useFileChooserBrowseOptions = (
  options: Ref<FileChooserOptions>,
) => {
  const addStateProviderListener = inject("addStateProviderListener");
  const filteredExtensions = ref<string[]>([]);
  const appendedExtension = ref<string | null>(null);
  const isWriter = computed(() => options.value.isWriter);

  const setFileExtension = (fileExtension: string) => {
    filteredExtensions.value = [fileExtension];
    appendedExtension.value = fileExtension;
  };

  onMounted(() => {
    if (options.value.fileExtension) {
      setFileExtension(options.value?.fileExtension);
    }
    if (options.value.fileExtensionProvider) {
      addStateProviderListener(
        options.value.fileExtensionProvider,
        setFileExtension,
      );
    }
    const multipleFileExtensions = options.value.fileExtensions;
    if (multipleFileExtensions) {
      filteredExtensions.value = multipleFileExtensions;
    }
  });

  return {
    filteredExtensions,
    appendedExtension,
    isWriter,
  };
};
