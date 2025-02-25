import { config } from "@vue/test-utils";
import consola from "consola";

// @ts-expect-error we have a global consola instance in our apps
window.global.consola = consola;

// see https://test-utils.vuejs.org/migration/#shallowmount-and-renderstubdefaultslot
config.global.renderStubDefaultSlot = true;
