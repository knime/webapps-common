/* Utility function to mimic the behaviour of JSONForms determining a renderer component out of a set of
 * renderers, given a certain schema and uischema.
 * The functions below have mainly been copied directly from JSONForms v. 2.5.2 and adapted slightly to be usable
 * for tests. */

import type {
  JsonSchema,
  TesterContext,
  UISchemaElement,
} from "@jsonforms/core";
import { maxBy } from "lodash-es";

import { type NamedRenderer, defaultRenderers } from "../src";

export const setUpRendererTest = (renderers: readonly NamedRenderer[]) => {
  const findRenderer = (uiSchema: UISchemaElement, schema: JsonSchema) => {
    const renderer: NamedRenderer | undefined = maxBy(
      renderers,
      (r: NamedRenderer) => r.tester(uiSchema, schema, {} as TesterContext),
    );

    // eslint-disable-next-line no-undefined
    if (
      typeof renderer === "undefined" ||
      renderer.tester(uiSchema, schema, {} as TesterContext) === -1
    ) {
      return null;
    } else {
      return renderer;
    }
  };

  const getRendererName = (uiSchema: UISchemaElement, schema: JsonSchema) =>
    findRenderer(uiSchema, schema)?.name;

  return { getRendererName };
};

export const determineRenderer =
  setUpRendererTest(defaultRenderers).getRendererName;
