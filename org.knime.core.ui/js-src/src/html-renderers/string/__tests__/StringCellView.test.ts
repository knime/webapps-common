import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { JsonDataService } from "@knime/ui-extension-service";

import {
  type StringCellViewInitialData,
  addInnerHtml,
} from "../StringCellView";

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

  const init = (initialData: StringCellViewInitialData) => {
    JsonDataService.getInstance = vi.fn().mockResolvedValue({
      initialData: vi.fn().mockResolvedValue(initialData),
    });
    return addInnerHtml(htmlValueViewElement);
  };

  it("sets the inner html to the given value when it should be rendered as html", async () => {
    const value = "<button>Click Me!</button>";
    await init({ value, renderAsHTML: true });
    expect(htmlValueViewElement.innerHTML).toBe(value);
  });

  it("sets the inner html to the given value with escaping when it should not be rendered as html", async () => {
    await init({ value: "<button>Click Me!</button>", renderAsHTML: false });
    expect(htmlValueViewElement.innerHTML).toBe(
      "&lt;button&gt;Click Me!&lt;/button&gt;",
    );
  });
});
