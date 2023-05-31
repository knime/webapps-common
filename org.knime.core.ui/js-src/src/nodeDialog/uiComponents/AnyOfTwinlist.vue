<script>
import { optionsMapper } from '../utils';
import SimpleTwinlistInput from './SimpleTwinlistInput.vue';

export default {
    name: 'AnyOfTwinlist',
    components: {
        SimpleTwinlistInput
    },
    inheritAttrs: false,
    methods: {
        optionsGenerator(control) {
            return control?.schema?.anyOf?.map(optionsMapper);
        }
    }
};
</script>

<template>
  <SimpleTwinlistInput
    v-bind="$attrs"
    :options-generator="optionsGenerator"
  />
</template>
