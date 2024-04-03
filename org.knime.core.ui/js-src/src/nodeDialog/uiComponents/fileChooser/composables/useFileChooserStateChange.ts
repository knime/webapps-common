import { mergeDeep } from "@/nodeDialog/utils";
import { FSCategory, FileChooserValue } from "../types/FileChooserProps";
import { Ref } from "vue";

export default (
  currentValue: Ref<FileChooserValue>,
  onChange: (value: FileChooserValue) => void,
) => {
  const onPathUpdate = (path: string) => {
    onChange(mergeDeep(currentValue.value, { path }));
  };

  const onTimeoutUpdate = (timeout: number) => {
    onChange(mergeDeep(currentValue.value, { timeout }));
  };

  const onFsCategoryUpdate = (fsCategory: keyof typeof FSCategory) => {
    onChange(mergeDeep(currentValue.value, { fsCategory }));
  };

  return { onPathUpdate, onTimeoutUpdate, onFsCategoryUpdate };
};
