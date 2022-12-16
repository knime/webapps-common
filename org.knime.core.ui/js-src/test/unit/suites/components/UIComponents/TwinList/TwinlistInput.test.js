import { mountJsonFormsComponent, initializesJsonFormsControl, mountJsonFormsComponentWithStore }
    from '~/test/unit/suites/utils/jsonFormsTestUtils';
import TwinlistInput from '@/components/UIComponents/TwinlistInput.vue';
import LabeledInput from '@/components/UIComponents/LabeledInput.vue';
import MultiModeTwinlist from '~/webapps-common/ui/components/forms/MultiModeTwinlist.vue';
import Twinlist from '~/webapps-common/ui/components/forms/Twinlist.vue';

describe('TwinlistInput.vue', () => {
    let propsData;

    beforeEach(() => {
        propsData = {
            control: {
                path: 'test',
                enabled: true,
                visible: true,
                label: 'defaultLabel',
                data: {
                    selected: ['test_1'],
                    manualFilter: {
                        manuallySelected: ['test_1']
                    },
                    patternFilter: {
                        isCaseSensitive: false,
                        isInverted: false,
                        pattern: ''
                    },
                    typeFilter: {
                        selectedTypes: ['String']
                    },
                    mode: 'MANUAL'
                },
                schema: {
                    type: 'object',
                    properties: {
                        patternFilter: {
                            type: 'object',
                            properties: {
                                isCaseSensitive: {
                                    type: 'boolean'
                                },
                                isInverted: {
                                    type: 'boolean'
                                },
                                pattern: {
                                    type: 'string'
                                }
                            }
                        },
                        manualFilter: {
                            type: 'object',
                            properties: {
                                manuallySelected: {
                                    items: {
                                        type: 'string'
                                    },
                                    type: 'array'
                                }
                            }
                        },
                        typeFilter: {
                            type: 'object',
                            properties: {
                                selectedTypes: {
                                    items: {
                                        type: 'string'
                                    },
                                    type: 'array'
                                }
                            }
                        },
                        mode: {
                            oneOf: [
                                {
                                    const: 'MANUAL',
                                    title: 'Manual'
                                },
                                {
                                    const: 'REGEX',
                                    title: 'Regex'
                                },
                                {
                                    const: 'WILDCARD',
                                    title: 'Wildcard'
                                },
                                {
                                    const: 'TYPE',
                                    title: 'Type'
                                }
                            ]
                        },
                        selected: {
                            anyOf:
                                [{
                                    const: 'test_1',
                                    title: 'test_1',
                                    columnType: 'String'
                                },
                                {
                                    const: 'test_2',
                                    title: 'test_2',
                                    columnType: 'Double'
                                },
                                {
                                    const: 'test_3',
                                    title: 'test_3',
                                    columnType: 'String'
                                }]
                        }
                    }
                },
                uischema: {},
                rootSchema: {
                    hasNodeView: true,
                    flowVariablesMap: {}
                }
            }
        };
    });


    let wrapper, onChangeSpy;

    beforeAll(() => {
        onChangeSpy = jest.spyOn(TwinlistInput.methods, 'onChange');
        TwinlistInput.methods.handleChange = jest.fn();
    });
    
    beforeEach(() => {
        wrapper = mountJsonFormsComponent(TwinlistInput, propsData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(TwinlistInput).exists()).toBe(true);
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
        expect(wrapper.findComponent(MultiModeTwinlist).exists()).toBe(true);
    });
    
    it('initializes jsonforms', () => {
        initializesJsonFormsControl(wrapper);
    });

    it('calls onChange when twinlist input is changed', async () => {
        const dirtySettingsMock = jest.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(TwinlistInput, propsData, {
            'pagebuilder/dialog': {
                actions: { dirtySettings: dirtySettingsMock },
                namespaced: true
            }
        });
        await localWrapper.findComponent(Twinlist).findComponent({ ref: 'moveAllRight' }).trigger('click');
        expect(onChangeSpy).toBeCalled();
        expect(dirtySettingsMock).not.toHaveBeenCalled();
    });

    it('indicates model settings change when model setting is changed', async () => {
        const dirtySettingsMock = jest.fn();
        propsData.control.uischema.scope = '#/properties/model/properties/yAxisColumn';
        const localWrapper = await mountJsonFormsComponentWithStore(TwinlistInput, propsData, {
            'pagebuilder/dialog': {
                actions: { dirtySettings: dirtySettingsMock },
                namespaced: true
            }
        });
        await localWrapper.findComponent(Twinlist).findComponent({ ref: 'moveAllRight' }).trigger('click');
        expect(onChangeSpy).toBeCalled();
        expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true, expect.undefined);
    });

    it('correctly transforms the data into possible values', () => {
        expect(wrapper.findComponent(MultiModeTwinlist).props().possibleValues).toEqual(
            [{
                id: 'test_1',
                text: 'test_1',
                type: 'String'
            },
            {
                id: 'test_2',
                text: 'test_2',
                type: 'Double'
            },
            {
                id: 'test_3',
                text: 'test_3',
                type: 'String'
            }]
        );
    });

    it('transforms empty anyof into empty possible values', async () => {
        propsData.control.schema.properties.selected.anyOf = [{ const: '', title: '' }];
        const localWrapper = await mountJsonFormsComponentWithStore(
            TwinlistInput,
            propsData
        );
        expect(localWrapper.findComponent(Twinlist).props().possibleValues).toEqual([]);
    });

    it('sets correct initial value', () => {
        expect(wrapper.findComponent(MultiModeTwinlist).vm.initialPattern).toBe(propsData.control.data.patternFilter.pattern);
        expect(wrapper.findComponent(MultiModeTwinlist).vm.initialSelectedTypes).toBe(
            propsData.control.data.typeFilter.selectedTypes
        );
        expect(wrapper.findComponent(MultiModeTwinlist).vm.initialManuallySelected).toBe(
            propsData.control.data.manualFilter.manuallySelected
        );
        expect(wrapper.findComponent(MultiModeTwinlist).vm.initialMode).toBe('manual');
    });
    

    it('sets correct label', () => {
        expect(wrapper.findComponent('label').text()).toBe(propsData.control.label);
    });

    it('disables twinlist when controlled by a flow variable', () => {
        const localDefaultPropsData = JSON.parse(JSON.stringify(propsData));
        localDefaultPropsData.control.rootSchema
            .flowVariablesMap[propsData.control.path] = {
                controllingFlowVariableAvailable: true,
                controllingFlowVariableName: 'knime.test',
                exposedFlowVariableName: 'test',
                leaf: true
            };
        const localWrapper = mountJsonFormsComponent(TwinlistInput, localDefaultPropsData);
        expect(localWrapper.vm.disabled).toBeTruthy();
    });

    it('moves missing values correctly', async () => {
        const dirtySettingsMock = jest.fn();
        const localProps = { ...propsData,
            control: { ...propsData.control,
                data: { ...propsData.control.data, manualFilter: { manuallySelected: ['missing'] } } } };
        const localWrapper = await mountJsonFormsComponentWithStore(TwinlistInput, localProps, {
            'pagebuilder/dialog': {
                actions: { dirtySettings: dirtySettingsMock },
                namespaced: true
            }
        });
        expect(localWrapper.props().control.data.manualFilter).toMatchObject({ manuallySelected: ['missing'] });
        await localWrapper.findComponent(Twinlist).findComponent({ ref: 'moveAllLeft' }).trigger('click');
        expect(onChangeSpy).toBeCalledWith({ manualFilter: { manuallySelected: [] }, selected: [] });
        await localWrapper.findComponent(Twinlist).findComponent({ ref: 'moveAllRight' }).trigger('click');
        expect(onChangeSpy).toBeCalledWith({
            manualFilter: { manuallySelected: ['test_1', 'test_2', 'test_3'] },
            selected: ['test_1', 'test_2', 'test_3']
        });
    });

    it('does not render content of TwinlistInput when visible is false', async () => {
        wrapper.setProps({ control: { ...propsData.control, visible: false } });
        await wrapper.vm.$nextTick(); // wait until pending promises are resolved
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
    });
});
