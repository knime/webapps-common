import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsControl } from '@@/test-setup/utils/jsonFormsTestUtils';
import ColumnSelect from '../ColumnSelect.vue';
import DropdownInput from '../DropdownInput.vue';
import Dropdown from 'webapps-common/ui/components/forms/Dropdown.vue';


describe('ColumnSelect.vue', () => {
    let wrapper, props, path;

    beforeEach(async () => {
        path = 'control path mock';
        props = {
            control: {
                path,
                visible: true,
                data: {
                    selected: 'Universe_0_0'
                },
                label: 'Column Selection',
                schema: {
                    type: 'object',
                    properties: {
                        selected: {
                            type: 'array'
                        }
                    },
                    title: 'Y Axis Column'
                },
                uischema: {
                    type: 'Control',
                    scope: '#/properties/view/properties/yAxisColumn',
                    options: {
                        format: 'columnSelection',
                        showRowKeys: false,
                        showNoneColumn: false,
                        possibleValues: [
                            {
                                id: 'Universe_0_0',
                                text: 'Universe_0_0',
                                compatibleTypes: ['Type_0_0', 'OtherType_0_0']
                            },
                            {
                                id: 'Universe_0_1',
                                text: 'Universe_0_1',
                                compatibleTypes: ['Type_0_1', 'OtherType_0_1']
                            },
                            {
                                id: 'Universe_1_0',
                                text: 'Universe_1_0',
                                compatibleTypes: ['Type_1_0', 'OtherType_1_0']
                            },
                            {
                                id: 'Universe_1_1',
                                text: 'Universe_1_1',
                                compatibleTypes: ['Type_1_1', 'OtherType_1_1']
                            }
                        ]
                    }
                }
            }
        };
        wrapper = await mountJsonFormsComponent(ColumnSelect, props);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(ColumnSelect).exists()).toBe(true);
        expect(wrapper.getComponent(DropdownInput).exists()).toBe(true);
    });

    it('passes default props', () => {
        const dropdownProps = wrapper.getComponent(DropdownInput).props();
        expect(dropdownProps.optionsGenerator).toBe(wrapper.vm.optionsGenerator);
    });

    it('initializes jsonforms on pass-through component', () => {
        initializesJsonFormsControl(wrapper.getComponent(DropdownInput));
    });

    describe('compatible types', () => {
        it('updates compatible types when mounted', () => {
            const dropdownInput = wrapper.findComponent(DropdownInput);
            expect(dropdownInput.vm.handleChange).toHaveBeenCalledWith(path, {
                selected: 'Universe_0_0',
                compatibleTypes: ['Type_0_0', 'OtherType_0_0']
            });
        });

        it('updates compatible types on value change', () => {
            const dropdownInput = wrapper.findComponent(DropdownInput);
            const dropdown = dropdownInput.findComponent(Dropdown);
            dropdown.vm.$emit('update:modelValue', 'Universe_1_1');
            expect(dropdownInput.vm.handleChange).toHaveBeenNthCalledWith(2, path, {
                selected: 'Universe_1_1',
                compatibleTypes: ['Type_1_1', 'OtherType_1_1']
            });
        });
    });

    describe('optionsGenerator', () => {
        it('optionsGenerator correctly transforms the data', async () => {
            await wrapper.vm.$nextTick();
    
            expect(wrapper.getComponent(ColumnSelect).vm.optionsGenerator(props.control)).toEqual(
                [
                    expect.objectContaining({
                        id: 'Universe_0_0',
                        text: 'Universe_0_0'
                    }),
                    expect.objectContaining({
                        id: 'Universe_0_1',
                        text: 'Universe_0_1'
                    }),
                    expect.objectContaining({
                        id: 'Universe_1_0',
                        text: 'Universe_1_0'
                    }),
                    expect.objectContaining({
                        id: 'Universe_1_1',
                        text: 'Universe_1_1'
                    })
                ]
            );
        });
    
        it('optionsGenerator correctly transforms the data with none column and row keys', async () => {
            await wrapper.vm.$nextTick();
            props.control.uischema.options.showNoneColumn = true;
            props.control.uischema.options.showRowKeys = true;
            
            const tmp = wrapper.getComponent(ColumnSelect).vm.optionsGenerator(props.control);
            expect(tmp).toEqual(
                [expect.objectContaining({
                    id: '<none>',
                    text: 'None'
                }),
                expect.objectContaining({
                    id: '<row-keys>',
                    text: 'RowIDs'
                }),
                expect.objectContaining({
                    id: 'Universe_0_0',
                    text: 'Universe_0_0'
                }),
                expect.objectContaining({
                    id: 'Universe_0_1',
                    text: 'Universe_0_1'
                }),
                expect.objectContaining({
                    id: 'Universe_1_0',
                    text: 'Universe_1_0'
                }),
                expect.objectContaining({
                    id: 'Universe_1_1',
                    text: 'Universe_1_1'
                })]
            );
        });
    });
});
