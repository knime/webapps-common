import { mountJsonFormsComponent, initializesJsonFormsLayout } from '~/test/unit/suites/utils/jsonFormsTestUtils';
import HorizontalLayout from '@/components/LayoutComponents/HorizontalLayout';

describe('HorizontalLayout.vue', () => {
    const defaultPropsData = {
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
        wrapper = await mountJsonFormsComponent(HorizontalLayout, defaultPropsData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(HorizontalLayout).exists()).toBe(true);
    });
    
    it('initializes jsonforms', () => {
        initializesJsonFormsLayout(wrapper);
    });

    it('checks that it is not rendered if it is an advanced setting', async () => {
        defaultPropsData.layout.uischema.options = { isAdvanced: true };
        wrapper = await mountJsonFormsComponent(HorizontalLayout, defaultPropsData);
        expect(wrapper.getComponent(HorizontalLayout).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', async () => {
        defaultPropsData.layout.uischema.options = { isAdvanced: true };
        wrapper = await mountJsonFormsComponent(HorizontalLayout, defaultPropsData, true);
        expect(wrapper.getComponent(HorizontalLayout).isVisible()).toBe(true);
    });
});
