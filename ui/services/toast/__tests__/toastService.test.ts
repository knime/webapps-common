/* eslint-disable vue/one-component-per-file */
import { createApp, inject, provide } from "vue";
import { describe, it, beforeEach, expect } from "vitest";
import { mount } from "@vue/test-utils";

import {
  ToastServiceProvider,
  useToasts,
  defaultToastServiceSymbol,
  defaultGlobalPropertyName,
  ToastServiceError,
} from "../toastService";

import type { Toast, ToastService } from "../types";

describe("test-service.ts", () => {
  let serviceProvider: ToastServiceProvider,
    toastService: ToastService,
    simpleToast: Toast,
    persistentToast: Toast,
    toastWithId: Toast,
    toastWithKey: Toast;

  beforeEach(() => {
    serviceProvider = new ToastServiceProvider();
    toastService = serviceProvider.toastServiceObject;
    simpleToast = {
      headline: "This is a simple toast",
    };
    persistentToast = {
      headline: "This is a persistent toast",
      autoRemove: false,
    };
    toastWithId = {
      headline: "This toast has an id",
      id: "my-id",
    };
    toastWithKey = {
      headline: "This toast has an id",
      key: "my-key",
    };
  });

  describe("toast service provider class", () => {
    describe("toastServiceObject", () => {
      it("should have the toastServiceObject with the correct properties", () => {
        const expectedProperties = [
          "toasts",
          "show",
          "remove",
          "autoRemove",
          "removeAll",
        ];
        expect(Object.keys(toastService)).toEqual(expectedProperties);
      });
    });

    describe("toasts", () => {
      it("should initialise a reactive toasts array", () => {
        expect(toastService.toasts.value).toEqual([]);
      });

      it("should not share the toasts array between different instances of the service provider", () => {
        const toastService2 = new ToastServiceProvider().toastServiceObject;
        toastService.show(simpleToast);
        expect(toastService2.toasts.value).toHaveLength(0);
      });
    });

    describe("show", () => {
      it("should add a new toast to the toasts array", () => {
        toastService.show(simpleToast);
        expect(toastService.toasts.value).toHaveLength(1);
      });

      it("should add a toast twice to the toasts array using different ids", () => {
        const firstId = toastService.show(simpleToast);
        const secondId = toastService.show(simpleToast);
        expect(firstId).not.toEqual(secondId);
        expect(toastService.toasts.value).toHaveLength(2);
      });

      it("should not add a toast twice to the toasts if it provides a custom id", () => {
        const firstId = toastService.show(toastWithKey);
        const secondId = toastService.show(toastWithKey);
        expect(firstId).toEqual(secondId);
        expect(toastService.toasts.value).toHaveLength(1);
      });

      it("should return the id of the new toast", () => {
        const id = toastService.show(simpleToast);
        expect(id).toBe(toastService.toasts.value[0].id);
      });

      it("should assign a unique id to the new toast if id is not provided", () => {
        const id = toastService.show(simpleToast);
        expect(toastService.toasts.value[0].id).toBe(id);
      });

      it("should make the provided id unique", () => {
        const id = toastService.show(toastWithId);
        expect(id).toContain(toastWithId.id);
        expect(id).not.toBe(toastWithId.id);
      });

      it("should add new toasts to the start of the toasts array", () => {
        toastService.show(simpleToast);
        toastService.show(persistentToast);
        expect(toastService.toasts.value[0].headline).toBe(
          persistentToast.headline,
        );
      });
    });

    describe("remove", () => {
      it("should remove the toast with the given id from the toasts array", () => {
        const id = toastService.show(simpleToast);
        toastService.remove(id);
        expect(toastService.toasts.value).toHaveLength(0);
      });

      it("should not modify the toasts array if no toast with the given id is found", () => {
        toastService.show(simpleToast);
        toastService.remove("konstanz-information-miner");
        expect(toastService.toasts.value).toHaveLength(1);
      });
    });

    describe("autoRemove", () => {
      it("should remove all toasts with autoRemove set to true from the toasts array", () => {
        toastService.show(simpleToast);
        toastService.show(toastWithId);
        toastService.autoRemove();
        expect(toastService.toasts.value).toHaveLength(0);
      });

      it("should not remove toasts with autoRemove set to false from the toasts array", () => {
        toastService.show(simpleToast);
        toastService.show(persistentToast);
        toastService.autoRemove();
        expect(toastService.toasts.value).toHaveLength(1);
      });
    });

    describe("removeAll", () => {
      it("should remove all toasts from the toasts array", () => {
        toastService.show(simpleToast);
        toastService.show(persistentToast);
        toastService.removeAll();
        expect(toastService.toasts.value).toHaveLength(0);
      });
    });

    describe("useToastService", () => {
      it("should provide the toast service object to downstream components", () => {
        const wrapper = mount({
          setup() {
            serviceProvider.useToastService();
          },
          components: {
            Child: {
              setup() {
                const service = inject(defaultToastServiceSymbol);
                return { service };
              },
              template: "<div></div>",
            },
          },
          template: "<Child/>",
        });

        expect(wrapper.findComponent({ name: "Child" }).vm.service).toBe(
          toastService,
        );
      });

      it("should allow binding the toast service object properties to a specific Symbol", () => {
        const mySymbol = Symbol("mySymbol");

        const wrapper = mount({
          setup() {
            serviceProvider.useToastService({ serviceSymbol: mySymbol });
          },
          components: {
            Child: {
              setup() {
                const service = inject(mySymbol);
                return { service };
              },
              template: "<div></div>",
            },
          },
          template: "<Child/>",
        });

        expect(wrapper.findComponent({ name: "Child" }).vm.service).toBe(
          toastService,
        );
      });
    });

    describe("getToastServicePlugin", () => {
      it("should return an object that can be used as a plugin", () => {
        const toastServicePlugin = serviceProvider.getToastServicePlugin();
        expect(toastServicePlugin).toHaveProperty("install");
      });

      it("should bind the toast service object to the app's global property", () => {
        const toastServicePlugin = serviceProvider.getToastServicePlugin();
        const app = createApp({});
        app.use(toastServicePlugin);
        expect(app.config.globalProperties[defaultGlobalPropertyName]).toEqual(
          toastService,
        );
      });

      it("should allow a custom property name to be used as the global property name", () => {
        const toastServicePlugin = serviceProvider.getToastServicePlugin();
        const app = createApp({});
        app.use(toastServicePlugin, {
          propertyName: "$kombucha",
        });
        expect(app.config.globalProperties.$kombucha).toEqual(toastService);
      });
    });

    describe("getToastServiceObject", () => {
      it("should return the toast service object directly", () => {
        const toastServiceObject = serviceProvider.getToastServiceObject();
        expect(toastServiceObject).toBe(toastService);
      });
    });
  });

  describe("useToasts", () => {
    it("should retrieve the toast service object from the global injection", () => {
      const wrapper = mount({
        setup() {
          const service = serviceProvider.getToastServiceObject();
          provide(defaultToastServiceSymbol, service);
        },
        components: {
          Child: {
            setup() {
              const service = useToasts();
              return { service };
            },
            template: "<div></div>",
          },
        },
        template: "<Child/>",
      });

      expect(wrapper.findComponent({ name: "Child" }).vm.service).toBe(
        toastService,
      );
    });

    it("should retrieve the toast service object from the app's global property if not found in the global injection", () => {
      const ParentComponent = {
        components: {
          Child: {
            setup() {
              const service = useToasts();
              return { service };
            },
            template: "<div></div>",
          },
        },
        template: "<Child/>",
      };

      const wrapper = mount(ParentComponent, {
        global: {
          plugins: [
            {
              install: (app) => {
                app.config.globalProperties[defaultGlobalPropertyName] =
                  toastService;
              },
            },
          ],
        },
      });

      expect(wrapper.findComponent({ name: "Child" }).vm.service).toBe(
        toastService,
      );
    });

    it("should allow a custom symbol to be used as the injection key", () => {
      const customSymbol = Symbol("customSymbol");

      const wrapper = mount({
        setup() {
          const service = serviceProvider.getToastServiceObject();
          provide(customSymbol, service);
        },
        components: {
          Child: {
            setup() {
              const service = useToasts({
                serviceSymbol: customSymbol,
              });
              return { service };
            },
            template: "<div></div>",
          },
        },
        template: "<Child/>",
      });

      expect(wrapper.findComponent({ name: "Child" }).vm.service).toBe(
        toastService,
      );
    });

    it("should allow a custom global property name", () => {
      const ParentComponent = {
        components: {
          Child: {
            setup() {
              const service = useToasts({
                propertyName: "$kombucha",
              });
              return { service };
            },
            template: "<div></div>",
          },
        },
        template: "<Child/>",
      };

      const wrapper = mount(ParentComponent, {
        global: {
          plugins: [
            {
              install: (app) => {
                app.config.globalProperties.$kombucha = toastService;
              },
            },
          ],
        },
      });

      expect(wrapper.findComponent({ name: "Child" }).vm.service).toBe(
        toastService,
      );
    });

    it("should throw a ToastServiceError if the toast service object is not found in either the global injection or the app's global properties", () => {
      const ParentComponent = {
        components: {
          Child: {
            setup() {
              const service = useToasts();
              return { service };
            },
            template: "<div></div>",
          },
        },
        template: "<Child/>",
      };

      expect(() => {
        mount(ParentComponent);
      }).toThrow(ToastServiceError);
    });

    it("should throw a ToastServiceError if both arguments are provided", () => {
      expect(() => {
        useToasts({
          serviceSymbol: Symbol("customSymbol"),
          propertyName: "$kombucha",
        });
      }).toThrow(ToastServiceError);
    });
  });
});
