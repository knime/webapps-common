import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { shallowMount } from "@vue/test-utils";
import { useJsonFormsArrayControl } from "@jsonforms/vue";

import SimpleArrayLayout from "../SimpleArrayLayout.vue";
import SimpleArrayLayoutItemControls from "../SimpleArrayLayoutItemControls.vue";

vi.mock("@jsonforms/vue", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@jsonforms/vue")>()),
  rendererProps: vi.fn().mockReturnValue({}),
  useJsonFormsArrayControl: vi.fn().mockReturnValue({
    addItem: vi.fn(),
    moveUp: vi.fn(),
    moveDown: vi.fn(),
    removeItems: vi.fn(),
  }),
}));

const baseSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      email: { type: "string", default: "" },
    },
  },
};

const baseUischemaOptions = {
  addButtonText: "Add item",
  showSortButtons: false,
  detail: {
    emailField: { type: "Control", scope: "#/properties/email" },
  },
};

const createControl = (overrides: Record<string, unknown> = {}) =>
  ref({
    path: "items",
    data: [{ email: "a@b.com" }, { email: "c@d.com" }],
    schema: baseSchema.items,
    uischema: { type: "SimpleArrayLayout", options: baseUischemaOptions },
    enabled: true,
    renderers: [],
    cells: [],
    visible: true,
    ...overrides,
  });

const doMount = (controlOverrides: Record<string, unknown> = {}) => {
  const addItemInner = vi.fn();
  const addItemMock = vi.fn(() => addItemInner);
  const moveUpInner = vi.fn();
  const moveUpMock = vi.fn(() => moveUpInner);
  const moveDownInner = vi.fn();
  const moveDownMock = vi.fn(() => moveDownInner);
  const removeItemsInner = vi.fn();
  const removeItemsMock = vi.fn(() => removeItemsInner);

  vi.mocked(useJsonFormsArrayControl).mockReturnValue({
    control: createControl(controlOverrides),
    addItem: addItemMock,
    moveUp: moveUpMock,
    moveDown: moveDownMock,
    removeItems: removeItemsMock,
  } as any);

  const wrapper = shallowMount(SimpleArrayLayout, {
    props: {
      path: "items",
      schema: baseSchema,
      uischema: {
        type: "SimpleArrayLayout",
        options: baseUischemaOptions,
      } as any,
    },
  });

  return { wrapper, addItemMock, moveUpMock, moveDownMock, removeItemsMock };
};

describe("SimpleArrayLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders one row per data item", () => {
    const { wrapper } = doMount();
    // DispatchRenderer is stubbed, one per element per item
    expect(
      wrapper.findAllComponents({ name: "DispatchRenderer" }),
    ).toHaveLength(2);
  });

  it("renders the add button with configured label", () => {
    const { wrapper } = doMount();
    const addButton = wrapper.findComponent({ name: "KdsButton" });
    expect(addButton.props("label")).toBe("Add item");
  });

  it("calls addItem with path and default values when add button is clicked", async () => {
    const { wrapper, addItemMock } = doMount();
    await wrapper.findComponent({ name: "KdsButton" }).trigger("click");
    expect(addItemMock).toHaveBeenCalledWith("items", { email: "" });
    expect(addItemMock()).toHaveBeenCalled();
  });

  describe("item controls", () => {
    it("renders item controls per row", () => {
      const { wrapper } = doMount();
      expect(
        wrapper.findAllComponents(SimpleArrayLayoutItemControls),
      ).toHaveLength(2);
    });

    it("marks first item as isFirst", () => {
      const { wrapper } = doMount();
      const [first] = wrapper.findAllComponents(SimpleArrayLayoutItemControls);
      expect(first.props("isFirst")).toBe(true);
    });

    it("marks last item as isLast", () => {
      const { wrapper } = doMount();
      const controls = wrapper.findAllComponents(SimpleArrayLayoutItemControls);
      expect(controls.at(-1)!.props("isLast")).toBe(true);
    });

    it("calls moveUp with path and index", async () => {
      const { wrapper, moveUpMock } = doMount();
      const [, secondControls] = wrapper.findAllComponents(
        SimpleArrayLayoutItemControls,
      );
      await secondControls.vm.$emit("moveUp");
      expect(moveUpMock).toHaveBeenCalledWith("items", 1);
      expect(moveUpMock()).toHaveBeenCalled();
    });

    it("calls moveDown with path and index", async () => {
      const { wrapper, moveDownMock } = doMount();
      const [firstControls] = wrapper.findAllComponents(
        SimpleArrayLayoutItemControls,
      );
      await firstControls.vm.$emit("moveDown");
      expect(moveDownMock).toHaveBeenCalledWith("items", 0);
      expect(moveDownMock()).toHaveBeenCalled();
    });

    it("calls removeItems with path and index on delete", async () => {
      const { wrapper, removeItemsMock } = doMount();
      const [firstControls] = wrapper.findAllComponents(
        SimpleArrayLayoutItemControls,
      );
      await firstControls.vm.$emit("delete");
      expect(removeItemsMock).toHaveBeenCalledWith("items", [0]);
      expect(removeItemsMock()).toHaveBeenCalled();
    });
  });

  describe("showSortControls", () => {
    it("passes showSortControls=false by default", () => {
      const { wrapper } = doMount();
      wrapper.findAllComponents(SimpleArrayLayoutItemControls).forEach((c) => {
        expect(c.props("showSortControls")).toBe(false);
      });
    });

    it("passes showSortControls=true when showSortButtons is set", () => {
      const { wrapper } = doMount({
        uischema: {
          type: "SimpleArrayLayout",
          options: { ...baseUischemaOptions, showSortButtons: true },
        },
      });
      wrapper.findAllComponents(SimpleArrayLayoutItemControls).forEach((c) => {
        expect(c.props("showSortControls")).toBe(true);
      });
    });
  });

  describe("element titles", () => {
    it("does not show item-header when arrayElementTitle is not set", () => {
      const { wrapper } = doMount();
      expect(wrapper.find(".item-header").exists()).toBe(false);
    });

    it("shows item-header with label when arrayElementTitle is set", () => {
      const { wrapper } = doMount({
        uischema: {
          type: "SimpleArrayLayout",
          options: { ...baseUischemaOptions, arrayElementTitle: "Email" },
        },
      });
      expect(wrapper.findAll(".item-header")).toHaveLength(2);
      expect(
        wrapper
          .find(".item-header")
          .findComponent({ name: "Label" })
          .props("text"),
      ).toContain("Email 1");
    });
  });

  describe("isHidingControlHeader", () => {
    it("passes isHidingControlHeader=false by default", () => {
      const { wrapper } = doMount();
      wrapper.findAllComponents(SimpleArrayLayoutItemControls).forEach((c) => {
        expect(c.props("isHidingControlHeader")).toBe(false);
      });
    });

    it("passes isHidingControlHeader=true when hideControlHeader is set", () => {
      const { wrapper } = doMount({
        uischema: {
          type: "SimpleArrayLayout",
          options: { ...baseUischemaOptions, hideControlHeader: true },
        },
      });
      wrapper.findAllComponents(SimpleArrayLayoutItemControls).forEach((c) => {
        expect(c.props("isHidingControlHeader")).toBe(true);
      });
    });
  });

  it("renders empty state with only add button when data is empty", () => {
    const { wrapper } = doMount({ data: [] });
    expect(
      wrapper.findAllComponents(SimpleArrayLayoutItemControls),
    ).toHaveLength(0);
    expect(wrapper.findComponent({ name: "KdsButton" }).exists()).toBe(true);
  });
});
