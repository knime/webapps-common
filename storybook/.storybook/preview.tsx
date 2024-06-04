import type { Preview } from "@storybook/vue3";

import "@knime/styles/css/index.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    /* docs: {
      page: DocumentationTemplate,
    }, */
  },
};

export default preview;
