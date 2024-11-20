import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import { shallowMount } from "@vue/test-utils";

import { CreateLinkModal } from "@knime/rich-text-editor";

import DialogLinkModal, { type Props } from "../DialogLinkModal.vue";

describe("DialogLinkModal", () => {
  let props: Props, showModalSpy: () => void, closeSpy: () => void;

  const shallowMountModal = () => shallowMount(DialogLinkModal, { props });

  let wrapper: ReturnType<typeof shallowMountModal>;

  beforeEach(() => {
    props = {
      linkTool: {
        props: {
          text: ref("text"),
          url: ref("url"),
          isActive: ref(false),
          isEdit: ref(false),
          urlValidator: vi.fn(),
        },
        events: {
          addLink: vi.fn(),
          removeLink: vi.fn(),
          cancelAddLink: vi.fn(),
        },
      },
    };
    wrapper = shallowMountModal();
    showModalSpy = vi.fn();
    closeSpy = vi.fn();
    wrapper.find("dialog").element.showModal = showModalSpy;
    wrapper.find("dialog").element.close = closeSpy;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders", () => {
    expect(wrapper.find("dialog").exists()).toBe(true);
    expect(wrapper.find("dialog").isVisible()).toBe(false);
    expect(wrapper.findComponent(CreateLinkModal).exists()).toBe(true);
    expect(wrapper.findComponent(CreateLinkModal).props("isActive").value).toBe(
      false,
    );
  });

  it("shows modal", async () => {
    props.linkTool.props.isActive.value = true;
    await nextTick();
    expect(showModalSpy).toHaveBeenCalled();
    expect(wrapper.findComponent(CreateLinkModal).props("isActive").value).toBe(
      false,
    );
    await nextTick();
    expect(wrapper.findComponent(CreateLinkModal).props("isActive").value).toBe(
      true,
    );
  });

  it("closes modal", async () => {
    props.linkTool.props.isActive.value = true;
    await nextTick();
    await nextTick();
    expect(wrapper.findComponent(CreateLinkModal).props("isActive").value).toBe(
      true,
    );
    props.linkTool.props.isActive.value = false;
    await nextTick();
    expect(wrapper.findComponent(CreateLinkModal).props("isActive").value).toBe(
      false,
    );
    vi.runAllTimers();
    expect(closeSpy).toHaveBeenCalled();
  });
});
