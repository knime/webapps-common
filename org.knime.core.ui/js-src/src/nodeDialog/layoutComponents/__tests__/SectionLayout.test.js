import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsLayout } from '@@/test-setup/utils/jsonFormsTestUtils';
import SectionLayout from '../SectionLayout.vue';

describe('SectionLayout.vue', () => {
    let defaultProps, wrapper;

    beforeEach(async () => {
        defaultProps = {
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

        const component = await mountJsonFormsComponent(SectionLayout, { props: defaultProps });
        wrapper = component.wrapper;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(SectionLayout).exists()).toBe(true);
    });
    
    it('initializes jsonforms', () => {
        initializesJsonFormsLayout(wrapper);
    });

    it('checks that it is not rendered if it is an advanced setting', async () => {
        defaultProps.layout.uischema.options.isAdvanced = true;
        const { wrapper } = await mountJsonFormsComponent(SectionLayout, { props: defaultProps });
        expect(wrapper.getComponent(SectionLayout).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', async () => {
        defaultProps.layout.uischema.options.isAdvanced = true;
        const { wrapper } = await mountJsonFormsComponent(SectionLayout, { props: defaultProps, showAdvanced: true });
        expect(wrapper.getComponent(SectionLayout).isVisible()).toBe(true);
    });
});
