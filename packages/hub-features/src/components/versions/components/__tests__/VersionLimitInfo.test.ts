import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import VersionLimitInfo from "../VersionLimitInfo.vue";

type Props = InstanceType<typeof VersionLimitInfo>["$props"];

describe("VersionLimitInfo", () => {
  const defaultProps = {
    versionLimit: {
      limit: 123,
      currentUsage: 42,
    },
    upgradeUrl: "https://www.knime.com/knime-hub-pricing",
    isPrivate: true,
  };

  const doMount = ({ props = {} }: { props?: Partial<Props> } = {}) => {
    const wrapper = mount(VersionLimitInfo, {
      props: {
        ...defaultProps,
        ...props,
      },
    });
    return { wrapper };
  };

  it("renders component", () => {
    const { wrapper } = doMount();
    expect(wrapper.text()).toContain("Using 42 of 123 versions");
    expect(wrapper.text()).toContain(
      "Upgrade to use unlimited versions for private items",
    );
    expect(wrapper.find("a").attributes("href")).toBe(defaultProps.upgradeUrl);
  });

  it("renders limit reached", () => {
    // limit is met
    let { wrapper } = doMount({
      props: {
        versionLimit: {
          limit: 2,
          currentUsage: 2,
        },
      },
    });
    expect(wrapper.text()).toContain(
      "You've reached the maximum of 2 versions.",
    );

    // limit is exceeded
    ({ wrapper } = doMount({
      props: {
        versionLimit: {
          limit: 2,
          currentUsage: 123,
        },
      },
    }));
    expect(wrapper.text()).toContain(
      "You've reached the maximum of 2 versions.",
    );
  });
});
