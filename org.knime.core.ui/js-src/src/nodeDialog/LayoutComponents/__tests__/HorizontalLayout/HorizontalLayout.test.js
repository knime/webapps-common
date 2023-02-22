import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsLayout } from '@@/test-setup/utils/jsonFormsTestUtils';
import HorizontalLayout from '@/nodeDialog/LayoutComponents/HorizontalLayout.vue';

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

    beforeEach(async () => {
        wrapper = await mountJsonFormsComponent(HorizontalLayout, defaultProps);
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

    it('checks that it is not rendered if it is an advanced setting', async () => {
        defaultProps.layout.uischema.options = { isAdvanced: true };
        wrapper = await mountJsonFormsComponent(HorizontalLayout, defaultProps);
        expect(wrapper.getComponent(HorizontalLayout).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', async () => {
        defaultProps.layout.uischema.options = { isAdvanced: true };
        wrapper = await mountJsonFormsComponent(HorizontalLayout, defaultProps, true);
        expect(wrapper.getComponent(HorizontalLayout).isVisible()).toBe(true);
    });
});
