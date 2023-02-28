<script>
import { defineComponent } from 'vue';
import RadioInputBase from './RadioInputBase.vue';

const RadioInput = defineComponent({
    name: 'RadioInput',
    components: {
        RadioInputBase
    },
    inheritAttrs: false
});
export default RadioInput;
</script>

<template>
  <RadioInputBase
    v-bind="$attrs"
    type="radio"
  />
</template>
