import { type Ref, computed } from "vue";
import { partial } from "filesize";

type FileSizeOptions = Parameters<typeof partial>[0];

type UseFileSizeFormattingOptions = {
  size: Ref<number>;
  fileSizeOptions?: FileSizeOptions;
};

export const useFileSizeFormatting = (
  options: UseFileSizeFormattingOptions,
) => {
  const formatSize = partial({ output: "string", ...options.fileSizeOptions });

  const formattedSize = computed(() => formatSize(options.size.value));

  return { formattedSize };
};
