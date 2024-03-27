import { describe, expect, it } from "vitest";
import {
  dialogInitialData,
  expectedRenderers,
} from "@@/test-setup/mocks/dialogData";
import { determineRenderer } from "./rendererTestUtils";

const getElementsToTest = (elements) =>
  elements
    .map((element) => {
      if (element.elements) {
        return getElementsToTest(element.elements);
      }
      return (
        element.scope &&
        (!element.rule ||
          (element.rule && element.rule.effect !== "DISABLE")) &&
        element
      );
    })
    .flat()
    .filter(Boolean);

describe("nodeDialog renderer", () => {
  it("renders test dialog elements", () => {
    const elementsToTest = getElementsToTest(
      dialogInitialData.ui_schema.elements,
    );

    expectedRenderers.forEach((expectedRenderer) => {
      const element = elementsToTest.find(
        (el) => expectedRenderer.scope === el.scope,
      );
      expect(element).toBeDefined();
      expect(determineRenderer(element, dialogInitialData.schema)).toBe(
        expectedRenderer.component,
      );
    });
  });
});
