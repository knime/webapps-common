import { setUpCustomEmbedderService } from "src/embedder";
import { CloseService } from "src/services/CloseService";

describe("CloseService", () => {
  it("provides configs for dialogs", () => {
    const close = jest.fn();
    const embedder = setUpCustomEmbedderService({
      close,
    });
    const closeService = new CloseService(embedder.service);

    closeService.close();
    expect(close).toHaveBeenCalledWith(false);

    const isMetaKeyPressed = true;
    closeService.close(isMetaKeyPressed);
    expect(close).toHaveBeenCalledWith(isMetaKeyPressed);
  });
});
