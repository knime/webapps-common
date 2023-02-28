<script>
import { optionsMapper } from '@/nodeDialog/utils';
import DropdownInput from './DropdownInput.vue';

export default {
    name: 'ColumnSelect',
    components: {
        DropdownInput
    },
    inheritAttrs: false,
    methods: {
        optionsGenerator(control) {
            // Since an oneOf cannot be empty, we currently add one option in the backend with empty id and title.
            // TODO: Remove this when the respective schema structure is adjusted with UIEXT-715
            const options = control.schema.oneOf;
            const correctedOneOf = options.length === 1 && options[0].const === '' ? [] : control.schema.oneOf;
            return [
                ...control.uischema.options.showNoneColumn ? [{ id: '<none>', text: 'None' }] : [],
                ...control.uischema.options.showRowKeys ? [{ id: '<row-keys>', text: 'RowIDs' }] : [],
                ...correctedOneOf.map(optionsMapper)
            ];
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
