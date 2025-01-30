/* eslint-disable vue/one-component-per-file */
import { beforeEach, describe, expect, it } from "vitest";
import { createApp, inject, provide } from "vue";
import { mount } from "@vue/test-utils";

import {
  ToastServiceError,
  ToastServiceProvider,
  defaultGlobalPropertyName,
  defaultToastServiceSymbol,
  useToasts,
} from "../toastService";
import type { Toast, ToastService } from "../types";

describe("test-service.ts", () => {
  let serviceProvider: ToastServiceProvider,
    toastService: ToastService,
    simpleToast: Toast,
    persistentToast: Toast,
    toastWithDeduplicationKey: Toast,
    toastWithMeta: Toast,
    toastWithButton: Toast;

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
    toastWithDeduplicationKey = {
      headline: "This toast has a key",
      deduplicationKey: "my-key",
    };
    toastWithMeta = {
      headline: "This toast has a meta object",
      meta: {
        group: "myGroup",
      },
    };
    toastWithButton = {
      headline: "This toast has a button",
      buttons: [{ text: "Click me", callback: () => {} }],
    };
  });

  describe("toast service provider class", () => {
    describe("toastServiceObject", () => {
      it("has the toastServiceObject with the correct properties", () => {
        const expectedProperties = [
          "toasts",
          "show",
          "remove",
          "removeBy",
          "autoRemove",
          "removeAll",
        ];
        expect(Object.keys(toastService)).toEqual(expectedProperties);
      });
    });

    describe("toasts", () => {
      it("initializes a reactive toasts array", () => {
        expect(toastService.toasts.value).toEqual([]);
      });

      it("doesn't share the toasts array between different instances of the service provider", () => {
        const toastService2 = new ToastServiceProvider().toastServiceObject;
        toastService.show(simpleToast);
        expect(toastService2.toasts.value).toHaveLength(0);
      });
    });

    describe("show", () => {
      it("adds a new toast to the toasts array", () => {
        toastService.show(simpleToast);
        expect(toastService.toasts.value).toHaveLength(1);
      });

      it("returns the id of the new toast", () => {
        const id = toastService.show(simpleToast);
        expect(id).toBe(toastService.toasts.value[0].id);
      });

      it("adds a toast twice if not using deduplicationKey", () => {
        const firstId = toastService.show(simpleToast);
        const secondId = toastService.show(simpleToast);
        expect(firstId).not.toEqual(secondId);
        expect(toastService.toasts.value).toHaveLength(2);
      });

      it("doesn't add a toast twice if they provide a deduplicationKey", () => {
        const firstId = toastService.show(toastWithDeduplicationKey);
        const secondId = toastService.show(toastWithDeduplicationKey);
        expect(firstId).toEqual(secondId);
        expect(toastService.toasts.value).toHaveLength(1);
      });

      it("adds new toasts to the start of the toasts array", () => {
        toastService.show(simpleToast);
        toastService.show(persistentToast);
        expect(toastService.toasts.value[0].headline).toBe(
          persistentToast.headline,
        );
      });

      it("sets metadata object on toast", () => {
        toastService.show(toastWithMeta);

        expect(toastService.toasts.value[0].meta).toStrictEqual({
          group: "myGroup",
        });
      });

      it("adds a toast with a button", () => {
        toastService.show(toastWithButton);

        expect(toastService.toasts.value[0]).toEqual(
          expect.objectContaining({
            headline: "This toast has a button",
            buttons: [
              expect.objectContaining({
                text: "Click me",
                callback: expect.any(Function),
              }),
            ],
          }),
        );
      });
    });

    describe("remove", () => {
      it("removes the toast with the given id from the toasts array", () => {
        const id = toastService.show(simpleToast);
        toastService.remove(id);
        expect(toastService.toasts.value).toHaveLength(0);
      });

      it("doesn't modify the toasts array if no toast with the given id is found", () => {
        toastService.show(simpleToast);
        toastService.remove("konstanz-information-miner");
        expect(toastService.toasts.value).toHaveLength(1);
      });
    });

    describe("removeBy", () => {
      it("removes toast that match the predicate", () => {
        const groupAToast = { ...toastWithMeta, meta: { group: "a" } };
        const groupBToast = { ...toastWithMeta, meta: { group: "b" } };
        toastService.show(groupAToast);
        toastService.show(groupBToast);

        toastService.removeBy((toast) => toast.meta?.group === "a");

        expect(toastService.toasts.value).toStrictEqual([
          {
            ...groupBToast,
            autoRemove: expect.any(Boolean),
            id: expect.any(String),
          },
        ]);
      });
    });

    describe("autoRemove", () => {
      it("removes all toasts with autoRemove set to true from the toasts array", () => {
        toastService.show(simpleToast);
        toastService.show(toastWithButton);
        toastService.autoRemove();
        expect(toastService.toasts.value).toHaveLength(0);
      });

      it("doesn't remove toasts with autoRemove set to false from the toasts array", () => {
        toastService.show(simpleToast);
        toastService.show(persistentToast);
        toastService.autoRemove();
        expect(toastService.toasts.value).toHaveLength(1);
      });
    });

    describe("removeAll", () => {
      it("removes all toasts from the toasts array", () => {
        toastService.show(simpleToast);
        toastService.show(persistentToast);
        toastService.removeAll();
        expect(toastService.toasts.value).toHaveLength(0);
      });
    });

    describe("useToastService", () => {
      it("provides the toast service object to downstream components", () => {
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

      it("allows binding the toast service object properties to a specific Symbol", () => {
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
      it("returns an object that can be used as a plugin", () => {
        const toastServicePlugin = serviceProvider.getToastServicePlugin();
        expect(toastServicePlugin).toHaveProperty("install");
      });

      it("binds the toast service object to the app's global property", () => {
        const toastServicePlugin = serviceProvider.getToastServicePlugin();
        const app = createApp({});
        app.use(toastServicePlugin);
        expect(app.config.globalProperties[defaultGlobalPropertyName]).toEqual(
          toastService,
        );
      });

      it("allows a custom property name to be used as the global property name", () => {
        const toastServicePlugin = serviceProvider.getToastServicePlugin();
        const app = createApp({});
        app.use(toastServicePlugin, {
          propertyName: "$kombucha",
        });
        expect(app.config.globalProperties.$kombucha).toEqual(toastService);
      });
    });

    describe("getToastServiceObject", () => {
      it("returns the toast service object directly", () => {
        const toastServiceObject = serviceProvider.getToastServiceObject();
        expect(toastServiceObject).toBe(toastService);
      });
    });
  });

  describe("useToasts", () => {
    it("retrieves the toast service object from the global injection", () => {
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

    it("retrieves the toast service object from the app's global property if not found in the global injection", () => {
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

    it("allows a custom symbol to be used as the injection key", () => {
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

    it("allows a custom global property name", () => {
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

    it("throws a ToastServiceError if the toast service object is not found in either the global injection or the app's global properties", () => {
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

    it("throws a ToastServiceError if both arguments are provided", () => {
      expect(() => {
        useToasts({
          serviceSymbol: Symbol("customSymbol"),
          propertyName: "$kombucha",
        });
      }).toThrow(ToastServiceError);
    });
  });
});
