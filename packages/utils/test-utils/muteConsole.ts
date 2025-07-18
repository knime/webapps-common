/* eslint-disable no-console */

type ConsoleMethod = "log" | "warn" | "error" | "info";
const methods: ConsoleMethod[] = ["log", "warn", "error", "info"];

/**
 * Helper function to run code suppressing all console output
 * @param f The function to run. Can be async.
 * @returns The original function's return value
 */
export default (f: (...args: never[]) => Promise<unknown>) => {
  const originals = methods.map((method) => console[method]);
  methods.forEach((method) => {
    console[method] = () => {};
  });

  let originalConsola: typeof consola;
  // @ts-expect-error Property 'consola' does not exist on type 'typeof globalThis'.
  if (global.consola) {
    // @ts-expect-error Property 'consola' does not exist on type 'typeof globalThis'.
    originalConsola = global.consola;
    // @ts-expect-error Property 'consola' does not exist on type 'typeof globalThis'.
    global.consola = consola.create({
      level: -1,
    });
  }

  const restoreOriginals = () => {
    methods.forEach((method, i) => {
      console[method] = originals[i];
    });
    if (originalConsola) {
      // @ts-expect-error Property 'consola' does not exist on type 'typeof globalThis'.
      global.consola = originalConsola;
    }
  };

  if (f.constructor.name === "AsyncFunction") {
    // async
    const result = f();
    if (result instanceof Promise) {
      return result.finally(restoreOriginals);
    }
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
