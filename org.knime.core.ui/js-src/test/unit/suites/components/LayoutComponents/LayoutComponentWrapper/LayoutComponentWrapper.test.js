import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import LayoutComponentWrapper from '@/components/LayoutComponents/LayoutComponentWrapper.vue';

const defaultProps = {
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

const mountComponent = () => mount(LayoutComponentWrapper, {
    global: {
        provide: { jsonforms }
    },
    props: defaultProps
});

describe('LayoutComponentWrapper.vue', () => {
    it('renders', () => {
        const wrapper = mountComponent();
        expect(wrapper.getComponent(LayoutComponentWrapper).exists()).toBe(true);
    });

    it('is invisible if it is an advanced setting and advanced settings are not to be shown', () => {
        defaultProps.layout.uischema.options.isAdvanced = true;
        jsonforms.core.schema.showAdvancedSettings = false;
        const wrapper = mountComponent();
        expect(wrapper.getComponent(LayoutComponentWrapper).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', () => {
        defaultProps.layout.uischema.options.isAdvanced = true;
        jsonforms.core.schema.showAdvancedSettings = true;
        const wrapper = mountComponent();
        expect(wrapper.getComponent(LayoutComponentWrapper).isVisible()).toBe(true);
    });
});

