import { describe, expect, it } from "vitest";

import shallowMountReportingComponent from "@@/test-setup/utils/shallowMountReportingComponent";
import TableView from "../TableView.vue";
import TableViewInteractive from "../TableViewInteractive.vue";
import TableViewReport from "../TableViewReport.vue";

describe("TableView.vue", () => {
  it("renders the interactive tableView", () => {
    const { wrapper } = shallowMountReportingComponent(TableView);
    expect(wrapper.findComponent(TableViewInteractive).exists()).toBeTruthy();
    expect(wrapper.findComponent(TableViewReport).exists()).toBeFalsy();
  });

  it("renders the report tableView", () => {
    const { wrapper } = shallowMountReportingComponent(TableView, true);
    expect(wrapper.findComponent(TableViewReport).exists()).toBeTruthy();
    expect(wrapper.findComponent(TableViewInteractive).exists()).toBeFalsy();
  });

  it("sets reporting content when rendered", async () => {
    const { wrapper, setRenderCompleted } = shallowMountReportingComponent(
      TableView,
      true,
    );
    await wrapper.findComponent(TableViewReport).vm.$emit("rendered");
    expect(setRenderCompleted).toHaveBeenCalled();
  });
});
