import { type Mock, vi } from "vitest";
import { config } from "@vue/test-utils";
import consola from "consola";

window.consola = consola;

// see https://test-utils.vuejs.org/migration/#shallowmount-and-renderstubdefaultslot
config.global.renderStubDefaultSlot = true;

declare global {
  var $ofetchMock: Mock;
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      $ofetchMock: Mock;
    }
  }
}

vi.mock("./src/common/ofetchClient", () => {
  globalThis.$ofetchMock = vi.fn(() => Promise.resolve({}));

  return {
    getFetchClient: () => globalThis.$ofetchMock,
  };
});
