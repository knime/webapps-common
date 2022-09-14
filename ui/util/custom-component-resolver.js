import { h, defineComponent, getCurrentInstance } from 'vue';

const compatConfig = {
    RENDER_FUNCTION: false
};

const getAppInstance = () => {
    const currentInstance = getCurrentInstance();

    return currentInstance?.appContext.app;
};

export const resolveClientOnlyComponent = () => {
    const app = getAppInstance();
    
    const clientOnlyComponent = app.component('ClientOnly');
    
    if (clientOnlyComponent) {
        return clientOnlyComponent;
    }
    
    // fallback component when neither NuxtLink nor RouterLink are available
    const fallbackComponent = defineComponent({
        compatConfig,
        render() {
            return h('div', [this.$slots.default()]);
        }
    });

    // register component globally
    app.component('ClientOnly', fallbackComponent);
    
    return fallbackComponent;
};

export const resolveLinkComponent = () => {
    const app = getAppInstance();

    const nuxtLinkComponent = app.component('NuxtLink');

    if (nuxtLinkComponent) {
        return nuxtLinkComponent;
    }
    
    const routerLinkComponent = app.component('RouterLink');

    if (routerLinkComponent) {
        // shim and replace NuxtLink with RouterLink
        app.component('NuxtLink', routerLinkComponent);
    }

    // fallback component when neither NuxtLink nor RouterLink are available
    const fallbackComponent = defineComponent({
        compatConfig,
        props: {
            to: {
                type: String,
                default: ''
            }
        },
    
        render() {
            return h('a', { to: this.to }, [this.$slots.default()]);
        }
    });
    
    app.component('NuxtLink', fallbackComponent);
    
    return fallbackComponent;
};
