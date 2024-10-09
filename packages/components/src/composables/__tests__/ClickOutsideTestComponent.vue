<script setup lang="ts">
import { ref } from "vue";
import { toRefs } from "@vueuse/shared";

import useClickOutside from "../useClickOutside";

const props = withDefaults(
  defineProps<{
    callback: (event: PointerEvent) => void;
    active?: boolean;
  }>(),
  { active: true },
);

const { active } = toRefs(props);
const first = ref(null);
const second = ref(null);
useClickOutside({ targets: [first, second], callback: props.callback }, active);
</script>

<template>
  <button id="buttonOutside" />
  <button id="buttonInside" ref="first" />
  <div ref="second">
    <button id="nestedButtonInside" />
  </div>
</template>
