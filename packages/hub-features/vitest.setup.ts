import { type Mock, vi } from "vitest";
import { config } from "@vue/test-utils";
import consola from "consola";

// @ts-ignore
window.global.consola = consola;

// see https://test-utils.vuejs.org/migration/#shallowmount-and-renderstubdefaultslot
config.global.renderStubDefaultSlot = true;

declare global {
  // eslint-disable-next-line no-var
  var $ofetchMock: Mock;
  namespace NodeJS {
    interface Global {
      $ofetchMock: Mock;
    }
  }
}

vi.mock("./src/common/ofetchClient", () => {
  globalThis.$ofetchMock = vi.fn(() => Promise.resolve({}));

  return {
    $ofetch: globalThis.$ofetchMock,
  };
});
