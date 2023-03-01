<script>
import { generatePossibleColumnValues } from './ColumnSelect.vue';
import SimpleDropdownInput from './SimpleDropdownInput.vue';

export default {
    name: 'SimpleColumnSelect',
    components: {
        SimpleDropdownInput
    },
    inheritAttrs: false,
    methods: {
        optionsGenerator(control) {
            const oneOf = control.schema.oneOf;
            const options = control.uischema.options;
            return generatePossibleColumnValues(oneOf, options);
        }
    }
};
</script>

<template>
  <SimpleDropdownInput
    v-bind="$attrs"
    :options-generator="optionsGenerator"
  />
</template>
