import { describe, it, expect, beforeAll, vi } from "vitest";
import { mount } from "@vue/test-utils";

import OpenSourceCredits from "../OpenSourceCredits.vue";
import Description from "../Description.vue";

vi.mock("../../buildtools/opensourcecredits/used-packages.json", () => ({
  default: [
    {
      name: "a-package",
      repository: "/",
      licenseText: "I am a license",
    },
    {
      name: "a-package",
      repository: "/",
      licenseText: "I am a license",
    },
    {
      name: "b-package",
      repository: "/",
      licenseText: "I am a license",
    },
  ],
}));

describe("OpenSourceCredits.vue", () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(OpenSourceCredits);
  });

  it("renders", () => {
    expect(wrapper.getComponent(Description).props("text")).toContain(
      "This project uses open source software components."
    );
  });

  it.skip("de-duplicates packages", () => {
    // TODO fix json import mock
    expect(wrapper.vm.packages.length).toBe(2);
    let packages = wrapper.findAll("button");
    expect(packages.length).toBe(2);
    expect(packages[0].text()).toContain("a-package");
    expect(packages[1].text()).toContain("b-package");
  });

  it("toggles expandable details", () => {
    let button = wrapper.find("button");
    let details = wrapper.find("dl");
    expect(details.classes()).not.toContain("open");
    expect(button.attributes("aria-expanded")).toBe("false");
    button.trigger("click");
    expect(details.classes()).toContain("open");
    expect(button.attributes("aria-expanded")).toBe("true");
    button.trigger("click");
    expect(details.classes()).not.toContain("open");
    expect(button.attributes("aria-expanded")).toBe("false");
  });
});
