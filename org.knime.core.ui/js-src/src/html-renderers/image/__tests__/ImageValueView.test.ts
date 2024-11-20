import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { JsonDataService } from "@knime/ui-extension-service";

import { type ImageInitialData, addImageSrc } from "../ImageValueView";

describe("ImageValueView", () => {
  let image: HTMLImageElement;

  beforeAll(() => {
    Object.defineProperty(document, "fonts", {
      value: { load: vi.fn().mockResolvedValue(1) },
    });
  });

  beforeEach(() => {
    image = document.createElement("img");
  });

  const init = (initialData: ImageInitialData) => {
    JsonDataService.getInstance = vi.fn().mockResolvedValue({
      initialData: vi.fn().mockResolvedValue(initialData),
    });
    return addImageSrc(image);
  };

  it("sets image source from initial data", async () => {
    await init({ data: "data", mimeType: "image/png" });
    expect(image.src).toBe("data:image/png;base64, data");
  });
});
