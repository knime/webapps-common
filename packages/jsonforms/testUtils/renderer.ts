/* Utility function to mimic the behaviour of JSONForms determining a renderer component out of a set of
 * renderers, given a certain schema and uischema.
 * The functions below have mainly been copied directly from JSONForms v. 2.5.2 and adapted slightly to be usable
 * for tests. */

import type {
  JsonSchema,
  TesterContext,
  UISchemaElement,
} from "@jsonforms/core";

import { type NamedRenderer, defaultRenderers } from "../src";

export const setUpRendererTest = (renderers: readonly NamedRenderer[]) => {
  const findRenderer = (uiSchema: UISchemaElement, schema: JsonSchema) => {
    let maxRenderer: NamedRenderer | undefined;
    let maxScore = -Infinity;

    for (const r of renderers) {
      const score = r.tester(uiSchema, schema, {} as TesterContext);
      if (score > maxScore) {
        maxScore = score;
        maxRenderer = r;
      }
    }

    if (typeof maxRenderer === "undefined" || maxScore === -1) {
      return null;
    } else {
      return maxRenderer;
    }
  };

  const getRendererName = (uiSchema: UISchemaElement, schema: JsonSchema) =>
    findRenderer(uiSchema, schema)?.name;

  return { getRendererName };
};

export const determineRenderer =
  setUpRendererTest(defaultRenderers).getRendererName;
