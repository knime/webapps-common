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
            const allColumns = this.getAllColumns(control);
            const additionalInformation = control.uischema.options;
            return generatePossibleValues(allColumns, additionalInformation);
        },
        toValue(data) {
            return data.selected;
        },
        toData(control, value) {
            const allColumns = this.getAllColumns(control);
            const compatibleTypes = allColumns.find(item => item.const === value)?.compatibleTypes;
            return { selected: value, compatibleTypes };
        },
        getAllColumns(control) {
            return control.schema.properties.selected.oneOf;
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
