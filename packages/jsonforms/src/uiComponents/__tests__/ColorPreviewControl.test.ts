import { describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

import { getControlBase, mountJsonFormsControl } from "../../../testUtils";
import { inputFormats } from "../../constants/inputFormats";
import ColorPreviewControl from "../ColorPreviewControl.vue";
import ColorPreviewEmptyState from "../colorPreview/ColorPreviewEmptyState.vue";

const createProps = () => ({
  control: {
    ...getControlBase("preview"),
    data: undefined,
    schema: {
      properties: {
        preview: { type: "null" },
      },
    },
    uischema: {
      type: "Control" as const,
      scope: "#/properties/preview",
      options: {
        format: inputFormats.colorPreview,
      },
      providedOptions: ["previewColors"],
    },
  },
  disabled: false,
  isValid: true,
  messages: { errors: [] },
});

describe("ColorPreviewControl", () => {
  it("renders no colors state initially", () => {
    const addStateProviderListener = vi.fn();
    const { wrapper } = mountJsonFormsControl(ColorPreviewControl, {
      props: createProps(),
      provide: { addStateProviderListener },
    });

    expect(wrapper.text()).toContain("No colors");
  });

  it("renders palette preview when palette colors exist", async () => {
    const addStateProviderListener = vi.fn();
    const { wrapper } = mountJsonFormsControl(ColorPreviewControl, {
      props: createProps(),
      provide: { addStateProviderListener },
    });

    const callback = addStateProviderListener.mock.calls[0][1];
    callback({ colors: ["#AA0000", "#00AA00"] });
    await flushPromises();

    expect(wrapper.find(".palette-grid").exists()).toBe(true);
    expect(wrapper.find(".gradient-bar").exists()).toBe(false);
  });

  it("renders gradient preview when gradient values exist", async () => {
    const addStateProviderListener = vi.fn();
    const { wrapper } = mountJsonFormsControl(ColorPreviewControl, {
      props: createProps(),
      provide: { addStateProviderListener },
    });

    const callback = addStateProviderListener.mock.calls[0][1];
    callback({ colors: ["#AA0000", "#00AA00"], stops: [0, 100] });
    await flushPromises();

    expect(wrapper.find(".gradient-bar").exists()).toBe(true);
    expect(wrapper.find(".palette-grid").exists()).toBe(false);
  });

  it("renders gradient preview when gradient values exist but no stops", async () => {
    const addStateProviderListener = vi.fn();
    const { wrapper } = mountJsonFormsControl(ColorPreviewControl, {
      props: createProps(),
      provide: { addStateProviderListener },
    });

    const callback = addStateProviderListener.mock.calls[0][1];
    callback({ colors: ["#AA0000", "#00AA00"], stops: null });
    await flushPromises();

    expect(wrapper.find(".gradient-bar").exists()).toBe(true);
    expect(wrapper.find(".palette-grid").exists()).toBe(false);
  });

  it("keeps empty state for gradient without colors", async () => {
    const addStateProviderListener = vi.fn();
    const { wrapper } = mountJsonFormsControl(ColorPreviewControl, {
      props: createProps(),
      provide: { addStateProviderListener },
    });

    const callback = addStateProviderListener.mock.calls[0][1];
    callback({ colors: [], stops: null });
    await flushPromises();

    expect(wrapper.find(".gradient-preview").exists()).toBe(true);
    expect(wrapper.findComponent(ColorPreviewEmptyState).exists()).toBe(true);
  });
});
