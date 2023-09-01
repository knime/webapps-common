<script lang="ts">
import { rendererProps } from "@jsonforms/vue";
import { computed } from "vue";
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
    const options = computed(() => {
      const oneOf = control.value?.schema?.oneOf;
      return oneOf?.map(optionsMapper) ?? [];
    });

    return {
      getOptions: () => Promise.resolve(options.value),
    };
  },
};
</script>

<template>
  <DropdownInput v-bind="{ ...$attrs, ...$props }" :get-options="getOptions" />
</template>
