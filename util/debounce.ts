// Use this method to reduce many method calls to a few.
// It's an 'immediate' implementation, so it will call the callback once immediately an then again after the given wait.

import type { Id } from "../ui/composables/types";

type CallbackFunc = (value: Id, index: number) => void;

const debounce = (callback: CallbackFunc, wait: number) => {
  let timer: ReturnType<typeof setTimeout>;
  let lastCall = 0;
  return (...args: [Id, number]) => {
    const [value, index] = args;
    clearTimeout(timer);
    const now = Date.now();
    const timeFromLastCall = now - lastCall;

    if (timeFromLastCall > wait) {
      lastCall = now;
      callback(value, index);
    } else {
      timer = setTimeout(() => {
        lastCall = now;
        callback(value, index);
      }, wait);
    }
  };
};

export default debounce;
