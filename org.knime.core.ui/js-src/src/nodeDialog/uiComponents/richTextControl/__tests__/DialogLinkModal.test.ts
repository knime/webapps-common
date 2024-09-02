import { shallowMount } from "@vue/test-utils";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import DialogLinkModal, { type Props } from "../DialogLinkModal.vue";
import { ref, nextTick } from "vue";
import { CreateLinkModal } from "@knime/rich-text-editor";

describe("DialogLinkModal", () => {
  let props: Props,
    showModalSpy: () => void,
    closeSpy: () => void,
    propsUrlValidator: Mock<() => boolean>;

  const shallowMountModal = () => shallowMount(DialogLinkModal, { props });

  let wrapper: ReturnType<typeof shallowMountModal>;

  beforeEach(() => {
    propsUrlValidator = vi.fn();
    props = {
      linkTool: {
        props: {
          text: ref("text"),
          url: ref("url"),
          isActive: ref(false),
          isEdit: ref(false),
          urlValidator: propsUrlValidator,
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

  describe("flow variable urls", () => {
    let urlValidator: (url: string) => boolean;

    beforeEach(() => {
      urlValidator = wrapper
        .findComponent(CreateLinkModal)
        .props("urlValidator");
    });

    it("allows flow variable urls", () => {
      expect(urlValidator('$$["myFlowVariable"]')).toBe(true);
    });

    it.each([
      ["", true],
      ["dis", false],
    ])("%sallows same urls as per default", (_, allowed) => {
      propsUrlValidator.mockReturnValueOnce(allowed);
      expect(urlValidator("maybeAUrl")).toBe(allowed);
    });
  });
});
