// eslint-disable-next-line func-style
export function interceptMethodCalls<T extends Record<string, any>>(
  obj: T,
  fn: (...args: any[]) => any,
  exceptions: string[] = [],
) {
  return new Proxy(obj, {
    get(target, prop: string) {
      if (exceptions.includes(prop)) {
        return target[prop];
      }

      return function (...args: any[]) {
        // Add the method name as the first argument
        return fn(prop, ...args);
      };
    },
  });
}
