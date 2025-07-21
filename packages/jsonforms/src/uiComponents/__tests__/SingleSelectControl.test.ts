import { type Mock, beforeEach, describe, expect, it } from "vitest";
import { type VueWrapper } from "@vue/test-utils";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
  useInitialProvidedState,
} from "../../../testUtils";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import SingleSelectControl from "../SingleSelectControl.vue";
import LoadingDropdown from "../loading/LoadingDropdown.vue";

describe("SingleSelectControl", () => {
  let props: VueControlTestProps<typeof SingleSelectControl>,
    wrapper: VueWrapper,
    changeValue: Mock,
    provideChoices: (choices: IdAndText[]) => Promise<void>;

  const labelForId = "myLabelForId";

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        data: {
          specialChoice: "first",
        },
        schema: {},
        uischema: {
          type: "Control",
          scope: "#/properties/test",
          options: {
            specialChoices: [
              {
                id: "first",
                text: "First",
              },
              {
                id: "second",
                text: "Second",
              },
            ],
          },
          providedOptions: ["possibleValues"],
        },
      },
      disabled: false,
      labelForId,
      isValid: true,
    };

    const { addStateProviderListener, provideState } =
      useInitialProvidedState<IdAndText[]>();
    provideChoices = provideState;
    ({ wrapper, changeValue } = mountJsonFormsControlLabelContent(
      SingleSelectControl,
      {
        props,
        provide: {
          addStateProviderListener,
        },
      },
    ));
  });

  it("renders a loading dropdown initially", () => {
    expect(wrapper.findComponent(LoadingDropdown).exists()).toBe(true);

    expect(wrapper.findComponent(LoadingDropdown).props()).toEqual({
      ariaLabel: "defaultLabel",
      disabled: false,
      id: "myLabelForId",
      modelValue: "__special__first",
      possibleValues: null,
    });
  });

  it("loads regular choices", async () => {
    await provideChoices([
      {
        id: "aRegularChoice",
        text: "A Regular Choice",
      },
    ]);

    expect(
      wrapper.findComponent(LoadingDropdown).props("possibleValues"),
    ).toEqual([
      { id: "__special__first", text: "First", isSpecial: true },
      { id: "__special__second", text: "Second", isSpecial: true },
      { id: "__regular__aRegularChoice", text: "A Regular Choice" },
    ]);
  });

  it("calls changeValue when selecting a value in the dropdown", async () => {
    await provideChoices([
      {
        id: "aRegularChoice",
        text: "A Regular Choice",
      },
    ]);

    await wrapper
      .findComponent(LoadingDropdown)
      .vm.$emit("update:modelValue", "__regular__aRegularChoice");
    expect(changeValue).toHaveBeenCalledWith({
      regularChoice: "aRegularChoice",
    });

    await wrapper
      .findComponent(LoadingDropdown)
      .vm.$emit("update:modelValue", "__special__second");
    expect(changeValue).toHaveBeenCalledWith({ specialChoice: "second" });
  });

  it("handles missing values by displaying original value as id", async () => {
    props.control.data = { regularChoice: "missingChoice" };
    const { addStateProviderListener, provideState } =
      useInitialProvidedState<IdAndText[]>();
    provideChoices = provideState;
    ({ wrapper, changeValue } = mountJsonFormsControlLabelContent(
      SingleSelectControl,
      {
        props,
        provide: {
          addStateProviderListener,
        },
      },
    ));

    expect(wrapper.findComponent(LoadingDropdown).props("modelValue")).toBe(
      "__regular__missingChoice",
    );

    await provideChoices([
      {
        id: "existingChoice",
        text: "Existing Choice",
      },
    ]);

    expect(wrapper.findComponent(LoadingDropdown).props("modelValue")).toBe(
      "missingChoice",
    );
  });
});
