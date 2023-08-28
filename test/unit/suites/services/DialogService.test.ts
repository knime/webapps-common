import { DialogService } from "src/services/DialogService";
import { extensionConfig } from "test/mocks";
import { KnimeService } from "src/services/KnimeService";

describe("DialogService", () => {
  describe("initialization", () => {
    it("Creates data service", () => {
      const knimeService = new KnimeService(extensionConfig);
      const dialogService = new DialogService(knimeService);

      expect(dialogService).toHaveProperty("hasNodeView");
    });
  });
});
