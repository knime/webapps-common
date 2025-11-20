import { type Ref, computed } from "vue";

import FileIcon from "@knime/styles/img/icons/file.svg";
import { getFileExtension } from "@knime/utils";

import { fileTypeIcons, isFileTypeIconExisting } from "./fileTypeIcons";

type UseFileIconOptions = {
  filename: Ref<string>;
};

/**
 * Determines which icon to use for a given file name (based on the extension),
 * defaulting to a general FileIcon when no suitable icon is found
 */
export const useFileIcon = (options: UseFileIconOptions) => {
  const icon = computed(() => {
    const candidate =
      `${getFileExtension(options.filename.value)}Icon` as keyof typeof fileTypeIcons;

    return isFileTypeIconExisting(candidate)
      ? fileTypeIcons[candidate]
      : FileIcon;
  });

  return { icon };
};
