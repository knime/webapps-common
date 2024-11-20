import { describe, expect, it } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";

import { JsonDataService } from "@knime/ui-extension-service";

import FlowVariableView from "../FlowVariableView.vue";

describe("FlowVariableView.vue", () => {
  const initialData = [
    {
      ownerNodeId: "testOwner",
      type: "StringValue",
      name: "testFlowVariable1",
      value: "test1",
    },
    {
      type: "IntValue",
      name: "testFlowVariable2",
      value: "test2",
    },
  ];

  const doShallowMount = () => {
    JsonDataService.mockImplementation(() => ({
      initialData: () => Promise.resolve(initialData),
    }));
    return shallowMount(FlowVariableView, {
      global: {
        provide: {
          getKnimeService: () => {},
        },
      },
    });
  };

  it("displays flowVariable table", async () => {
    const wrapper = doShallowMount();
    await flushPromises();

    let cells = wrapper.findAll("td");
    expect(cells.at(0).text()).toBe("testOwner");
    expect(cells.at(1).text()).toBe("StringValue");
    expect(cells.at(2).text()).toBe("testFlowVariable1");
    expect(cells.at(3).text()).toBe("test1");
    expect(cells.at(4).text()).toBe("");
    expect(cells.at(5).text()).toBe("IntValue");
    expect(cells.at(6).text()).toBe("testFlowVariable2");
    expect(cells.at(7).text()).toBe("test2");
  });

  it("renders header", () => {
    const wrapper = doShallowMount();

    const cells = wrapper.findAll("th");

    expect(cells[0].text()).toBe("Owner ID");
    expect(cells[1].text()).toBe("Data Type");
    expect(cells[2].text()).toBe("Variable Name");
    expect(cells[3].text()).toBe("Value");
  });
});
