/* eslint-disable no-undefined */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { mountJsonFormsComponent, initializesJsonFormsArrayControl } from '@@/test-setup/utils/jsonFormsTestUtils';
import ArrayLayout from '../ArrayLayout.vue';
import ArrayLayoutItemControls from '../ArrayLayoutItemControls.vue';
import FunctionButton from 'webapps-common/ui/components/FunctionButton.vue';
import ArrowUpIcon from 'webapps-common/ui/assets/img/icons/arrow-up.svg';
import ArrowDownIcon from 'webapps-common/ui/assets/img/icons/arrow-down.svg';
import TrashIcon from 'webapps-common/ui/assets/img/icons/trash.svg';

const useJsonFormsControlMock = {
    handleChange: vi.fn(),
    control: ref({ path: 'foo', data: 'bar' })
};

vi.mock('@/nodeDialog/uiComponents/composables/jsonFormsControlWithUpdate', () => ({
    useJsonFormsControlWithUpdate: () => useJsonFormsControlMock
}));

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
        const component = await mountJsonFormsComponent(ArrayLayout, props);
        wrapper = component.wrapper;
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

    it('renders an add button', () => {
        const { wrapper } = mountJsonFormsComponent(ArrayLayout, props);
        const addButton = wrapper.find('.array > button');
        expect(addButton.text()).toBe('New');
        addButton.element.click();
        expect(wrapper.vm.addItem).toHaveBeenCalled();
    });


    it('sets add button text', () => {
        const customAddButtonText = 'My add button text';
        props.control.uischema.options.addButtonText = customAddButtonText;
        const { wrapper } = mountJsonFormsComponent(ArrayLayout, props);
        const addButton = wrapper.find('.array > button');
        expect(addButton.text()).toBe(customAddButtonText);
    });

    it('adds default item', () => {
        const { wrapper } = mountJsonFormsComponent(ArrayLayout, props);
        wrapper.vm.addDefaultItem();
        expect(wrapper.vm.addItem).toHaveBeenCalled();
        expect(useJsonFormsControlMock.handleChange).toHaveBeenCalledWith(
            useJsonFormsControlMock.control.value.path,
            useJsonFormsControlMock.control.value.data
        );
    });


    it('deletes item', () => {
        const { wrapper } = mountJsonFormsComponent(ArrayLayout, props);
        wrapper.vm.deleteItem();
        expect(wrapper.vm.removeItems).toHaveBeenCalled();
        expect(useJsonFormsControlMock.handleChange).toHaveBeenCalledWith(
            useJsonFormsControlMock.control.value.path,
            useJsonFormsControlMock.control.value.data
        );
    });

    it('moves item up', async () => {
        const { wrapper } = mountJsonFormsComponent(ArrayLayout, props);
        const index = 1;
        await wrapper
            .findAllComponents(ArrayLayoutItemControls)
            .at(index)
            .vm.$emit('moveUp');
        expect(wrapper.vm.moveUp).toHaveBeenCalledWith(props.control.path, index);
        expect(useJsonFormsControlMock.handleChange).toHaveBeenCalledWith(
            useJsonFormsControlMock.control.value.path,
            useJsonFormsControlMock.control.value.data
        );
    });

    it('moves item down', async () => {
        const { wrapper } = mountJsonFormsComponent(ArrayLayout, props);
        const index = 1;
        await wrapper
            .findAllComponents(ArrayLayoutItemControls)
            .at(index)
            .vm.$emit('moveDown');
        expect(wrapper.vm.moveDown).toHaveBeenCalledWith(props.control.path, index);
        expect(useJsonFormsControlMock.handleChange).toHaveBeenCalledWith(
            useJsonFormsControlMock.control.value.path,
            useJsonFormsControlMock.control.value.data
        );
    });


    it('does not render sort buttons when showSortButtons is not present or false', () => {
        const { wrapper } = mountJsonFormsComponent(ArrayLayout, props);
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

    it('renders headers', () => {
        const { wrapper } = mountJsonFormsComponent(ArrayLayout, props);
        expect(wrapper.find('.item-header').exists()).toBeTruthy();
        expect(wrapper.find('.item-header').text()).toBe('ElementTitle 1');
    });

    it('does not render headers but renders controls if arrayElementTitle is missing', () => {
        delete props.control.uischema.options.arrayElementTitle;
        const { wrapper } = mountJsonFormsComponent(ArrayLayout, props);
        expect(wrapper.find('.item-header').exists()).toBeFalsy();
        const numberDataItems = props.control.data.length;
        const itemControls = wrapper.findAllComponents(ArrayLayoutItemControls);
        expect(itemControls).toHaveLength(numberDataItems);
    });

    it.each([
        { button: 'move up button', position: 'the first', itemNum: 0, moveUpDisabled: true, moveDownDisabled: false },
        { button: 'none of the sort buttons',
            position: 'any non-boundary',
            itemNum: 1,
            moveUpDisabled: false,
            moveDownDisabled: false },
        { button: 'move down button', position: 'the last', itemNum: 2, moveUpDisabled: false, moveDownDisabled: true }
    ])('disables $button for $position item when showSortButtons is true',
        ({ itemNum, moveUpDisabled, moveDownDisabled }) => {
            props.control.uischema.options.showSortButtons = true;
            const { wrapper } = mountJsonFormsComponent(ArrayLayout, props);
            const itemControls = wrapper.findAll('.item-controls');
            const itemControlsButtons = itemControls.at(itemNum).findAllComponents(FunctionButton);
            expect(itemControlsButtons.at(0).vm.disabled).toBe(moveUpDisabled);
            expect(itemControlsButtons.at(1).vm.disabled).toBe(moveDownDisabled);
        });
});
