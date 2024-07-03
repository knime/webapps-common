import { describe, it, expect } from "vitest";
import { shallowMount, mount } from "@vue/test-utils";

import BaseButton from "./BaseButton.vue";

// TODO fix and improve test
describe("BaseButton.vue", () => {
  it("renders a button", () => {
    const wrapper = shallowMount(BaseButton);
    expect(typeof wrapper.attributes().href === "undefined").toBeTruthy();
  });

  it("renders an anchor tag", () => {
    const wrapper = shallowMount(BaseButton, {
      props: {
        href: "testhref",
      },
      global: {
        stubs: {
          NuxtLink: "<div></div>",
        },
      },
    });

    expect(wrapper.get("a").attributes("href")).toBe("testhref");
  });

  it("emits events", () => {
    /* Depending on the `to` and `href` attributes and if it runs in a Nuxt application, the component renders
     * either a native <button>, a native <a> or a <router-link>/<nuxt-link> component.
     * To make sure click handlers work in all cases, we need to set the `@click` handler
     * cf. https://stackoverflow.com/a/41476882/5134084 */

    // test for router-link
    let wrapper = shallowMount(BaseButton, {
      props: {
        to: "route-test",
      },
      global: {
        stubs: {
          RouterLink: "<div></div>",
        },
      },
    });
    wrapper.findComponent("router-link-stub").trigger("click");
    expect(wrapper.emitted("click")).toBeDefined();

    // test for nuxt-link
    wrapper = shallowMount(BaseButton, {
      props: {
        to: "route-test",
      },
      global: {
        stubs: {
          NuxtLink: "<div></div>",
        },
      },
    });
    wrapper.findComponent("nuxt-link-stub").trigger("click");
    expect(wrapper.emitted("click")).toBeDefined();

    // test for a element
    wrapper = shallowMount(BaseButton, {
      props: {
        href: "http://www.test.de",
      },
    });
    // preventDefault to omit console error, see https://github.com/jsdom/jsdom/issues/2112#issuecomment-1019402961
    wrapper
      .find("a")
      .wrapperElement.addEventListener(
        "click",
        (event) => event.preventDefault(),
        false,
      );
    wrapper.find("a").trigger("click");
    expect(wrapper.emitted("click")).toBeDefined();

    // test for button element
    wrapper = shallowMount(BaseButton);
    wrapper.find("button").trigger("click");
    expect(wrapper.emitted("click")).toBeDefined();
  });

  it.skip("allows preventing default", () => {
    // TODO refactor BaseButton see https://router.vuejs.org/guide/migration/index.html#removal-of-event-and-tag-props-in-router-link
    let wrapper = shallowMount(BaseButton, {
      props: {
        to: "/test",
        preventDefault: true,
      },
      global: {
        stubs: {
          RouterLink: "<div></div>",
        },
      },
    });
    let button = wrapper.findComponent("router-link-stub");
    expect(button.attributes("event")).toBeUndefined();
  });

  it("gets focused when focus method is called", () => {
    const wrapper = mount(BaseButton, { attachTo: document.body });
    wrapper.vm.focus();
    expect(document.activeElement).toBe(wrapper.get("button").wrapperElement);
  });
});
