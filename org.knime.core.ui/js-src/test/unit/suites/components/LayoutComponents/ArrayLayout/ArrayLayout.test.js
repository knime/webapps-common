/* eslint-disable no-undefined */
import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { mountJsonFormsComponent, initializesJsonFormsArrayControl } from '@@/test-setup/utils/jsonFormsTestUtils';
import ArrayLayout from '@/components/LayoutComponents/ArrayLayout.vue';
import ArrayLayoutItemControls from '@/components/LayoutComponents/ArrayLayoutItemControls.vue';
import FunctionButton from 'webapps-common/ui/components/FunctionButton.vue';
import ArrowUpIcon from 'webapps-common/ui/assets/img/icons/arrow-up.svg';
import ArrowDownIcon from 'webapps-common/ui/assets/img/icons/arrow-down.svg';
import TrashIcon from 'webapps-common/ui/assets/img/icons/trash.svg';

describe('ArrayLayout.vue', () => {
    let wrapper, props;

    beforeEach(async () => {
        props = {
            control: {
                visible: true,
                cells: [],
                data: [{
                    borderStyle: 'DASHED',
                    color: 'blue',
                    label: undefined,
                    size: 1,
                    value: '0'
                },
                {
                    borderStyle: 'DOTTED',
                    color: 'red',
                    label: undefined,
                    size: 1,
                    value: '1'
                },
                {
                    borderStyle: 'SOLID',
                    color: 'green',
                    label: undefined,
                    size: 1,
                    value: '2'
                }],
                path: 'view/referenceLines',
                schema: {
                    type: 'object',
                    properties: {
                        borderStyle: {
                            oneOf: [{
                                const: 'DASHED',
                                title: 'Dashed'
                            },
                            {
                                const: 'DOTTED',
                                title: 'Dotted'
                            },
                            {
                                const: 'SOLID',
                                title: 'Solid'
                            }],
                            title: 'Borderstyle',
                            default: 'DASHED'
                        },
                        color: {
                            type: 'string',
                            title: 'Color',
                            default: 'blue'
                        },
                        label: {
                            type: 'string',
                            title: 'Label'
                        },
                        size: {
                            type: 'integer',
                            format: 'int32',
                            title: 'Size',
                            default: 1,
                            minimum: 0,
                            maximum: 10
                        },
                        value: {
                            type: 'string',
                            title: 'Value',
                            default: '0'
                        }
                        
                    }
                },
                uischema: {
                    type: 'Control',
                    scope: '#/properties/view/properties/referenceLines',
                    options: {
                        arrayElementTitle: 'ElementTitle',
                        detail: {
                            value: {
                                type: 'Control',
                                scope: '#/properties/value'
                            },
                            label: {
                                type: 'Control',
                                scope: '#/properties/label'
                            },
                            borderStyle: {
                                type: 'Control',
                                scope: '#/properties/borderStyle',
                                options: {
                                    format: 'radio',
                                    radioLayout: 'horizontal'
                                }
                            },
                            horizontalLayout: {
                                type: 'HorizontalLayout',
                                elements: [
                                    { type: 'Control', scope: '#/properties/size' },
                                    { type: 'Control', scope: '#/properties/color' }
                                ]
                            }
                        }
                    }
                }
            }
        };
        wrapper = await mountJsonFormsComponent(ArrayLayout, props);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(ArrayLayout).exists()).toBe(true);
    });
    
    it('initializes jsonforms', () => {
        initializesJsonFormsArrayControl(wrapper);
    });

    it('creates a default value', () => {
        const expectedDefaultValue = {
            borderStyle: 'DASHED',
            color: 'blue',
            label: undefined,
            size: 1,
            value: '0'
        };
        expect(wrapper.getComponent(ArrayLayout).vm.createDefaultValue(props.control.schema))
            .toStrictEqual(expectedDefaultValue);
    });

    it('adds default item', async () => {
        const addItemSpy = ArrayLayout.methods.addItem = vi.fn().mockReturnValue(() => false);
        wrapper = await mountJsonFormsComponent(ArrayLayout, props);
        wrapper.vm.addDefaultItem();
        expect(addItemSpy).toHaveBeenCalled();
    });


    it('deletes item', async () => {
        const deleteItemSpy = ArrayLayout.methods.deleteItem = vi.fn().mockReturnValue(() => false);
        wrapper = await mountJsonFormsComponent(ArrayLayout, props);
        wrapper.vm.deleteItem();
        expect(deleteItemSpy).toHaveBeenCalled();
    });

    it('does not render sort buttons when showSortButtons is not present or false', async () => {
        wrapper = await mountJsonFormsComponent(ArrayLayout, props);
        const numberDataItems = props.control.data.length;
        const itemControls = wrapper.findAllComponents(ArrayLayoutItemControls);

        expect(itemControls).toHaveLength(numberDataItems);
        const itemControlsWithArrowUp = itemControls.filter(
            wrapper => wrapper.findComponent(ArrowUpIcon).exists()
        );
        const itemControlsWithArrowDown = itemControls.filter(
            wrapper => wrapper.findComponent(ArrowDownIcon).exists()
        );
        const itemControlsWithTrash = itemControls.filter(
            wrapper => wrapper.findComponent(TrashIcon).exists()
        );

        expect(itemControlsWithArrowUp).toHaveLength(0);
        expect(itemControlsWithArrowDown).toHaveLength(0);
        expect(itemControlsWithTrash).toHaveLength(numberDataItems);
    });

    it('renders headers', async () => {
        wrapper = await mountJsonFormsComponent(ArrayLayout, props);
        expect(wrapper.find('.item-header').exists()).toBeTruthy();
        expect(wrapper.find('.item-header').text()).toBe('ElementTitle 1');
    });

    it('does not render headers but renders controls if arrayElementTitle is missing', async () => {
        delete props.control.uischema.options.arrayElementTitle;
        wrapper = await mountJsonFormsComponent(ArrayLayout, props);
        expect(wrapper.find('.item-header').exists()).toBeFalsy();
        const numberDataItems = props.control.data.length;
        const itemControls = wrapper.findAllComponents(ArrayLayoutItemControls);
        expect(itemControls).toHaveLength(numberDataItems);
    });

    test.each([
        { button: 'move up button', position: 'the first', itemNum: 0, moveUpDisabled: true, moveDownDisabled: false },
        { button: 'none of the sort buttons',
            position: 'any non-boundary',
            itemNum: 1,
            moveUpDisabled: false,
            moveDownDisabled: false },
        { button: 'move down button', position: 'the last', itemNum: 2, moveUpDisabled: false, moveDownDisabled: true }
    ])('disables $button for $position item when showSortButtons is true',
        async ({ itemNum, moveUpDisabled, moveDownDisabled }) => {
            props.control.uischema.options.showSortButtons = true;
            wrapper = await mountJsonFormsComponent(ArrayLayout, props);
            const itemControls = wrapper.findAll('.item-controls');
            const itemControlsButtons = itemControls.at(itemNum).findAllComponents(FunctionButton);
            expect(itemControlsButtons.at(0).vm.disabled).toBe(moveUpDisabled);
            expect(itemControlsButtons.at(1).vm.disabled).toBe(moveDownDisabled);
        });
});
