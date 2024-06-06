import "@knime/styles/css/index.css";

import type { Preview } from "@storybook/vue3";
import { useArgs } from "@storybook/preview-api";
import consola from "consola";

window.consola = consola.create({
  level: 4,
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    //support for v-model
    (story, context) => {
      const [args, updateArgs] = useArgs();
      if ("modelValue" in args) {
        args["onUpdate:modelValue"] = (...values) => {
          const modelValue = values[0] === undefined ? null : values[0];
          updateArgs({ modelValue });
        };
      }
      return story({ ...context, updateArgs });
    },
  ],

  tags: ["autodocs"],
};

export default preview;
