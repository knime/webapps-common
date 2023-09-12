<script lang="ts">
import { rendererProps } from "@jsonforms/vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";
import { optionsMapper } from "../utils";
import DropdownInput from "./DropdownInput.vue";

export default {
  name: "OneOfDropdown",
  components: {
    DropdownInput,
  },
  inheritAttrs: false,
  props: {
    ...rendererProps(),
  },
  setup(props) {
    const control = useJsonFormsControlWithUpdate(props).control;
    const options = control.value?.schema?.oneOf?.map(optionsMapper) ?? [];

    return {
      asyncInitialOptions: Promise.resolve(options),
    };
  },
};
</script>

<template>
  <DropdownInput
    v-bind="{ ...$attrs, ...$props }"
    :async-initial-options="asyncInitialOptions"
  />
</template>
