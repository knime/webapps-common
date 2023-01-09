import { mountJsonFormsComponent, initializesJsonFormsControl, mountJsonFormsComponentWithStore }
    from '~/test/unit/suites/utils/jsonFormsTestUtils';
import TwinlistInput from '@/components/UIComponents/TwinlistInput.vue';
import LabeledInput from '@/components/UIComponents/LabeledInput.vue';
import Twinlist from '~/webapps-common/ui/components/forms/Twinlist.vue';

describe('TwinlistInput.vue', () => {
    const defaultPropsData = {
        control: {
            path: 'test',
            enabled: true,
            visible: true,
            label: 'defaultLabel',
            data: {
                selected: ['test_1'],
                manuallySelected: ['test_1'],
                isCaseSensitive: false,
                isInverted: false,
                mode: 'MANUAL',
                pattern: '',
                selectedTypes: ['String']
            },
            schema: {
                type: 'object',
                properties: {
                    isCaseSensitive: {
                        type: 'boolean'
                    },
                    isInverted: {
                        type: 'boolean'
                    },
                    manuallySelected: {
                        items: {
                            type: 'string'
                        },
                        type: 'array'
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
                    },
                    pattern: {
                        type: 'string'
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

    let wrapper, onChangeSpy;

    beforeAll(() => {
        onChangeSpy = jest.spyOn(TwinlistInput.methods, 'onChange');
        TwinlistInput.methods.handleChange = jest.fn();
    });
    
    beforeEach(() => {
        wrapper = mountJsonFormsComponent(TwinlistInput, defaultPropsData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(TwinlistInput).exists()).toBe(true);
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
        expect(wrapper.findComponent(Twinlist).exists()).toBe(true);
    });
    
    it('initializes jsonforms', () => {
        initializesJsonFormsControl(wrapper);
    });

    it('calls onChange when twinlist input is changed', async () => {
        const dirtySettingsMock = jest.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(TwinlistInput, defaultPropsData, {
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
        const localWrapper = await mountJsonFormsComponentWithStore(
            TwinlistInput,
            {
                ...defaultPropsData,
                control: {
                    ...defaultPropsData.control,
                    uischema: {
                        ...defaultPropsData.control.schema,
                        scope: '#/properties/model/properties/yAxisColumn'
                    }
                }
            },
            {
                'pagebuilder/dialog': {
                    actions: { dirtySettings: dirtySettingsMock },
                    namespaced: true
                }
            }
        );
        await localWrapper.findComponent(Twinlist).findComponent({ ref: 'moveAllRight' }).trigger('click');
        expect(onChangeSpy).toBeCalled();
        expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true, expect.undefined);
    });

    it('correctly transforms the data into possible values', () => {
        expect(wrapper.findComponent(Twinlist).props().possibleValues).toEqual(
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

    it('sets correct initial value', () => {
        expect(wrapper.findComponent(Twinlist).vm.initialPattern).toBe(defaultPropsData.control.data.pattern);
        expect(wrapper.findComponent(Twinlist).vm.initialSelectedTypes).toBe(
            defaultPropsData.control.data.selectedTypes
        );
        expect(wrapper.findComponent(Twinlist).vm.initialManuallySelected).toBe(
            defaultPropsData.control.data.manuallySelected
        );
        expect(wrapper.findComponent(Twinlist).vm.initialMode).toBe('manual');
    });
    

    it('sets correct label', () => {
        expect(wrapper.findComponent('label').text()).toBe(defaultPropsData.control.label);
    });

    it('disables twinlist when controlled by a flow variable', () => {
        const localDefaultPropsData = JSON.parse(JSON.stringify(defaultPropsData));
        localDefaultPropsData.control.rootSchema
            .flowVariablesMap[defaultPropsData.control.path] = {
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
        const localProps = { ...defaultPropsData,
            control: { ...defaultPropsData.control,
                data: { ...defaultPropsData.control.data, manuallySelected: ['missing'] } } };
        const localWrapper = await mountJsonFormsComponentWithStore(TwinlistInput, localProps, {
            'pagebuilder/dialog': {
                actions: { dirtySettings: dirtySettingsMock },
                namespaced: true
            }
        });
        expect(localWrapper.props().control.data).toMatchObject({ manuallySelected: ['missing'] });
        await localWrapper.findComponent(Twinlist).findComponent({ ref: 'moveAllLeft' }).trigger('click');
        expect(onChangeSpy).toBeCalledWith({ manuallySelected: [], selected: [] });
        await localWrapper.findComponent(Twinlist).findComponent({ ref: 'moveAllRight' }).trigger('click');
        expect(onChangeSpy).toBeCalledWith({
            manuallySelected: ['test_1', 'test_2', 'test_3'],
            selected: ['test_1', 'test_2', 'test_3']
        });
    });

    it('does not render content of TwinlistInput when visible is false', async () => {
        wrapper.setProps({ control: { ...defaultPropsData.control, visible: false } });
        await wrapper.vm.$nextTick(); // wait until pending promises are resolved
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
    });
});
