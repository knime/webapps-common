import { reactive, ref } from "vue";

export default (initialValue = false) => {
  const state = ref(initialValue);
  const setTrue = () => {
    state.value = true;
  };
  const setFalse = () => {
    state.value = false;
  };
  return reactive({ state, setTrue, setFalse });
};
