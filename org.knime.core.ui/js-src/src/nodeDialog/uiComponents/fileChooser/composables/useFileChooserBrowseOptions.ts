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
  const mountId = computed(() => options.value.mountId ?? "Current space");
  const spacePath = computed(() => options.value.spacePath);
  const isLocal = computed(() => options.value.isLocal);
  const isLoaded = ref(false);

  const setFileExtension = (fileExtension: string) => {
    filteredExtensions.value = [fileExtension];
    appendedExtension.value = fileExtension;
    isLoaded.value = true;
  };

  onMounted(() => {
    const { fileExtension, fileExtensionProvider, fileExtensions } =
      options.value;
    if (!fileExtension && !fileExtensionProvider && !fileExtensions) {
      isLoaded.value = true;
      return;
    }
    if (fileExtension) {
      setFileExtension(fileExtension);
    }
    if (fileExtensionProvider) {
      addStateProviderListener({ id: fileExtensionProvider }, setFileExtension);
    }
    if (fileExtensions) {
      filteredExtensions.value = fileExtensions;
      isLoaded.value = true;
    }
  });

  return {
    filteredExtensions,
    appendedExtension,
    isWriter,
    isLoaded,
    isLocal,
    mountId,
    spacePath,
  };
};
