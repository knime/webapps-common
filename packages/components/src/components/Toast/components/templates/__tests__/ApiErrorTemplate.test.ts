import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";

import ApiErrorTemplate from "../ApiErrorTemplate.vue";

const { useClipboardMock } = vi.hoisted(() => ({
  useClipboardMock: vi.fn(),
}));

vi.mock("@vueuse/core", () => ({
  useClipboard: useClipboardMock,
}));

describe("ApiErrorTemplate", () => {
  const defaultProps = {
    headline: "Toast headline",
    title: "There was an error",
    details: ["Here", "are", "the", "deets"],
    status: 500,
    date: new Date(2012, 11, 12),
    requestId: "123456789",
  };
  const doMount = (props = defaultProps) => {
    const copiedMock = ref(false);
    const copyMock = vi.fn(() => {
      copiedMock.value = true;
    });
    useClipboardMock.mockReturnValue({
      copy: copyMock,
      copied: copiedMock,
    });
    const wrapper = mount(ApiErrorTemplate, {
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
    expect(wrapper.text()).not.toContain("Date: Dec 12, 2012, 12:00:00 AM");
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
    expect(wrapper.text()).toContain("Date: Dec 12, 2012, 12:00:00 AM");
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

  it("copies to clipboard", async () => {
    const { wrapper, copyMock } = doMount({
      ...defaultProps,
      errorId: "extremely-fatal-error",
    } as any);
    expect(useClipboardMock).toHaveBeenCalled();
    await wrapper.find("button").trigger("click"); // first show details
    await wrapper.find("button").trigger("click"); // then the clipboard button
    expect(copyMock).toHaveBeenCalled();
    // @ts-ignore
    const copiedText = copyMock.mock.calls[0][0];
    expect(copiedText).toContain(defaultProps.title);
    defaultProps.details.forEach((item) => {
      expect(copiedText).toContain(item);
    });
    expect(copiedText).toContain("Status: 500");
    expect(copiedText).toContain("Date: Dec 12, 2012, 12:00:00 AM");
    expect(copiedText).toContain(`Request Id: ${defaultProps.requestId}`);
    expect(copiedText).toContain("Error Id: extremely-fatal-error");
  });

  it("updates button text on copy", async () => {
    const { wrapper } = doMount();
    await wrapper.find("button").trigger("click");
    expect(wrapper.find("button").text()).toBe("Copy error to clipboard");
    await wrapper.find("button").trigger("click");
    expect(wrapper.find("button").text()).toBe("Error was copied");
  });
});
