import { onMounted, onUnmounted, ref } from "vue";

const defaultKeys = [
  "Tab",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  " " /* Space */,
  "Enter",
];

/*
 * Composable that returns whether user has navigated using the keyboard (pressed a key). Most useful as an *additional*
 * check to make focus styles visible when the document is navigated using key presses. Similar to `:focus-visible`
 * but with much more control over which keys are considered and can also be used in JS/TS code.
 * Keys can be defined with the `keys` parameter.
 *
 * Keyboard used state is reset when the document is clicked (`mousedown`).
 */
const useKeyPressedUntilMouseClick = (keys: Array<string> = defaultKeys) => {
  const hasUsedKeyboard = ref(false);

  const turnKeyboardUsageOn = (event: KeyboardEvent) => {
    if (keys.includes(event.key)) {
      hasUsedKeyboard.value = true;
    }
  };

  const turnKeyboardUsageOff = () => {
    hasUsedKeyboard.value = false;
  };

  onMounted(() => {
    document.addEventListener("keydown", turnKeyboardUsageOn);
    // use pointerdown because it comes before mousedown and that might lead to timing issues,                                                                                                               │
    // where the 'click' did not yet reset state
    document.addEventListener("pointerdown", turnKeyboardUsageOff);
  });

  onUnmounted(() => {
    // Clean up - remove event listeners and stored data
    document.removeEventListener("keydown", turnKeyboardUsageOn);
    document.removeEventListener("pointerdown", turnKeyboardUsageOff);
  });

  return hasUsedKeyboard;
};

export default useKeyPressedUntilMouseClick;
