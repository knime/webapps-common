import { setUpCustomEmbedderService } from "src/embedder";
import { DialogService } from "src/services/DialogService";
import { extensionConfig } from "test/mocks";

describe("DialogService", () => {
  it("provides configs for dialogs", () => {
    const embedder = setUpCustomEmbedderService({
      getConfig: () => extensionConfig,
    });
    const dialogService = new DialogService(embedder.service);

    expect(dialogService.hasNodeView()).toBeTruthy();
    expect(dialogService.isWriteProtected()).toBeFalsy();
  });
});
