import { useJsonFormsControl, type RendererProps } from "@jsonforms/vue";
import { inject, toRef, type Ref } from "vue";
import type Control from "../types/Control";

/**
 * Wrapper around the handleChange method of the json forms control object.
 * This is used to add custom functionality to json forms, e.g. updating data
 * of dependent settings.
 */
export const useJsonFormsControlWithUpdate = (
  props: RendererProps<any>,
): {
  handleChange: ReturnType<typeof useJsonFormsControl>["handleChange"];
  control: Ref<Control>;
} => {
  const jsonFormsControl = useJsonFormsControl(props);
  type HandleChangeArguments = [path: string, value: any];
  const updateData = inject("updateData") as (
    // NOSONAR
    handleChange: (...args: HandleChangeArguments) => void,
    ...args: HandleChangeArguments
  ) => void;
  const handleChange = jsonFormsControl.handleChange;
  jsonFormsControl.handleChange = (...args) =>
    updateData(handleChange, ...args);
  return {
    handleChange: jsonFormsControl.handleChange,
    control: toRef(jsonFormsControl, "control") as any,
  };
};
