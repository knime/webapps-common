/* eslint-disable no-console */

type ConsoleMethod = "log" | "warn" | "error" | "info";
const methods: ConsoleMethod[] = ["log", "warn", "error", "info"];

/**
 * Helper function to run code suppressing all console output
 * @param f The function to run. Can be async.
 * @returns The original function's return value
 */
export default (f: Function) => {
  const originals = methods.map((method) => console[method]);
  methods.forEach((method) => {
    console[method] = () => {};
  });

  let originalConsola: typeof consola;
  // @ts-ignore - needs to extend the globalThis namespace
  if (global.consola) {
    // @ts-ignore
    originalConsola = global.consola;
    // @ts-ignore
    global.consola = consola.create({
      level: -1,
    });
  }

  const restoreOriginals = () => {
    methods.forEach((method, i) => {
      console[method] = originals[i];
    });
    if (originalConsola) {
      // @ts-ignore
      global.consola = originalConsola;
    }
  };

  if (f.constructor.name === "AsyncFunction") {
    // async
    return f().finally(restoreOriginals);
  } else {
    // sync
    try {
      return f();
    } catch (e) {
      throw e;
    } finally {
      restoreOriginals();
    }
  }
};
