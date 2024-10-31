import { vi } from "vitest";
import { config } from "@vue/test-utils";
import consola from "consola";
import createFetchMock from "vitest-fetch-mock";

// @ts-ignore
window.global.consola = consola;

// see https://test-utils.vuejs.org/migration/#shallowmount-and-renderstubdefaultslot
config.global.renderStubDefaultSlot = true;

const fetchMocker = createFetchMock(vi);

// sets globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks();
