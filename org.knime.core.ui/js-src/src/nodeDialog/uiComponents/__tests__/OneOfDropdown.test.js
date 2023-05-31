import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsControl } from '@@/test-setup/utils/jsonFormsTestUtils';
import OneOfDropdown from '../OneOfDropdown.vue';
import DropdownInput from '../DropdownInput.vue';

describe('OneOfDropdown.vue', () => {
    let wrapper, props;

    beforeEach(async () => {
        props = {
            path: '',
            control: {
                label: 'Drop Down',
                schema: {
                    oneOf: [
                        {
                            const: 'Universe_0_0',
                            title: 'Universe_0_0'
                        },
                        {
                            const: 'Universe_0_1',
                            title: 'Universe_0_1'
                        },
                        {
                            const: 'Universe_1_0',
                            title: 'Universe_1_0'
                        },
                        {
                            const: 'Universe_1_1',
                            title: 'Universe_1_1'
                        }
                    ],
                    title: 'Y Axis Column'
                },
                uischema: {
                    type: 'Control',
                    scope: '#/properties/view/properties/yAxisColumn'
                }
            }
        };

        wrapper = await mountJsonFormsComponent(OneOfDropdown, props);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(OneOfDropdown).exists()).toBe(true);
        expect(wrapper.getComponent(DropdownInput).exists()).toBe(true);
    });

    it('passes default props', () => {
        const dropdownProps = wrapper.getComponent(DropdownInput).props();
        expect(dropdownProps.optionsGenerator).toBe(wrapper.vm.optionsGenerator);
    });

    it('initializes jsonforms on pass-through component', () => {
        initializesJsonFormsControl(wrapper.getComponent(DropdownInput));
    });

    it('optionsGenerator correctly transforms the data', async () => {
        await wrapper.vm.$nextTick();

        expect(wrapper.getComponent(OneOfDropdown).vm.optionsGenerator(props.control)).toEqual(
            [{
                id: 'Universe_0_0',
                text: 'Universe_0_0'
            },
            {
                id: 'Universe_0_1',
                text: 'Universe_0_1'
            },
            {
                id: 'Universe_1_0',
                text: 'Universe_1_0'
            },
            {
                id: 'Universe_1_1',
                text: 'Universe_1_1'
            }]
        );
    });
});
