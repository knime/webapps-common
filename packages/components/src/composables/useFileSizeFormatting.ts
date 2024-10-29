import { type Ref, computed } from "vue";
import { partial } from "filesize";

type UseFileSizeFormattingOptions = {
  size: Ref<number>;
};

export const useFileSizeFormatting = (
  options: UseFileSizeFormattingOptions,
) => {
  const formatSize = partial({ output: "string" });

  const formattedSize = computed(() => formatSize(options.size.value));

  //   const progressedFileSizeFormat = computed(() => {
  //     const parsedSize = formatSize(
  //       ((props.fileSize as number) / 100) * (props?.percentage as number),
  //     );
  //     return parsedSize;
  //   });

  return { formattedSize };
};
