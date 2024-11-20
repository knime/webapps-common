/* Utility function to mimic the behaviour of JSONForms determining a renderer component out of a set of
 * renderers, given a certain schema and uischema.
 * The functions below have mainly been copied directly from JSONForms v. 2.5.2 and adapted slightly to be usable
 * for tests. */
import { vanillaRenderers } from "@jsonforms/vue-vanilla";

import { defaultRenderers, fallbackRenderers } from "..";

const maxBy = require("lodash/maxBy");

const _interopDefaultLegacy = (e) =>
  e && typeof e === "object" && "default" in e ? e : { default: e };
const maxByDefault = _interopDefaultLegacy(maxBy);

const renderers = [
  ...vanillaRenderers,
  ...fallbackRenderers,
  ...defaultRenderers,
];

const findRenderer = (uiSchema, schema) => {
  const renderer = maxByDefault.default(renderers, (r) =>
    r.tester(uiSchema, schema),
  );

  // eslint-disable-next-line no-undefined
  if (renderer === undefined || renderer.tester(uiSchema, schema) === -1) {
    return {};
  } else {
    return renderer;
  }
};

const getComponentName = (renderer) => renderer?.name ?? renderer?.__name;
export const determineRenderer = (uiSchema, schema) => {
  const renderer = findRenderer(uiSchema, schema);
  const componentName = getComponentName(renderer);
  if (componentName === "AsyncComponentWrapper") {
    if (typeof renderer.name === "undefined") {
      throw Error("Async renderers require a name.");
    }
    return renderer.name;
  }
  return componentName;
};
