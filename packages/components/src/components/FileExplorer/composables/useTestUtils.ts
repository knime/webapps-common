import { vi } from "vitest";
import { h } from "vue";
import type { VueWrapper } from "@vue/test-utils";

type IntersectionObserverMockType = {
  // @ts-expect-error Call signature, which lacks return-type annotation, implicitly has an 'any' return type
  (callback: (...args: never[]) => unknown);
  __trigger__: (isIntersecting: boolean) => void;
};

// @ts-expect-error Property '__trigger__' is missing in type '(this: any, callback: (...args: any[]) => any) => void' but required in type 'IntersectionObserverMockType'.
export const MockIntersectionObserver: IntersectionObserverMockType =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function MockIntersectionObserver(this: any, callback) {
    this.callbackRef = callback;
    this.element = null;

    // @ts-expect-error Property '__trigger__' does not exist on type '(this: any, callback: (...args: any[]) => any) => void'.
    MockIntersectionObserver.__trigger__ = (isIntersecting = false) => {
      this.callbackRef([{ isIntersecting }]);
    };

    this.observe = function (element: unknown) {
      this.element = element;
    };

    const disconnect = vi.fn();
    this.disconnect = disconnect;
  };

export const createSlottedChildComponent = (params: {
  slottedComponentTemplate: string;
  slottedComponentData?: unknown;
}) => {
  // Dummy component to be inserted in the slot
  const mockComponentInSlot = {
    name: "SlottedChild",
    template: params.slottedComponentTemplate,
    props: {
      scope: {
        type: Object,
        required: true,
      },
    },
    data() {
      return params.slottedComponentData || {};
    },
  };

  /**
   * Function used to render a slot that has a dummy component in it
   */
  const renderSlot = (props: unknown) =>
    h(mockComponentInSlot, { scope: props });

  /**
   * Given a test component wrapper, this function is used to find the
   * mocked component in the slot
   */
  const getSlottedChildComponent = (wrapper: VueWrapper<unknown>) =>
    wrapper.findComponent({ name: "SlottedChild" });

  const getSlottedStubProp = ({
    wrapper,
    propName,
  }: {
    wrapper: VueWrapper<unknown>;
    propName: string;
  }) => {
    // access the `scope` prop of the dummy slotted component and get value that was injected by
    // the parent component via the slot props
    return getSlottedChildComponent(wrapper).props("scope")[propName];
  };

  return {
    getSlottedChildComponent,
    mockComponentInSlot,
    getSlottedStubProp,
    renderSlot,
  };
};
