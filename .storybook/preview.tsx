import type { Preview } from "@storybook/vue3";

import "../ui/css/index.css";
import DocumentationTemplate from "../stories/Template.mdx";

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
