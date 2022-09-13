import { App, h } from 'vue';

export const registerLinkComponent = (appInstance: App<Element>) => {
    const hasNuxtLink = Boolean(appInstance._context.components.NuxtLink);
    const hasRouterLink = Boolean(appInstance._context.components.NuxtLink);
    if (hasNuxtLink) {
        return;
    }

    if (hasRouterLink) {
        // shim and replace NuxtLink with RouterLink
        const RouterLink = appInstance._context.components.RouterLink;
        appInstance.component('NuxtLink', RouterLink);
    }

    // fallback component when neither NuxtLink nor RouterLink are available
    const defaultLinkComponent = {
        compatConfig: {
            RENDER_FUNCTION: false
        },
    
        props: {
            to: {
                type: String,
                default: ''
            }
        },
    
        render() {
            return h('a', { to: this.to }, [this.$slots.default()]);
        }
    };
    appInstance.component('NuxtLink', defaultLinkComponent);
};
