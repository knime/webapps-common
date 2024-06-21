import { join, dirname } from "path";
import type { StorybookConfig } from "@storybook/vue3-vite";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: [
    "../../packages/**/__stories__/*.stories.@(js|mjs|ts)",
    "../../**/__stories__/*.mdx",
  ],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],

  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },

  docs: {},
};
export default config;
