/* eslint-disable vitest/max-nested-describe */
import { flushPromises, shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SortList, { type Props } from "../SortList.vue";
import MultiselectListBox from "../MultiselectListBox.vue";
import FunctionButton from "../../FunctionButton.vue";
import ArrowDownIcon from "../../../assets/img/icons/arrow-down.svg";
import ArrowUpIcon from "../../../assets/img/icons/arrow-up.svg";
import ArrowDownloadIcon from "../../../assets/img/icons/arrow-download.svg";
import ArrowUploadIcon from "../../../assets/img/icons/arrows-upload.svg";
import type { FunctionalComponent } from "vue";

describe("SortList.vue", () => {
  let props: Props;

  beforeEach(() => {
    props = {
      modelValue: ["test1", "test3", "test2", "test4"],
      ariaLabel: "testAriaLabel",
      possibleValues: [
        { id: "test1", text: "Test1" },
        { id: "test2", text: "Test2" },
        { id: "test3", text: "Test3" },
        { id: "test4", text: "Test4" },
      ],
    };
  });

  it("renders MultiselectListBox and FunctionButtons", () => {
    const wrapper = shallowMount(SortList, { props });
    expect(wrapper.findComponent(MultiselectListBox).exists()).toBeTruthy();
    expect(wrapper.findAllComponents(FunctionButton).length).toBe(4);
  });

  it("passes possible values to the list box", () => {
    const wrapper = shallowMount(SortList, { props });
    expect(
      wrapper.findComponent(MultiselectListBox).props().possibleValues,
    ).toStrictEqual([
      props.possibleValues[0],
      props.possibleValues[2],
      props.possibleValues[1],
      props.possibleValues[3],
    ]);
  });

  it("adds invalid possible values for modelValues entries that are not present in the input possible values", () => {
    const missingId = "missing";
    props.modelValue = [...props.modelValue, missingId];
    const wrapper = shallowMount(SortList, { props });
    expect(
      wrapper.findComponent(MultiselectListBox).props().possibleValues?.[4],
    ).toStrictEqual({
      id: missingId,
      text: `(MISSING) ${missingId}`,
      invalid: true,
    });
  });

  it("passes empty selection to list box initially", () => {
    const wrapper = shallowMount(SortList, { props });
    expect(
      wrapper.findComponent(MultiselectListBox).props().modelValue,
    ).toStrictEqual([]);
  });

  it("sets selected values from list box", async () => {
    const wrapper = shallowMount(SortList, { props });
    const selectedValues = [props.modelValue[1]];
    const listBox = wrapper.findComponent(MultiselectListBox);
    await listBox.vm.$emit("update:modelValue", selectedValues);
    expect(listBox.props().modelValue).toStrictEqual(selectedValues);
  });

  it("removes missing selected on new model value", async () => {
    const wrapper = shallowMount(SortList, { props });
    const selectedValues = [props.modelValue[1], props.modelValue[2]];
    const listBox = wrapper.findComponent(MultiselectListBox);
    await listBox.vm.$emit("update:modelValue", selectedValues);
    expect(listBox.props().modelValue).toStrictEqual(selectedValues);
    const newModelValue = [props.modelValue[0], props.modelValue[2]];
    await wrapper.setProps({ modelValue: newModelValue });
    expect(listBox.props().modelValue).toStrictEqual([props.modelValue[2]]);
  });

  it("disables button when none selected", async () => {
    const wrapper = shallowMount(SortList, { props });
    const expectButtonsDisabled = () =>
      wrapper
        .findAllComponents(FunctionButton)
        .forEach((functionButton) =>
          expect(functionButton.props().disabled).toBeTruthy(),
        );
    const expectButtonsEnabled = () =>
      wrapper
        .findAllComponents(FunctionButton)
        .forEach((functionButton) =>
          expect(functionButton.props().disabled).toBeFalsy(),
        );
    expectButtonsDisabled();
    const listBox = wrapper.findComponent(MultiselectListBox);
    await listBox.vm.$emit("update:modelValue", [props.modelValue[1]]);
    expectButtonsEnabled();
    await listBox.vm.$emit("update:modelValue", []);
    expectButtonsDisabled();
  });

  describe("moving items", () => {
    const shallowMountSortList = () => shallowMount(SortList, { props });

    let wrapper: ReturnType<typeof shallowMountSortList>,
      scrollUpIntoView: () => {},
      scrollDownIntoView: () => {},
      setCurrentKeyNavIndex: () => {};

    beforeEach(() => {
      scrollUpIntoView = vi.fn();
      scrollDownIntoView = vi.fn();
      setCurrentKeyNavIndex = vi.fn();
      const MultiselectListBoxStub = {
        props: {
          id: {
            type: String,
          },
          modelValue: {
            type: Array,
          },
          disabled: {
            type: Boolean,
          },
          withIsEmptyState: {
            type: Boolean,
          },
          emptyStateLabel: {
            type: String,
          },
          emptyStateComponent: {
            type: Object,
          },
          multiselectByClick: {
            type: Boolean,
          },
          size: {
            type: Number,
          },
          ariaLabel: {
            type: String,
          },
          possibleValues: {
            type: Array,
          },
        },
        emits: ["update:modelValue", "keydown"],
        methods: {
          scrollDownIntoView,
          scrollUpIntoView,
          setCurrentKeyNavIndex,
        },
        render: () => "",
      };
      wrapper = shallowMount(SortList, {
        props,
        global: {
          stubs: {
            MultiselectListBox: MultiselectListBoxStub,
          },
        },
      });
    });

    const orderToItems = (order: number[]) =>
      order.map((index) => props.modelValue[index]);

    const setSelected = (order: number[]) =>
      wrapper
        .findComponent(MultiselectListBox)
        .vm.$emit("update:modelValue", orderToItems(order));

    const expectFirstChangeInOrder = (order: number[]) =>
      expect(wrapper.emitted("update:modelValue")![0][0]).toStrictEqual(
        orderToItems(order),
      );

    const getButtons = () => wrapper.findAllComponents(FunctionButton);
    const clickButtonWithIcon = (icon: FunctionalComponent<any>) =>
      getButtons()
        .filter((button) => button.findComponent(icon).exists())[0]
        .trigger("click");

    const triggerKeydown = (event: KeyboardEventInit) =>
      wrapper
        .findComponent(MultiselectListBox)
        .vm.$emit("keydown", new KeyboardEvent("keydown", event));

    describe.each([
      [
        "buttons",
        {
          oneUp: () => clickButtonWithIcon(ArrowUpIcon),
          oneDown: () => clickButtonWithIcon(ArrowDownIcon),
          moveToStart: () => clickButtonWithIcon(ArrowUploadIcon),
          moveToEnd: () => clickButtonWithIcon(ArrowDownloadIcon),
        },
      ],
      [
        "keyboard",
        {
          oneUp: () => triggerKeydown({ key: "ArrowUp", altKey: true }),
          oneDown: () => triggerKeydown({ key: "ArrowDown", altKey: true }),
          moveToStart: () => triggerKeydown({ key: "Home", altKey: true }),
          moveToEnd: () => triggerKeydown({ key: "End", altKey: true }),
        },
      ],
    ])("per %s", (_, { oneUp, oneDown, moveToStart, moveToEnd }) => {
      it.each([
        {
          selected: [1],
          result: [1, 0, 2, 3],
          scrollToIndex: -1,
          navigationIndex: 0,
        },
        {
          selected: [1, 3],
          result: [1, 3, 0, 2],
          scrollToIndex: -1,
          navigationIndex: 0,
        },
        {
          selected: [2, 3],
          result: [0, 2, 3, 1],
          scrollToIndex: 0,
          navigationIndex: 1,
        },
      ])(
        "moves items one up (%s)",
        async ({ selected, result, scrollToIndex, navigationIndex }) => {
          setSelected(selected);
          await oneUp();
          expectFirstChangeInOrder(result);
          await flushPromises();
          expect(scrollUpIntoView).toHaveBeenCalledWith(scrollToIndex);
          expect(setCurrentKeyNavIndex).toHaveBeenCalledWith(navigationIndex);
        },
      );

      it.each([
        {
          selected: [1],
          result: [0, 2, 1, 3],
          scrollToIndex: 3,
          navigationIndex: 2,
        },
        {
          selected: [1, 3],
          result: [0, 2, 1, 3],
          scrollToIndex: 5,
          navigationIndex: 4,
        },
        {
          selected: [0, 1],
          result: [2, 0, 1, 3],
          scrollToIndex: 3,
          navigationIndex: 2,
        },
      ])(
        "moves items one down (%s)",
        async ({ selected, result, scrollToIndex, navigationIndex }) => {
          setSelected(selected);
          await oneDown();
          expectFirstChangeInOrder(result);
          await flushPromises();
          expect(scrollDownIntoView).toHaveBeenCalledWith(scrollToIndex);
          expect(setCurrentKeyNavIndex).toHaveBeenCalledWith(navigationIndex);
        },
      );

      it.each([
        {
          selected: [1],
          result: [0, 2, 3, 1],
        },
        {
          selected: [1, 3],
          result: [0, 2, 1, 3],
        },
        {
          selected: [0, 1],
          result: [2, 3, 0, 1],
        },
      ])("moves items to the end (%s)", async ({ selected, result }) => {
        setSelected(selected);
        await moveToEnd();
        expectFirstChangeInOrder(result);
      });

      it.each([
        {
          selected: [1],
          result: [1, 0, 2, 3],
        },
        {
          selected: [1, 3],
          result: [1, 3, 0, 2],
        },
        {
          selected: [2, 3],
          result: [2, 3, 0, 1],
        },
      ])("moves items to the start (%s)", async ({ selected, result }) => {
        setSelected(selected);
        await moveToStart();
        expectFirstChangeInOrder(result);
      });
    });
  });
});
