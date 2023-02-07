<script setup lang="ts">
import { ref } from 'vue';
import useClickOutside from '../useClickOutside';

const props = defineProps({
    callback: {
        type: Function,
        required: true
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    }
});
const active = ref(props.active);
const first = ref(null);
const second = ref(null);
useClickOutside({ targets: [first, second], callback: props.callback }, active);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setActive = (newVal: boolean) => {
    active.value = newVal;
};
</script>

<template>
  <button id="buttonOutside" />
  <button
    id="buttonInside"
    ref="first"
  />
  <div ref="second">
    <button id="nestedButtonInside" />
  </div>
</template>
