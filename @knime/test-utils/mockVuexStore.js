import Vuex from 'vuex';

const mockVuexStore = (moduleInput) => {
    let modules = Object.entries(moduleInput).reduce((modules, [moduleName, moduleConfig]) => {
        if (moduleName !== 'index') {
            modules[moduleName] = { ...moduleConfig, namespaced: true };
        }
        return modules;
    }, {});

    let storeConfig = { modules };

    if (moduleInput.index) {
        Object.assign(storeConfig, moduleInput.index);
    }

    return new Vuex.Store(storeConfig);
};

export {
    mockVuexStore
};
