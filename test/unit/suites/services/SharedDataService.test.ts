import { UIExtensionPushEvents } from "src";
import { setUpCustomEmbedderService } from "src/embedder";
import { SharedDataService } from "src/services/SharedDataService";
import { SharedDataServiceAPILayer } from "src/services/types/serviceApiLayers";

describe("SharedDataService", () => {
  const constructSharedDataService = (
    extensionConfig: ReturnType<SharedDataServiceAPILayer["getConfig"]> = {},
  ) => {
    const apiLayer = {
      onApplied: jest.fn(),
      publishData: jest.fn(),
      onDirtyStateChange: jest.fn(),
      getConfig: () => extensionConfig,
    };
    const embedder = setUpCustomEmbedderService(apiLayer);
    const sharedDataService = new SharedDataService(embedder.service);
    return {
      sharedDataService,
      ...apiLayer,
      dispatchPushEvent: embedder.dispatchPushEvent,
    };
  };

  it("shares data", () => {
    const { sharedDataService, publishData } = constructSharedDataService();
    const testData = { agent: "007" };
    sharedDataService.shareData(testData);
    expect(publishData).toHaveBeenCalledWith(testData);
  });

  it("adds callback to event with addOnDataChangeCallback", () => {
    const { sharedDataService, dispatchPushEvent } =
      constructSharedDataService();

    const mockDataChangeCallback = jest.fn();

    sharedDataService.addSharedDataListener(mockDataChangeCallback);

    const payload = {};

    dispatchPushEvent({
      eventType: UIExtensionPushEvents.EventTypes.DataEvent,
      payload,
    });
    expect(mockDataChangeCallback).toHaveBeenCalledWith(payload);
  });

  describe("initial shared data", () => {
    it("returns the supplied initial shared data", () => {
      const initialSharedData = { view: { foo: "bar" } };
      const { sharedDataService } = constructSharedDataService({
        initialSharedData,
      });
      expect(sharedDataService.getInitialSharedData()).toStrictEqual(
        initialSharedData,
      );
    });

    it("returns null if no data are supplied initially", () => {
      const { sharedDataService } = constructSharedDataService();
      expect(sharedDataService.getInitialSharedData()).toBeNull();
    });
  });
});
