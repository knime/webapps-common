/* eslint-disable vitest/max-nested-describe */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines */
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as imagesModule from "../../../utils/images";

import ImageRenderer from "../ImageRenderer.vue";
import flushPromises from "flush-promises";
import { ResourceService } from "@knime/ui-extension-service";

describe("ImageRenderer.vue", () => {
  let props, context;

  const getResourceUrl = vi.fn((path) =>
    Promise.resolve(`Resource url (${path})`),
  );

  beforeEach(() => {
    ResourceService.mockImplementation(() => ({
      getResourceUrl,
    }));
    props = {
      path: "path",
      includeDataInHtml: false,
      tableIsReady: true,
    };

    context = { props, global: { provide: { getKnimeService: () => ({}) } } };
  });

  it("sets url", async () => {
    const wrapper = mount(ImageRenderer, context);
    await flushPromises();
    expect(getResourceUrl).toHaveBeenCalledWith(props.path);
    expect(wrapper.find("img").attributes().src).toBe(
      await getResourceUrl(props.path),
    );
  });

  it("sets width and height if provided", async () => {
    props.width = 10;
    props.height = 20;
    const wrapper = mount(ImageRenderer, context);
    await flushPromises();
    expect(wrapper.find("img").attributes().src).toBe(
      `${await getResourceUrl(props.path)}?w=${props.width}&h=${props.height}`,
    );
  });

  it("does not update src if desired", async () => {
    props.width = 10;
    props.height = 20;
    props.update = false;
    const wrapper = mount(ImageRenderer, context);
    await flushPromises();
    const initialSrc = `${await getResourceUrl(props.path)}?w=${
      props.width
    }&h=${props.height}`;
    expect(wrapper.find("img").attributes().src).toBe(initialSrc);

    const newProps = {
      width: 123,
      height: 123,
    };
    await wrapper.setProps(newProps);
    await flushPromises();
    expect(wrapper.find("img").attributes().src).toBe(initialSrc);

    await wrapper.setProps({
      update: true,
    });
    expect(wrapper.find("img").attributes().src).toBe(
      `${await getResourceUrl(props.path)}?w=${newProps.width}&h=${
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
      await flushPromises();
      expect(wrapper.emitted("pending")[0]).toStrictEqual([
        expect.stringContaining("Image"),
      ]);
      expect(wrapper.emitted("rendered")[0]).toStrictEqual([
        expect.stringContaining("Image"),
      ]);
    });

    it("emits rendered when the ImageRenderer is unmounted", async () => {
      props.includeDataInHtml = true;
      props.tableIsReady = false;
      const wrapper = mount(ImageRenderer, context);
      await flushPromises();
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
      await flushPromises();
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
