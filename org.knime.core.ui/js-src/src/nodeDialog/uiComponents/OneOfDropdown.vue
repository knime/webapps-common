<script>
import { optionsMapper } from '../utils';
import DropdownInput from './DropdownInput.vue';

export default {
    name: 'OneOfDropdown',
    components: {
        DropdownInput
    },
    inheritAttrs: false,
    methods: {
        optionsGenerator(control) {
            return control?.schema?.oneOf?.map(optionsMapper);
        }
    }
};
</script>

<template>
  <DropdownInput
    v-bind="$attrs"
    :options-generator="optionsGenerator"
  />
</template>
