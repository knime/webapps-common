import FSLocationTextControl, {
  type Props as FSLocationTextInputProps,
  prefixes,
} from "../FSLocationTextControl.vue";
import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";
import { InputField } from "@knime/components";

describe("FSLocationTextControl.vue", () => {
  const currentSpacePrefix = "knime://knime.space/";
  const embeddedDataPrefix = "knime://knime.workflow.data/";
  let props: FSLocationTextInputProps;

  beforeEach(() => {
    props = {
      modelValue: {
        path: "myPath",
        timeout: 1000,
        fsCategory: "relative-to-current-hubspace",
      },
      disabled: false,
      isLocal: false,
    };
  });

  const absolute = (path: string) => `absolute/path/to/${path}`;
  const mountFsLocationTextInput = async () => {
    const dataServiceSpy = vi.fn(
      ({
        options,
      }: {
        method?: string | undefined;
        options: [unknown, unknown, string];
      }) => {
        return Promise.resolve({ path: absolute(options[2]) });
      },
    );
    const wrapper = shallowMount(FSLocationTextControl, {
      props,
      global: {
        provide: {
          getData: dataServiceSpy,
        },
      },
    });

    await flushPromises();
    return wrapper;
  };

  it("renders", async () => {
    const inputField = (await mountFsLocationTextInput()).findComponent(
      InputField,
    );
    expect(inputField.exists()).toBeTruthy();
  });

  it("shows relative-to-current-hubspace path", async () => {
    const path = "foo";
    props.modelValue = {
      path,
      timeout: 1000,
      fsCategory: "relative-to-current-hubspace",
    };
    expect(
      (await mountFsLocationTextInput()).findComponent(InputField).props()
        .modelValue,
    ).toBe(currentSpacePrefix + path);
  });

  it("shows relative-to-embedded-data path", async () => {
    const path = "foo";
    props.modelValue = {
      path,
      timeout: 1000,
      fsCategory: "relative-to-embedded-data",
    };
    expect(
      (await mountFsLocationTextInput()).findComponent(InputField).props()
        .modelValue,
    ).toBe(embeddedDataPrefix + path);
  });

  it("shows CUSTOM_URL path", async () => {
    const path = "foo://bar";
    props.modelValue = {
      path,
      timeout: 1000,
      fsCategory: "CUSTOM_URL",
    };
    expect(
      (await mountFsLocationTextInput()).findComponent(InputField).props()
        .modelValue,
    ).toBe(path);
  });

  it("shows local path", async () => {
    props.modelValue.fsCategory = "LOCAL";
    const path = "myLocalPath";
    props.modelValue.path = path;
    expect(
      (await mountFsLocationTextInput()).findComponent(InputField).props()
        .modelValue,
    ).toBe(absolute(path));
  });

  it("shows connected path", async () => {
    props.modelValue.fsCategory = "CONNECTED";
    props.portIndex = 1;
    const path = "myLocalPath";
    props.modelValue.path = path;
    expect(
      (await mountFsLocationTextInput()).findComponent(InputField).props()
        .modelValue,
    ).toBe(path);
  });

  it("shows non-supported paths", async () => {
    const fsToString = "myFsPathString";
    props.modelValue.fsCategory = "RELATIVE" as any;
    props.modelValue.context = {
      fsToString,
    };
    expect(
      (await mountFsLocationTextInput()).findComponent(InputField).props()
        .modelValue,
    ).toBe(fsToString);
  });

  it.each([
    "LOCAL",
    "relative-to-current-hubspace",
    "relative-to-embedded-data",
    "CUSTOM_URL",
  ] as const)(
    "shows %s as non-supported when portIndex is present",
    async (fsCategory) => {
      const fsToString = "myFsPathString";
      props.modelValue.fsCategory = fsCategory;
      props.portIndex = 1;
      props.modelValue.context = {
        fsToString,
      };
      expect(
        (await mountFsLocationTextInput()).findComponent(InputField).props()
          .modelValue,
      ).toBe(fsToString);
    },
  );

  it("shows CONNECTED as non-supported when no portIndex is present", async () => {
    const fsToString = "myFsPathString";
    props.modelValue.fsCategory = "CONNECTED";
    props.modelValue.context = {
      fsToString,
    };
    expect(
      (await mountFsLocationTextInput()).findComponent(InputField).props()
        .modelValue,
    ).toBe(fsToString);
  });

  it("shows nothing in case of non-supported paths without context", async () => {
    props.modelValue.fsCategory = "RELATIVE" as any;
    expect(
      (await mountFsLocationTextInput()).findComponent(InputField).props()
        .modelValue,
    ).toBe("");
  });

  it.each(prefixes)(
    "emits %s FS location on text input prefixed with %s",
    async (fsCategory, prefix) => {
      const wrapper = await mountFsLocationTextInput();
      const path = "foo";
      wrapper
        .findComponent(InputField)
        .vm.$emit("update:model-value", prefix + path);
      expect(wrapper.emitted("update:modelValue")).toStrictEqual([
        [
          {
            fsCategory,
            path,
            timeout: wrapper.props().modelValue.timeout,
          },
        ],
      ]);
    },
  );

  it("emits CUSTOM_URL FS location on text input prefixed with valid scheme", async () => {
    const wrapper = await mountFsLocationTextInput();
    const path = "foo://bar";
    wrapper.findComponent(InputField).vm.$emit("update:model-value", path);
    expect(wrapper.emitted("update:modelValue")).toStrictEqual([
      [
        {
          fsCategory: "CUSTOM_URL",
          path,
          timeout: wrapper.props().modelValue.timeout,
        },
      ],
    ]);
  });

  it("emits relative-to-current-hubspace FS location on text input prefixed without valid scheme", async () => {
    const wrapper = await mountFsLocationTextInput();
    const path = "foo";
    wrapper.findComponent(InputField).vm.$emit("update:model-value", path);
    expect(wrapper.emitted("update:modelValue")).toStrictEqual([
      [
        {
          fsCategory: "relative-to-current-hubspace",
          path,
          timeout: wrapper.props().modelValue.timeout,
        },
      ],
    ]);
  });

  it("emits LOCAL FS location on text input in case of isLocal", async () => {
    props.isLocal = true;
    const wrapper = await mountFsLocationTextInput();
    const path = "foo";
    wrapper.findComponent(InputField).vm.$emit("update:model-value", path);
    expect(wrapper.emitted("update:modelValue")).toStrictEqual([
      [
        {
          fsCategory: "LOCAL",
          path,
          timeout: wrapper.props().modelValue.timeout,
        },
      ],
    ]);
  });

  describe("connected via port", () => {
    beforeEach(() => {
      props.portIndex = 1;
    });

    it("emits CONNECTED FS location on text input", async () => {
      const wrapper = await mountFsLocationTextInput();
      const path = "foo";
      wrapper.findComponent(InputField).vm.$emit("update:model-value", path);
      expect(wrapper.emitted("update:modelValue")).toStrictEqual([
        [
          {
            fsCategory: "CONNECTED",
            path,
            timeout: wrapper.props().modelValue.timeout,
            context: {
              fsToString: "",
              fsSpecifier: undefined,
            },
          },
        ],
      ]);
    });

    it("adds fileSystemSpecifier if present", async () => {
      const fsSpecifier = "mySpecifier";
      props.fileSystemSpecifier = fsSpecifier;
      const wrapper = await mountFsLocationTextInput();
      const path = "foo";
      wrapper.findComponent(InputField).vm.$emit("update:model-value", path);
      expect(wrapper.emitted("update:modelValue")).toStrictEqual([
        [
          {
            fsCategory: "CONNECTED",
            path,
            timeout: wrapper.props().modelValue.timeout,
            context: {
              fsToString: "",
              fsSpecifier,
            },
          },
        ],
      ]);
    });
  });
});
