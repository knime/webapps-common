import { mountJsonFormsComponent, initializesJsonFormsControl, mountJsonFormsComponentWithStore }
    from '~/test/unit/suites/utils/jsonFormsTestUtils';
import NumberInput from '@/components/UIComponents/NumberInput.vue';
import NumberInputBase from '@/components/UIComponents/NumberInputBase.vue';
import ErrorMessage from '@/components/UIComponents/ErrorMessage.vue';
import LabeledInput from '@/components/UIComponents/LabeledInput.vue';

describe('NumberInput.vue', () => {
    let defaultPropsData, wrapper, onChangeSpy;

    beforeAll(() => {
        onChangeSpy = jest.spyOn(NumberInputBase.methods, 'onChange');
        NumberInputBase.methods.handleChange = jest.fn();
    });

    beforeEach(async () => {
        defaultPropsData = {
            control: {
                path: 'test',
                enabled: true,
                visible: true,
                label: 'defaultLabel',
                schema: {
                    properties: {
                        maxRows: {
                            type: 'double',
                            title: 'Show tooltip'
                        }
                    }
                },
                uischema: {
                    type: 'Control',
                    scope: '#/properties/view/properties/maxRows',
                    options: {
                        format: 'double'
                    }
                },
                rootSchema: {
                    hasNodeView: true,
                    flowVariablesMap: {}
                }
            }
        };
        
        wrapper = await mountJsonFormsComponent(NumberInput, defaultPropsData);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('renders', () => {
        expect(wrapper.getComponent(NumberInput).exists()).toBe(true);
        expect(wrapper.getComponent(NumberInputBase).exists()).toBe(true);
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
        expect(wrapper.getComponent(NumberInput).getComponent(ErrorMessage).exists()).toBe(true);
    });
   
    it('passes default props', () => {
        const numberInputProps = wrapper.getComponent(NumberInputBase).props();
        expect(numberInputProps.type).toBe('double');
    });

    it('initializes jsonforms on pass-through component', () => {
        initializesJsonFormsControl(wrapper.getComponent(NumberInputBase));
    });

    it('calls onChange of NumberInputBase when number input is changed', async () => {
        const dirtySettingsMock = jest.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(NumberInput, defaultPropsData, {
            'pagebuilder/dialog': {
                actions: { dirtySettings: dirtySettingsMock },
                namespaced: true
            }
        });
        localWrapper.findComponent(NumberInputBase).getComponent('input').trigger('input');
        expect(onChangeSpy).toBeCalled();
        expect(dirtySettingsMock).not.toHaveBeenCalled();
    });

    it('indicates model settings change when model setting is changed', async () => {
        const dirtySettingsMock = jest.fn();
        const localWrapper = await mountJsonFormsComponentWithStore(
            NumberInput,
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
        localWrapper.findComponent(NumberInputBase).getComponent('input').trigger('input');
        expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true, expect.undefined);
    });

    it('sets correct label', () => {
        expect(wrapper.findComponent('label').text()).toBe(defaultPropsData.control.label);
    });
    
    it('disables numberInputBase when controlled by a flow variable', () => {
        const localDefaultPropsData = JSON.parse(JSON.stringify(defaultPropsData));
        localDefaultPropsData.control.rootSchema
            .flowVariablesMap[defaultPropsData.control.path] = {
                controllingFlowVariableAvailable: true,
                controllingFlowVariableName: 'knime.test',
                exposedFlowVariableName: 'test',
                leaf: true
            };

        const localWrapper = mountJsonFormsComponent(NumberInput, localDefaultPropsData);
        expect(localWrapper.findComponent(NumberInputBase).vm.disabled).toBeTruthy();
    });

    it('does not render content of NumberInputBase when visible is false', async () => {
        wrapper.setProps({ control: { ...defaultPropsData.control, visible: false } });
        await wrapper.vm.$nextTick(); // wait until pending promises are resolved
        expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
    });

    it('checks that it is not rendered if it is an advanced setting', async () => {
        defaultPropsData.control.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(NumberInput, defaultPropsData);
        expect(wrapper.getComponent(NumberInputBase).isVisible()).toBe(false);
    });

    it('checks that it is rendered if it is an advanced setting and advanced settings are shown', async () => {
        defaultPropsData.control.rootSchema = { showAdvancedSettings: true };
        defaultPropsData.control.uischema.options.isAdvanced = true;
        wrapper = await mountJsonFormsComponent(NumberInput, defaultPropsData);
        expect(wrapper.getComponent(NumberInputBase).isVisible()).toBe(true);
    });
});
