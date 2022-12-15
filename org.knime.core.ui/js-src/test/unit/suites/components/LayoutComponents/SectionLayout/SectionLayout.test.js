import { mountJsonFormsComponent, initializesJsonFormsLayout } from '~/test/unit/suites/utils/jsonFormsTestUtils';
import SectionLayout from '@/components/LayoutComponents/SectionLayout.vue';

describe('SectionLayout.vue', () => {
    let defaultPropsData, wrapper;

    beforeEach(async () => {
        defaultPropsData = {
            layout: {
                cells: [],
                data: {
                    view: {
                        xAxisLabel: 'xAxisLabel'
                    }
                },
                path: '',
                schema: {
                    properties: {
                        xAxisLabel: {
                            type: 'string',
                            title: 'X Axis Label'
                        }
                    }
                },
                uischema: {
                    type: 'Section',
                    label: 'Interactivity',
                    elements: [
                        {
                            type: 'Control',
                            scope: '#/properties/view/properties/xAxisLabel'
                        }
                    ],
                    options: {
                        isAdvanced: false
                    }
                },
                visible: true
            }
        };

        wrapper = await mountJsonFormsComponent(SectionLayout, defaultPropsData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(SectionLayout).exists()).toBe(true);
    });
    
    it('initializes jsonforms', () => {
        initializesJsonFormsLayout(wrapper);
    });

    it('checks that it is not rendered if it is an advanced setting', async () => {
        defaultPropsData.layout.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(SectionLayout, defaultPropsData);
        expect(wrapper.getComponent(SectionLayout).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', async () => {
        defaultPropsData.layout.schema = { showAdvancedSettings: true };
        defaultPropsData.layout.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(SectionLayout, defaultPropsData);
        expect(wrapper.getComponent(SectionLayout).isVisible()).toBe(true);
    });
});
