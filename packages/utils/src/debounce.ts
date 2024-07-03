// Use this method to reduce many method calls to a few.
// It's an 'immediate' implementation, so it will call the callbackindex: number once immediately an then again after the given wait.

type CallbackFunc<T> = (value: T, index: number) => void;

const debounce = <T>(callback: CallbackFunc<T>, wait: number) => {
  let timer: ReturnType<typeof setTimeout>;
  let lastCall = 0;

  return (...args: Parameters<typeof callback>) => {
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
