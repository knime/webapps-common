import { config } from "@vue/test-utils";
import consola from "consola";

// @ts-expect-error migrated from ts-ignore to es-expect-error TODO: explain why error is expected
window.global.consola = consola;

// see https://test-utils.vuejs.org/migration/#shallowmount-and-renderstubdefaultslot
config.global.renderStubDefaultSlot = true;
