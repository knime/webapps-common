import { mount } from "@vue/test-utils";

import JsonFormsDialog from "../../../JsonFormsDialog.vue";
import { controls, layouts, toRenderers } from "../../../renderers";

const jsonFormsDialogPropsWithTextControl = {
  data: {
    text: "Hello World",
  },
  schema: {
    type: "object",
    properties: {
      text: {
        type: "string",
      },
    },
  },
  uischema: {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/text",
      },
    ],
    persist: {
      type: "object",
      properties: {
        text: {},
      },
    },
  },
  renderers: toRenderers({
    renderers: [],
    controls: [controls.textRenderer],
    layouts: [layouts.verticalLayoutRenderer],
  }),
};

export const mountJsonFormsDialog = () =>
  mount(JsonFormsDialog, {
    props: jsonFormsDialogPropsWithTextControl,
  });
