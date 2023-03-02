<script>
import { generatePossibleValues } from '../utils';
import DropdownInput from './DropdownInput.vue';

export default {
    name: 'SimpleColumnSelect',
    components: {
        DropdownInput
    },
    inheritAttrs: false,
    methods: {
        optionsGenerator(control) {
            const oneOf = control.schema.oneOf;
            const options = control.uischema.options;
            return generatePossibleValues(oneOf, options);
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
