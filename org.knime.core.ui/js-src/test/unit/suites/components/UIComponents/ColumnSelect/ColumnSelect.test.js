import { mountJsonFormsComponent, initializesJsonFormsControl } from '~/test/unit/suites/utils/jsonFormsTestUtils';
import ColumnSelect from '@/components/UIComponents/ColumnSelect.vue';
import DropdownInput from '@/components/UIComponents/DropdownInput.vue';

describe('ColumnSelect.vue', () => {
    let wrapper, propsData;

    beforeEach(async () => {
        propsData = {
            path: '',
            control: {
                label: 'Column Selection',
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
                    scope: '#/properties/view/properties/yAxisColumn',
                    options: {
                        format: 'columnSelection',
                        showRowKeys: false,
                        showNoneColumn: false
                    }
                }
            }
        };

        wrapper = await mountJsonFormsComponent(ColumnSelect, propsData);
    });

    afterEach(() => {
        jest.clearAllMocks();
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

    it('optionsGenerator correctly transforms the data', async () => {
        await wrapper.vm.$nextTick();

        expect(wrapper.getComponent(ColumnSelect).vm.optionsGenerator(propsData.control)).toEqual(
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

    it('optionsGenerator correctly transforms the data with none column and row keys', async () => {
        await wrapper.vm.$nextTick();
        propsData.control.uischema.options.showNoneColumn = true;
        propsData.control.uischema.options.showRowKeys = true;
        
        const tmp = wrapper.getComponent(ColumnSelect).vm.optionsGenerator(propsData.control);
        expect(tmp).toEqual(
            [{
                id: '<none>',
                text: 'None'
            },
            {
                id: '<row-keys>',
                text: 'RowIDs'
            },
            {
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

    it('optionsGenerator removes empty element coming because oneOfs cant be empty', async () => {
        await wrapper.vm.$nextTick();
        propsData.control.schema.oneOf = [{ const: '', title: '' }];
        
        const tmp = wrapper.getComponent(ColumnSelect).vm.optionsGenerator(propsData.control);
        expect(tmp).toEqual([]);
    });

    it('optionsGenerator removes empty element coming because oneOfs can\'t be empty with special rows', async () => {
        await wrapper.vm.$nextTick();
        propsData.control.schema.oneOf = [{ const: '', title: '' }];
        propsData.control.uischema.options.showNoneColumn = true;
        propsData.control.uischema.options.showRowKeys = true;
        
        const tmp = wrapper.getComponent(ColumnSelect).vm.optionsGenerator(propsData.control);
        expect(tmp).toEqual(
            [{
                id: '<none>',
                text: 'None'
            },
            {
                id: '<row-keys>',
                text: 'RowIDs'
            }]
        );
    });
});
