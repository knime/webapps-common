import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import {
  getDate,
  getDayOfYear,
  getHours,
  getMilliseconds,
  getMinutes,
  getMonth,
  getSeconds,
  getYear,
} from "date-fns";

import Dropdown from "../../Dropdown/Dropdown.vue";
import TimePartInput from "../../TimePartInput/TimePartInput.vue";
import DateTimeInput from "../DateTimeInput.vue";

// TODO fix test
describe("DateTimeInput.vue", () => {
  let context, props;

  beforeEach(() => {
    props = {
      modelValue: new Date("2020-05-03T09:54:55"),
      id: "dateTimeInputID",
      min: null,
      max: null,
      isValid: true,
      showSeconds: true,
      showMilliseconds: true,
      showTime: true,
      showDate: true,
      required: false,
      timezone: "Europe/Berlin",
    };
    context = {
      global: {
        stubs: {
          DatePicker: "<div></div>",
        },
      },
    };
  });

  beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  describe("renders", () => {
    it("renders with datepicker and time", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      expect(wrapper.html()).toBeTruthy();
      expect(wrapper.isVisible()).toBeTruthy();
      expect(
        wrapper.findComponent({ ref: "datePicker" }).isVisible(),
      ).toBeTruthy();
      // eslint-disable-next-line no-magic-numbers
      expect(wrapper.findAllComponents(TimePartInput).length).toBe(4);
      expect(wrapper.findComponent(Dropdown).exists()).toBe(false);
    });

    it("renders with datepicker and time and timezone", () => {
      const localProps = {
        ...props,
        showTimezone: true,
      };
      let wrapper = mount(DateTimeInput, {
        ...context,
        props: localProps,
      });
      expect(wrapper.html()).toBeTruthy();
      expect(wrapper.isVisible()).toBeTruthy();
      expect(
        wrapper.findComponent({ ref: "datePicker" }).isVisible(),
      ).toBeTruthy();
      // eslint-disable-next-line no-magic-numbers
      expect(wrapper.findAllComponents(TimePartInput).length).toBe(4);
      expect(wrapper.findComponent(Dropdown).exists()).toBe(true);
    });

    it("renders without time", () => {
      props.showTime = false;
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      expect(wrapper.html()).toBeTruthy();
      expect(wrapper.isVisible()).toBeTruthy();
      expect(wrapper.findComponent({ ref: "datePicker" }).isVisible()).toBe(
        true,
      );
      expect(wrapper.findAllComponents(TimePartInput).length === 0).toBe(true);
    });

    it("renders without date", () => {
      props.showDate = false;
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      expect(wrapper.html()).toBeTruthy();
      expect(wrapper.isVisible()).toBeTruthy();
      expect(wrapper.findComponent({ ref: "datePicker" }).exists()).toBeFalsy();
      expect(wrapper.findAllComponents(TimePartInput).length > 0).toBe(true);
    });

    it("renders without milliseconds and seconds", () => {
      props.showSeconds = false;
      props.showMilliseconds = false;
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      expect(wrapper.findAllComponents(TimePartInput).length).toBe(2);
    });

    it("has default props", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props: {
          modelValue: new Date(),
        },
      });
      expect(wrapper.html()).toBeTruthy();
      expect(wrapper.isVisible()).toBeTruthy();
      expect(
        wrapper.findComponent({ ref: "datePicker" }).isVisible(),
      ).toBeTruthy();
    });

    it.todo("renders disabled state", () => {
      // TODO add test for disabled state
    });
  });

  describe("updates", () => {
    it("updates date on datepicker changes", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      const d = new Date("2020-05-05T15:34:25");
      wrapper
        .findComponent({ ref: "datePicker" })
        .vm.$emit("update:modelValue", d);
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(
        getDayOfYear(wrapper.emitted("update:modelValue")[0][0]),
      ).toStrictEqual(getDayOfYear(d));
    });

    it("updates date if datepicker emits @update:model-value", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      const d = new Date("2020-05-05T15:34:25");
      wrapper
        .findComponent({ ref: "datePicker" })
        .vm.$emit("update:modelValue", d);

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(
        getDayOfYear(wrapper.emitted("update:modelValue")[0][0]),
      ).toStrictEqual(getDayOfYear(d));
    });

    it("updates date on manual input to date field", () => {
      props.dateFormat = "yyyy-MM-dd";
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      const dayOfMonth = 22;
      const month = 11;
      const year = 2019;
      const input = `${year}-${month}-${dayOfMonth}`;

      // <input> is inside of the slot
      wrapper.vm.onTextInputChange({ target: { value: input } }, () => "");

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      const date = wrapper.emitted("update:modelValue")[0][0];

      expect(getDate(date)).toStrictEqual(dayOfMonth);
      expect(getMonth(date)).toStrictEqual(month - 1);
      expect(getYear(date)).toStrictEqual(year);
    });

    it("does not update date if invalid input is entered", () => {
      props.modelValue = new Date("2020-05-03T09:54:55");
      props.dateFormat = "yyyy-MM-dd";
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      // <input> is inside of the slot
      wrapper.vm.onTextInputChange({ target: { value: "asdf" } }, () => "");

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      const date = wrapper.emitted("update:modelValue")[0][0];

      expect(getDate(date)).toStrictEqual(getDate(props.modelValue));
      expect(getMonth(date)).toStrictEqual(getMonth(props.modelValue));
      expect(getYear(date)).toStrictEqual(getYear(props.modelValue));
    });

    it("updates hours if input changes", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      const hours = 11;
      wrapper
        .findComponent({ ref: "hours" })
        .vm.$emit("update:modelValue", hours);

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(
        getHours(wrapper.emitted("update:modelValue")[0][0]),
      ).toStrictEqual(hours);
      expect(
        getDayOfYear(wrapper.emitted("update:modelValue")[0][0]),
      ).toStrictEqual(getDayOfYear(props.modelValue));
    });

    it("updates minutes if input changes", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      const minutes = 23;
      wrapper
        .findComponent({ ref: "minutes" })
        .vm.$emit("update:modelValue", minutes);

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(
        getMinutes(wrapper.emitted("update:modelValue")[0][0]),
      ).toStrictEqual(minutes);
      expect(
        getDayOfYear(wrapper.emitted("update:modelValue")[0][0]),
      ).toStrictEqual(getDayOfYear(props.modelValue));
    });

    it("updates seconds if input changes", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      const seconds = 12;
      wrapper
        .findComponent({ ref: "seconds" })
        .vm.$emit("update:modelValue", seconds);

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(
        getSeconds(wrapper.emitted("update:modelValue")[0][0]),
      ).toStrictEqual(seconds);
      expect(
        getDayOfYear(wrapper.emitted("update:modelValue")[0][0]),
      ).toStrictEqual(getDayOfYear(props.modelValue));
    });

    it("updates milliseconds if input changes", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      const milliseconds = 234;
      wrapper
        .findComponent({ ref: "milliseconds" })
        .vm.$emit("update:modelValue", milliseconds);

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(
        getMilliseconds(wrapper.emitted("update:modelValue")[0][0]),
      ).toStrictEqual(milliseconds);
      expect(
        getDayOfYear(wrapper.emitted("update:modelValue")[0][0]),
      ).toStrictEqual(getDayOfYear(props.modelValue));
    });

    it("updates date if selected timezone changes", async () => {
      const modelValue = new Date("2020-05-03T10:00:00.000Z");
      const localProps = {
        ...props,
        showTimezone: true,
        timezone: "Europe/Berlin", // +1 hour
        modelValue,
      };
      const newTimeZone = "Europe/Tallinn"; // +2 hour
      const wrapper = mount(DateTimeInput, {
        ...context,
        props: localProps,
      });
      await wrapper
        .findComponent(Dropdown)
        .vm.$emit("update:modelValue", newTimeZone);

      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(
        new Date("2020-05-03T09:00:00.000Z"),
      );
    });
  });

  describe("over- and underflow of time values", () => {
    it("keeps days on overflow of hours", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      wrapper
        .findComponent({ ref: "hours" })
        .vm.$emit("bounds", { type: "max", input: 25, value: 23 });
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(
        new Date("2020-05-03T21:54:55.000Z"),
      );
    });

    it("keeps day on overflow of hours if date is not shown", () => {
      props.showDate = false;
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      wrapper
        .findComponent({ ref: "hours" })
        .vm.$emit("bounds", { type: "max", input: 25, value: 23 });
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });

    it("keeps days on underflow of hours", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      // the -1 is not a relative value but an absolute one
      wrapper
        .findComponent({ ref: "hours" })
        .vm.$emit("bounds", { type: "min", input: -1, value: 0 });
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(
        new Date("2020-05-02T22:54:55.000Z"),
      );
    });

    it("keeps hours on overflow of minutes", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      wrapper
        .findComponent({ ref: "minutes" })
        .vm.$emit("bounds", { type: "min", input: 63, value: 59 });
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(
        new Date("2020-05-03T07:59:55.000Z"),
      );
    });

    it("keeps hours on underflow of minutes", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      wrapper
        .findComponent({ ref: "minutes" })
        .vm.$emit("bounds", { type: "min", input: -1, value: 0 });
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(
        new Date("2020-05-03T07:00:55.000Z"),
      );
    });

    it("keeps minutes on overflow of seconds", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      wrapper
        .findComponent({ ref: "seconds" })
        .vm.$emit("bounds", { type: "max", input: 61, value: 59 });
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(
        new Date("2020-05-03T07:54:59.000Z"),
      );
    });

    it("keeps minutes on underflow of seconds", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      wrapper
        .findComponent({ ref: "seconds" })
        .vm.$emit("bounds", { type: "min", input: -1, value: 0 });
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(
        new Date("2020-05-03T07:54:00.000Z"),
      );
    });

    it("keeps seconds on overflow of milliseconds", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      wrapper
        .findComponent({ ref: "milliseconds" })
        .vm.$emit("bounds", { type: "max", input: 1000, value: 999 });
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(
        new Date("2020-05-03T07:54:55.999Z"),
      );
    });

    it("keeps seconds on underflow of milliseconds", () => {
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      wrapper
        .findComponent({ ref: "milliseconds" })
        .vm.$emit("bounds", { type: "min", input: -1, value: 0 });
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual(
        new Date("2020-05-03T07:54:55.000Z"),
      );
    });
  });

  describe("validates", () => {
    it("invalidates values earlier than min date", () => {
      props.modelValue = new Date("2020-05-03T09:54:50");
      props.min = new Date("2020-05-03T09:54:54");
      props.max = new Date("2020-05-03T09:54:56");
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });
      const validation = wrapper.vm.validate();
      expect(validation.isValid).toBeFalsy();
      expect(validation.errorMessage).toBe(
        "2020-05-03 09:54:50 is before minimum 2020-05-03 09:54:54",
      );
    });

    it("invalidates values later than max date", () => {
      props.modelValue = new Date("2020-05-03T09:54:59");
      props.max = new Date("2020-05-02T09:54:56");
      props.dateFormat = "yyy-MM-dd";
      props.showTime = false;
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });

      const validation = wrapper.vm.validate();
      expect(validation.isValid).toBeFalsy();
      expect(validation.errorMessage).toBe(
        "2020-05-03 is after maximum 2020-05-02",
      );
    });

    it("invalidates values later than max date (time only)", () => {
      props.modelValue = new Date("2020-05-03T14:54:59");
      props.max = new Date("2020-05-04T14:54:56");
      props.timeFormat = "HH:mm:ss";
      props.showTime = true;
      props.showDate = false;
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });

      const validation = wrapper.vm.validate();
      expect(validation.isValid).toBeFalsy();
      expect(validation.errorMessage).toBe(
        "14:54:59 is after maximum 14:54:56",
      );
    });

    it("invalidates values later than max date via @update:model-value", () => {
      props.max = new Date("2020-05-05T09:54:56");
      props.dateFormat = "yyy-MM-dd";
      props.showTime = false;
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });

      wrapper
        .findComponent({ ref: "datePicker" })
        .vm.$emit("update:modelValue", new Date("2020-05-06T09:54:56"));

      const validation = wrapper.vm.validate();
      expect(validation.isValid).toBeFalsy();
      expect(validation.errorMessage).toBe(
        "2020-05-06 is after maximum 2020-05-05",
      );
    });

    it("invalidates null value if required", () => {
      props.modelValue = new Date("");
      props.required = true;
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });

      const validation = wrapper.vm.validate();
      expect(validation.isValid).toBeFalsy();
      expect(validation.errorMessage).toBe("Please input a valid date");
    });

    it("validates values in the given min/max range", () => {
      props.modelValue = new Date("2020-05-03T09:54:55");
      props.min = new Date("2020-05-03T09:54:54");
      props.max = new Date("2020-05-03T09:54:56");
      props.dateFormat = "yyy-MM-dd";
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });

      const validation = wrapper.vm.validate();
      expect(validation.isValid).toBeTruthy();
    });

    it("ignores max if none given", () => {
      props.modelValue = new Date("2020-05-03T09:54:55");
      props.min = new Date("2020-05-03T09:54:54");
      props.max = null;
      props.dateFormat = "yyy-MM-dd";
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });

      const validation = wrapper.vm.validate();
      expect(validation.isValid).toBeTruthy();
    });

    it("ignores min if none given", () => {
      props.modelValue = new Date("2020-05-03T09:54:53");
      props.min = null;
      props.max = new Date("2020-05-03T09:54:54");
      props.dateFormat = "yyy-MM-dd";
      let wrapper = mount(DateTimeInput, {
        ...context,
        props,
      });

      const validation = wrapper.vm.validate();
      expect(validation.isValid).toBeTruthy();
    });
  });
});
