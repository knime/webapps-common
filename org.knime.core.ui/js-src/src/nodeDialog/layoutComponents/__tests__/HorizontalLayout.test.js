import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsLayout } from '@@/test-setup/utils/jsonFormsTestUtils';
import HorizontalLayout from '../HorizontalLayout.vue';

describe('HorizontalLayout.vue', () => {
    const defaultProps = {
        layout: {
            cells: [],
            path: 'view.referenceLines',
            schema: {
                properties: {
                    size: {
                        type: 'integer',
                        title: 'Size'
                    }
                }
            },
            uischema: {
                type: 'HorizontalLayout',
                elements: [
                    {
                        type: 'Control',
                        scope: '#/properties/size'
                    }
                ]
            },
            visible: true
        }
    };

    let wrapper;

    beforeEach(() => {
        const component = mountJsonFormsComponent(HorizontalLayout, defaultProps);
        wrapper = component.wrapper;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(HorizontalLayout).exists()).toBe(true);
    });
    
    it('initializes jsonforms', () => {
        initializesJsonFormsLayout(wrapper);
    });

    it('checks that it is not rendered if it is an advanced setting', () => {
        defaultProps.layout.uischema.options = { isAdvanced: true };
        const { wrapper } = mountJsonFormsComponent(HorizontalLayout, defaultProps);
        expect(wrapper.getComponent(HorizontalLayout).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', () => {
        defaultProps.layout.uischema.options = { isAdvanced: true };
        const { wrapper } = mountJsonFormsComponent(HorizontalLayout, defaultProps, true);
        expect(wrapper.getComponent(HorizontalLayout).isVisible()).toBe(true);
    });
});
