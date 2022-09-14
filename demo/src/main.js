import { createApp, configureCompat } from 'vue';
import consola from 'consola';

import App from './App.vue';

window.consola = consola.create({
    level: 4 // TODO: make configurable
});


configureCompat({ });

const app = createApp(App);

app.mount('#app');

