import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../../testUtils/component";
import AnyOfTwinlist from "../AnyOfTwinlist.vue";
import TwinlistControlBase from "../TwinlistControlBase.vue";

describe("AnyOfTwinlist.vue", () => {
  let wrapper: VueWrapper, props: VueControlTestProps<typeof AnyOfTwinlist>;

  const labelForId = "myLabelForId";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("path"),
        data: ["Universe_0_0"],
        schema: {
          anyOf: [
            {
              const: "Universe_0_0",
              title: "Universe_0_0",
            },
            {
              const: "Universe_0_1",
              title: "Universe_0_1",
            },
            {
              const: "Universe_1_0",
              title: "Universe_1_0",
            },
            {
              const: "Universe_1_1",
              title: "Universe_1_1",
            },
          ],
          title: "Y Axis Column",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/frequencies",
        },
      },
      labelForId,
      disabled: true,
      isValid: false,
    };

    const component = await mountJsonFormsControlLabelContent(AnyOfTwinlist, {
      props,
      stubs: {
        SimpleTwinlistControl: false,
      },
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(TwinlistControlBase).exists()).toBe(true);
  });

  it("optionsGenerator correctly transforms the data", async () => {
    await wrapper.vm.$nextTick();

    expect(
      wrapper.getComponent(TwinlistControlBase).props().possibleValues,
    ).toEqual([
      {
        id: "Universe_0_0",
        text: "Universe_0_0",
      },
      {
        id: "Universe_0_1",
        text: "Universe_0_1",
      },
      {
        id: "Universe_1_0",
        text: "Universe_1_0",
      },
      {
        id: "Universe_1_1",
        text: "Universe_1_1",
      },
    ]);
  });
});
