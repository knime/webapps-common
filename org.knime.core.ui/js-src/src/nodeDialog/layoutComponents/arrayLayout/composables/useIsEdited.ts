import { type Ref, nextTick, ref, watch } from "vue";

import inject from "@/nodeDialog/utils/inject";
import { ELEMENT_RESET_BUTTON_ID } from "../EditResetButton.vue";

const MILLISECONDS_UNTIL_LOADING = 200;
const hash = (ids: string[]) => ids.reduce((x, y) => x + y, "");

export default (withEditAndReset: boolean, ids: Ref<string[]>) => {
  // mapping  element ids to whether the element is edited
  const isEdited = ref(new Map());
  const isEditedIsLoading = ref(false);
  const isTriggerActive = inject("isTriggerActive");
  const setIsEdited = () => {
    let resultAvailable = false;
    isTriggerActive({ id: ELEMENT_RESET_BUTTON_ID }).then((response) => {
      resultAvailable = true;
      if (response.state !== "SUCCESS") {
        return;
      }
      isEdited.value = response.result.reduce((acc, { indices, isActive }) => {
        acc.set(indices[0], isActive);
        return acc;
      }, new Map());
      isEditedIsLoading.value = false;
    });
    setTimeout(() => {
      if (!resultAvailable) {
        isEditedIsLoading.value = true;
      }
    }, MILLISECONDS_UNTIL_LOADING);
    isEditedIsLoading.value = false;
  };
  watch(
    () => hash(ids.value),
    () => {
      if (withEditAndReset) {
        const alreadyComputedForIds =
          ids.value.every((id) => isEdited.value.has(id)) &&
          isEdited.value.size === ids.value.length;
        if (!alreadyComputedForIds) {
          nextTick(setIsEdited);
        }
      }
    },
    { immediate: true },
  );
  return { isEdited, isEditedIsLoading };
};
