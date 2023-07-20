/* eslint-disable vitest/max-nested-describe */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines */
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "vuex";
import * as imagesModule from "../utils/images";

import ImageRenderer from "../ImageRenderer.vue";
import flushPromises from "flush-promises";

describe("ImageRenderer.vue", () => {
  let props, context;

  const getUiExtResourceLocation = vi.fn(
    ({ resourceInfo }) => resourceInfo.baseUrl + resourceInfo.path,
  );

  beforeEach(() => {
    props = {
      baseUrl: "baseUrl",
      path: "path",
      includeDataInHtml: false,
      tableIsReady: true,
    };
    const store = createStore({
      modules: {
        api: {
          getters: {
            uiExtResourceLocation: () => getUiExtResourceLocation,
          },
          namespaced: true,
        },
      },
    });
    context = { props, global: { provide: { store } } };
  });

  it("sets url", () => {
    const wrapper = mount(ImageRenderer, context);
    const resourceInfo = {
      baseUrl: props.baseUrl,
      path: props.path,
    };
    expect(getUiExtResourceLocation).toHaveBeenCalledWith({ resourceInfo });
    expect(wrapper.find("img").attributes().src).toBe(
      getUiExtResourceLocation({ resourceInfo }),
    );
  });

  it("sets width and height if provided", () => {
    props.width = 10;
    props.height = 20;
    const wrapper = mount(ImageRenderer, context);
    const resourceInfo = {
      baseUrl: props.baseUrl,
      path: props.path,
    };
    expect(wrapper.find("img").attributes().src).toBe(
      `${getUiExtResourceLocation({ resourceInfo })}?w=${props.width}&h=${
        props.height
      }`,
    );
  });

  it("does not update src if desired", async () => {
    props.width = 10;
    props.height = 20;
    props.update = false;
    const resourceInfo = {
      baseUrl: props.baseUrl,
      path: props.path,
    };
    const wrapper = mount(ImageRenderer, context);
    const initialSrc = `${getUiExtResourceLocation({ resourceInfo })}?w=${
      props.width
    }&h=${props.height}`;
    expect(wrapper.find("img").attributes().src).toBe(initialSrc);

    const newProps = {
      width: 123,
      height: 123,
    };
    await wrapper.setProps(newProps);
    expect(wrapper.find("img").attributes().src).toBe(initialSrc);

    await wrapper.setProps({
      update: true,
    });
    expect(wrapper.find("img").attributes().src).toBe(
      `${getUiExtResourceLocation({ resourceInfo })}?w=${newProps.width}&h=${
        newProps.height
      }`,
    );
  });

  describe("when 'includeDataInHtml' is true", () => {
    const fetchedImageData = "fetchedImageData";

    beforeEach(() => {
      vi.spyOn(imagesModule, "fetchImage").mockResolvedValue(fetchedImageData);
    });

    it("includes data in html", async () => {
      props.includeDataInHtml = true;
      const wrapper = mount(ImageRenderer, context);
      expect(wrapper.find("img").exists()).toBeFalsy();
      await flushPromises();
      const img = wrapper.find("img");
      expect(img.exists()).toBeTruthy();
      expect(img.attributes().src).toBe(fetchedImageData);
    });

    it("emits pending and rendered events when image is loaded", async () => {
      props.includeDataInHtml = true;
      const wrapper = mount(ImageRenderer, context);
      expect(wrapper.emitted("pending")[0]).toStrictEqual([
        expect.stringContaining("Image"),
      ]);
      expect(wrapper.emitted("rendered")).toBeFalsy();
      await flushPromises();
      expect(wrapper.emitted("rendered")[0]).toStrictEqual([
        expect.stringContaining("Image"),
      ]);
    });

    it("emits rendered when the ImageRenderer is unmounted", () => {
      props.includeDataInHtml = true;
      const wrapper = mount(ImageRenderer, context);
      expect(wrapper.emitted("pending")).toStrictEqual([
        [expect.stringContaining("Image")],
      ]);
      expect(wrapper.emitted()).not.toHaveProperty("rendered");
      wrapper.unmount();
      expect(wrapper.emitted("rendered")).toStrictEqual([
        [expect.stringContaining("Image")],
      ]);
    });

    it("waits until the table is ready before fetching the images", async () => {
      props.tableIsReady = false;
      props.includeDataInHtml = true;
      const wrapper = mount(ImageRenderer, context);
      expect(wrapper.emitted("pending")[0]).toStrictEqual([
        expect.stringContaining("Image"),
      ]);
      expect(wrapper.emitted("rendered")).toBeFalsy();

      await wrapper.setProps({ tableIsReady: true });
      expect(wrapper.emitted("rendered")).toBeFalsy();

      await flushPromises();
      expect(wrapper.emitted("rendered")[0]).toStrictEqual([
        expect.stringContaining("Image"),
      ]);
    });
  });
});
