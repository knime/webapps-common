// Development app launcher. Not included in production build.
import Vue from 'vue';
import Vuex from 'vuex';
import c from 'consola';
import { logToConsole as enable, level } from '../../logger.config';
import DevApp from './DevApp.vue';

Vue.use(Vuex);

window.consola = c.create({
    level: enable ? level : -1
});

Vue.config.productionTip = false;
const pagebuilderStoreMock = {
    pagebuilder: {
        namespaced: true,
        modules: {
            dialog: {
                namespaced: true,
                dirtyModelSettings: {
                    namespaced: true
                },
                actions: {
                    setApplySettings: () => {},
                    dirtySettings: () => {},
                    cleanSettings: () => {},
                    callApplySettings: () => {}
                }
            }
        }
    }
};

new Vue({
    render: h => h(DevApp),
    store: new Vuex.Store({ modules: pagebuilderStoreMock })
}).$mount('#app');
