import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import SideDrawerHeader from "../SideDrawerHeader.vue";

describe("SideDrawerHeader", () => {
  const doMount = ({
    title = "Test Title",
    description = "Test Description",
    isSubDrawer = false,
  }: {
    title?: string;
    description?: string | null;
    isSubDrawer?: boolean;
  } = {}) => {
    const wrapper = shallowMount(SideDrawerHeader, {
      props: { title, description, isSubDrawer },
    });
    return { wrapper };
  };

  it("renders the title in main drawer (h4)", () => {
    const { wrapper } = doMount({ isSubDrawer: false });

    expect(wrapper.find("h4").exists()).toBe(true);
    expect(wrapper.find("h4").text()).toBe("Test Title");
  });

  it("renders the title in subdrawer (.title span)", () => {
    const { wrapper } = doMount({ isSubDrawer: true });
    const titleEl = wrapper.find(".title");
    expect(titleEl.exists()).toBe(true);
    expect(titleEl.text()).toBe("Test Title");
  });

  it("renders the description in a paragraph", () => {
    const { wrapper } = doMount({ description: "Test Description" });
    const p = wrapper.find("p");
    expect(p.exists()).toBe(true);
    expect(p.text()).toBe("Test Description");
  });

  it("does not render description paragraph when description is null/undefined", () => {
    const { wrapper } = doMount({ description: null });
    expect(wrapper.find("p").exists()).toBe(false);
  });

  it("emits close event when close button is clicked", async () => {
    const { wrapper } = doMount();
    await wrapper.find(".close").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
    expect(wrapper.emitted("close")!.length).toBe(1);
  });
});
