<script>
import { optionsMapper } from '../utils';
import DropdownInput from './DropdownInput.vue';

export const generatePossibleColumnValues = (oneOf, { showNoneColumn = false, showRowKeys = false } = {}) => {
    // Since an oneOf cannot be empty, we currently add one option in the backend with empty id and title.
    // TODO: Remove this when the respective schema structure is adjusted with UIEXT-715
    const correctedOneOf = oneOf.length === 1 && oneOf[0].const === '' ? [] : oneOf;
    return [
        ...showNoneColumn ? [{ id: '<none>', text: 'None' }] : [],
        ...showRowKeys ? [{ id: '<row-keys>', text: 'RowIDs' }] : [],
        ...correctedOneOf.map(optionsMapper)
    ];
};

export default {
    name: 'ColumnSelect',
    components: {
        DropdownInput
    },
    inheritAttrs: false,
    methods: {
        optionsGenerator(control) {
            const oneOf = control.schema.properties.selected.oneOf;
            const options = control.uischema.options;
            return generatePossibleColumnValues(oneOf, options);
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
