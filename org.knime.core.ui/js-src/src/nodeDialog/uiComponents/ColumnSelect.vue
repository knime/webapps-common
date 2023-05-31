<script>
import { getPossibleValuesFromUiSchema } from '../utils';
import DropdownInput from './DropdownInput.vue';


export default {
    name: 'ColumnSelect',
    components: {
        DropdownInput
    },
    inheritAttrs: false,
    methods: {
        optionsGenerator(control) {
            return getPossibleValuesFromUiSchema(control);
        },
        toValue(data) {
            return data.selected;
        },
        toData(control, value) {
            const allColumns = this.getAllColumns(control);
            const compatibleTypes = allColumns.find(item => item.id === value)?.compatibleTypes;
            return { selected: value, compatibleTypes };
        },
        getAllColumns(control) {
            return getPossibleValuesFromUiSchema(control);
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
