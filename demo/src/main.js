import { createApp, configureCompat } from 'vue';
import consola from 'consola';

import App from './App.vue';

window.consola = consola.create({
    level: 4 // TODO: make configurable
});


configureCompat({
    // COMPONENT_ASYNC: false
});

const app = createApp(App);

// map all nuxt-links to router links,
// since nuxt-link inherits from RouterLink and we don't need use nuxt
const RouterLink = app._context.components.RouterLink;
app.component('NuxtLink', RouterLink);

app.mount('#app');

