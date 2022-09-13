import { createApp, configureCompat } from 'vue';
import consola from 'consola';

import App from './App.vue';
import { registerLinkComponent } from './plugins/shim-link-component';

window.consola = consola.create({
    level: 4 // TODO: make configurable
});


configureCompat({
    // COMPONENT_ASYNC: false
    INSTANCE_LISTENERS: false,
    RENDER_FUNCTION: false,
    COMPONENT_V_MODEL: false,
    COMPILER_V_BIND_OBJECT_ORDER: false
});

const app = createApp(App);

registerLinkComponent(app);

app.mount('#app');

