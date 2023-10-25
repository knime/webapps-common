import { defineAsyncComponent, getCurrentInstance } from "vue";

/**
 * Determines whether a given component (by name) is registered on the given Vue instance
 * @param {Object} param
 * @param {Object} param.vueInstance The vue instance to check
 * @param {String} param.componentName The component name to assert
 * @returns {Boolean} whether the component is already registered or not
 */
export const isComponentRegistered = ({ vueInstance, componentName }) =>
  Boolean(vueInstance.component(componentName));

const registerComponent = ({ vueInstance, componentName, component }) => {
  vueInstance.component(componentName, component);
};

/**
 * Dynamically loads a script and appends its contents to the document head
 * @param {Object} payload
 * @param {Object} payload.window Window object reference. Useful when loading to an iframe
 * @param {String} payload.url url to fetch the script from
 * @returns {Promise} A promise that is resolved with the script element in case of success, or rejected on error.
 */
export const loadScript = ({ url }) =>
  new Promise((resolve, reject) => {
    const script = window.document.createElement("script");

    script.async = true; // this is the default, but let's be safe

    script.addEventListener("load", () => {
      resolve(script);
    });

    script.addEventListener("error", () => {
      reject(new Error(`Script loading of "${url}" failed`));
      window.document.head.removeChild(script);
    });

    script.src = url;
    window.document.head.appendChild(script);
  });

/**
 * Loads a Vue component from an url and registers it globally
 * Requires the component to be built in library mode and UMD format, see https://vitejs.dev/guide/build.html#library-mode
 *
 * @param {String} param.resourceLocation url to load component from
 * @param {String} param.componentName name of component
 * @param {Function} param.onLoad callback function that will execute as soon as the component is loaded, but before
 * it's registered in the Vue instance
 * @returns {Promise} A promise that is resolved if the component was loaded successfully.
 */
export const loadComponentLibrary = async ({
  resourceLocation,
  componentName,
  onLoad = null,
}) => {
  // Necessary for global component registration
  const vueInstance = getCurrentInstance()?.appContext.app;

  // resolve immediately if component has already been loaded
  if (isComponentRegistered({ vueInstance, componentName })) {
    return Promise.resolve(vueInstance.component(componentName));
  }

  // Load and mount component library script
  await loadScript({ url: resourceLocation });

  // Lib build defines component on `window` using the name defined during build.
  // This name has to match the componentName
  const component = window[componentName];
  if (!component) {
    throw new Error(
      `Component "${componentName}" loading failed. Script invalid.`,
    );
  }

  onLoad?.({ component });

  registerComponent({ vueInstance, componentName, component });
  // clean up Window object
  delete window[componentName];

  return Promise.resolve(component);
};

/**
 * Same as loadComponentLibrary() but returns a Vue Async Component which can be used right away, no need to
 * wait until it's loaded. Also it allows defining a component which is shown while loading/if loading fails.
 * See https://vuejs.org/guide/components/async.html for details.
 *
 * @param {String} param.resourceLocation url to load component from
 * @param {String} param.componentName name of component
 * @param {String} param.asyncComponentOptions see https://vuejs.org/guide/components/async.html#loading-and-error-states
 * @param {Function} param.onLoad callback function that will execute as soon as the component is loaded, but before
 * it's registered in the Vue instance
 * @returns {Promise} A promise that is resolved if the component was loaded successfully.
 */
export const loadAsyncComponent = ({
  resourceLocation,
  componentName,
  asyncComponentOptions = {},
  onLoad = null,
}) =>
  defineAsyncComponent({
    loader: () =>
      loadComponentLibrary({ window, resourceLocation, componentName, onLoad }),
    ...asyncComponentOptions,
  });
