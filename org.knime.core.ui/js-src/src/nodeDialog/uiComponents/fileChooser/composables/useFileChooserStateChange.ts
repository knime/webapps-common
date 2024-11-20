import { type Ref } from "vue";

import { type FileChooserOptions } from "@/nodeDialog/types/FileChooserUiSchema";
import { mergeDeep } from "@/nodeDialog/utils";
import type { FSCategory, FileChooserValue } from "../types/FileChooserProps";

export default (
  currentValue: Ref<FileChooserValue>,
  onChange: (value: FileChooserValue) => void,
  options: Ref<FileChooserOptions>,
) => {
  const onPathUpdate = (path: string) => {
    const fsSpecifier = options.value.fileSystemSpecifier;
    onChange(
      mergeDeep(currentValue.value, {
        path,
        ...(fsSpecifier ? { context: { fsSpecifier } } : {}),
      }),
    );
  };

  const onTimeoutUpdate = (timeout: number) => {
    onChange(mergeDeep(currentValue.value, { timeout }));
  };

  const onFsCategoryUpdate = (fsCategory: keyof typeof FSCategory) => {
    onChange(mergeDeep(currentValue.value, { fsCategory }));
  };

  return { onPathUpdate, onTimeoutUpdate, onFsCategoryUpdate };
};
