// cache the imported modules
const moduleCache: Record<string, { default: (...args: any[]) => any }> = {};

export const useDynamicImport = () => {
  const dynamicImport = async (location: string, ignoreCache = false) => {
    if (!moduleCache[location] || ignoreCache) {
      moduleCache[location] = await import(/* @vite-ignore */ location);
    }

    return moduleCache[location];
  };

  const clearCache = () => {
    Object.keys(moduleCache).forEach((key) => delete moduleCache[key]);
  };

  return {
    dynamicImport,
    clearCache,
  };
};
