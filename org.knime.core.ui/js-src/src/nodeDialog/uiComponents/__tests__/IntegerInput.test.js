import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsControl } from '@@/test-setup/utils/jsonFormsTestUtils';
import IntegerInput from '../IntegerInput.vue';
import NumberInputBase from '../NumberInputBase.vue';
import ErrorMessage from '../ErrorMessage.vue';

describe('IntegerInput.vue', () => {
    let defaultProps, wrapper, component;

    beforeEach(async () => {
        defaultProps = {
            path: '',
            control: {
                visible: true,
                schema: {
                    properties: {
                        maxRows: {
                            type: 'integer',
                            title: 'Show tooltip'
                        }
                    }
                },
                uischema: {
                    type: 'Control',
                    scope: '#/properties/view/properties/maxRows',
                    options: {
                        format: 'integer'
                    }
                }
            }
        };
        component = await mountJsonFormsComponent(IntegerInput, { props: defaultProps });
        wrapper = component.wrapper;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });
    
    it('renders', () => {
        expect(wrapper.getComponent(IntegerInput).exists()).toBe(true);
        expect(wrapper.getComponent(NumberInputBase).exists()).toBe(true);
        expect(wrapper.getComponent(IntegerInput).getComponent(ErrorMessage).exists()).toBe(true);
    });

    it('passes default props', () => {
        const numberInputProps = wrapper.getComponent(NumberInputBase).props();
        expect(numberInputProps.type).toBe('integer');
    });

    it('initializes jsonforms on pass-through component', () => {
        initializesJsonFormsControl({
            wrapper: wrapper.getComponent(NumberInputBase),
            useJsonFormsControlSpy: component.useJsonFormsControlSpy
        });
    });

    it('checks that it is not rendered if it is an advanced setting', () => {
        defaultProps.control.uischema.options.isAdvanced = true;
        const { wrapper } = mountJsonFormsComponent(IntegerInput, { props: defaultProps });
        expect(wrapper.getComponent(NumberInputBase).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', () => {
        defaultProps.control.rootSchema = { showAdvancedSettings: true };
        defaultProps.control.uischema.options.isAdvanced = true;
        const { wrapper } = mountJsonFormsComponent(IntegerInput, { props: defaultProps });
        expect(wrapper.getComponent(NumberInputBase).isVisible()).toBe(true);
    });
});
