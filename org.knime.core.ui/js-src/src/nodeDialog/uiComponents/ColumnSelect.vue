<script>
import { generatePossibleValues } from '../utils';
import DropdownInput from './DropdownInput.vue';


export default {
    name: 'ColumnSelect',
    components: {
        DropdownInput
    },
    inheritAttrs: false,
    methods: {
        optionsGenerator(control) {
            const oneOf = control.schema.properties.selected.oneOf;
            const additionalInformation = control.uischema.options;
            return generatePossibleValues(oneOf, additionalInformation);
        },
        toValue(data) {
            return data.selected;
        },
        toData(value) {
            return { selected: value };
        }
    }
};
</script>

<template>
  <DropdownInput
    v-bind="$attrs"
    :options-generator="optionsGenerator"
    :control-data-to-dropdown-value="toValue"
    :dropdown-value-to-control-data="toData"
  />
</template>
