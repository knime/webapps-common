import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";

import LocalDateTime from "../LocalDateTime.vue";
import { formatLocalDateTimeString } from "@knime/utils";

const dateOffset = "2023-01-23T09:15:28+00:00";
const dateUTC = "2023-01-23T09:15:28.000Z";

describe("LocalDateTime.vue", () => {
  it("renders a date", async () => {
    const wrapper = shallowMount(LocalDateTime, {
      propsData: {
        date: dateOffset,
        showTime: false,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("time").text()).toBe(
      formatLocalDateTimeString(dateOffset),
    );
  });

  it("renders date with time", () => {
    const wrapper = shallowMount(LocalDateTime, {
      propsData: {
        date: dateOffset,
        showTime: true,
      },
    });
    expect(wrapper.find("time").text()).toBe(
      formatLocalDateTimeString(dateOffset, true),
    );
  });

  it("renders a date from time in UTC", async () => {
    const wrapper = shallowMount(LocalDateTime, {
      propsData: {
        date: dateUTC,
        showTime: false,
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("time").text()).toBe(
      formatLocalDateTimeString(dateUTC),
    );
  });

  it("renders date with time from time in UTC", () => {
    const wrapper = shallowMount(LocalDateTime, {
      propsData: {
        date: dateUTC,
        showTime: true,
      },
    });
    expect(wrapper.find("time").text()).toBe(
      formatLocalDateTimeString(dateUTC, true),
    );
  });
});
