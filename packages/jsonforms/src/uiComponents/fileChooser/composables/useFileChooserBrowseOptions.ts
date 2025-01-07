import { type Ref, computed, onMounted, ref } from "vue";

import { type FileChooserOptions } from "../../../types/FileChooserUiSchema";
import inject from "../../../utils/inject";
import { FSCategory } from "../types/FileChooserProps";

export const useFileChooserFileSystemsOptions = (
  options: Ref<FileChooserOptions>,
) => {
  const isLocal = computed(() => options.value.isLocal);
  const isConnected = computed(
    () => typeof options.value.portIndex !== "undefined",
  );
  const validCategories = computed<(keyof typeof FSCategory)[]>(() =>
    isConnected.value
      ? ["CONNECTED"]
      : [
          ...(isLocal.value ? ["LOCAL" as const] : []),
          "relative-to-current-hubspace",
          "relative-to-embedded-data",
          "CUSTOM_URL",
        ],
  );

  return { isLocal, isConnected, validCategories };
};

export const useFileChooserBrowseOptions = (
  options: Ref<FileChooserOptions>,
) => {
  const { isLocal, isConnected } = useFileChooserFileSystemsOptions(options);
  const addStateProviderListener = inject("addStateProviderListener");
  const filteredExtensions = ref<string[]>([]);
  const appendedExtension = ref<string | null>(null);
  const isWriter = computed(() => options.value.isWriter);
  const mountId = computed(() => options.value.mountId ?? "Current space");
  const spacePath = computed(() => options.value.spacePath);
  const portIndex = computed(() => options.value.portIndex);
  const portFileSystemName = computed(
    () => options.value.fileSystemType ?? "Connected File System",
  );
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
    } else if (fileExtensionProvider) {
      addStateProviderListener({ id: fileExtensionProvider }, setFileExtension);
    } else if (fileExtensions) {
      filteredExtensions.value = fileExtensions;
      isLoaded.value = true;
    } else {
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
    isConnected,
    portIndex,
    portFileSystemName,
  };
};
