import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";

import { formatDateTimeString } from "@knime/utils";

import RFCErrorToastTemplate from "../RFCErrorToastTemplate.vue";

const { useClipboardMock } = vi.hoisted(() => ({
  useClipboardMock: vi.fn(),
}));

vi.mock("@vueuse/core", () => ({
  useClipboard: useClipboardMock,
}));

describe("RFCErrorToastTemplate", () => {
  const defaultProps = {
    headline: "Toast headline",
    title: "There was an error",
    details: ["Here", "are", "the", "deets"],
    status: 500,
    date: new Date(2012, 11, 12),
    requestId: "123456789",
  };
  const formattedDate = formatDateTimeString(defaultProps.date.getTime());
  const doMount = (props = defaultProps) => {
    const copiedMock = ref(false);
    const copyMock = vi.fn(() => {
      copiedMock.value = true;
      return Promise.resolve();
    });
    useClipboardMock.mockReturnValue({
      copy: copyMock,
      copied: copiedMock,
    });
    const wrapper = mount(RFCErrorToastTemplate, {
      props,
    });
    return {
      wrapper,
      copyMock,
    };
  };

  it("is collapsed initially", () => {
    const { wrapper } = doMount();
    expect(wrapper.find(".title").text()).toBe(defaultProps.title);
    expect(wrapper.text()).toContain("Show details");
    expect(wrapper.text()).not.toContain("Status: 500");
    expect(wrapper.text()).not.toContain(`Date: ${formattedDate}`);
    expect(wrapper.text()).not.toContain(
      `Request id: ${defaultProps.requestId}`,
    );
  });

  it("renders relevant information", async () => {
    const { wrapper } = doMount();
    await wrapper.find("button").trigger("click");
    expect(wrapper.find(".title").text()).toBe(defaultProps.title);
    const details = wrapper.find(".details").text();
    defaultProps.details.forEach((item) => {
      expect(details).toContain(item);
    });
    expect(wrapper.text()).toContain("Status: 500");
    expect(wrapper.text()).toContain(`Date: ${formattedDate}`);
    expect(wrapper.text()).toContain(`Request id: ${defaultProps.requestId}`);
  });

  it("renders optional errorId", async () => {
    const { wrapper } = doMount({
      ...defaultProps,
      errorId: "extremely-fatal-error",
    } as any);
    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("extremely-fatal-error");
  });

  it("handles stacktrace", async () => {
    const { wrapper, copyMock } = doMount({
      ...defaultProps,
      stacktrace: "cannot read property explosion of undefined at foo.bar.baz",
      canCopyToClipboard: false,
    } as any);

    await wrapper.find("[data-test-id='show-details']").trigger("click");

    expect(wrapper.text()).not.toContain("Stacktrace: Part of clipboard text");
    await wrapper.setProps({ canCopyToClipboard: true });
    expect(wrapper.text()).toContain("Stacktrace: Part of clipboard text");
    await wrapper.find("[data-test-id='copy-to-clipboard']").trigger("click");
    expect(copyMock).toHaveBeenCalled();
  });

  it("copies to clipboard", async () => {
    const { wrapper, copyMock } = doMount({
      ...defaultProps,
      errorId: "extremely-fatal-error",
    } as any);
    expect(useClipboardMock).toHaveBeenCalled();
    await wrapper.find("button").trigger("click"); // first show details
    await wrapper.find("button").trigger("click"); // then the clipboard button
    expect(copyMock).toHaveBeenCalled();
    // @ts-expect-error Tuple type '[]' of length '0' has no element at index '0'.
    expect(copyMock.mock.calls[0][0]).toEqual(expect.any(String));
  });

  it("updates button text on copy", async () => {
    const { wrapper } = doMount();
    await wrapper.find("button").trigger("click");
    expect(wrapper.find("button").text()).toBe("Copy error to clipboard");
    await wrapper.find("button").trigger("click");
    expect(wrapper.find("button").text()).toBe("Error was copied");
  });

  it("uses custom serializeErrorForClipboard", async () => {
    const serializeErrorForClipboard = vi.fn(() => "custom clipboard text");
    const { wrapper, copyMock } = doMount({
      ...defaultProps,
      serializeErrorForClipboard,
    } as any);

    await wrapper.find("button").trigger("click");
    await wrapper.find("button").trigger("click");

    expect(serializeErrorForClipboard).toHaveBeenCalledWith(
      expect.objectContaining({
        headline: defaultProps.headline,
        title: defaultProps.title,
      }),
      defaultProps.headline,
      expect.any(Function),
    );
    expect(copyMock).toHaveBeenCalledWith("custom clipboard text");
  });

  it("emits showMore event", async () => {
    const { wrapper } = doMount();
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("showMore")).toBeDefined();
  });
});
