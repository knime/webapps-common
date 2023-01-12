import { mount } from '@vue/test-utils';
import LayoutComponenWrapper from '~/src/components/LayoutComponents/LayoutComponentWrapper.vue';

const defaultPropsData = {
    layout: {
        uischema: {
            options: {
                isAdvanced: false
            }
        },
        visible: true
    }
};

const jsonforms = {
    core: {
        schema: {
            showAdvancedSettings: false
        }
    }
};

const mountComponent = () => mount(LayoutComponenWrapper, {
    provide: { jsonforms },
    propsData: defaultPropsData
});

describe('LayoutComponentWrapper.vue', () => {
    it('renders', () => {
        const wrapper = mountComponent();
        expect(wrapper.getComponent(LayoutComponenWrapper).exists()).toBe(true);
    });

    it('is invisible if it is an advanced setting and advanced settings are not to be shown', () => {
        defaultPropsData.layout.uischema.options.isAdvanced = true;
        jsonforms.core.schema.showAdvancedSettings = false;
        const wrapper = mountComponent();
        expect(wrapper.getComponent(LayoutComponenWrapper).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', () => {
        defaultPropsData.layout.uischema.options.isAdvanced = true;
        jsonforms.core.schema.showAdvancedSettings = true;
        const wrapper = mountComponent();
        expect(wrapper.getComponent(LayoutComponenWrapper).isVisible()).toBe(true);
    });
});

