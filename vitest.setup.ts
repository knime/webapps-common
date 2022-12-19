import consola from 'consola';
import { config } from '@vue/test-utils';

window.global.consola = consola;


// see https://test-utils.vuejs.org/migration/#shallowmount-and-renderstubdefaultslot
config.global.renderStubDefaultSlot = true;
