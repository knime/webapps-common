import { mount } from '@vue/test-utils';
import DialogComponentWrapper from '~/src/components/UIComponents/DialogComponentWrapper.vue';

const defaultPropsData = {
    control: {
        uischema: {
            options: {
                isAdvanced: false
            }
        },
        visible: true,
        rootSchema: {
            showAdvancedSettings: true
        }
    }
};

const mountComponent = () => mount(DialogComponentWrapper, {
    propsData: defaultPropsData
});

describe('DialogComponentWrapper.vue', () => {
    it('renders', () => {
        const wrapper = mountComponent();
        expect(wrapper.getComponent(DialogComponentWrapper).exists()).toBe(true);
    });

    it('is invisible if it is an advanced setting and advanced settings are not to be shown', () => {
        defaultPropsData.control.uischema.options.isAdvanced = true;
        defaultPropsData.control.rootSchema.showAdvancedSettings = false;
        const wrapper = mountComponent();
        expect(wrapper.getComponent(DialogComponentWrapper).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', () => {
        defaultPropsData.control.uischema.options.isAdvanced = true;
        defaultPropsData.control.rootSchema.showAdvancedSettings = true;
        const wrapper = mountComponent();
        expect(wrapper.getComponent(DialogComponentWrapper).isVisible()).toBe(true);
    });
});

