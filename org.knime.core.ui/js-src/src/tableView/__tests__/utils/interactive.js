import TableViewInteractive from '../../TableViewInteractive.vue';
import { shallowMount } from '@vue/test-utils';
import flushPromises from 'flush-promises';


export const shallowMountInteractive = async (context) => {
    const wrapper = shallowMount(TableViewInteractive, context);
    await flushPromises();
    return wrapper;
};

const deepCopySettings = (wrapper) => JSON.parse(JSON.stringify(wrapper.vm.$data.settings));

export const changeViewSetting = (wrapper, settingsKey, settingsValue) => {
    const settings = deepCopySettings(wrapper);
    settings[settingsKey] = settingsValue;
    wrapper.vm.onViewSettingsChange({
        data: { data: { view: settings } }
    });
};
