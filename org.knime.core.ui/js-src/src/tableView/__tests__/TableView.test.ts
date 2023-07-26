import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TableView from "../TableView.vue";
import TableViewInteractive from "../TableViewInteractive.vue";
import TableViewReport from "../TableViewReport.vue";

describe("TableView.vue", () => {
  const shallowMountTableView = (isReport: boolean) => {
    const knimeService = {
      extensionConfig: {
        ...(isReport
          ? { generatedImageActionId: "dummyGeneratedImageActionId" }
          : {}),
        nodeId: "dummyNodeId",
      },
    };
    const store = { dispatch: vi.fn() };
    const wrapper = shallowMount(TableView as any, {
      global: {
        provide: {
          getKnimeService: () => knimeService,
          store,
        },
      },
    });
    return { wrapper, store };
  };

  it("renders the interactive tableView", () => {
    const { wrapper } = shallowMountTableView(false);
    expect(wrapper.findComponent(TableViewInteractive).exists()).toBeTruthy();
    expect(wrapper.findComponent(TableViewReport).exists()).toBeFalsy();
  });

  it("renders the report tableView", () => {
    const { wrapper } = shallowMountTableView(true);
    expect(wrapper.findComponent(TableViewReport).exists()).toBeTruthy();
    expect(wrapper.findComponent(TableViewInteractive).exists()).toBeFalsy();
  });

  it("sets reporting content when rendered", async () => {
    const { wrapper, store } = shallowMountTableView(true);
    await wrapper.findComponent(TableViewReport).vm.$emit("rendered");
    expect(store.dispatch).toHaveBeenCalledWith(
      "pagebuilder/setReportingContent",
      {
        nodeId: "dummyNodeId",
        reportContent: false,
      },
    );
  });
});
