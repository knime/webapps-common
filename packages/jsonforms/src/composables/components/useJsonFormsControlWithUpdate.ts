import { type Ref, nextTick, toRef } from "vue";
import { type RendererProps, useJsonFormsControl } from "@jsonforms/vue";

import type { Control } from "../../types/Control";
import inject from "../../utils/inject";

/**
 * Wrapper around the handleChange method of the json forms control object.
 * This is used to add custom functionality to json forms, e.g. updating data
 * of dependent settings.
 */
export const useJsonFormsControlWithUpdate = (props: RendererProps<any>) => {
  const jsonFormsControl = useJsonFormsControl(props);
  const updateData = inject("updateData");
  return {
    handleChange: async (path: string, value: any) => {
      jsonFormsControl.handleChange(path, value);
      await nextTick();
      updateData(path);
    },
    control: toRef(jsonFormsControl, "control") as Ref<Control>,
  };
};
