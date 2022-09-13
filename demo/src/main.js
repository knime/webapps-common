import { createApp, configureCompat } from 'vue';
import consola from 'consola';

import App from './App.vue';
import { registerLinkComponent } from './plugins/shim-link-component';

window.consola = consola.create({
    level: 4 // TODO: make configurable
});


configureCompat({
    // COMPONENT_ASYNC: false
});

const app = createApp(App);

registerLinkComponent(app);

app.mount('#app');

