import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { HTMLValueViewInitialData, addInnerHtml } from "../HTMLValueView";
import { JsonDataService } from "@knime/ui-extension-service";

describe("StringValueView", () => {
  let htmlValueViewElement: HTMLElement;

  beforeAll(() => {
    Object.defineProperty(document, "fonts", {
      value: { load: vi.fn() },
    });
  });

  beforeEach(() => {
    htmlValueViewElement = document.createElement("div");
  });

  const init = (initialData: HTMLValueViewInitialData) => {
    JsonDataService.getInstance = vi.fn().mockResolvedValue({
      initialData: vi.fn().mockResolvedValue(initialData),
    });
    return addInnerHtml(htmlValueViewElement);
  };

  it("sets the inner html to the given value", async () => {
    const value = "some string";
    await init({ value });
    expect(htmlValueViewElement.innerHTML).toBe(value);
  });
});
