import { h, defineComponent } from 'vue';
// eslint-disable-next-line no-duplicate-imports
import type { App } from 'vue';

export const registerClientOnlyComponent = (appInstance: App<Element>) => {
    const hasNuxtClientOnly = Boolean(appInstance._context.components.ClientOnly);

    if (hasNuxtClientOnly) {
        return;
    }

    // fallback component when neither NuxtLink nor RouterLink are available
    const fallbackComponent = defineComponent({
        render() {
            return h('div', [this.$slots.default()]);
        }
    });
    appInstance.component('ClientOnly', fallbackComponent);
};
