import { mountJsonFormsComponent, initializesJsonFormsControl, mountJsonFormsComponentWithStore }
    from '~/test/unit/suites/utils/jsonFormsTestUtils';
import SimpleTwinlistInput from '@/components/UIComponents/SimpleTwinlistInput.vue';
import LabeledInput from '@/components/UIComponents/LabeledInput.vue';
import Twinlist from '~/webapps-common/ui/components/forms/Twinlist.vue';

describe('SimpleTwinlistInput.vue', () => {
    const defaultPropsData = {
        control: {
            path: 'test',
            enabled: true,
            visible: true,
            label: 'defaultLabel',
            data: ['test_1'],
            schema: {
                anyOf:
                    [{
                        const: 'test_1',
                        title: 'test_1'
                    },
                    {
                        const: 'test_2',
                        title: 'test_2'
                    },
                    {
                        const: 'test_3',
                        title: 'test_3'
                    }]
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
        onChangeSpy = jest.spyOn(SimpleTwinlistInput.methods, 'onChange');
        SimpleTwinlistInput.methods.handleChange = jest.fn();
    });
    
    beforeEach(() => {
        wrapper = mountJsonFormsComponent(SimpleTwinlistInput, defaultPropsData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders', () => {
        expect(wrapper.getComponent(SimpleTwinlistInput).exists()).toBe(true);
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
        expect(wrapper.findComponent(Twinlist).exists()).toBe(true);
    });
    
    it('initializes jsonforms', () => {
        initializesJsonFormsControl(wrapper);
    });

    it('calls onChange when twinlist input is changed', async () => {
        const dirtySettingsMock = jest.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(SimpleTwinlistInput, defaultPropsData, {
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
            SimpleTwinlistInput,
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
                text: 'test_1'
            },
            {
                id: 'test_2',
                text: 'test_2'
            },
            {
                id: 'test_3',
                text: 'test_3'
            }]
        );
    });

    it('sets correct initial value', () => {
        expect(wrapper.findComponent(Twinlist).vm.chosenValues).toBe(defaultPropsData.control.data);
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
        const localWrapper = mountJsonFormsComponent(SimpleTwinlistInput, localDefaultPropsData);
        expect(localWrapper.vm.disabled).toBeTruthy();
    });

    it('moves missing values correctly', async () => {
        const dirtySettingsMock = jest.fn();
        const localProps = { ...defaultPropsData, control: { ...defaultPropsData.control, data: ['missing'] } };
        const localWrapper = await mountJsonFormsComponentWithStore(SimpleTwinlistInput, localProps, {
            'pagebuilder/dialog': {
                actions: { dirtySettings: dirtySettingsMock },
                namespaced: true
            }
        });
        expect(localWrapper.props().control.data).toStrictEqual(['missing']);
        await localWrapper.findComponent(Twinlist).findComponent({ ref: 'moveAllLeft' }).trigger('click');
        expect(onChangeSpy).toBeCalledWith([], true);
        await localWrapper.findComponent(Twinlist).findComponent({ ref: 'moveAllRight' }).trigger('click');
        expect(onChangeSpy).toBeCalledWith(['test_1', 'test_2', 'test_3'], true);
    });

    it('does not render content of SimpleTwinlistInput when visible is false', async () => {
        wrapper.setProps({ control: { ...defaultPropsData.control, visible: false } });
        await wrapper.vm.$nextTick(); // wait until pending promises are resolved
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
    });
});
