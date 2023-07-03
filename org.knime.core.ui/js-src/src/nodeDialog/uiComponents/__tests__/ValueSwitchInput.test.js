import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent } from '@@/test-setup/utils/jsonFormsTestUtils';
import RadioInputBase from '../RadioInputBase.vue';
import ValueSwitchInput from '../ValueSwitchInput.vue';
import LabeledInput from '../LabeledInput.vue';
import ValueSwitch from 'webapps-common/ui/components/forms/ValueSwitch.vue';
import BaseRadioButtons from 'webapps-common/ui/components/forms/BaseRadioButtons.vue';

describe('ValueSwitchInput.vue', () => {
    const defaultProps = {
        control: {
            path: 'test',
            enabled: true,
            visible: true,
            label: 'defaultLabel',
            data: 'LOG',
            schema: {
                oneOf: [
                    {
                        const: 'LOG',
                        title: 'Logarithmic'
                    },
                    {
                        const: 'VALUE',
                        title: 'Linear'
                    }
                ]
            },
            uischema: {
                type: 'Control',
                scope: '#/properties/yAxisScale',
                options: {
                    format: 'valueSwitch'
                }
            },
            rootSchema: {
                hasNodeView: true,
                flowVariablesMap: {}
            }
        }
    };

    let wrapper;

    beforeEach(async () => {
        const component = await mountJsonFormsComponent(ValueSwitchInput, defaultProps);
        wrapper = component.wrapper;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(ValueSwitchInput).exists()).toBe(true);
        expect(wrapper.getComponent(RadioInputBase).exists()).toBe(true);
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
        expect(wrapper.findComponent(ValueSwitch).exists()).toBe(true);
        expect(wrapper.findComponent(BaseRadioButtons).exists()).toBe(true);
    });

    it('sets correct type prop', () => {
        expect(wrapper.findComponent(RadioInputBase).props().type).toBe('valueSwitch');
    });
});
