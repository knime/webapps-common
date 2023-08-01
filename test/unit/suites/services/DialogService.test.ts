import { DialogService } from "src/services/DialogService";
import { extensionConfig } from "test/mocks";
import { KnimeService } from "src/services/KnimeService";
import { createFlowVariablesMap } from "src/utils/flowVariablesUtils";

describe("DialogService", () => {
  describe("initialization", () => {
    it("Creates data service", () => {
      const knimeService = new KnimeService(extensionConfig);
      const dialogService = new DialogService(knimeService);

      expect(dialogService).toHaveProperty("getFlowVariableSettings");
    });
  });

  describe("service.getFlowVariableSettings", () => {
    it("Fetches flowVariablesSettings if it's passed to constructor", async () => {
      const knimeService = new KnimeService(extensionConfig);
      const dialogService = new DialogService(knimeService);

      expect(await dialogService.getFlowVariableSettings()).toEqual(
        createFlowVariablesMap(extensionConfig.flowVariableSettings),
      );
    });

    it("Returns empty settings object if extensionConfig is not passed to constructor", async () => {
      const knimeService = new KnimeService();
      const dialogService = new DialogService(knimeService);

      expect(await dialogService.getFlowVariableSettings()).toEqual({});
    });
  });
});
