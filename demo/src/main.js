import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import consola from 'consola';

import App from './App.vue';

window.consola = consola.create({
    level: 4 // TODO: make configurable
});

const app = createApp(App);
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: App
        }
    ]
});
app.use(router);

app.mount('#app');
